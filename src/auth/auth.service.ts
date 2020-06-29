import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtAccessToken } from './jwt-access-token.interface';
import { User } from './user.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async signUp( authCredentialDto: AuthCredentialsDto): Promise<void> {
       return  this.userRepository.signUp(authCredentialDto);
    }

    async signIn( authCredentialDto: AuthCredentialsDto): Promise<any> {  // JwtAccessToken
        const user: User  = await this.userRepository.validateUserPassword(authCredentialDto);
       
        const payload: JwtPayload =  { username: user.username } //{ ser.username};
        const accessToken = this.jwtService.sign(payload);

        delete user.password;
        delete user.salt;

        return {accessToken, user};
    }
}

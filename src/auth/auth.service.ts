import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtAccessToken } from './jwt-access-token.interface';


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

    async signIn( authCredentialDto: AuthCredentialsDto): Promise<JwtAccessToken> {
        const username = await this.userRepository.validateUserPassword(authCredentialDto);
       
        // if(!username) {
        //     throw new UnauthorizedException('Invalid Credentials.');
        // }

        const payload: JwtPayload = {username};
        const accessToken = this.jwtService.sign(payload);

        return {accessToken};
    }
}

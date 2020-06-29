import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UserRol } from "./user-rol-enum";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password } = authCredentialsDto;
        const user = new User(); // this.create(); //new User();
       
        user.username = username;
        user.rol = UserRol.USER;
        await user.setPassword(password);

        try {
            await this.save(user); 
 
        } catch (error) {
            if(error.code == 'ER_DUP_ENTRY'){
                throw new ConflictException('UserName already exist ...');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
   
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const {username, password} = authCredentialsDto;
        const user = await this.validateUser(username);  // findOne({username});

        return await this.validatePassword(user, password);
    }

    async validatePassword(user: User, password: string): Promise<User> {
        if(!(await user.validatePassword(password))) {
            throw new UnauthorizedException('Credenciales Incorrectas');
        }
        return user; // .username;
    }

    async validateUser(username: string): Promise<User> {
        const user = await this.findOne({username});
        if(! user) {
            throw new UnauthorizedException('Credenciales Incorrectas');
        }
        return user;
    }
}
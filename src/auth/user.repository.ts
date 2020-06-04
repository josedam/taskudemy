import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password } = authCredentialsDto;
        const user = new User();
       
        user.username = username;
        await user.setPassword(password);

        // user.salt = await bcrypt.genSalt();
        // user.password = await this.hashPassword(password, user.salt);

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

    private async hashPassword(password: string, salt: string):Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {username, password} = authCredentialsDto;
        const user = await this.findOne({username});

        if(user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }

    }
  
}
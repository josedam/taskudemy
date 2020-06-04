import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
  
    @Column()
    salt: string;

 
    async setPassword(password: string): Promise<void>{
        this.salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(password, this.salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
 }
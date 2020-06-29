import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Task } from "../tasks/task.entity";
import { UserRol } from "./user-rol-enum";


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

    @Column('varchar', {length: 30, default: UserRol.USER})
    rol: UserRol;

    @OneToMany(type => Task, task => task.user, {eager: true})
    tasks: Task[]; 

 
    async setPassword(password: string): Promise<void>{
        this.salt = await bcrypt.genSalt();
        this.password = await this.hashPassword(password, this.salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        const hash = await this.hashPassword(password, this.salt);
        return hash === this.password;
    }

    private async hashPassword(password: string, salt: string):Promise<string> {
        return bcrypt.hash(password, salt);
    }
 }
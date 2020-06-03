import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}
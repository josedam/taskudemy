import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { TaskStatus } from "./task-status-enum";
import { User } from "src/auth/user.entity";


@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column('text')
    description: string;
    
    @Column('varchar', { length: 30 })
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks, { eager: false})
    user: User;

    @Column()
    userId: number;
}
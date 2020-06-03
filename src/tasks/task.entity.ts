import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { TaskStatus } from "./task-status-enum";


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

}
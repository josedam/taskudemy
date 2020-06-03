import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status-enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    
    async getTasks(filterTask: GetTasksFilterDto): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterTask);
    }    

    async getTaskById(id: number): Promise<Task> {
        const found =  await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task id [${id}] Not Found`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
      return await this.taskRepository.createTask( createTaskDto);
    }
   
    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task id [${id}] Not Found`);
        }        
        return ;
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        return await this.taskRepository.save(task);
    }

}

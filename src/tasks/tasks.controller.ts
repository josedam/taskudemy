import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status-enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private taskService: TasksService) {}

   
    ///////////////////////////////////////////////////////// GetTasks()
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto)  {
       return this.taskService.getTasks(filterDto);
    };
 
    ///////////////////////////////////////////////// GetTaskById()
    @Get('/:id')
    getTaskById (@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    ////////////////////////////////////////////////// CreateTask()
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ) : Promise<Task> {

      return this.taskService.createTask(createTaskDto, user);  

    }

    ////////////////////////////////////////////////// DeleteTask()
    @Delete('/:id')
    deleteTask (@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.taskService.deleteTask(id);
    }

    ///////////////////////////////////////////////// UpdateTaskStatus()
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus):Promise<Task> {
        
        return this.taskService.updateTaskStatus(id, status);

    }
}

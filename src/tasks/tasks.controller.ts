import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status-enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private taskService: TasksService) {}

   
    ///////////////////////////////////////////////////////// GetTasks()
    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
        )  {
    
        // this.logger.verbose(`User [${user.username}] geting all. filter ${JSON.stringify(filterDto)}`);
        return this.taskService.getTasks(filterDto, user);
    };
 
    ///////////////////////////////////////////////// GetTaskById()
    @Get('/:id')
    getTaskById (
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<Task> {
    
        return this.taskService.getTaskById(id, user);
    }

    ////////////////////////////////////////////////// CreateTask()
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ) : Promise<Task> {

        // this.logger.verbose(`User [${user.username}] create task. data ${JSON.stringify(createTaskDto)}`);  
      return this.taskService.createTask(createTaskDto, user);  

    }

    ////////////////////////////////////////////////// DeleteTask()
    @Delete('/:id')
    deleteTask (
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<void> {

        return this.taskService.deleteTask(id, user);
    }

    ///////////////////////////////////////////////// UpdateTaskStatus()
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User):Promise<Task> {
        
        return this.taskService.updateTaskStatus(id, status, user);

    }
}

import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status-enum';
import { User } from '../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException, NotAcceptableException } from '@nestjs/common';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
});

const mockUser:User  = new User;
mockUser.username = 'Test User';
mockUser.id = 12;



describe('tasks-service', () => { 
  let tasksService;
  let taskRepository;
 

  beforeEach(async () => {
    const module = await Test.createTestingModule({
        providers: [
            TasksService,
            { provide: TaskRepository, useFactory: mockTaskRepository},
        ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);

  });

  describe('GetTasks', () => {
      it('Get all Task from the repository', async () => {

        taskRepository.getTasks.mockResolvedValue('someValue');

        expect(taskRepository.getTasks).not.toHaveBeenCalled();
        
        const filterTask: GetTasksFilterDto = {status: TaskStatus.IN_PROGRESS, search: 'Some search query'}; 
        
        const result = await tasksService.getTasks(filterTask, mockUser);
        expect(taskRepository.getTasks).toHaveBeenCalled();
        expect(result).toEqual('someValue');

      });
  });

  describe('getTaskById', () => {
    it('Call taskRepository.findOne() and succeffuly retrieve and return the task',async () => {
      const mockTask = {
        id: 1,
        title: 'Test Title',
        description: 'Test Description'
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith(
        {where: {id:1, userId: mockUser.id}}
      );

    });


    it('throw error if task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);

    });
  });


  describe('createTask', () => {

    it('Call taskRepository.create() and return de result', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      
      const createTaskDto = {title: 'Test title', description: 'Test Description'};

      taskRepository.createTask.mockResolvedValue(createTaskDto);
      const result = await tasksService.createTask(createTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
      expect(result).toEqual(createTaskDto);
      
    });

  });


  describe('deleteTask', () => {
    it('Call taskRepository.deleteTaks() to Delete a Task',async  () => {
      expect(taskRepository.delete).not.toHaveBeenCalled();
      
      taskRepository.delete.mockResolvedValue({affected:1});
      
      const result = await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({id:1, userId: mockUser.id});
      expect(result).toBeNull;
    });
    
    it('Throw error for Task Id not found', async () => {
      taskRepository.delete.mockResolvedValue({affected:0});
      await expect( tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);   // toThrow(NotAcceptableException);
    });

  });

describe('updateTaskStatus',() => {
  
  it('update Task status',async () => {
    const save = jest.fn().mockResolvedValue(true);
    
    tasksService.getTaskById = jest.fn().mockResolvedValue({
      status: TaskStatus.OPEN,
      save,
    });

    expect(tasksService.getTaskById).not.toHaveBeenCalled();

    taskRepository.save.mockResolvedValue({status: TaskStatus.DONE});
    const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);

    expect(tasksService.getTaskById).toHaveBeenCalled();
    expect(taskRepository.save).toHaveBeenCalled();
    expect(result.status).toEqual(TaskStatus.DONE);

  });

});

});
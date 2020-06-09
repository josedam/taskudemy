import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status-enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {


    async getTasks(filterTask: GetTasksFilterDto): Promise<Task[]> {
        const {status, search} = filterTask;
        const query = this.createQueryBuilder('task');

        if(status){
            query.andWhere('task.status = :status',{status});
        }

        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)',{search: `%${search}%`});
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task> {
        const {title, description} = createTaskDto;
        const task: Task  = new Task; // this.create(); //   new Task;

        task.description = description;
        task.title = title;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await this.save(task);
        delete task.user;

        return task;

  }

}
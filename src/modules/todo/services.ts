import taskRepository, { TaskRepository } from "./repositories";
import * as taskParams from "./dto";
import { BadException } from "../../shared/errors";
import { ITask } from "../../shared/interfaces";
import * as Message from "../../shared/enums/message"
import { PaginatedResult } from "../../shared/types";

export interface TaskService {
    createTask(param: taskParams.CreateTaskDTO): Promise<BadException | ITask>
    updateTask(param: taskParams.CreateTaskDTO): Promise<BadException | ITask>
    deleteTask(param: taskParams.TaskIdDTO): Promise<BadException | null>
    getOne(param: taskParams.TaskIdDTO): Promise<BadException | ITask>
    getMany(param: taskParams.FetchTasksDTO): Promise<ITask[] | PaginatedResult>
}

export class TaskServiceImpl implements TaskService {
    constructor(
        private readonly taskRepository: TaskRepository
    ) { }

    private composeFilter(args: taskParams.FetchTasksDTO) {
        let filter = {};

        if (args.fromDate) {
            filter = {
                ...filter,
                createdAt: {
                    $gte: new Date(args.fromDate)
                }
            }
        }

        if (args.toDate) {
            filter = {
                ...filter,
                createdAt: {
                    $gte: new Date(args.fromDate),
                    $lte: new Date(args.toDate)
                }
            }
        }
        
        if (args.status) {
            filter = {
                ...filter,
                status: args.status
            }
        }
        
        if (args.search) {
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: args.search, $options: 'i'} },
                    { description: { $regex: args.search, $options: 'i'} },
                ]
            }
        }
        
        if (args.user_id) {
            filter = {
                ...filter,
                user_id: args.user_id
            }
        }

        return filter;
    }

    public async getMany(args: taskParams.FetchTasksDTO): Promise<ITask[] | PaginatedResult> {
        const filter = this.composeFilter(args);
        const transactions = await this.taskRepository.getMany(filter, { page: args.page, limit: args.limit, sort: { createdAt: -1 } });

        return transactions;
    }

    public async createTask(param: taskParams.CreateTaskDTO): Promise<BadException | ITask> {
        let task = await this.taskRepository.getOne(param.name);

        if (task) {
            return new BadException(Message.RESOURCE_NOT_FOUND('task'))
        }

        task = await this.taskRepository.create(param) as ITask

        return task;
    }

    public async deleteTask(param: taskParams.TaskIdDTO): Promise<BadException | null> {
        let task = await this.taskRepository.getOne(param.taskId);

        if (!task) {
            return new BadException(Message.RESOURCE_ALREADY_EXISTS('task'))
        }

        await this.taskRepository.deleteOne(param.taskId)

        return null
    }

    public async updateTask(param: taskParams.UpdateTaskDTO): Promise<BadException | ITask> {
        let task = await this.taskRepository.getOne(param.taskId);

        if (task) {
            return new BadException(Message.RESOURCE_ALREADY_EXISTS('task'))
        }

        task = await this.taskRepository.create(param) as ITask

        return task;
    }

    public async getOne(param: taskParams.TaskIdDTO): Promise<BadException | ITask> {
        const task = await this.taskRepository.getOne(param.taskId);

        if (!task) {
            return new BadException(Message.RESOURCE_ALREADY_EXISTS('task'))
        }

        return task;
    }
}

const taskService = new TaskServiceImpl(taskRepository);

export default taskService;
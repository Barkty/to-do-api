import taskRepository, { TaskRepository } from "./repositories";
import * as taskParams from "./dto";
import { BadException } from "../../shared/errors";
import { ITask } from "../../shared/interfaces";
import * as Message from "../../shared/enums/message"

export interface TaskService {
    createTask(param: taskParams.CreateTaskDTO): Promise<BadException | ITask>
    updateTask(param: taskParams.CreateTaskDTO): Promise<BadException | ITask>
    deleteTask(param: taskParams.TaskIdDTO): Promise<BadException | null>
    getOne(param: taskParams.TaskIdDTO): Promise<BadException | ITask>
}

export class TaskServiceImpl implements TaskService {
    constructor(
        private readonly taskRepository: TaskRepository
    ) { }

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
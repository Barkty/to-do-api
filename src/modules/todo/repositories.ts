import { ClientSession } from 'mongoose';
import Task from './model';
import { ITask } from '../../shared/interfaces';

export interface TaskRepository {
    getOne(param: string): Promise<ITask | null>;
    deleteOne(param: string): Promise<void>;
    create(param: Partial<ITask>): Promise<ITask | null>;
    update(param: Partial<ITask>, session?: ClientSession): Promise<ITask | null>;
}

export class TaskRepositoryImpl implements TaskRepository {
    public async getOne(param: string): Promise<ITask | null> {
        const filter = { name: param }
        const task = await Task.findOne(filter).lean();

        return task;
    }

    public async deleteOne(param: string): Promise<void> {
        await Task.deleteOne({ _id: param });

    }

    public async create(param: Partial<ITask>): Promise<ITask | null> {

        const task = await new Task(param).save()

        return task;
    }

    public async update(param: Partial<ITask>, session?: ClientSession): Promise<ITask | null> {
        const { _id, ...rest } = param;
        return await Task.findByIdAndUpdate({_id}, { $set: rest }, { new: true, session }).lean();
    }
}

const taskRepository = new TaskRepositoryImpl();

export default taskRepository;

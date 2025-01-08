import { BaseEntity } from '../../shared/utils/entities/base-entity';

export class CreateTaskDTO extends BaseEntity<CreateTaskDTO> {
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
}

export class UpdateTaskDTO extends BaseEntity<UpdateTaskDTO> {
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    taskId: string;
}

export class TaskIdDTO extends BaseEntity<TaskIdDTO> {
    taskId: string;
}
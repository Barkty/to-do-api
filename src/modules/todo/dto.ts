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

export class FetchTasksDTO extends BaseEntity<FetchTasksDTO> {
    user_id: string;
    page: string;
    limit: string;
    search: string;
    status: string;
    fromDate: Date;
    toDate: Date;
}
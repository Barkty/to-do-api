import Joi from 'joi';
import { TASK_STATUS } from '../../shared/enums';

export const createTaskSchema = Joi.object({
    name: Joi.string().label('Name').required(),
    description: Joi.string().label('Description').required(),
    status: Joi.string().label('Status').valid(...Object.values(TASK_STATUS)).default(TASK_STATUS.PENDING),
    start_date: Joi.date().label('Start Date').required(),
    end_date: Joi.date().min(Joi.ref("start_date")).label('End Date'),
})

export const singleTaskSchema = Joi.object({
    taskId: Joi.string().label('Task Id').required(),
})
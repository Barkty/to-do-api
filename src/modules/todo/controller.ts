import * as Dtos from './dto';
import * as Message from '../../shared/enums/message';
import * as ApiResponse from '../../shared/response';
import TaskService from './services';
import { fnRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
import logger from '../../shared/logger';
import { handleCustomError, BadException } from '../../shared/errors';


export class ToDoController {
    // #swagger.tags = ['Task']
    // #swagger.summary = 'Create a task'
    public createTask: fnRequest = async(req, res) => {
        const { body, user } = req;
        const payload = new Dtos.CreateTaskDTO(body);

        const resp = await TaskService.createTask(payload)

        if (resp instanceof BadException) {
            logger.info(`${user._id}: could not create an task`, 'createTask.task.controllers.ts');
            return handleCustomError(res, resp, StatusCodes.BAD_REQUEST);
        }
        
        return ApiResponse.success(
            res,
            StatusCodes.CREATED,
            Message.RESOURCE_MESSAGE('Task created successfully'),
            resp
        );
    }
   
    public updateTask: fnRequest = async(req, res) => {
        const { body, user, params } = req;

        const payload = new Dtos.CreateTaskDTO(body);
        const taskId = new Dtos.TaskIdDTO(params);

        const resp = await TaskService.updateTask({ ...payload, taskId: taskId.taskId })

        if (resp instanceof BadException) {
            logger.info(`${user._id}: could not create an task`, 'updateTask.task.controllers.ts');
            return handleCustomError(res, resp, StatusCodes.BAD_REQUEST);
        }
        
        return ApiResponse.success(
            res,
            StatusCodes.CREATED,
            Message.RESOURCE_MESSAGE('Task created successfully'),
            resp
        );
    }
    
    public deleteTask: fnRequest = async(req, res) => {
        const { params, user } = req;
        const payload = new Dtos.TaskIdDTO(params);

        const resp = await TaskService.deleteTask(payload)

        if (resp instanceof BadException) {
            logger.info(`${user._id}: could not delete a task`, 'deleteTask.task.controllers.ts');
            return handleCustomError(res, resp, StatusCodes.BAD_REQUEST);
        }
        
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.RESOURCE_MESSAGE('Task deleted successfully'),
            resp
        );
    }
    
    public getOneTask: fnRequest = async(req, res) => {
        const { params, user } = req;
        const payload = new Dtos.TaskIdDTO(params);

        const resp = await TaskService.getOne(payload)

        if (resp instanceof BadException) {
            logger.info(`${user._id}: could not fetch a task`, 'getOneTask.task.controllers.ts');
            return handleCustomError(res, resp, StatusCodes.BAD_REQUEST);
        }
        
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.FETCHED_DATA_SUCCESSFULLY('task'),
            resp
        );
    }
    
    public getTasks: fnRequest = async(req, res) => {
        const { query, user } = req;
        const payload = new Dtos.FetchTasksDTO(query);

        const resp = await TaskService.getMany({ ...payload, user_id: user._id })
        
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.FETCHED_DATA_SUCCESSFULLY('task'),
            resp
        );
    }
}

const todoController = new ToDoController();

export default todoController;
// import * as Dtos from './dto';
import * as Message from '../../shared/enums/message';
import * as ApiResponse from '../../shared/response';
// import * as Helpers from '../../shared/helpers';
// import * as activityDescription from '../../shared/enums/monitor.description';
// import AuthService from './services';
import { fnRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
// import logger from '../../shared/logger';
// import { handleCustomError, BadException, UnAuthorizedException, NotFoundException, ForbiddenException, ConflictException } from '../../shared/errors';


export class ToDoController {
    // #swagger.tags = ['Task']
    // #swagger.summary = 'Create a task'
    public createTask: fnRequest = async(req, res) => {
        const { } = req;

        const task = {}
        
        return ApiResponse.success(
            res,
            StatusCodes.CREATED,
            Message.RESOURCE_MESSAGE('Task created successfully'),
            task
        );
    }
}

const todoController = new ToDoController();

export default todoController;
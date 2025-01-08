import { Router } from 'express';
import * as todoValidator from './validator';
import todoController from './controller';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import { validateDataMiddleware } from '../../shared/middlewares/request-body-validator.middleware';
import * as AuthenticationMidddlware from '../../shared/middlewares/auth.middleware';
import * as CommonMiddleware from '../../shared/middlewares/common.middleware';

const todoRouter = Router();

todoRouter.use(CommonMiddleware.computeUserDevice)
todoRouter.use(AuthenticationMidddlware.verifyAuthTokenMiddleware)

todoRouter.post('/',
    validateDataMiddleware(todoValidator.createTaskSchema, 'payload'),
    WatchAsyncController(todoController.createTask)
)

todoRouter.get('/:taskId',
    validateDataMiddleware(todoValidator.singleTaskSchema, 'params'),
    WatchAsyncController(todoController.getOneTask)
)

todoRouter.patch('/:taskId',
    validateDataMiddleware(todoValidator.singleTaskSchema, 'params'),
    validateDataMiddleware(todoValidator.createTaskSchema, 'payload'),
    WatchAsyncController(todoController.updateTask)
)

todoRouter.delete('/:taskId',
    validateDataMiddleware(todoValidator.singleTaskSchema, 'params'),
    WatchAsyncController(todoController.deleteTask)
)

export default todoRouter
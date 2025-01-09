import express, { Request, Response } from 'express';
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../../../swagger.json"
import authRouter from '../../modules/auth/routes';
import todoRouter from '../../modules/todo/routes';

const appRouter = express.Router();

appRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).send({
    message: `Hello from Developer Foundry To Do. Check the API specification for further guidance and next steps.`,
    success: 1,
  });
});

// appRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
appRouter.use('/auth', authRouter
  /* 
    #swagger.tags = ['Auth']

    #swagger.security = [{
        "apiKeyAuth": []
    }] 

    #swagger.responses[201] = {
        schema: { $ref: '#/definitions/AuthUser' }
    }  
  */
)
appRouter.use('/tasks', todoRouter)

export const v1Router = appRouter;
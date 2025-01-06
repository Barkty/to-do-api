import express, { Request, Response } from 'express';

const appRouter = express.Router();

appRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).send({
    message: `Hello from Developer Foundry To Do. Check the API specification for further guidance and next steps.`,
    success: 1,
  });
});

export const v1Router = appRouter;
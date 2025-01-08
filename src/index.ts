import http from 'http';
import { Express } from 'express';
import { envValidatorSchema } from './shared/validators/env-validator';
import Env from './shared/utils/envholder/env';
import { connectDB } from './config/database';
import app from './config/express';
import { AppEnv } from './shared/enums';
import Logger from './config/logger';

async function main(app: Express): Promise<void> {
  const logger = new Logger(app.name);

  // run the following before initializing App function
  await Env.validateEnv(envValidatorSchema);
  await connectDB();

 const server = http.createServer(app);
 
 const PORT = Env.get<number>('PORT') || 9080;
 const NODE_ENV = Env.get<string>('NODE_ENV');

  NODE_ENV !== AppEnv.PRODUCTION &&
    server.on('listening', () => {
      logger.info(`Listening on http://localhost:${PORT}`);
    });

  server.listen(PORT);
}

main(app);

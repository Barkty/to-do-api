import { NextFunction, Request, Response } from 'express';
import requestIp from 'request-ip';
import useragent from "express-useragent"
import logger from '../logger';
import Env from '../utils/envholder/env';

export const computeUserDevice = (req: Request, _res: Response, next: NextFunction) => {
    const { user, headers } = req;
    const NODE_ENV = Env.get<string>('NODE_ENV');
    if (NODE_ENV === "test") {
      req.device = {}
    } else {
      const source = headers["user-agent"] || ''; 
      const agent = useragent.parse(source as string);
      const ip_address = requestIp.getClientIp(req);
      const device = {
        ip_address,
        operating_system: agent.os,
        platform: agent.platform,
        browser_version: agent.version,
        browser: agent.browser
      };
    
      req.device = device;
      logger.info(`${user?._id} made API request with Browser: ${agent.browser}, version: ${agent.version}, Platform: ${agent.platform}, Operating System: ${device.operating_system}`, 'computeUserDevice.common.middleware.ts');
    }
    return next();
  };
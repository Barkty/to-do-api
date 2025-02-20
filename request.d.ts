import { IUser } from "./src/shared/interfaces";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
      file?: any;
      device?: IDevice | any;
    }
  }
}
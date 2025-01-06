import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces';

export type ExpressController = (
  req: Request,
  res: Response,
  next?: NextFunction
) => any;

export type fnRequest = (req: Request, res: Response) => Promise<any>;

export type VerifyOTP = {
  email: string,
  hash: string
}

export type AuthUser = {
  user: IUser,
  access_token: string,
  refresh_token?: string,
}

export type PaginatedResult = {
    totalDocs: number,
    limit: number,
    page: number,
    totalPages: number,
    prevPage: number,
    nextPage: number,
    hasPrevPage: boolean,
    hasNextPage: boolean,
    docs: any[]
}
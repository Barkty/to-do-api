import { isAfter } from 'date-fns';
import hashingService from '../services/hashing/hashing.service';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import * as ApiResponse from '../../shared/response';
import { SignedData } from '../interfaces';
import * as Message from '../enums/message';
import { isObjectEmpty } from '../utils/check-object';
import authService from '../../modules/auth/services';
import { NotFoundException } from '../errors';

export const verifyAuthTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.get('Authorization');
  const token = authToken?.split(' ')[1];

  if (!token) {
    return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, Message.NO_TOKEN);
  }

  try {
    const stringDecoded = await hashingService.decryptDataWithCryptoJs(token)
    if (stringDecoded === '') {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, Message.EXPIRED_RESOURCE('token'));
    }
    const decoded = JSON.parse(stringDecoded) as SignedData;
    const expiresAt = decoded?.time;
    if (!decoded || isObjectEmpty(decoded) || !expiresAt) {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, Message.NO_TOKEN);
    }
  
    if (isAfter(new Date(), new Date(expiresAt))) {
      // factor in refresh token
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, Message.EXPIRED_RESOURCE('token'));
    }
    const user = await authService.getUserByEmailOrId(decoded._id);
    if (user instanceof NotFoundException) {
      return ApiResponse.error(
        res,
        StatusCodes.BAD_REQUEST,
        Message.EXPIRED_RESOURCE('token'),
      );
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      statusCode: StatusCodes.UNAUTHORIZED,
      message: error.message || Message.NO_TOKEN,
    });
  }
};

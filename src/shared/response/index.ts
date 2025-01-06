import { Response } from 'express';

const sendResponse = (
  res: Response,
  status: 'success' | 'error',
  code: number,
  message: string,
  data?: string
) => {
  return res.status(code).json({
    status,
    code,
    message,
    data
  });
};

export const error = (res: Response, code: number, error: any) => {
  return sendResponse(res, 'error', code, error);
};

export const success = (
  res: Response,
  code: number,
  message: string,
  data?: any
) => {
  return sendResponse(res, 'success', code, message, data);
};

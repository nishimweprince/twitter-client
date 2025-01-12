import { NextFunction, Request, Response } from 'express';
import { AppError, CustomError } from '../helpers/errors.helper';
import logger from '../helpers/logger.heper';

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.debug(err.message);
    return res.status(err.statusCode).json({
      message: err.message,
      data: err?.data,
    });
  }

  return res.status(500).json({
    message: err.message,
  });
};

export default errorHandler;

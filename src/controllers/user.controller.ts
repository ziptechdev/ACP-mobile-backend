import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export const eligibilityRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
  } catch (error: any) {
    next(error);
  }
};

export const kycRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(httpStatus.OK).json(req.body);
  } catch (error: any) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';

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

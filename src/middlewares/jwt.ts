import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';
import { ErrorTypes } from '../config/constants';
import { jwtConfig } from '../config/vars';
import User from '../models/User';
import UserTokens from '../models/UserTokens';
import { TokenType } from '../shared/types/request';

async function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction,
  tokenType: TokenType
): Promise<void> {
  const tokenPayload = request.headers['authorization'];

  if (!tokenPayload) {
    next(new HttpError(401, 'No token provided', ErrorTypes.UNAUTHORIZED));
  }

  const tokenParts = tokenPayload.split(' ');

  if (tokenParts.length !== 2) {
    next(new HttpError(401, 'Invalid token format', ErrorTypes.UNAUTHORIZED));
  }

  const [prefix, token] = tokenParts;

  if (prefix !== 'Bearer') {
    next(new HttpError(401, 'Invalid token prefix', ErrorTypes.UNAUTHORIZED));
  }

  const jwt = require('jsonwebtoken');

  try {
    const user = jwt.verify(token, jwtConfig.secretKey) as Partial<User>;

    const userToken = await UserTokens.query()
      .where('userId', '=', user.id)
      .where(tokenType, '=', token)
      .first();

    if (!userToken) {
      next(
        new HttpError(
          401,
          'Unauthorized: Invalid token',
          ErrorTypes.UNAUTHORIZED
        )
      );
    }

    request.user = user;
    request.token = token;

    next();
  } catch (error) {
    next(
      new HttpError(401, 'Unauthorized: Invalid token', ErrorTypes.UNAUTHORIZED)
    );
  }
}

export async function verifyRefreshToken(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  await verifyToken(request, response, next, 'refresh');
}

export async function verifyAccessToken(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  await verifyToken(request, response, next, 'access');
}

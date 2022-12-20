import {
  CreateEligibleUserParams,
  EligibilityRegisterParams,
  KYCRegisterParams,
} from '../../shared/types/userTypes/params';
import User from '../../models/User';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;
import { compare } from 'bcrypt';
import { serializeUser } from '../../serializers/users';
import { HttpError } from '../../utils/httpError';
import { ErrorTypes } from '../../config/constants';
import { jwtConfig } from '../../config/vars';
import UserTokens from '../../models/UserTokens';

export const getUsersCount = async (): Promise<number> => {
  return (await User.query().count())[0].count;
};

export const registerEligibleUser = async (
  eligibilityCheckId: string,
  params: EligibilityRegisterParams
): Promise<User> => {
  const eligibleUser = await User.query()
    .findOne({
      eligibilityCheckId,
    })
    .throwIfNotFound();
  return eligibleUser.$query().patchAndFetch(params);
};

// finds or creates user that has passed eligibility check and is pending to be registered(get username and password)
export const findOrCreateEligibleUser = async (
  params: CreateEligibleUserParams
): Promise<User> => {
  const eligibleUser = await User.query().findOne({
    eligibilityCheckId: params.eligibilityCheckId,
  });
  return eligibleUser || User.query().insert(params);
};

export const registerKycUser = async (
  trx: Transaction,
  params: KYCRegisterParams
): Promise<User> => User.query(trx).insert(params);

export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const user = await User.query()
    .withGraphJoined('tokens')
    .findOne({ username });

  if (!user || !(await compare(password, user.password))) {
    throw new HttpError(
      401,
      'Invalid username or password',
      ErrorTypes.UNAUTHORIZED
    );
  }

  const jwt = require('jsonwebtoken');

  user.tokens.forEach((userToken: UserTokens) => {
    jwt.verify(
      userToken.token,
      jwtConfig.secretKey,
      async function (error: Error | null, result: boolean) {
        if (error) {
          await userToken.$query().delete();
        }
      }
    );
  });

  if (jwtConfig.sessionNumber <= user.tokens.length) {
    throw new HttpError(400, 'Session limit exceeded', ErrorTypes.UNAUTHORIZED);
  }

  const generatedToken = jwt.sign(serializeUser(user), jwtConfig.secretKey, {
    expiresIn: jwtConfig.duration,
  });

  await user.$relatedQuery('tokens').insert({
    token: generatedToken,
  });

  user.token = generatedToken;

  return user;
};

import {
  jumioAuthPayload,
  jumioAuthSuccessResponse,
} from '../../shared/types/jumoTypes';
import { jumioCredentials } from '../../config/vars';
import {
  jumioAccountPayload,
  jumioAccountSuccessResponse,
} from '../../shared/types/jumoTypes/accountTypes';
import { UserConsent } from '../../shared/types/jumoTypes/sharedTypes';
import { request } from '../../utils/request';
import { generateHashedValue } from '../../utils/dataGenerators';

export const verifyIndentiy = async (): Promise<void> => {
  //TODO remove later, used for testing only
  const userConsent = {
    userIp: '192.168.0.1',
    userLocation: {
      country: 'USA',
      state: 'IL',
    },

    consent: {
      obtained: 'yes',
      obtainedAt: '2022-12-28T11:20:35.000Z',
    },
  };

  const token = await jumioAuth();
  const accountDetails = await jumioAccountCreate(
    userConsent,
    'john.doe@example1.com',
    token.access_token
  );

  console.log(accountDetails);
};

const jumioAuth = async (): Promise<jumioAuthSuccessResponse> => {
  const payload: jumioAuthPayload = { grant_type: 'client_credentials' };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: jumioCredentials,
  };

  return await request(
    'post',
    'https://auth.amer-1.jumio.ai/oauth2/token',
    payload,
    config
  );
};

const jumioAccountCreate = async (
  userConsent: UserConsent,
  username: string,
  accessToken: string
): Promise<jumioAccountSuccessResponse> => {
  const payload: jumioAccountPayload = {
    customerInternalReference: await generateHashedValue(username + 'ID_CHECK'),
    workflowDefinition: {
      key: 3,
      credentials: [
        {
          category: 'ID',
          type: {
            values: ['DRIVING_LICENSE', 'ID_CARD', 'PASSPORT'],
          },
          country: {
            values: ['USA'],
          },
        },
      ],
    },
    userReference: await generateHashedValue(username),
    userConsent,
  };
  const config = {
    headers: {
      'User-Agent': 'ACP',
    },
  };

  return await request(
    'post',
    'https://account.amer-1.jumio.ai/api/v1/accounts',
    payload,
    config,
    accessToken
  );
};

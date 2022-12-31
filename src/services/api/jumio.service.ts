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
import { Request } from 'express';
import { ResidentIdentityVerificationBody } from '../../shared/types/jumoTypes/residentIdentityVerification';
import { parseFileBufferFromRequest } from '../../utils/file';
import { WorkflowExecutionResponse } from '../../shared/types/jumoTypes/workflowExecutionTypes';
import { Readable } from 'stream';

export const verifyIndentiy = async (request: Request): Promise<void> => {
  const data = Object.assign(
    {},
    request.body
  ) as ResidentIdentityVerificationBody;

  data.idImages = {
    front: parseFileBufferFromRequest(request, 'documentIdFront'),
    back: parseFileBufferFromRequest(request, 'documentIdBack'),
    face: parseFileBufferFromRequest(request, 'selfie'),
  };

  const userConsent = {
    userIp: data.userIp,
    userLocation: {
      country: 'USA',
      state: data.userState,
    },

    consent: {
      obtained: data.consentOptained,
      obtainedAt: data.consentOptainedAt,
    },
  } as UserConsent;

  const token = await jumioAuth();
  const accountDetails = await jumioAccountCreate(
    userConsent,
    data.username,
    token.access_token
  );

  let response: WorkflowExecutionResponse;

  for (const credential of accountDetails.workflowExecution.credentials) {
    if (!credential.hasOwnProperty('api')) continue;

    for (const key in credential.api.parts) {
      response = await sendIdImage(
        credential.api.parts[key],
        credential.api.token,
        data.idImages[key]
      );
    }
  }

  console.log(response);
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

const sendIdImage = async (
  url: string,
  accessToken: string,
  image: any
): Promise<WorkflowExecutionResponse> => {
  const FormData = require('form-data');
  const data = new FormData();

  const stream = new Readable({
    read() {
      this.push(image.buffer);
      this.push(null);
    },
  });

  data.append('file', stream, image.originalname);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  return await request('post', url, data, config, accessToken);
};

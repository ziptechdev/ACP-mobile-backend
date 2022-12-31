import {
  jumioAuthPayload,
  jumioAuthSuccessResponse,
} from '../../shared/types/jumoTypes';
import { jumioCredentials } from '../../config/vars';
import {
  jumioAccountPayload,
  jumioAccountSuccessResponse,
} from '../../shared/types/jumoTypes/accountTypes';
import {
  UserConsent,
  VerificationProccessRejectedReasson,
  WorkflowCapabilityType,
  WorkflowExecutionCredential,
} from '../../shared/types/jumoTypes/sharedTypes';
import { sendRequest } from '../../utils/request';
import { generateHashedValue } from '../../utils/dataGenerators';
import { Request } from 'express';
import { ResidentIdentityVerificationBody } from '../../shared/types/jumoTypes/residentIdentityVerification';
import { parseFileBufferFromRequest } from '../../utils/file';
import { WorkflowExecutionResponse } from '../../shared/types/jumoTypes/workflowExecutionTypes';
import { Readable } from 'stream';
import JumioVerificationProcesses from '../../models/JumioVerificationProcesses';
import { WorkflowDetails } from '../../shared/types/jumoTypes/workflowDetailsTypes';
import { VerificationProcessStatus } from '../../shared/types/jumoTypes/verificationProcessStatus';

export const getUserJumioVerificationProcess = async (
  username: string
): Promise<JumioVerificationProcesses> => {
  return JumioVerificationProcesses.query().findOne({ username });
};

export const deleteUserJumioVerificationProcess = async (
  username: string
): Promise<void> => {
  await JumioVerificationProcesses.query()
    .where('username', '=', username)
    .delete();
};

export const startIndentityVerification = async (
  request: Request
): Promise<WorkflowExecutionResponse> => {
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

  let idDocumentUploadResponse: WorkflowExecutionResponse;

  for (const credential of accountDetails.workflowExecution.credentials) {
    if (!credential.hasOwnProperty('api')) continue;

    for (const key in credential.api.parts) {
      idDocumentUploadResponse = await sendIdImage(
        credential.api.parts[key],
        credential.api.token,
        data.idImages[key]
      );
    }
  }

  const response: WorkflowExecutionResponse = await sendRequest(
    'put',
    idDocumentUploadResponse.api.workflowExecution,
    {},
    {},
    idDocumentUploadResponse.api.token
  );

  await JumioVerificationProcesses.query().insert({
    accountId: response.account.id,
    workflowExecutionId: response.workflowExecution.id,
    username: data.username,
    token: token.access_token,
  });

  return response;
};

export const getVerificationProcessStatus = async (
  accountId: string,
  workflowId: string,
  token: string
): Promise<VerificationProcessStatus> => {
  const workflowDetails: WorkflowDetails = await sendRequest(
    'get',
    `https://retrieval.amer-1.jumio.ai/api/v1/accounts/${accountId}/workflow-executions/${workflowId}`,
    {},
    {},
    token
  );

  const verificationProccessStatus: VerificationProcessStatus = {
    status: 'REJECTED',
    reasons: [] as Array<VerificationProccessRejectedReasson>,
  };

  switch (workflowDetails.workflow.status) {
    case 'INITIATED':
      verificationProccessStatus.status = 'PENDING';
      break;
    case 'ACQUIRED':
      verificationProccessStatus.status = 'PENDING';
      break;
    case 'PROCESSED':
      verificationProccessStatus.status = 'PASSED';
      break;
    case 'SESSION_EXPIRED':
      verificationProccessStatus.status = 'EXPIRED';
      break;
    case 'TOKEN_EXPIRED':
      verificationProccessStatus.status = 'EXPIRED';
      break;
  }

  if (workflowDetails.workflow.status !== 'PROCESSED') {
    return verificationProccessStatus;
  }

  let criteria: keyof typeof workflowDetails.capabilities;
  for (criteria in workflowDetails.capabilities) {
    if (criteria === 'liveness') continue;

    workflowDetails.capabilities[criteria].forEach(
      (verificationType: WorkflowCapabilityType) => {
        const hasFacemapCredential = verificationType.credentials.every(
          (credential: WorkflowExecutionCredential) => {
            return credential.category === 'FACEMAP';
          }
        );

        if (hasFacemapCredential) return;

        if (verificationType.decision.type !== 'PASSED') {
          verificationProccessStatus.status = 'REJECTED';
          verificationProccessStatus.reasons.push({
            criteria: criteria,
            credentials: verificationType.credentials,
            lable: `${verificationType.decision.type} ${verificationType.decision.details.label}`,
          });
        }
      }
    );
  }

  return verificationProccessStatus;
};

const jumioAuth = async (): Promise<jumioAuthSuccessResponse> => {
  const payload: jumioAuthPayload = { grant_type: 'client_credentials' };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: jumioCredentials,
  };

  return await sendRequest(
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

  return await sendRequest(
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

  return await sendRequest('post', url, data, config, accessToken);
};

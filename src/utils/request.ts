import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { RequestMethod } from '../shared/types/request';

type AxiosResponseData<T> = T;

export async function sendRequest<T>(
  method: RequestMethod,
  url: string,
  data: object | string,
  config: AxiosRequestConfig = {},
  token: string | null = null
): Promise<AxiosResponseData<T>> {
  const configWithAddedHeaders = {
    ...config,
    headers: {
      Accept: 'application/json',
      ...(config.headers ?? {}),
    } as Record<string, any>,
  };

  if (token) {
    configWithAddedHeaders.headers['Authorization'] = `Bearer ${token}`;
  }

  return new Promise<AxiosResponseData<T>>((resolve, reject) => {
    axios
      .request({ url, method, data, ...configWithAddedHeaders })
      .then(response => resolve(response.data as T))
      .catch((error: AxiosError<string>) => {
        reject(error);
      });
  });
}

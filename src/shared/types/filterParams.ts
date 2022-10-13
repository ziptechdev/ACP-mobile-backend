import { isUndefined, omitBy, pick } from 'lodash';

export const filterParams = <T>(body: T, whiteListedParams: string[]): any => {
  return omitBy(pick(body, whiteListedParams), isUndefined);
};

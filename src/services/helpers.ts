import * as qs from 'qs';
import { error, queryParams } from './type';
// import { signOut } from 'next-auth/react';

export const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const staticURL = `${baseURL}/static`;

type QueryParams = {
  [key: string]: string | number | Array<string | number>;
};

export const queryParamsToQs = (queryParams: queryParams = {}): string => {
  const withParams = Object.keys(queryParams)?.length;
  const queryString = withParams
    ? '?' +
      qs.stringify(queryParams, {
        arrayFormat: 'indices',
        encode: false,
        format: 'RFC3986',
      })
    : '';
  return queryString;
};

export const qsToQueryParams = (queryString: string): queryParams => {
  const parsedParams = qs.parse(queryString, {
    ignoreQueryPrefix: true,
  }) as queryParams;

  return parsedParams;
};

export const handleError = (error: error) => {
  const { response } = error;
  if (response && response.status === 401) {
    // signOut({ redirect: false });
  }
  const { message } = error?.response?.data || {};
  console.error(message);
  return true;
};

export function customObjectToQs(params: QueryParams): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        // Join array elements with a comma
        return `${encodeURIComponent(key)}=${value.join(',')}`;
      }
      // Handle single value
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  // Prepend '?' to the query string
  return `?${queryString}`;
}

import * as qs from 'qs';
import { baseURL } from './helpers';
import { queryParams } from './type';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { queryParams } from './types';

interface fetchParams {
  queryParams?: queryParams;
  withoutToken?: boolean;
  withoutBaseUrl?: boolean;
  tags?: string[];
}

export const handleFetch = async (
  table: string,
  {
    queryParams = {},
    withoutToken = true,
    withoutBaseUrl = false,
    tags = [],
  }: fetchParams = {},
) => {
  try {
    const queryKeys = Object.keys(queryParams);

    const queryString = queryKeys.length
      ? '?' +
        qs.stringify(queryParams, {
          arrayFormat: 'indices',
          encode: false,
          format: 'RFC3986',
        })
      : '';

    let initData: any = {};
    const url = withoutBaseUrl ? table : `${baseURL}/${table}${queryString}`;

    // Make the request
    // const fetchOptions = {
    //   method: 'GET',
    //   headers: headers,
    // };

    // Fetch the session to get the token
    // const session: any = await getServerSession(authOptions);

    let headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    // if (!withoutToken && session?.token?.access_token) {
    //   headers['Authorization'] = `Bearer ${session?.token?.access_token}`;
    // }

    const response = await fetch(url, {
      next: { tags },
      method: 'GET',
      headers: headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    initData = responseData;
    return initData;
  } catch (error) {
    console.error('handleFetch', error);
    return {};
  }
};

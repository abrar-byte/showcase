import axios from 'axios';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  anyGetParams,
  listParams,
  listResult,
  listResultInfinite,
  mutationParams,
} from './type';
import { baseURL, handleError, queryParamsToQs } from './helpers';
import { useSession } from 'next-auth/react';

export const useApi = () => {
  const session: any = useSession();
  const { status, data } = session || {};
  const config: any = {
    baseURL,
    headers: {},
  };
  if (status == 'authenticated' && data?.token) {
    config.headers['Authorization'] = `Bearer ${data?.token}`;
  }
  const axiosInstance = axios.create(config);
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    },
  );
  return { api: axiosInstance, session };
};

export const useApiList = (
  table: string,
  { queryParams = {}, skip = false, isPublic = false, keys }: listParams = {},
) => {
  const queryString = queryParamsToQs(queryParams);
  const { api, session } = useApi();
  return useQuery({
    queryKey: keys ? [...keys, queryString] : [table, queryString],
    queryFn: async (): Promise<listResult> => {
      try {
        const { data } = await api.get(`${table}${queryString}`);
        return data;
      } catch (error) {
        return { data: [], meta: { count: 0, page: 0, take: 0, pageCount: 0 } };
      }
    },
    enabled: isPublic ? !skip : session?.status == 'authenticated' && !skip,
    placeholderData: (previousData) => previousData,
    throwOnError: handleError,
    refetchOnWindowFocus: false,
  });
};

export const useApiRead = (
  table: string,
  id: string | number,
  { queryParams = {}, skip = false, isPublic = false, keys }: listParams = {},
) => {
  const queryString = queryParamsToQs(queryParams);
  const { api, session } = useApi();
  return useQuery({
    queryKey: keys ? [...keys, queryString] : [table, id, queryString],
    queryFn: async (): Promise<{ [key: string]: any }> => {
      try {
        const { data } = await api.get(`${table}/${id}${queryString}`);
        return data;
      } catch (error) {
        return {};
      }
    },
    enabled: isPublic ? !skip : session?.status == 'authenticated' && !skip,
    placeholderData: (previousData) => previousData,
    throwOnError: handleError,
    refetchOnWindowFocus: false,
  });
};

export const useApiPost = (
  table: string,
  { invalidateKeys = [] }: mutationParams = {},
) => {
  const queryClient = useQueryClient();
  const { api } = useApi();
  return useMutation({
    mutationFn: async (payload: any) => {
      return await api.post(`${table}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      for (let i = 0; i < invalidateKeys.length; i++) {
        const key = invalidateKeys[i];
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: handleError,
  });
};

export const useApiPatch = (
  table: string,
  { invalidateKeys = [] }: mutationParams = {},
) => {
  const queryClient = useQueryClient();
  const { api } = useApi();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string | number;
      payload: any;
    }) => {
      return await api.patch(`${table}/${id}`, payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: [`${table}-${variables.id}`] });
      for (let i = 0; i < invalidateKeys.length; i++) {
        const key = invalidateKeys[i];
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: handleError,
  });
};

export const useApiDelete = (
  table: string,
  { invalidateKeys = [] }: mutationParams = {},
) => {
  const queryClient = useQueryClient();
  const { api } = useApi();
  return useMutation({
    mutationFn: async (id: string | number) => {
      return await api.delete(`${table}/${id}`);
    },
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: [`${table}-${id}`] });
      for (let i = 0; i < invalidateKeys.length; i++) {
        const key = invalidateKeys[i];
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: handleError,
  });
};

// >> FOR DYNAMIC TYPES:
export const useApiAnyGet = (
  table: string,
  { queryParams = {}, skip = false, isPublic = false, keys }: anyGetParams = {},
) => {
  const queryString = queryParamsToQs(queryParams);
  const { api, session } = useApi();
  return useQuery({
    queryKey: keys ? [...keys, queryString] : [table, queryString],
    queryFn: async () => {
      try {
        const { data } = await api.get(`${table}${queryString}`);
        return data;
      } catch (error) {
        return null;
      }
    },
    enabled: isPublic ? !skip : session?.status == 'authenticated' && !skip,
    placeholderData: (previousData) => previousData,
    throwOnError: handleError,
    refetchOnWindowFocus: false,
  });
};

export const useApiInfiniteList = (
  table: string,
  { queryParams = {}, skip = false, isPublic = false }: listParams = {},
) => {
  const { api, session } = useApi();

  return useInfiniteQuery({
    queryKey: [table],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<listResultInfinite> => {
      try {
        const combinedQueryParams = { ...queryParams, page: pageParam };
        const queryString = queryParamsToQs(combinedQueryParams);
        const { data } = await api.get(`${table}${queryString}`);
        return data;
      } catch (error) {
        return { pages: [], pageParams: [] };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const { meta } = lastPage;
      let page =
        typeof meta?.page === 'string' ? parseInt(meta?.page) : meta?.page;
      const nextPage = page < meta?.pageCount ? page + 1 : undefined;
      return nextPage;
      // return page < meta?.pageCount ? page + 1 : undefined;
    },
    enabled: isPublic ? !skip : session?.status === 'authenticated' && !skip,
    placeholderData: (previousData) => previousData,
    throwOnError: handleError,
    refetchOnWindowFocus: false,
  });
};

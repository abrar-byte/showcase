import {
  useApiAnyGet,
  useApiDelete,
  useApiInfiniteList,
  useApiList,
  useApiPatch,
  useApiPost,
} from '@/services/client';
import { handleFetch } from './server';
import { listParams } from './type';
const searchKeys = 'name,plate';

export const useGetListCars = (params: listParams = {}) => {
  const data = useApiList(`car`, {
    ...params,
    queryParams: params.queryParams
      ? {
          ...params.queryParams,
          keys: searchKeys,
        }
      : {},
  });
  return data;
};

export const useGetCarMedia = (
  car_id: string | number,
  params: listParams = {},
) => {
  const data = useApiList(`carMedia`, {
    skip: !car_id,
    queryParams: {
      car_id,
    },
  });
  return data;
};

export const getPopularCars = async () => {
  const data = await handleFetch(`car`, {
    queryParams: {
      take: 4,
      active: true,
    },
  });
  return data;
};

export const getDetailCar = async (id: string | number) => {
  const data = await handleFetch(`car/${id}`);
  return data;
};

export const getReviewsCar = async (id: string | number, take = 10) => {
  const data = await handleFetch(`car/${id}/review`, { queryParams: { take } });
  return data;
};

export const useGetReviews = (id: string | number, { take = 2, page = 1 }) => {
  const data = useApiList(`car/${id}/review`, {
    queryParams: {
      take,
      page,
    },
  });
  return data;
};

export const getRecentCar = async (id: string | number, search = '') => {
  const data = await handleFetch(`car`, {
    queryParams: {
      sort: '-created_at',
      search,
      keys: searchKeys,
      take: 3,
      active: true,
      id: {
        not: id,
      },
    },
  });
  return data;
};

export const getRecommendationCar = async (
  id: string | number,
  { search = '', additionalFilter = {} },
) => {
  const data = await handleFetch(`car`, {
    queryParams: {
      take: 3,
      active: true,
      search,
      ...additionalFilter,
      keys: searchKeys,

      id: {
        not: id,
      },
    },
  });
  return data;
};

export const useGetInfiniteCars = (
  { search = '', additionalFilter = {} },
  status = '',
  take = 8,
) => {
  const data = useApiInfiniteList(`car`, {
    queryParams: {
      take,
      active: true,

      search,
      keys: searchKeys,
      ...additionalFilter,
    },
    isPublic: status == 'unauthenticated' ? true : false,
  });
  return data;
};

export const useCarMetadata = (params: listParams = {}) =>
  useApiAnyGet('metadata/car', params);

export const useDeleteCar = () => useApiDelete('car');

export const useAddCar = () => useApiPost('car');
export const useUploadCar = () =>
  useApiPost('carMedia', { invalidateKeys: ['car'] });

export const useUpdateCar = () => useApiPatch('car');

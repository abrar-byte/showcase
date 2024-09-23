import {
  useApiInfiniteList,
  useApiList,
  useApiPatch,
  useApiPost,
  useApiRead,
} from '@/services/client';
import { listParams } from '@/services/type';

export const useOrderList = (params: listParams = {}) =>
  useApiList(`order/admin`, {
    ...params,
    queryParams: params.queryParams
      ? {
          ...params.queryParams,
          keys: `car_name,cust_city,cust_phone`,
          sort: '-created_at',
        }
      : {},
  });

export const useGetInfiniteMyOrders = (take = 6, status = '') => {
  const data = useApiInfiniteList(`order`, {
    queryParams: {
      take,
      sort: '-created_at',
      status,
    },
  });

  return data;
};

export const useGetDetailOrder = (id: string | number) => {
  const data = useApiRead(`order`, id);
  return data;
};

export const useReviewOrder = () => {
  const data = useApiPatch(`order`);
  return data;
};
export const useCreateOrder = () => useApiPost('order');

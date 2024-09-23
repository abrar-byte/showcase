import {
  useApiDelete,
  useApiInfiniteList,
  useApiList,
  useApiPost,
} from '@/services/client';

export const usePostFavorite = () =>
  useApiPost('favorite', { invalidateKeys: ['car'] });

export const useDeleteFavorite = () =>
  useApiDelete('favorite', { invalidateKeys: ['car'] });

export const useGetFilteredFavorite = (id: number | string = '') => {
  const data = useApiList(`favorite`, {
    queryParams: {
      car_id: id,
    },
  });
  return data;
};

export const useGetInfiniteFavorites = ({ search = '' }, take = 6) => {
  const data = useApiInfiniteList(`favorite`, {
    queryParams: {
      take,

      search,
      keys: `car.name,car.plate`,
    },
  });

  return data;
};

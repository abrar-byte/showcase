import { useApiDelete, useApiList, useApiPatch, useApiPost } from './client';
import { listParams } from './type';

export const useGarageList = (params: listParams = {}) =>
  useApiList(`garage`, {
    ...params,
    isPublic: true,
    queryParams: params.queryParams
      ? {
          ...params.queryParams,
          keys: 'name,description,location',
        }
      : {},
  });

export const useAddGarage = () => useApiPost('garage');

export const useUpdateGarage = () => useApiPatch('garage');

export const useDeleteGarage = () => useApiDelete('garage');

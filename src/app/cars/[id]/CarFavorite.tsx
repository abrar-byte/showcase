'use client';
import Loading from '@/components/Loading';
import LikeIcon from '@/components/icons/LikeIcon';
import useUnauthenticatedDialog from '@/hooks/checkAuth';
import {
  useDeleteFavorite,
  useGetFilteredFavorite,
  usePostFavorite,
} from '@/services/favorites';
import React from 'react';
import { toast } from 'react-toastify';

export default function CarFavorite({ id }: { id: string | number }) {
  const { data: favoriteData, isSuccess } = useGetFilteredFavorite(id);
  const { mutateAsync: postFavorite, isPending } = usePostFavorite();
  const { mutateAsync: deleteFavorite, isPending: isPendingDelete } =
    useDeleteFavorite();
  const handleCheck = useUnauthenticatedDialog();
  let favorite = favoriteData?.data?.[0];
  const handleFavorite = async (e: any) => {
    e.preventDefault();
    if (handleCheck()) {
      return;
    }

    try {
      let payload = { car_id: id };
      if (favorite && favorite) {
        await deleteFavorite(favorite?.id);
      } else {
        await postFavorite(payload);
      }
    } catch (error: any) {
      toast.error(error?.message);

      console.error('Error handling favorite:', error);
    }
  };
  return (
    <>
      {isSuccess && (
        <button
          onClick={handleFavorite}
          disabled={isPending || isPendingDelete}
          className="disabled:cursor-not-allowed"
        >
          <LikeIcon
            className={`fill-transparent ${favorite ? '!fill-red-600' : 'stroke-secondary'} w-6 h-6 cursor-pointer`}
          />
        </button>
      )}
    </>
  );
}

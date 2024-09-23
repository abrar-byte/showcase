'use client';
import ListingCars from '@/app/home/ListingCars';
import ShowMore from '@/app/home/ShowMore';
import CardCar from '@/components/CardCar';
import Loading from '@/components/Loading';
import { Title } from '@/components/Title';
import AuthLayout from '@/components/layout/AuthLayout';
import { useApi } from '@/services/client';
import { useGetInfiniteFavorites } from '@/services/favorites';
import { Favorite } from '@/types';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const {
    data,
    isPending,
    isLoading,
    isError,
    isRefetching,
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetInfiniteFavorites({});
  const [favoriteIds, setFavoriteIds]: any = useState([]);
  const { api, session } = useApi();

  useEffect(() => {
    if (data?.pages) {
      const ids = data?.pages?.flatMap((page) =>
        page?.data?.map((favorite: any) => favorite?.id),
      );
      setFavoriteIds(ids);
    }
  }, [data, isPending]);

  const handleFavorite = async (id: string | number) => {
    const selected = favoriteIds?.findIndex((value: any) => value == id);
    const newFavoriteIds = [...favoriteIds];
    const payload = {
      car_id: id,
    };

    try {
      if (selected >= 0) {
        // Remove from favorites
        newFavoriteIds.splice(selected, 1);
        await api.delete(`favorite/${id}`);
      } else {
        // Add to favorites
        newFavoriteIds.push(id);
        await api.post(`favorite`, payload);
      }
      setFavoriteIds(newFavoriteIds);
    } catch (error: any) {
      toast.error(error?.message);
      console.error('Error updating favorites:', error);
      // Optionally handle the error (e.g., show a notification)
    }
  };

  return (
    <AuthLayout>
      <title>My Favorites - Gorent</title>

      <Title>My Favorites</Title>
      <div className="mt-10">
        <div className={`grid lg:grid-cols-3 gap-5 `}>
          {isPending && <Loading fullscreen={false} />}
          {data?.pages?.map((favorites, iFavorites) => (
            <Fragment key={iFavorites}>
              {favorites?.data?.map((favorite: Favorite, iFavorite: number) => {
                const car = favorite?.car;
                if (car) {
                  return (
                    <CardCar
                      key={iFavorite}
                      car={car}
                      handleFavoriteState={() => handleFavorite(favorite?.id)}
                      landscape
                      active={favoriteIds?.includes(favorite?.id)}
                    />
                  );
                }
              })}
            </Fragment>
          ))}
        </div>
        <ShowMore
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          total={data?.pages[0]?.meta?.count}
        />
      </div>
    </AuthLayout>
  );
}

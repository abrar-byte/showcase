'use client';
import CardCar from '@/components/CardCar';
import Loading from '@/components/Loading';
import { useGetInfiniteCars } from '@/services/cars';
import { Car, Props } from '@/types';
import React, { Fragment, useEffect } from 'react';
import ShowMore from '@/app/home/ShowMore';
import { useSession } from 'next-auth/react';

export default function ListingCars({
  searchParams,
  className = '',
  take,
}: Props & { className?: string; take?: number }) {
  let search = searchParams?.search || '';

  const { status } = useSession();

  const additionalFilter = {
    capacity: { in: searchParams?.capacity || '' },
    type: { in: searchParams?.type || '' },
    ...(searchParams?.amount && {
      amount: { lte: parseInt(searchParams?.amount, 10) },
    }),
  };

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
  } = useGetInfiniteCars({ search, additionalFilter }, status, take);
  useEffect(() => {
    refetch();
  }, [searchParams]);
  const loading = isPending || isRefetching;
  return (
    <>
      <div className={`grid lg:grid-cols-4 gap-5 ${className}`}>
        {loading && <Loading fullscreen={false} />}
        {data?.pages?.map((cars, iCars) => (
          <Fragment key={iCars}>
            {cars?.data?.map((car: any, iCar: number) => {
              return <CardCar key={iCar} car={car} landscape />;
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
    </>
  );
}

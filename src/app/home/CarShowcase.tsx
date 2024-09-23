'use client';
import CardCar from '@/components/CardCar';
import Loading from '@/components/Loading';
import { useGetListCars } from '@/services/cars';
import { Car } from '@/types';
import { useSession } from 'next-auth/react';
import React from 'react';
interface ShowCase {
  className?: string;
  search?: string;
  additionalFilter?: { [key: string]: any };
}

export default function CarShowcase({
  className = '',
  search,
  additionalFilter = {},
}: ShowCase) {
  const { status } = useSession();
  const { data: cars, isPending } = useGetListCars({
    isPublic: status == 'unauthenticated' ? true : false,
    queryParams: {
      search,
      ...additionalFilter,
    },
  });
  return (
    <>
      {isPending && <Loading fullscreen={false} />}
      <div
        className={`flex items-center overflow-x-scroll -mr-6 lg:mr-auto lg:grid grid-cols-4 gap-5 ${className}`}
      >
        {!!cars?.data?.length &&
          cars?.data.map((car: Car, iCar: number) => (
            <CardCar key={iCar} car={car} />
          ))}
      </div>
    </>
  );
}

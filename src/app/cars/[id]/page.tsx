import Layout from '@/components/layout/Layout';
import React from 'react';

import { Car, Props } from '@/types';
import CardCar from '@/components/CardCar';
import { dummyCars, popularCars } from '@/utils/dummy';
import SidebarFilter from '@/components/SidebarFilter';
import Link from 'next/link';
import CarInformation from '@/app/cars/[id]/CarInformation';
import Reviews from '@/app/cars/[id]/Reviews';
import {
  getDetailCar,
  getRecentCar,
  getRecommendationCar,
  getReviewsCar,
} from '@/services/cars';
import CarShowcase from '@/app/home/CarShowcase';
import { Metadata, ResolvingMetadata } from 'next';
import { handleFetch } from '@/services/server';
import { applicationName, description, keywords } from '@/utils/constants';

export async function generateMetadata(
  { params }: Props,

  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slugs = params?.id.split('-') || [];
  const carId = slugs[slugs.length - 1];
  const detailCar = await handleFetch(`car/${carId}`);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${detailCar?.name} - Gorent` || 'Detail CarGorent',
    description,
    keywords,
    openGraph: {
      images: [
        detailCar?.CarMedia?.[0]
          ? detailCar?.CarMedia?.[0]?.link
          : '/images/placeholder-car.png',
        ...previousImages,
      ],
    },
    applicationName,
  };
}
export default async function Page(props: Props) {
  const additionalFilter = {
    capacity: { in: props?.searchParams?.capacity || '' },
    type: { in: props?.searchParams?.type || '' },
    ...(props?.searchParams?.amount && {
      amount: { lte: parseInt(props?.searchParams?.amount, 10) },
    }),
  };

  const search = props?.searchParams?.search;
  const slugs = props?.params?.id.split('-') || [];
  const carId = slugs[slugs.length - 1];
  const detail = await getDetailCar(carId);

  // const recentCar = await getRecentCar(carId);
  // const recomendationCar = await getRecommendationCar(carId, {
  //   search,
  //   additionalFilter,
  // });

  return (
    <Layout>
      <div className="flex">
        <SidebarFilter />
        <div className="gorent-container py-5 overflow-y-scroll h-screen space-y-10 ">
          {detail && <CarInformation detail={detail} />}
          <Reviews carId={carId} />

          <div>
            <div className="flex justify-between items-center gap-5  mx-5 mb-7 ">
              <p className="text-secondary font-semibold">Recent Car</p>
              <Link
                href="/cars?filter=recent"
                className="text-primary font-semibold"
              >
                View All
              </Link>
            </div>
            <CarShowcase
              search={search}
              additionalFilter={{
                take: 3,
                sort: '-created_at',
                id: {
                  not: carId,
                },
                ...additionalFilter,
              }}
              className="lg:!grid-cols-3"
            />
            {/* <div className="flex items-center overflow-x-scroll  -mr-6 lg:mr-auto lg:grid grid-cols-3 gap-5">
              {!!recentCar?.data?.length &&
                recentCar?.data?.map((car: Car, iCar: number) => (
                  <CardCar key={iCar} car={car} />
                ))}
            </div> */}
          </div>
          <div className="pb-10">
            <div className="flex justify-between items-center gap-5  mx-5 mb-7 ">
              <p className="text-secondary font-semibold">Recommendation Car</p>
              <Link
                href="/cars?filter=recommendation"
                className="text-primary font-semibold"
              >
                View All
              </Link>
            </div>
            <CarShowcase
              search={search}
              additionalFilter={{
                take: 3,
                id: {
                  not: carId,
                },
                ...additionalFilter,
              }}
              className="lg:!grid-cols-3"
            />
            {/* <div className="flex items-center overflow-x-scroll  -mr-6 lg:mr-auto lg:grid grid-cols-3 gap-5">
              {!!recomendationCar?.data?.length &&
                recomendationCar?.data?.map((car: Car, iCar: number) => (
                  <CardCar key={iCar} car={car} />
                ))}
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

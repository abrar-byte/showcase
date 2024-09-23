import Layout from '@/components/layout/Layout';
import React from 'react';
import CardAds from '@/app/home/CardAds';
import Link from 'next/link';
import CardCar from '@/components/CardCar';
import { dummyCars, popularCars } from '@/utils/dummy';
import { Car, Props } from '@/types';
import FilterCar from './FilterCar';
import ListingCars from '@/app/home/ListingCars';
import { getPopularCars } from '@/services/cars';
import CarShowcase from '@/app/home/CarShowcase';

const adsCar = [
  {
    title: 'The Best Platform for Car Rental  ',
    description:
      'Ease of doing a car rental safely and reliably. Of course at a low price.',
    variantButton: 'primary',
    image: '/images/car-ads-1.png',
    backgroundCard: '/images/bg-ads-1.png',
  },
  {
    title: 'Easy way to rent a car at a low price',
    description:
      'Providing cheap car rental services and safe and comfortable facilities.',
    variantButton: 'info',
    image: '/images/car-ads-2.png',
    backgroundCard: '/images/bg-ads-2.png',
  },
];

export default async function Home({ searchParams }: Props) {
  // const popularCars = await getPopularCars();

  return (
    <Layout>
      <div className="gorent-container py-5 ">
        <div className="grid lg:grid-cols-2 gap-5 w-full mb-5">
          {adsCar.map((ad, iAd) => {
            return <CardAds key={iAd} {...ad} />;
          })}
        </div>
        <FilterCar />
        {/* popular cars */}
        <div className="flex justify-between items-center gap-5 mt-10 mb-7 ">
          <p className="text-secondary font-semibold">Popular Car</p>
          <Link
            href="/cars?filter=popular"
            className="text-primary font-semibold"
          >
            View All
          </Link>
        </div>
        <CarShowcase additionalFilter={{ take: 4 }} />
        {/* <div className="flex items-center overflow-x-scroll -mr-6 lg:mr-auto lg:grid grid-cols-4 gap-5">
          {!!popularCars?.data?.length &&
            popularCars?.data.map((popular: Car, iPopular: number) => (
              <CardCar key={iPopular} car={popular} />
            ))}
        </div> */}
        {/* recommendation cars */}
        <div className="flex justify-between items-center gap-5 mt-10 mb-7 ">
          <p className="text-secondary font-semibold">Recomendation Car</p>
        </div>
        <ListingCars searchParams={searchParams} />
      </div>
    </Layout>
  );
}

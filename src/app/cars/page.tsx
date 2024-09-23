import Layout from '@/components/layout/Layout';
import React from 'react';
import FilterCar from '@/app/home/FilterCar';
import Button from '@/components/Button';
import { Car, Props } from '@/types';
import CardCar from '@/components/CardCar';
import { dummyCars, popularCars } from '@/utils/dummy';
import ShowMore from '@/app/home//ShowMore';
import SidebarFilter from '@/components/SidebarFilter';
import ListingCars from '@/app/home/ListingCars';
import { Metadata } from 'next';
import { description, applicationName, keywords } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Cars - GoRent',
  description,
  keywords,
  applicationName,
};

export default function Page({ searchParams }: Props) {
  return (
    <Layout>
      <div className="flex">
        <SidebarFilter />
        <div className="gorent-container py-5 overflow-y-scroll h-screen ">
          <FilterCar hasSidebar />

          <ListingCars
            searchParams={searchParams}
            take={9}
            className="lg:!grid-cols-3 mt-10"
          />
        </div>
      </div>
    </Layout>
  );
}

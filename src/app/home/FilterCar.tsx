'use client';
import Button from '@/components/Button';
import CardFilter from '@/components/CardFilter';
import SwapIcon from '@/components/icons/SwapIcon';
import React from 'react';

export default function FilterCar({ hasSidebar }: { hasSidebar?: boolean }) {
  return (
    <div
      className={`grid lg:flex  justify-between items-center ${
        hasSidebar ? 'lg:gap-3' : ' lg:gap-5'
      } gap-2`}
    >
      <CardFilter title={'Pick - Up'} />
      {/* <div className="flex justify-center relative">
        <Button
          variant="primary"
          className={`!p-3 -my-5 ${hasSidebar ? '-mx-5' : ''} lg:my-auto`}
          icon={<SwapIcon className="w-6 h-6 stroke-white" />}
        />
      </div>

      <CardFilter title={'Drop - Off'} /> */}
    </div>
  );
}

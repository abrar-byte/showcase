import Button from '@/components/Button';
import Rating from '@/components/Rating';
import LikeIcon from '@/components/icons/LikeIcon';
import { detailCar } from '@/utils/constants';
import React from 'react';
import CarGallery from '@/app/cars/[id]/CarGallery';
import { Car } from '@/types';
import Link from 'next/link';
import { calculateFinalAmount, generateSlug } from '@/utils/helpers';
import CarFavorite from './CarFavorite';

export default function CarInformation({
  detail,
  isOrder,
}: {
  detail: Car;
  isOrder?: boolean;
}) {
  const { finalAmount } = calculateFinalAmount(
    detail?.discount || 0,
    detail?.amount || 0,
  );
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {detail?.CarMedia && <CarGallery carMedia={detail?.CarMedia} />}
      <div className="bg-white rounded-lg p-5 flex flex-col justify-between gap-5">
        <div className="flex justify-between items-start gap-5">
          <div className="space-y-1">
            <h1 className=" text-black text-xl lg:text-3xl font-bold leading-loose lg:leading-10">
              {detail?.name}
            </h1>
            <div className="flex items-center gap-2">
              <Rating rate={detail?.rating?.avg} />
              <span className=" text-slate-500 text-xs lg:text-sm font-medium lg:tracking-tight">
                {detail?.rating?.respondent} Reviewer
              </span>
            </div>
          </div>
          <CarFavorite id={detail?.id || 0} />
          {/* <button>
            <LikeIcon
              className={`fill-transparent stroke-secondary hover:stroke-red-600 hover:fill-red-600 w-6 h-6 cursor-pointer`}
            />
          </button> */}
        </div>
        <p className=" text-slate-500 text-xs lg:text-xl lg:leading-10">
          {detail?.description}
        </p>
        <div className="grid grid-cols-2 gap-x-10 gap-y-1 w-full">
          {detailCar.map((v, i) => {
            return (
              <div
                key={i}
                className={`flex justify-between w-full  gap-5 items-center ${i % 2 !== 0 ? 'justify-self-end' : ''}`}
              >
                <h4 className=" text-secondary text-xs font-medium  lg:text-xl lg:leading-loose">
                  {v.label}
                </h4>
                <span className="text-right text-slate-500 text-xs lg:text-xl font-semibold lg:leading-loose">
                  {detail?.[v.key as keyof Car] as React.ReactNode}
                </span>
              </div>
            );
          })}
        </div>
        {!isOrder && (
          <div className="flex justify-between gap-5 items-center ">
            <div className="space-y-1">
              <p className="text-gray-900 lg:text-xl font-bold ">
                ${finalAmount}/
                <span className="text-secondary text-xs lg:text-sm font-bold ">
                  day
                </span>
              </p>
              {detail?.discount && (
                <p className="text-secondary text-xs lg:text-sm font-bold line-through">
                  ${detail.amount}
                </p>
              )}
            </div>
            <Link
              href={`/cars/${generateSlug(detail?.name || '')}-${detail?.id}/checkout`}
              className="relative"
            >
              <Button variant="primary" className="">
                Rent Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

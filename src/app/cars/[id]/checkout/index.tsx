'use client';
import Rating from '@/components/Rating';
import Layout from '@/components/layout/Layout';
import React, { useState } from 'react';
import PaymentForm from '@/app/cars/[id]/checkout/PaymentForm';
import { Car } from '@/types';
import AuthLayout from '@/components/layout/AuthLayout';
import { useSession } from 'next-auth/react';
import { initialRange } from '@/components/DateRange';
import dayjs from 'dayjs';
import { calculateFinalAmount, handleImageError } from '@/utils/helpers';
import { summaries } from '@/utils/constants';

type Props = {
  car: Car;
};

export default function Checkout({ car }: Props) {
  const [range, setRange] = useState(initialRange);
  const duration =
    dayjs(range?.endDate).diff(dayjs(range?.startDate), 'day') + 1;

  const { finalAmount, discountAmount } = calculateFinalAmount(
    car?.discount,
    car?.amount * duration,
  );

  return (
    <AuthLayout hideSidebar>
      <div className="gorent-container py-5 ">
        <div className="grid lg:grid-cols-3 gap-5 w-full ">
          <div className="lg:col-span-2 order-last lg:order-first">
            <PaymentForm car={car} rangeProps={[range, setRange]} />
          </div>
          <div className="bg-white rounded-lg p-5 space-y-5 w-full h-min flex-col flex justify-between gap-24 lg:order-last order-first">
            <div className="grid gap-5">
              <div>
                <h1 className="text-gray-900 lg:text-xl font-bold lg:leading-loose">
                  Rental Summary
                </h1>
                <p className=" text-slate-400 text-xs lg:text-sm font-medium leading-tight">
                  Prices may change depending on the length of the rental and
                  the price of your rental car.
                </p>
              </div>
              <div className="flex items-center gap-3 pb-7 border-b border-slate-300/40">
                <div
                  className="w-32 h-20 rounded-lg bg-contain flex items-center justify-center"
                  style={{
                    backgroundImage: `url(/images/bg-ads-2.png)`,
                  }}
                >
                  <img
                    src={
                      car?.CarMedia?.[0]?.link || '/images/placeholder-car.png'
                    }
                    alt="car image"
                    className=""
                    onError={handleImageError}
                  />
                </div>
                <div>
                  <h2 className=" text-gray-900 text-xl lg:text-3xl font-bold leading-7  lg:leading-10">
                    {car?.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Rating rate={car?.rating?.avg} />
                    <span className=" text-slate-500 text-xs lg:text-sm font-medium leading-tight">
                      {car?.rating?.respondent}+ Reviewer
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="flex justify-between item-center gap-5">
                <p className=" text-slate-400 text-xs lg:text-base font-medium ">
                  Subtotal
                </p>
                <p className="text-right text-gray-900 text-base font-semibold">
                  ${car?.amount}
                </p>
              </div> */}
              <div className="">
                {summaries?.map((summary, iSummary) => {
                  const fieldKey = summary?.value as keyof Car;
                  let value: any = car[fieldKey];
                  if (summary?.value == 'start_date') {
                    value = duration;
                  }
                  switch (fieldKey) {
                    case 'amount':
                      value = `$${car?.amount || 0}`;
                      break;

                    case 'discount':
                      value = value ? `${value}%` : 0;
                      break;
                    default:
                      break;
                  }

                  return (
                    <div
                      key={iSummary}
                      className="flex justify-between items-center gap-5"
                    >
                      <p className="text-slate-400 text-xs lg:text-base font-medium">
                        {summary?.label}
                      </p>
                      <p className="text-right text-gray-900 text-base font-semibold">
                        {value}
                        {summary?.value == 'discount' && car?.discount && (
                          <span className="line-through text-slate-400 ml-1">
                            {discountAmount}
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center gap-5">
              <div>
                <p className="text-gray-900 lg:text-xl font-bold ">
                  Total Rental Price
                </p>
                <div className=" text-slate-400 text-xs lg:text-sm font-medium lg:leading-tight">
                  Overall price and includes rental discount
                </div>
              </div>
              <p className=" text-gray-900 text-xl lg:text-3xl font-bold leading-loose lg:leading-normal">
                ${finalAmount}
                {/* {car?.discount && (
                  <span className="line-through text-slate-400">
                    {discountAmount}
                  </span>
                )} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

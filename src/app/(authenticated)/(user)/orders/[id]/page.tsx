'use client';
import CarInformation from '@/app/cars/[id]/CarInformation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import { Title } from '@/components/Title';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import StarIcon from '@/components/icons/StarIcon';
import AuthLayout from '@/components/layout/AuthLayout';
import { useGetDetailOrder, useReviewOrder } from '@/services/orders';
import { Order, Props } from '@/types';
import { summaries } from '@/utils/constants';
import { calculateFinalAmount } from '@/utils/helpers';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page(props: Props) {
  const orderId = props?.params?.id;
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    data: detailOrder,
    isPending,
    isSuccess,
  } = useGetDetailOrder(orderId);
  const { mutateAsync: updateReview, ...resupdatePromo } = useReviewOrder();
  const duration =
    dayjs(detailOrder?.end_date).diff(dayjs(detailOrder?.start_date), 'day') +
    1;

  const { finalAmount, discountAmount } = calculateFinalAmount(
    detailOrder?.discount,
    detailOrder?.car?.amount * duration,
  );

  const handleStarMouseEnter = (index: number) => {
    setHoveredStar(index + 1);
  };

  const handleStarMouseLeave = () => {
    setHoveredStar(0);
  };

  const handleReviewSubmit = async (e: any, starIndex?: number) => {
    e.preventDefault();
    try {
      // const form = e.currentTarget;
      // const formData = new FormData(form);
      // const message = formData.get('message');
      const { message } = e.target;

      const payload: any = {};
      if (message?.value) {
        payload.review = message?.value;
      }
      if (starIndex !== undefined) {
        payload.rating = starIndex + 1;
      }

      if (Object.keys(payload).length > 0) {
        const res = await updateReview({ id: orderId, payload });
        if (res?.data && message?.value) {
          toast.success(`Review ${detailOrder?.review ? 'updated' : 'added'}`);
        }
      }
    } catch (error: any) {
      toast.error(error?.message);
      console.error(error?.message);
    }
  };
  const router = useRouter();

  return (
    <AuthLayout>
      <title>Order Car - Gorent</title>
      {isPending && <Loading fullscreen={false} />}
      <Link href={`/orders`} className="flex items-center gap-2 mb-5">
        <ArrowBackIcon className="w-6 h-6 stroke-secondary" />
        <span className="font-semibold text-sm text-secondary">Back</span>
      </Link>
      <Title>Order for {detailOrder?.car?.name}</Title>
      {isSuccess && (
        <div className="mt-10 pb-5 space-y-5">
          {detailOrder?.car && (
            <CarInformation isOrder detail={detailOrder?.car} />
          )}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white p-5 shadow rounded-lg">
              <h1 className="text-gray-900 lg:text-xl font-bold lg:leading-loose">
                Rental Summary
              </h1>
              {summaries?.map((summary, iSummary) => {
                const fieldKey = summary?.value as keyof Order;
                let value = detailOrder[fieldKey];
                // console.log("fieldKey",fieldKey);

                switch (fieldKey) {
                  case 'amount':
                    value = `$${detailOrder?.car?.amount || 0}`;
                    break;
                  case 'discount':
                    value = value ? `${value}%` : 0;
                    break;
                  case 'start_date':
                    value = duration;

                  default:
                    break;
                }

                if (fieldKey === 'drop_location' && detailOrder?.drop_off) {
                  return null;
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
                      {summary?.value == 'discount' &&
                        detailOrder?.discount && (
                          <span className="line-through text-slate-400 ml-1">
                            {discountAmount}
                          </span>
                        )}
                    </p>
                  </div>
                );
              })}

              <div className="flex justify-between items-center gap-5 mt-24">
                <div>
                  <p className="text-gray-900 lg:text-xl font-bold ">
                    Total Rental Price
                  </p>
                  <div className=" text-slate-400 text-xs lg:text-sm font-medium lg:leading-tight">
                    Overall price and includes rental discount
                  </div>
                </div>
                <p className=" text-gray-900 text-xl lg:text-3xl font-bold leading-loose lg:leading-normal">
                  ${finalAmount || 0}{' '}
                  {/* {detailOrder?.discount && (
                    <span className="line-through text-slate-400">
                      {discountAmount}
                    </span>
                  )} */}
                </p>
              </div>
              <div className="flex justify-between items-center gap-5 mt-5">
                <p className="text-sm text-slate-400">Already Paid</p>
                <p className="text-gray-900 text-sm font-bold">
                  ${detailOrder?.amount || 0}
                </p>
              </div>
              {detailOrder?.status == 'CHECKOUT' && (
                <Button
                  variant="primary"
                  className="w-full mt-5"
                  onClick={() => router.push(`/payment?id=${detailOrder?.id}`)}
                >
                  Pay Now
                </Button>
              )}
            </div>
            <div className="bg-white p-5 shadow rounded-lg">
              <h1 className="text-gray-900 lg:text-xl font-bold lg:leading-loose">
                Your Review
              </h1>
              <div className="flex justify-end mt-10">
                {Array(5)
                  .fill('star')
                  .map((star: string, iStar: number) => {
                    return (
                      <button
                        key={iStar}
                        disabled={resupdatePromo?.isPending}
                        className="disabled:cursor-not-allowed"
                        onClick={(e) => handleReviewSubmit(e, iStar)}
                        onMouseEnter={() => handleStarMouseEnter(iStar)}
                        onMouseLeave={handleStarMouseLeave}
                      >
                        <StarIcon
                          className={`w-5 h-5 cursor-pointer ${
                            iStar + 1 <= (hoveredStar || detailOrder?.rating)
                              ? 'fill-orange-400'
                              : 'stroke-secondary'
                          }`}
                        />
                      </button>
                    );
                  })}
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-2">
                <Input
                  label={`Enter Your Review`}
                  rows={5}
                  textarea
                  name={`message`}
                  defaultValue={detailOrder?.review}
                />
                <Button variant="primary" type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

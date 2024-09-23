'use client';
import ListingCars from '@/app/home/ListingCars';
import ShowMore from '@/app/home/ShowMore';
import Button from '@/components/Button';
import CardCar from '@/components/CardCar';
import Loading from '@/components/Loading';
import { Title } from '@/components/Title';
import AuthLayout from '@/components/layout/AuthLayout';

import { useGetInfiniteMyOrders } from '@/services/orders';
import { Order } from '@/types';
import { orderStatus } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const [status, setStatus] = useState('');

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
  } = useGetInfiniteMyOrders(6, status);
  useEffect(() => {
    refetch();
  }, [status]);

  const router = useRouter();
  const toDetailOrder = (id: number | string) => {
    router.push(`/orders/${id}`);
  };

  return (
    <AuthLayout>
      <title>My Orders - Gorent</title>

      <Title>My Orders</Title>

      <div className="mt-10 pb-10">
        <div className="flex items-center space-x-5 overflow-x-scroll w-full mb-5">
          {orderStatus.map(
            (order: { label: string; value: string }, i: number) => {
              return (
                <Button
                  onClick={() => setStatus(order?.value)}
                  variant="primary"
                  outline={status !== order?.value}
                  key={i}
                  className={`!min-w-24`}
                >
                  {order?.label}
                </Button>
              );
            },
          )}
        </div>
        <div className={`grid lg:grid-cols-3 gap-5 `}>
          {isPending && <Loading fullscreen={false} />}
          {data?.pages?.map((orders, iOrders) => (
            <Fragment key={iOrders}>
              {orders?.data?.map((order: Order, iOrder: number) => {
                const car = order?.car;
                if (car) {
                  return (
                    <CardCar
                      key={iOrder}
                      car={car}
                      landscape
                      toDetailOrder={() => toDetailOrder(order?.id)}
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

'use client';
import Button from '@/components/Button';
import CardDashboard from '@/components/CardDashboard';
import CharLimit from '@/components/CharLimit';
import Loading from '@/components/Loading';
import { Title } from '@/components/Title';
import CarIcon from '@/components/icons/CarIcon';
import GarageIcon from '@/components/icons/GarageIcon';
import OrderIcon from '@/components/icons/OrderIcon';
import AuthLayout from '@/components/layout/AuthLayout';
import { useGetListCars } from '@/services/cars';
import { useGarageList } from '@/services/garages';
import { useOrderList } from '@/services/orders';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const listDashboards = [
  {
    icon: <CarIcon />,
    classNameIcon: '',
    title: 'Cars',
    type: 'cars',
    total: 200,
  },
  {
    icon: <GarageIcon />,
    classNameIcon: '',
    title: 'Garage',
    type: 'garages',
    total: 10,
  },
  {
    icon: <OrderIcon />,
    classNameIcon: '',
    title: 'Orders',
    type: 'orders',
    total: 80,
  },
];
const filteredCar = [
  { label: 'Available', value: 'available' },
  { label: 'On Going', value: 'on_going' },
  { label: 'Repair', value: 'repair' },
];

export default function Page() {
  const session = useSession();
  const [select, setSelect] = useState('cars');

  const { data: listCar, ...resCar } = useGetListCars();
  const { data: listGarage, ...resGarage } = useGarageList();
  const { data: listOrder, ...resOrder } = useOrderList();

  const loading =
    resCar?.isPending || resGarage?.isPending || resOrder?.isPending;
  const isSuccess =
    resCar?.isSuccess && resGarage?.isSuccess && resOrder?.isSuccess;
  return (
    <AuthLayout>
      <title>Dashboard - Gorent</title>
      <Title>Dashboard</Title>
      {loading && <Loading fullscreen={false} />}
      <div className="grid lg:grid-cols-3 gap-5 mt-10">
        {isSuccess &&
          listDashboards?.map((dashboard, iDashboard) => {
            let total: number = 0;
            switch (dashboard?.type) {
              case 'cars':
                total = listCar?.meta?.count || 0;
                break;
              case 'garages':
                total = listGarage?.meta?.count || 0;
                break;
              case 'orders':
                total = listOrder?.meta?.count || 0;
                break;

              default:
                total = 0;
                break;
            }
            return (
              <CardDashboard
                selectProps={[select, setSelect]}
                key={iDashboard}
                icon={dashboard?.icon}
                classNameIcon={dashboard?.classNameIcon}
                title={dashboard?.title}
                total={total}
                type={dashboard?.type}
              />
            );
          })}
      </div>

      <div className="mt-16">
        {select == 'cars' && (
          <div className="flex gap-5 items-center ">
            {filteredCar?.map((filter, iFilter) => {
              return (
                <Button key={iFilter} variant="primary" outline>
                  {filter?.label}
                </Button>
              );
            })}
          </div>
        )}
        {select == 'garages' && (
          <div className="grid lg:grid-cols-4 gap-5">
            {listGarage?.data?.map((garage, iGarage) => {
              return (
                <div
                  key={iGarage}
                  className={`rounded-lg p-3 flex flex-col gap-5 group shadow bg-transparent border border-primary hover:bg-primary`}
                >
                  <h2 className="text-primary group-hover:text-white text-lg font-semibold">
                    {garage?.name}
                  </h2>
                  <div className="space-y-1 grid text-primary group-hover:text-white">
                    <CharLimit text={garage?.description} max={30} />

                    <CharLimit
                      text={garage?.location}
                      max={25}
                      className="text-sm font-light"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

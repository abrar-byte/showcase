'use client';
import React from 'react';
import GasStation from '@/components/icons/GasStation';
import Steering from '@/components/icons/Steering';
import Profile2User from '@/components/icons/Profile2User';
import Button from './Button';
import { Car } from '@/types';
import LikeIcon from './icons/LikeIcon';
import Link from 'next/link';
import {
  calculateFinalAmount,
  generateSlug,
  handleImageError,
} from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import useUnauthenticatedDialog from '@/hooks/checkAuth';
import { useDeleteFavorite, usePostFavorite } from '@/services/favorites';
import { toast } from 'react-toastify';

// buat variabel untuk mapping details car
const detailIcons: { type: keyof Car; icon: JSX.Element }[] = [
  {
    type: 'gasoline',
    icon: <GasStation className="w-3.5 h-3.5 lg:w-6 lg:h-6 fill-secondary" />,
  },
  {
    type: 'steering',
    icon: (
      <Steering
        className="w-3.5 h-3.5 lg:w-6 lg:h-6 fill-secondary"
        color="fill-secondary"
      />
    ),
  },
  {
    type: 'capacity',
    icon: <Profile2User className="w-3.5 h-3.5 lg:w-6 lg:h-6 fill-secondary" />,
  },
];

export default function CardCar({
  car,
  landscape,
  active,
  handleFavoriteState,
  toDetailOrder,
}: {
  car: Car;
  landscape?: boolean;
  active?: { [key: string]: any };
  handleFavoriteState?: () => void;
  toDetailOrder?: () => void;
}) {
  const handleCheck = useUnauthenticatedDialog();
  const { mutateAsync: postFavorite, isPending } = usePostFavorite();
  const { mutateAsync: deleteFavorite, isPending: isPendingDelete } =
    useDeleteFavorite();

  const { finalAmount } = calculateFinalAmount(car?.discount, car?.amount);

  const router = useRouter();
  let favorite = car?.Favorite?.[0] || active;

  const handleFavorite = async (e: any) => {
    e.preventDefault();
    if (handleCheck()) {
      return;
    }
    if (handleFavoriteState) {
      handleFavoriteState();
      return;
    }
    try {
      let payload = { car_id: car?.id };
      if (favorite && favorite?.id) {
        await deleteFavorite(favorite?.id);
      } else {
        await postFavorite(payload);
      }
    } catch (error: any) {
      toast.error(error?.message);

      console.error('Error handling favorite:', error);
    }
  };
  const imageCover = car?.CarMedia?.[0]?.link || `images/placeholder-car.png`;

  return (
    <Link
      href={`/cars/${generateSlug(car?.name)}-${car?.id}`}
      className="bg-white rounded-lg p-5 min-w-64 w-full shadow hover:shadow-primary"
    >
      <div className="flex justify-between items-center gap-5">
        <h1 className="text-gray-900 lg:text-xl font-bold leading-loose ">
          {car?.name}
        </h1>
        <button
          onClick={handleFavorite}
          disabled={isPending || isPendingDelete}
          className="disabled:cursor-not-allowed"
        >
          <LikeIcon
            className={`fill-transparent  ${favorite ? '!fill-red-600' : 'stroke-secondary'}  w-6 h-6 cursor-pointer`}
          />
        </button>
      </div>
      <p className="text-secondary text-xs lg:text-sm font-bold leading-tight">
        {car?.type}
      </p>
      <div
        className={`${
          landscape
            ? 'flex justify-between w-full items-center gap-8 lg:block'
            : ''
        }`}
      >
        <div className="flex flex-col justify-center items-center my-16 lg:h-32 w-full relative">
          <img
            className="min-w-56 min-h-16  w-auto h-auto "
            src={imageCover}
            onError={handleImageError}
          />
          <div className="w-full h-16 bg-gradient-to-b from-white/20 to-white -mt-12" />
        </div>
        <div
          className={`${
            landscape ? 'grid lg:flex ' : 'flex'
          } items-center gap-2 lg:gap-3 w-full mt-2`}
        >
          {detailIcons.map((detail, iDetail) => {
            const detailValue = car[detail.type as keyof Car];
            let value: any =
              detail.type == 'capacity' ? `${detailValue} People` : detailValue;
            return (
              <div className="flex items-center gap-1 lg:gap-2" key={iDetail}>
                {detail.icon}
                <span className="font-semibold text-secondary text-xs lg:text-sm">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-5 items-center mt-3">
        <div className="space-y-1">
          <p className="text-gray-900 lg:text-xl font-bold ">
            ${finalAmount}/
            <span className="text-secondary text-xs lg:text-sm font-bold ">
              day
            </span>
          </p>
          {car?.discount && (
            <p className="text-secondary text-xs lg:text-sm font-bold line-through">
              ${car?.amount}
            </p>
          )}
        </div>

        <Button
          onClick={(e: any) => {
            e.preventDefault();
            if (handleCheck()) {
              return;
            }
            if (toDetailOrder) {
              toDetailOrder();
              return;
            }
            router.push(`/cars/${generateSlug(car?.name)}-${car?.id}/checkout`);
          }}
          variant="primary"
          className="relative z-[999]"
        >
          {toDetailOrder ? 'Detail Order' : 'Rent Now'}
        </Button>
      </div>
    </Link>
  );
}

import Rating from '@/components/Rating';
import Layout from '@/components/layout/Layout';
import React from 'react';
import PaymentForm from '@/app/cars/[id]/checkout/PaymentForm';
import { Car, Props } from '@/types';
import { dummyCars } from '@/utils/dummy';
import { handleImageError } from '@/utils/helpers';
import { getDetailCar } from '@/services/cars';
import Checkout from '.';

export default async function Page(props: Props) {
  const slugs = props?.params?.id?.split('-') || [];
  const carId = slugs[slugs.length - 1];
  const car = (await getDetailCar(carId)) as Car;

  return <Checkout {...props} car={car} />;
}

import Button from '@/components/Button';
import React from 'react';
type Ads = {
  title: string;
  description: string;
  variantButton: string;
  image: string;
  backgroundCard?: string;
};

export default function CardAds({
  title,
  description,
  variantButton,
  image,
  backgroundCard = '',
}: Ads) {
  return (
    <div
      className="rounded-lg p-5 bg-blue-500 bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${backgroundCard})`,
      }}
    >
      <h1 className="text-white text-3xl font-semibold leading-10">{title}</h1>
      <p className=" text-white  font-medium mt-7 w-72">{description}</p>
      <Button variant={variantButton} className="mt-5">
        Rental Car
      </Button>
      <div className="flex justify-center items-center mt-5">
        <img className="w-96 h-28" src={image} alt="" />
      </div>
    </div>
  );
}

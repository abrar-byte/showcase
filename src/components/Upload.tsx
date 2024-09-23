'use client';
import React, { useState } from 'react';
import Trash from '@/components/icons/Trash';
import { CarMediaItem, obj } from '@/types';
import UploadIcon from './icons/UploadIcon';

export type SelectedImageValue = obj[];
export type SelectedImageProps = [
  SelectedImageValue,
  (
    | ((v?: any) => void)
    | React.Dispatch<React.SetStateAction<SelectedImageValue>>
  ),
];

interface UploadProps {
  name?: string;
  cars: CarMediaItem[];
  selectedImageProps: SelectedImageProps;
}

export default function Upload({
  name = 'cars',
  cars,
  selectedImageProps,
}: UploadProps) {
  const [selectedImage, setSelectedImage] = selectedImageProps;
  //   const [removeData, setRemoveData] = removeDataProps;
  const handleImageChange = (event: any) => {
    const file = event.target.files;

    const newSelectedImage = [...selectedImage];
    const arraySelectedImage = newSelectedImage.concat([...file]);
    setSelectedImage(arraySelectedImage);
  };
  const handleRemove = (i: number) => {
    const newSelectedImage = [...selectedImage];

    newSelectedImage.splice(i, 1);
    setSelectedImage(newSelectedImage);
  };
  //   const handleRemoveData = (id: string | number, name: string) => {
  //     setRemoveData({
  //       ids: [...removeData.ids, id],
  //       names: [...removeData.names, name],
  //     });
  //   };

  return (
    <div
      className={`flex w-full h-full items-center ${cars?.length && selectedImage?.length ? 'gap-2' : ''}`}
    >
      <div className="overflow-x-auto flex w-min ">
        {!!cars?.length &&
          cars?.map((car: CarMediaItem, i: number) => (
            <Media key={i} media={car} />
          ))}
        {!!selectedImage?.length &&
          selectedImage?.map((car: any, i: number) => (
            <Media isLocal key={i} media={car} />
          ))}
      </div>
      <div className="relative w-min">
        <label
          htmlFor="uploadFile1"
          className="bg-white text-gray-400 font-semibold rounded-lg w-[150px] h-[100px] flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed "
        >
          <UploadIcon className="w-8 mb-2 fill-gray-500" />
          Upload file
          <input
            type="file"
            id="uploadFile1"
            multiple
            accept="image/*"
            name={name}
            onChange={handleImageChange}
            className="hidden"
          />
          {/* <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p> */}
        </label>
      </div>
    </div>
  );
}

function Media({
  className,
  isLocal,
  media,
}: {
  className?: string;
  isLocal?: boolean;
  media: any;
}) {
  const src = isLocal ? URL.createObjectURL(media) : media?.link;
  return (
    <div className={`relative min-w-max ${className}`}>
      <img
        className="w-[150px] h-[100px] mr-4 rounded-lg object-cover"
        alt={media?.name}
        src={src}
      />
    </div>
  );
}

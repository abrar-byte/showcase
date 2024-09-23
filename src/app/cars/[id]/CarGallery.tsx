'use client';
import Chevrondown from '@/components/icons/Chevrondown';
import { CarMediaItem } from '@/types';
import { dummyCars, dummyGallery } from '@/utils/dummy';
import { handleImageError } from '@/utils/helpers';
import React, { useState } from 'react';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const placeholder = `images/placeholder-car.png`;
export default function CarGallery({ carMedia }: { carMedia: CarMediaItem[] }) {
  const [view, setView] = useState(carMedia[0]?.link);

  return (
    <div className="block space-y-4 w-full overflow-hidden">
      <img
        src={view || placeholder}
        onError={handleImageError}
        alt={'car'}
        className={'w-full h-[232px] lg:h-[360px] rounded-lg object-cover'}
      />

      {carMedia.length > 1 && (
        <Swiper
          loop={carMedia?.length > 3}
          grabCursor={true}
          spaceBetween={20}
          slidesPerView={3}
          modules={[Navigation]}
        >
          {carMedia?.map((gallery, i) => {
            const active = view == gallery?.link;
            const activeClass = active
              ? 'border-2 border-primary rounded-lg p-1.5'
              : '';
            return (
              <SwiperSlide key={i}>
                <div
                  className={`${activeClass} h-[64px] lg:h-[124px] hover:border-2 hover:rounded-lg hover:border-primary hover:p-1.5`}
                >
                  <img
                    onMouseEnter={() => setView(gallery?.link)}
                    src={gallery?.link || placeholder}
                    alt={gallery?.name}
                    onError={handleImageError}
                    className="object-cover cursor-pointer rounded-lg w-full h-full"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}

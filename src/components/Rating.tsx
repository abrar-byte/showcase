import React from 'react';
import StarIcon from './icons/StarIcon';

export default function Rating({ rate = 0 }: { rate?: number }) {
  return (
    <div className="flex item-center">
      {Array(5)
        .fill('star')
        .map((star: string, iStar: number) => {
          return (
            <StarIcon
              key={iStar}
              className={`w-5 h-5 ${
                iStar + 1 <= Math.round(rate)
                  ? 'fill-orange-400'
                  : 'stroke-secondary'
              } `}
            />
          );
        })}
    </div>
  );
}

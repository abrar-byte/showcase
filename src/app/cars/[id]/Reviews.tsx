'use client';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import Rating from '@/components/Rating';
import Chevrondown from '@/components/icons/Chevrondown';
import { useGetReviews } from '@/services/cars';
import { metaResponse } from '@/services/type';
import { CommentType, Review } from '@/types';
import { dummyReviews } from '@/utils/dummy';
import dayjs from 'dayjs';
import React, { useState } from 'react';
let reviewCount = 13;

interface ReviewProps {
  data: Review[];
  meta: metaResponse;
}
export default function Reviews({ carId }: { carId: number | string }) {
  const [page, setPage] = useState({ current: 1, take: 2 });

  const { data: listReviews, isPending } = useGetReviews(carId, {
    take: page.take,
    page: page.current,
  });

  return (
    <div className="bg-white rounded-lg p-5">
      {isPending && <Loading fullscreen={false} />}
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-gray-900 text-xl font-semibold">Reviews</h1>
        <span className="bg-primary py-2 px-3.5 text-white text-sm font-bold rounded">
          {listReviews?.meta?.count}
        </span>
      </div>
      <div className="space-y-5">
        {!!listReviews?.data?.length &&
          listReviews?.data?.map((review, iReview) => {
            return <Comment key={iReview} comment={review} />;
          })}
        {listReviews?.meta?.count &&
          listReviews?.meta?.count > 2 &&
          page.take < 10 && (
            <div className="flex justify-center">
              <button
                className="flex items-center gap-2"
                onClick={() => setPage({ ...page, take: 10 })}
              >
                <span className="text-secondary font-semibold ">Show All</span>
                <Chevrondown className="w-4 h-4 stroke-secondary " />
              </button>
            </div>
          )}
        {!!listReviews?.data?.length && page.take >= 10 && (
          <Pagination
            totalItems={listReviews?.meta?.count || 0}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}

function Comment({ comment }: { comment: Review }) {
  return (
    <div className="flex gap-4">
      <img
        className="w-11 h-11 lg:w-14 lg:h-14 rounded-full"
        src={comment?.user?.image}
        alt={comment?.user?.fullname}
      />
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between gap-5 w-full">
          <div className="grid">
            <p className=" text-gray-900 lg:text-xl font-semibold lg:font-bold lg:leading-loose">
              {comment?.user?.fullname}
            </p>
            {/* <p className="text-slate-400 text-xs lg:text-sm font-medium lg:leading-tight">
              {comment.role}
            </p> */}
          </div>
          <div className="grid">
            <p className="text-right text-slate-400 text-xs lg:text-sm font-medium lg:leading-tight">
              {dayjs(comment?.review_at).format('DD MMMM YYYY')}
            </p>
            <Rating rate={comment?.rating} />
          </div>
        </div>
        <p className=" text-slate-500 text-xs lg:text-sm lg:leading-7">
          {comment?.review}
        </p>
      </div>
    </div>
  );
}

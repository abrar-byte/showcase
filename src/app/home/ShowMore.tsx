import Button from '@/components/Button';
import Loading from '@/components/Loading';
import React from 'react';
interface showMoreProps {
  total: number;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  message?: string;
}

export default function ShowMore({
  total,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  message = 'Show More Car',
}: showMoreProps) {
  return (
    <div className="flex  justify-between gap-5 items-end mt-5  ">
      <p className="invisible"></p>
      {isFetchingNextPage ? (
        <Loading fullscreen={false} />
      ) : hasNextPage ? (
        <Button
          variant="primary"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {message}
        </Button>
      ) : (
        <></>
      )}

      <p className="text-right text-secondary text-sm font-medium leading-tight">
        {total} Car
      </p>
    </div>
  );
}

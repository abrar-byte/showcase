/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { defaultPage } from '@/components/Pagination';
import { useDeleteGarage, useGarageList } from '@/services/garages';
import { Title } from '@/components/Title';
import { obj } from '@/types';
import Pencil from '@/components/icons/Pencil';
import Trash from '@/components/icons/Trash';
import ModalAddEdit from './modalAddEdit';
import Modal, { DialogType, DialogValue } from '@/components/Modal';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { toast } from 'react-toastify';
import { useOrderList } from '@/services/orders';
import CharLimit from '@/components/CharLimit';
import { orderStatus } from '@/utils/constants';
import EyeIcon from '@/components/icons/EyeIcon';

type HAction = (type: DialogType, item: obj) => void;

export default function Page() {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(defaultPage);
  const [dialog, setDialog] = useState<DialogValue>(false);
  const [status, setStatus] = useState('');

  const { data: orderList, ...resListOrder } = useOrderList({
    queryParams: {
      search: searchValue,
      page: page.current,
      take: page.take,
      status,
    },
  });
  const { mutateAsync: deleteGarage, ...dG } = useDeleteGarage();

  const handleAction: HAction = async (type, item) => {
    if (!dialog) {
      setDialog({ type, item });
    }
  };

  const handleDelete = async (e: any, item: any) => {
    try {
      // e.preventDefault();
      if (typeof dialog === 'object') {
        await deleteGarage(dialog?.item?.id);
      }
      // await updateEvent({ id: item?.id, payload: { active: false } });
      setDialog(false);
    } catch (error) {
      toast.error(`something went wrong`);
    }
  };

  return (
    <AuthLayout>
      <title>Garages - Gorent</title>
      {resListOrder?.isPending && <Loading fullscreen={false} />}

      {resListOrder?.isSuccess && (
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          pageProps={[page, setPage]}
          columns={createColumns(handleAction)}
          title={'Orders'}
          data={orderList}
          additionalComponent={
            <div className="flex items-center space-x-5 overflow-x-scroll w-full mt-5">
              {orderStatus
                ?.slice(1)
                .map((order: { label: string; value: string }, i: number) => {
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
                })}
            </div>
          }
          // handleAdd={() => setDialog({ type: 'add' })}
        />
      )}
      {typeof dialog === 'object' && (
        <>
          {['add', 'edit'].includes(dialog?.type) && (
            <ModalAddEdit
              dialogProps={[dialog, setDialog]}
              isAdd={dialog?.type === 'add'}
              item={dialog?.item}
            />
          )}

          {/* {dialog?.type == 'delete' && (
            <ConfirmModal
              dialogProps={[dialog, setDialog]}
              title={`Delete ${dialog?.item?.name}?`}
              handleConfirm={handleDelete}
            />
          )} */}
        </>
      )}
    </AuthLayout>
  );
}

const createColumns = (handleAction: HAction) => [
  {
    accessorKey: 'car_name',
    header: 'Car Name',
  },
  {
    accessorKey: 'cust_name',
    header: 'Customer Name',
  },
  // {
  //   accessorKey: 'cust_city',
  //   header: 'Customer City',
  // },
  // {
  //   accessorKey: 'cust_phone',
  //   header: 'Customer Phone',
  // },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }: any) => {
      return (
        <CharLimit className="" text={row?.original?.note || ''} max={20} />
      );
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      return <span className={`text-primary`}>{row?.original?.status}</span>;
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }: any) => {
      return <span>${row?.original?.total || 0}</span>;
    },
  },

  {
    accessorKey: 'action',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex items-center ">
        <button
          onClick={() => handleAction('edit', row?.original)}
          className="hover:opacity-60 ml-5"
        >
          <EyeIcon className="w-5 h-10 fill-primary " />
        </button>

        {/* <button
          onClick={() => handleAction('delete', row?.original)}
          className="hover:opacity-60"
        >
          <Trash className="w-5 h-10 stroke-red-600 " />
        </button> */}
      </div>
    ),
  },
];

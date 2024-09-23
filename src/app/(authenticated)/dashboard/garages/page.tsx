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

type HAction = (type: DialogType, item: obj) => void;

export default function Page() {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(defaultPage);
  const [dialog, setDialog] = useState<DialogValue>(false);
  const { data: garage, ...G } = useGarageList({
    queryParams: { search: searchValue, page: page.current, take: page.take },
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
      {G?.isPending && <Loading fullscreen={false} />}
      {G?.isSuccess && (
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          pageProps={[page, setPage]}
          columns={createColumns(handleAction)}
          title={'Garages'}
          data={garage}
          handleAdd={() => setDialog({ type: 'add' })}
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

          {dialog?.type == 'delete' && (
            <ConfirmModal
              dialogProps={[dialog, setDialog]}
              title={`Delete ${dialog?.item?.name}?`}
              handleConfirm={handleDelete}
            />
          )}
        </>
      )}
    </AuthLayout>
  );
}

const createColumns = (handleAction: HAction) => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },

  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }: any) => {
      const active = row?.original?.active;
      return (
        <span className={`${active ? 'text-primary' : 'text-red-600'}`}>
          {active ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },

  {
    accessorKey: 'action',
    header: 'Actions',
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction('edit', row?.original)}
          className="hover:opacity-60"
        >
          <Pencil className="w-5 h-10 fill-primary " />
        </button>

        <button
          onClick={() => handleAction('delete', row?.original)}
          className="hover:opacity-60"
        >
          <Trash className="w-5 h-10 stroke-red-600 " />
        </button>
      </div>
    ),
  },
];

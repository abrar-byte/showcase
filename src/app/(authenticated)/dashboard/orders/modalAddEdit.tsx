'use client';
import Button from '@/components/Button';
import Modal, { DialogProps } from '@/components/Modal';

import React from 'react';
import dayjs from 'dayjs';
import { obj } from '@/types';
import ParsedInput, { InputItem } from '@/components/ParsedInput';
import { useAddGarage, useUpdateGarage } from '@/services/garages';
import StarIcon from '@/components/icons/StarIcon';
type Props = {
  dialogProps: DialogProps;
  item?: obj | null;
};

type AddEditProps = Props & { isAdd?: boolean };

const inputs: InputItem[] = [
  {
    name: 'car_name',
    label: 'Car Name ',
    className: 'lg:col-span-2',
    disabled: true,
  },
  {
    name: 'cust_name',
    label: 'Customer Name ',
    className: '',
    disabled: true,
  },
  {
    name: 'cust_phone',
    label: 'Customer Phone ',
    className: '',
    disabled: true,
  },
  {
    name: 'cust_city',
    label: 'Customer City ',
    className: '',
    disabled: true,
  },
  {
    name: 'cust_address',
    label: 'Customer Address ',
    className: '',
    type: 'textarea',
    disabled: true,
  },
  {
    name: 'note',
    label: 'Note',
    type: 'textarea',
    className: 'lg:col-span-2',
    disabled: true,
  },
  {
    name: 'amount',
    label: 'Amount',
    className: '',
    disabled: true,
  },
  {
    name: 'discount',
    label: 'Discount',
    className: '',
    disabled: true,
  },
  {
    name: 'total',
    label: 'Total',
    className: 'lg:col-span-2',
    disabled: true,
  },
  {
    name: 'status',
    label: 'Status',
    className: '',
    disabled: true,
  },
];

export default function ModalAddEdit({
  dialogProps,
  item,
  isAdd,
}: AddEditProps) {
  const [dialog, setDialog] = dialogProps;
  const { mutateAsync: addGarage, ...aG } = useAddGarage();
  const { mutateAsync: updateGarage, ...uG } = useUpdateGarage();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { name, description, location, active } = e.target;
    const today = dayjs().format('YYYY-MM-DD');
    const payload = {
      name: name.value,
      description: description.value,
      location: location.value,
      active: active.checked,
    };

    let result: any;
    if (isAdd) {
      result = await addGarage(payload);
    } else {
      result = await updateGarage({ id: item?.id, payload });
    }
    if (result) {
      await setDialog(false);
    }
  };

  const handleClose = () => {
    setDialog(false);
  };

  return (
    <Modal dialogProps={[dialog, setDialog]} handleClose={handleClose}>
      <h1 className="text-primary text-2xl font-medium mb-5">View Order</h1>

      <form onSubmit={handleSubmit} className="w-[90vw] lg:w-[85vw] space-y-4">
        <div>
          {Array(5)
            .fill('star')
            .map((star: string, iStar: number) => {
              return (
                <button key={iStar}>
                  <StarIcon
                    className={`w-5 h-5 cursor-pointer ${
                      iStar + 1 <= item?.rating
                        ? 'fill-orange-400'
                        : 'stroke-secondary'
                    }`}
                  />
                </button>
              );
            })}
        </div>
        <div className="space-y-4 grid lg:grid-cols-2 gap-5">
          {inputs.map((v, i) => {
            if (!isAdd) {
              delete v.defaultChecked;
            }
            return <ParsedInput key={i} inputItem={v} item={item} />;
          })}
        </div>

        <div className="flex justify-end gap-2 w-full">
          <Button outline type="button" onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button
            disabled={uG?.isPending || aG?.isPending}
            variant="primary"
            type="submit"
          >
            Save
          </Button> */}
        </div>
      </form>
    </Modal>
  );
}

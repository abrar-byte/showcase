'use client';
import Button from '@/components/Button';
import Modal, { DialogProps } from '@/components/Modal';

import React from 'react';
import dayjs from 'dayjs';
import { obj } from '@/types';
import ParsedInput, { InputItem } from '@/components/ParsedInput';
import { useAddGarage, useUpdateGarage } from '@/services/garages';
type Props = {
  dialogProps: DialogProps;
  item?: obj | null;
};

type AddEditProps = Props & { isAdd?: boolean };

const inputs: InputItem[] = [
  {
    name: 'name',
    label: 'Name ',
    className: 'w-full md:w-2/3',
    required: true,
  },
  {
    name: 'location',
    label: 'Location',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
  },
  { name: 'active', label: 'Active', type: 'toggle', defaultChecked: true },
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
      <h1 className="text-primary text-2xl font-medium mb-5">
        {isAdd ? 'Add' : 'Edit'} Garage
      </h1>

      <form onSubmit={handleSubmit} className="w-[90vw] lg:w-[85vw] space-y-4">
        <div className="space-y-4">
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
          <Button
            disabled={uG?.isPending || aG?.isPending}
            variant="primary"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

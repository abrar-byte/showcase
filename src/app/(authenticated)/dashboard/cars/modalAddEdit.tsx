'use client';
import Button from '@/components/Button';
import Modal, { DialogProps } from '@/components/Modal';

import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { obj } from '@/types';
import ParsedInput, { InputItem } from '@/components/ParsedInput';
import {
  useAddGarage,
  useGarageList,
  useUpdateGarage,
} from '@/services/garages';
import { MappingFunction, createOptions } from '@/utils/helpers';
import Loading from '@/components/Loading';
import {
  useAddCar,
  useGetCarMedia,
  useUpdateCar,
  useUploadCar,
} from '@/services/cars';
import { useApiAnyGet } from '@/services/client';
import Upload from '@/components/Upload';
type Props = {
  dialogProps: DialogProps;
  item?: obj | null;
};

type AddEditProps = Props & { isAdd?: boolean };

export default function ModalAddEdit({
  dialogProps,
  item,
  isAdd,
}: AddEditProps) {
  const [dialog, setDialog] = dialogProps;
  const { data: listGarages, ...lG } = useGarageList({
    queryParams: {
      take: 50,
      active: true,
    },
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const { data: metadata, ...resMetadata } = useApiAnyGet('metadata');
  const { data: carMedia, ...resCarMedia } = useGetCarMedia(item?.id);

  const { mutateAsync: addCar, ...aC } = useAddCar();
  const { mutateAsync: uploadCar, ...uploadC } = useUploadCar();

  const { mutateAsync: updateCar, ...uC } = useUpdateCar();

  const { CAR_TYPE = [], CAR_STEERING = [] } = metadata || {};

  // custom map for list garage
  const customMappingFunction: MappingFunction = (item) => ({
    label: item.name,
    value: item.id,
  });

  const inputs = useMemo<InputItem[]>(
    () => [
      {
        name: 'name',
        label: 'Name ',
        className: 'col-span-2',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        className: 'col-span-2',
      },
      {
        name: 'garage_id',
        label: 'Garage',
        type: 'select',
        options: createOptions(listGarages?.data || [], customMappingFunction),
        className: ' !z-50 col-span-2 lg:col-span-1',
        required: true,
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: createOptions(CAR_TYPE),
        className: '!z-40 col-span-2 lg:col-span-1',
        required: true,
      },
      {
        name: 'amount',
        label: 'Amount',
        className: '',
        type: 'number',
        step: 0.1,
        min: 0,

        required: true,
      },
      {
        name: 'discount',
        label: 'Discount',

        type: 'number',
      },
      {
        name: 'total_amount',
        label: 'Total Amount',

        type: 'displayDiscount',
      },
      {
        name: 'plate',
        label: 'Plate',

        required: true,
      },

      {
        name: 'gasoline',
        label: 'Gasoline',

        type: 'number',
      },
      {
        name: 'capacity',
        label: 'Capacity',

        type: 'number',
        required: true,
      },

      {
        name: 'steering',
        label: 'Steering',
        type: 'select',
        className: 'col-span-2 !z-30',
        options: createOptions(CAR_STEERING),
        required: true,
      },

      { name: 'active', label: 'Active', type: 'toggle', defaultChecked: true },
    ],
    [listGarages?.data, CAR_TYPE, CAR_STEERING],
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const {
      name,
      description,
      garage_id,
      amount,
      plate,
      discount,
      gasoline,
      capacity,
      type,
      steering,
      active,
    } = e.target;
    const payload = {
      name: name.value,
      description: description.value,
      plate: plate.value,

      garage_id: parseInt(garage_id.value),
      amount: parseFloat(amount.value),
      discount: parseFloat(discount.value),
      gasoline: parseFloat(gasoline.value),
      capacity: parseInt(capacity.value),
      type: type.value,
      steering: steering.value,

      active: active.checked,
    };

    let result: any;
    if (isAdd) {
      result = await addCar(payload);

      // if (result?.data?.id && !!selectedImages?.length) {
      //   const formData = new FormData();

      //   for (let i = 0; i < selectedImages.length; i++) {
      //     formData.append('files', selectedImages[i]);
      //   }
      //   formData.append('car_id', result?.data?.id);
      //   await uploadCar(formData);
      // }
    } else {
      result = await updateCar({ id: item?.id, payload });
      // if (item?.id && !!selectedImages?.length) {
      //   const formData = new FormData();

      //   for (let i = 0; i < selectedImages.length; i++) {
      //     formData.append('files', selectedImages[i]);
      //   }
      //   formData.append('car_id', result?.data?.id);
      //   await uploadCar(formData);
      // }
    }
    const carId = result?.data?.id || item?.id;
    if (carId && !!selectedImages?.length) {
      const formData = new FormData();

      for (let i = 0; i < selectedImages.length; i++) {
        formData.append('files', selectedImages[i]);
      }
      formData.append('car_id', result?.data?.id);
      await uploadCar(formData);
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
        {isAdd ? 'Add' : 'Edit'} Car
      </h1>
      {(lG?.isPending || resMetadata?.isPending) && (
        <Loading fullscreen={false} />
      )}

      {lG?.isSuccess && resMetadata?.isSuccess && (
        <form
          onSubmit={handleSubmit}
          className="w-[90vw] lg:w-[85vw] space-y-4"
        >
          <div className="space-y-1">
            <label className={`text-gray-400 font-semibold `}>
              Upload Car Media
            </label>
            <Upload
              selectedImageProps={[selectedImages, setSelectedImages]}
              cars={carMedia?.data || []}
              name="cars"
            />
          </div>
          <div className="space-y-4 grid grid-cols-2 gap-5">
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
              disabled={uC?.isPending || aC?.isPending || uploadC?.isPending}
              variant="primary"
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

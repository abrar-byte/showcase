'use client';
import React, { useMemo, useState } from 'react';
import RSelect from './RSelect';
import { InputItem } from './ParsedInput';
import { useGarageList } from '@/services/garages';
import { MappingFunction, createOptions } from '@/utils/helpers';
import { format } from 'date-fns';
import Modal, { DialogValue } from './Modal';
import DateRange, { initialRange } from './DateRange';
import Button from './Button';

// const filterOptions = [
//   {
//     key: 'garage_id',
//     label: 'Locations',
//     type: 'select',
//     options: [],
//   },
//   {
//     key: 'date',
//     label: 'Date',
//     type: 'date-range',

//     options: [],
//   },
//   {
//     key: 'time',
//     label: 'Time',
//     type: 'select',

//     options: [],
//   },
// ];

interface ListFilter {
  key: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
}

interface Garage {
  label?: string;
  value?: string;
  description?: string;
  location?: string;
}

export default function CardFilter({ title }: { title: string }) {
  const [dialog, setDialog] = useState<DialogValue>(false);
  const [garage, setGarage] = useState<Garage>({});
  const [range, setRange] = useState(initialRange);
  const { data: listGarages, ...lG } = useGarageList({
    queryParams: {
      take: 50,
      active: true,
    },
  });

  // custom map for list garage
  const customMappingFunction: MappingFunction = (item) => ({
    label: item.name,
    value: item.id,
    description: item.description,
    location: item.location,
  });

  const listFilter = useMemo<ListFilter[]>(
    () => [
      {
        key: 'garage_id',
        label: 'Locations',
        type: 'select',
        options: createOptions(listGarages?.data || [], customMappingFunction),
      },
      {
        key: 'date',
        label: 'Date',
        type: 'date-range',
      },
    ],
    [listGarages?.data],
  );
  const handleClose = () => {
    setRange(initialRange);
    setDialog(false);
  };

  const handleGarage = (value: any) => {
    setGarage(value);
  };

  return (
    <div className="bg-white rounded-lg p-5 w-full">
      {dialog && (
        <Modal dialogProps={[dialog, setDialog]} handleClose={handleClose}>
          <DateRange rangeProps={[range, setRange]} />
          <div className="flex justify-end gap-2 w-full pt-5 ">
            <Button outline type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={() => setDialog(false)}
              // disabled={uC?.isPending || aC?.isPending || uploadC?.isPending}
              variant="primary"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Modal>
      )}
      <div className="flex items-center gap-1 mb-5">
        <div
          className={`w-4 h-4 p-1 ${title.includes('Up') ? 'bg-primary/30' : 'bg-info/30'} rounded-3xl justify-center items-center inline-flex`}
        >
          <span
            className={`w-2 h-2 ${title.includes('Up') ? 'bg-primary' : 'bg-info'}  rounded-full`}
          />
        </div>
        <h4 className=" text-black font-semibold ">{title}</h4>
      </div>
      <div className="flex ">
        {listFilter.map(({ key, label, options, type }: ListFilter, i) => {
          if (type == 'select') {
            return (
              <div key={i} className="w-full grow">
                <div
                  key={i}
                  className={`${
                    i !== 0
                      ? 'border-l border-slate-300 px-3 lg:px-5'
                      : 'pr-3 lg:pr-5'
                  }  grow w-full`}
                >
                  <RSelect
                    // value={options?.find(
                    //   (v) =>
                    //     v?.value===
                    //     garage?.id
                    // )}
                    // value={options[0]}
                    label={label}
                    name={key}
                    // id={key}
                    onChange={handleGarage}
                    inputClass=" !border-0 !border-transparent !font-semibold focus:!border-none focus:!ring-0 focus:!outline-none hover:!border-none hover:!border-transparent !shadow-none -ml-2"
                    className="text-gray-900 font-semibold bg-white capitalize without-border"
                    options={options}
                  />
                </div>
                <div className="space-y-1 mt-5">
                  <h2 className="font-medium text-gray-700">
                    {garage?.description}
                  </h2>
                  <p className="text-sm text-gray-600">{garage?.location}</p>
                </div>
              </div>
            );
          }
          if (type == 'date-range') {
            return (
              <div className="space-y-1 w-full" key={i}>
                <label className={`text-gray-900 font-semibold`}>
                  Select your date
                </label>

                <button
                  onClick={() => setDialog(true)}
                  type="button"
                  className=" bg-neutral-100 hover:opacity-70 px-4 py-3 rounded-lg items-center gap-3 flex mt-3"
                >
                  <svg
                    className="w-4 h-4 text-gray-700 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                  {/* <MdDateRange className="text-white text-2xl" /> */}
                  <span className="text-gray-700 font-medium ">
                    {format(range?.startDate, 'd MMMM yyyy')} -{' '}
                    {format(range?.endDate, 'd MMMM yyyy')}
                  </span>
                </button>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

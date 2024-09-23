'use client';
import { filterOptionCars } from '@/utils/constants';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import Checkbox from './Checkbox';
import useToggle from '@/stores/toggle';
import { customObjectToQs, queryParamsToQs } from '@/services/helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Selected } from '@/types';
import { useCarMetadata } from '@/services/cars';
import { MappingFunction, createOptions } from '@/utils/helpers';

type Option = {
  label: string | number;
  value: string | number;
  count: number;
};
export default function SidebarFilter() {
  const { hasSidebar, toggleSidebar, closeSidebar } = useToggle(
    (state) => state,
  );
  const { data: metadata, isPending } = useCarMetadata();
  const { TYPE = [], CAPACITY = [] } = metadata || {};
  const sidebarRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebarRef.current) return;
      if (!hasSidebar || sidebarRef.current.contains(target)) return;
      closeSidebar();
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });
  // useEffect(() => {
  //   const clickHandler = ({ target }: MouseEvent) => {
  //     closeSidebar();
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });

  useEffect(() => {
    // close if the esc key is pressed
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!hasSidebar || key == 'Esc') return;
      toggleSidebar(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const [selected, setSelected] = useState<Selected>({
    capacity: [],
    amount: 0,
    type: [],
  });
  const [tempAmount, setTempAmount] = useState(selected.amount);

  useEffect(() => {
    const updateSelectedFilters = () => {
      const newSelected = { ...selected };

      const capacityParam = searchParams.get('capacity');
      const typeParam = searchParams.get('type');
      const amountParam = searchParams.get('amount');

      if (capacityParam) {
        newSelected.capacity = capacityParam
          .split(',')
          .map((value) => parseFloat(value))
          .filter((value) => !isNaN(value));
      }
      if (typeParam) {
        newSelected.type = typeParam.split(',');
      }
      if (amountParam) {
        let valueAmount = parseInt(amountParam, 10) || 100;
        newSelected.amount = valueAmount;
        setTempAmount(valueAmount);
      }

      setSelected(newSelected);
    };

    updateSelectedFilters();
  }, [searchParams]);

  const handlePrice: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTempAmount(parseInt(event.target.value, 10));
  };

  const handleMouseUp = () => {
    const query = customObjectToQs({
      ...selected,
      ...(searchParams?.get('search') && {
        search: searchParams?.get('search') || '',
      }),
      amount: tempAmount,
    });
    router.push(`${pathname}${query}`);

    setSelected({ ...selected, amount: tempAmount });
  };

  const handleChangeCheckbox = (
    isChecked: boolean,
    key: string,
    item: string | number,
  ) => {
    // Create a copy of the previous state
    const updatedSelected: Selected = {
      ...selected,
    };

    // Ensure the key exists and is an array
    if (!Array.isArray(updatedSelected[key])) {
      updatedSelected[key] = [];
    }

    // Update the array based on isChecked
    if (isChecked) {
      if (!updatedSelected[key].includes(item)) {
        updatedSelected[key].push(item);
      }
    } else {
      updatedSelected[key] = updatedSelected[key].filter(
        (val: any) => val !== item,
      );
    }
    const { amount, ...updated } = updatedSelected;
    const newUpdatedSelected = amount ? updatedSelected : updated;

    const query = customObjectToQs({
      ...(searchParams?.get('search') && {
        search: searchParams?.get('search') || '',
      }),
      ...newUpdatedSelected,
    });

    router.push(`${pathname}${query}`);
    setSelected(updatedSelected);
  };

  return (
    <>
      {hasSidebar && (
        <div className="bg-black/50 fixed w-full h-full z-[80] top-0" />
      )}

      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 p-5 z-[90] lg:z-20 border-r border-gray-100 flex h-screen w-64  flex-col gap-10  overflow-y-auto  text-gray-900 bg-white duration-300 ease-linear  lg:static lg:translate-x-0 ${
          hasSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
        // className="bg-white border-r w-[360px] border-gray-100 p-5 hidden lg:block min-h-screen"
      >
        {filterOptionCars.map((filter, iFilter: number) => {
          let options: Option[] | any[] = [];
          const customMappingFunction: MappingFunction = (item) => ({
            label: item.type,
            value: item.type,
            count: item.count,
          });

          if (filter?.key?.toUpperCase() == 'TYPE') {
            options = createOptions(TYPE, customMappingFunction);
          }
          if (filter?.key?.toUpperCase() == 'CAPACITY') {
            options = createOptions(CAPACITY, customMappingFunction);
          }
          return (
            <div key={iFilter}>
              <h1
                className={`text-secondary text-xs font-semibold uppercase mb-3 `}
              >
                {filter.label}
              </h1>
              {filter.type == 'checkbox' && (
                <div className="space-y-3">
                  {options?.map((option, iOption) => {
                    let modifiedLabel =
                      filter.key == 'capacity'
                        ? `${option.label} Person`
                        : option.label;
                    return (
                      <Checkbox
                        labelClass={'!text-lg !text-slate-500 leading-loose'}
                        className=""
                        key={iOption}
                        label={modifiedLabel}
                        info={option.count}
                        name={option.value}
                        checked={selected[filter.key]?.includes(option.value)}
                        onChange={(value: any) =>
                          handleChangeCheckbox(value, filter.key, option.value)
                        }
                      />
                    );
                  })}
                </div>
              )}
              {filter.type == 'range' && (
                <div className="space-y-1">
                  <input
                    className="rounded-full overflow-hidden appearance-none bg-secondary h-3 w-full "
                    type="range"
                    min={1}
                    max={1000}
                    value={tempAmount}
                    onChange={handlePrice}
                    onMouseUp={handleMouseUp}
                    step={1}
                  />
                  <div className="text-slate-500 text-xl font-semibold leading-loose">
                    Max. ${tempAmount}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

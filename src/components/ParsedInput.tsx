import { obj } from '@/types';
import React, { useMemo, useState } from 'react';
import Input from './Input';
import RSelect from './RSelect';
import { calculateFinalAmount, parseOptions } from '@/utils/helpers';
import dayjs from 'dayjs';
import Toggle from './Toggle';
// import { Props } from 'react-select';

export type InputItem = {
  name: string; // Field name, used as a key to access the item's value.
  label: string; // Label for the input field.
  type?:
    | 'select'
    | 'displayDiscount'
    | 'number'
    | 'textarea'
    | 'toggle'
    | 'url'
    | 'date'
    | 'time'
    | 'imagePreview'
    | 'file'
    | 'multiselect';
  options?: { label: string; value: string }[]; // Options for select or multiselect fields.
  required?: boolean; // Optional boolean indicating if the field is required.
  className?: string | null | undefined;
  [key: string]: any;
};

type Props = {
  inputItem: InputItem;
  item: obj | null | undefined;
};

export default function ParsedInput({ inputItem: v, item }: Props) {
  let { name, label, type, options, className, ...props } = v;
  if (!className) {
    className = '';
  }

  let defaultValue: any = item?.[name] ? item[name] : '';
  if (props && !props.defaultChecked) {
    props.defaultChecked = defaultValue;
  }
  if (defaultValue) {
    if (type === 'date') {
      defaultValue = dayjs(defaultValue).format('YYYY-MM-DD');
    }
    if (type === 'time') {
      defaultValue = dayjs(defaultValue).format('HH:mm');
    }
  }

  if (!type || ['url', 'textarea', 'date', 'time', 'number'].includes(type)) {
    return (
      <Input
        float
        textarea={type === 'textarea'}
        className={className}
        type={type || 'text'}
        label={label}
        name={name}
        defaultValue={defaultValue}
        placeholder={label}
        {...props}
      />
    );
  }

  if (type === 'select') {
    return (
      <RSelect
        float
        creatable
        options={options}
        label={label}
        name={name}
        defaultValue={
          defaultValue
            ? options?.find((x: any) => x.value === defaultValue)
            : null
        }
        outline
        className={className}
        {...props}
      />
    );
  }
  if (type === 'multiselect') {
    return (
      <RSelect
        float
        isMulti
        creatable
        options={options}
        label={label}
        name={name}
        defaultValue={defaultValue ? parseOptions(defaultValue) : []}
        outline
        className={className}
        {...props}
      />
    );
  }
  if (type === 'toggle')
    return (
      <Toggle
        name={name}
        label={label}
        defaultChecked={!!item?.Draft}
        className={className}
        {...props}
      />
    );

  // harus pakai state
  // if (type == 'displayDiscount') {
  //   const { finalAmount, discountAmount } = calculateFinalAmount(
  //     item?.discount,
  //     item?.amount,
  //   );
  //   return (
  //     <div className={`space-y-1 ${className}`}>
  //       <label className={`text-gray-400 text-sm  `}>{label}</label>
  //       <p className="text-gray-900">
  //         {finalAmount}
  //         <span className="line-through ml-2 text-gray-300">
  //           {discountAmount}
  //         </span>
  //       </p>
  //     </div>
  //   );
  // }
  // if (type === 'imagePreview' && newItem[name])
  //   return (
  //     <div key={i} className="lg:col-span-2 space-y-1">
  //       <div className="text-gray-400 text-sm">{label} </div>
  //       <Image
  //         src={newItem.Image}
  //         alt="image"
  //         loading="lazy"
  //         decoding="async"
  //         className="h-32 w-auto"
  //         width={0}
  //         height={128}
  //       />
  //     </div>
  //   );
}

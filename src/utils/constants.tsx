import { FilterOptionCars } from '@/types';
import { capacities, carTypes } from '@/utils/dummy';

export const filterOptionCars = [
  {
    type: 'checkbox',
    key: 'type',
    label: 'Type',
    options: carTypes,
  },
  {
    type: 'checkbox',
    key: 'capacity',
    label: 'Capacity',
    options: capacities,
  },
  {
    type: 'range',
    key: 'price',
    label: 'Price',
    options: [],
  },
];

export const detailCar = [
  {
    key: 'type',
    label: 'Type Car',
  },
  {
    key: 'capacity',
    label: 'Capacity',
  },
  {
    key: 'steering',
    label: 'Steering',
  },
  {
    key: 'gasoline',
    label: 'Gasoline',
  },
];

export const keywords = [
  'car rental',
  'rent a car',
  'vehicle hire',
  'car hire',
  'cheap car rental',
];

export const orderStatus = [
  { label: 'Waiting For Payment', value: 'CHECKOUT' },
  { label: 'Paid', value: 'PAID' },
  { label: 'On Going', value: 'ON_GOING' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const summaries = [
  {
    label: 'Subtotal',
    value: 'amount',
  },
  {
    label: 'Rental Duration',
    value: 'start_date',
  },
  {
    label: 'Discount',
    value: 'discount',
  },

  {
    label: 'Note',
    value: 'note',
  },
  {
    label: 'Invoice',
    value: 'invoice',
  },
];

export const description = 'The Best Platform for Car Rental';
export const applicationName = 'Gorent';



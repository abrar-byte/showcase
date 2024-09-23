import { Prisma } from '@prisma/client';

const orders: Omit<
  Prisma.OrderUncheckedCreateInput,
  'user_id' | 'car_id' | 'amount' | 'tax' | 'total'
>[] = [
  {
    id: 'o1',
    start_date: new Date('2024-09-01'),
    end_date: new Date('2024-09-10'),
    status: 'PAID',
  },
  {
    id: 'o2',
    start_date: new Date('2024-10-01'),
    end_date: new Date('2024-10-05'),
    status: 'PAID',
  },
  {
    id: 'o3',
    start_date: new Date('2024-11-01'),
    end_date: new Date('2024-11-07'),
    rating: 4,
    review: 'Nice car',
    status: 'COMPLETED',
  },
];

export default orders;

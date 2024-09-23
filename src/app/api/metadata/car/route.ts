import { prisma } from '@/utils/api/prisma';
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async () => {
  try {
    const [type, capacity] = await Promise.all([
      prisma.car.groupBy({
        by: ['type'],
        _count: {
          _all: true,
        },
      }),

      prisma.car.groupBy({
        by: ['capacity'],
        _count: {
          _all: true,
        },
      }),
    ]);

    const metadata = {
      TYPE: type.map((t) => ({ type: t.type, count: t._count._all })),
      CAPACITY: capacity.map((c) => ({
        type: c.capacity,
        count: c._count._all,
      })),
    };

    return NextResponse.json(metadata);
  } catch (error) {
    throw error;
  }
};

import { prisma } from '@/utils/api/prisma';
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async () => {
  try {
    const distinct = await prisma.car.findMany({
      distinct: ['type', 'steering'],
      select: {
        type: true,
        steering: true,
      },
    });

    const CAR_TYPES = new Set();
    const CAR_STEERING = new Set();

    for (let i = 0; i < distinct.length; i++) {
      const C = distinct[i];
      if (C.type) CAR_TYPES.add(C.type);
      if (C.steering) CAR_STEERING.add(C.steering);
    }

    const metadata = {
      USER_ROLE: ['ADMIN', 'USER'],
      ORDER_STATUS: ['PAID', 'ON_GOING', 'COMPLETED'],
      CAR_TYPE: [
        ...new Set([
          'Sport',
          'SUV',
          'MPV',
          'Sedan',
          'Coupe',
          'Hatchback',
          ...CAR_TYPES,
        ]),
      ],
      CAR_STEERING: [...new Set(['Manual', 'Automatic', ...CAR_STEERING])],
    };

    return NextResponse.json(metadata);
  } catch (error) {
    throw error;
  }
};

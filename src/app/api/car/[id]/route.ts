import { READ, REMOVE, UPDATE } from '@/utils/api/crud';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../auth/service';
import { Prisma } from '@prisma/client';
import { handleError } from '@/utils/api';
import { prisma } from '@/utils/api/prisma';
import { getRating } from './helper';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const id = params.id ? Number(params.id) : null;
    if (!id) throw new Error('id is required');

    const user = await getUser();
    const include: Prisma.CarInclude = {
      CarMedia: { orderBy: [{ cover: 'asc' }] },
      // Order: {
      //   where: { rating: { not: null } },
      //   select: { rating: true, review: true },
      // },
    };
    if (user?.id) {
      include.Favorite = { where: { user_id: user?.id } };
    }
    const car = await prisma.car.findFirstOrThrow({
      where: { id },
      include,
    });

    const rating = await getRating(car.id);

    const result: any = {
      ...car,
      rating,
    };
    // delete result.Order;

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};
export const PATCH = UPDATE;
export const DELETE = REMOVE;

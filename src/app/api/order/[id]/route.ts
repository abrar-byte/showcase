import { READ, REMOVE, UPDATE } from '@/utils/api/crud';
import { NextRequest, NextResponse } from 'next/server';
import { restrict } from '../../auth/service';
import { Prisma } from '@prisma/client';
import { deleteNotAllowedKeys, handleError } from '@/utils/api';
import { prisma } from '@/utils/api/prisma';
import { getRating } from '../../car/[id]/helper';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const user = await restrict();
    const where: Prisma.OrderWhereInput = { id: params.id };
    if (user.role === 'USER') {
      where.user_id = user.id;
    }
    const include: Prisma.OrderInclude = {
      car: { include: { CarMedia: { orderBy: [{ cover: 'asc' }] } } },
    };
    const order = await prisma.order.findFirstOrThrow({
      where,
      include,
    });

    const rating = await getRating(order.car.id);
    const result = { ...order, car: { ...order.car, rating } };
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};
export const PATCH = async (req: NextRequest, { params }: any) => {
  try {
    const user = await restrict();
    const allowedKeys = ['rating', 'review'];
    const data = (await req.json()) as Prisma.OrderUncheckedUpdateInput;
    deleteNotAllowedKeys(data, allowedKeys);
    if (typeof data.rating === 'number') {
      if (data.rating < 1) throw new Error('min rating is 1');
      if (data.rating > 5) throw new Error('max rating is 5');
    }
    data.review_at = new Date();
    const result = await prisma.order.update({
      where: { id: params.id, user_id: user.id },
      data,
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};

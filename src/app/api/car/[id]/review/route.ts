import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/utils/api';
import { Prisma } from '@prisma/client';
import { LIST } from '@/utils/api/crud';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const id = params.id ? Number(params.id) : null;
    if (!id) throw new Error('id is required');

    const where: Prisma.OrderWhereInput = {
      car_id: id!,
      rating: { not: null },
    };
    const select: Prisma.OrderSelect = {
      rating: true,
      review: true,
      review_at: true,
      user: { select: { fullname: true, image: true } },
    };

    return LIST(req, { where, select, table: 'Order' });
  } catch (error) {
    return handleError(error);
  }
};

import { LIST } from '@/utils/api/crud';
import { NextRequest, NextResponse } from 'next/server';
import { restrict } from '../auth/service';
import { handleError } from '@/utils/api';
import { prisma } from '@/utils/api/prisma';
import { Prisma } from '@prisma/client';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, P: any) => {
  try {
    const user = await restrict();
    const where: Prisma.FavoriteWhereInput = { user_id: user.id };
    const include: Prisma.FavoriteInclude = {
      car: { include: { CarMedia: { take: 1, orderBy: [{ cover: 'asc' }] } } },
    };
    return LIST(req, { ...P, where, include });
  } catch (error) {
    return handleError(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const user = await restrict();
    const data = await req.json();
    const result = await prisma.favorite.create({
      data: { ...data, user_id: user.id },
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};

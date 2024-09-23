import { CREATE, LIST } from '@/utils/api/crud';
import { NextRequest } from 'next/server';
import { getUser } from '../auth/service';
import { Prisma } from '@prisma/client';
import { handleError } from '@/utils/api';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, P: any) => {
  try {
    const user = await getUser();
    const include: Prisma.CarInclude = {
      CarMedia: { take: 1, orderBy: [{ cover: 'asc' }] },
    };
    if (user?.id) {
      include.Favorite = { where: { user_id: user?.id } };
    }
    return LIST(req, { ...P, include });
  } catch (error) {
    return handleError(error);
  }
};
export const POST = CREATE;

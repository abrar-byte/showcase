import { READ, REMOVE, UPDATE } from '@/utils/api/crud';
import { NextRequest } from 'next/server';
import { restrict } from '../../auth/service';
import { handleError } from '@/utils/api';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = READ;
export const DELETE = async (req: NextRequest, P: any) => {
  try {
    await restrict();
    return REMOVE(req, P);
  } catch (error) {
    return handleError(error);
  }
};

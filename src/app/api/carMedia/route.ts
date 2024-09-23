import { handleError } from '@/utils/api';
import { LIST } from '@/utils/api/crud';
import { prisma } from '@/utils/api/prisma';
import { uploadMultipleS3 } from '@/utils/api/upload';
import { NextRequest, NextResponse } from 'next/server';

export const GET = LIST;
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as unknown as File[];
    const car_id = data.get('car_id');
    if (!car_id) throw new Error('car_id is required');
    const Uploads = await uploadMultipleS3(files, {
      types: ['image', 'video'],
    });
    const result = [];
    if (Uploads.length) {
      for (let i = 0; i < Uploads.length; i++) {
        const F = Uploads[i];
        const media = await prisma.carMedia.create({
          data: { ...F, car_id: Number(car_id) },
        });
        result.push(media);
      }
    }
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

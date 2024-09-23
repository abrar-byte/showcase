import { CREATE, LIST } from '@/utils/api/crud';
import { NextRequest, NextResponse } from 'next/server';
import { restrict } from '../auth/service';
import { Prisma } from '@prisma/client';
import { handleError } from '@/utils/api';
import { prisma } from '@/utils/api/prisma';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, P: any) => {
  try {
    const user = await restrict();
    const where: Prisma.OrderWhereInput = { user_id: user.id };
    const include: Prisma.OrderInclude = {
      car: { include: { CarMedia: { take: 1, orderBy: [{ cover: 'asc' }] } } },
    };
    return LIST(req, { ...P, where, include });
  } catch (error) {
    return handleError(error);
  }
};

export const POST = async (req: NextRequest, P: any) => {
  try {
    const user = await restrict();
    const {
      car_id,
      start_date,
      end_date,
      drop_off = false,
      drop_location = null,
      cust_name = null,
      cust_phone = null,
      cust_address = null,
      cust_city = null,
    } = (await req.json()) as Prisma.OrderUncheckedCreateInput;

    if (!cust_phone) throw new Error('cust_phone is required');

    // >> todo: cek dulu apakah di tanggal itu car ready
    // >> caranya: car include order where start_date sekian dan end_date sekian

    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        car_id: Number(car_id),
        start_date,
        end_date,
        drop_off,
        drop_location,
        cust_name,
        cust_phone,
        cust_address,
        cust_city,
        //note:  amount, discount, total  dll di set ketika payment berhasil
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return handleError(error);
  }
};

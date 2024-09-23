import { NextRequest, NextResponse } from 'next/server';
import { getSumDaysOfDates, handleError } from '@/utils/api';
import { restrict } from '../../auth/service';
import ENV from '@/utils/api/env';
import { prisma } from '@/utils/api/prisma';
import { CheckoutBody, checkoutMetadata, stripe } from '../helper';
import dayjs from 'dayjs';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest, P: any) => {
  try {
    const user = await restrict();
    const { order_id } = (await req.json()) as CheckoutBody;

    const order = await prisma.order.findFirstOrThrow({
      where: { id: order_id },
      include: {
        car: true,
      },
    });
    const {
      car: { amount, discount, name },
    } = order;

    const customers = await stripe.customers.search({
      query: `email:'${user.email}'`,
    });

    let C = customers?.data?.length
      ? customers.data[customers.data.length - 1]
      : null;

    if (!C) {
      C = await stripe.customers.create({
        name: user.fullname || '',
        email: user.email,
        metadata: {
          gorent_user_id: user.id,
        },
      });
    }

    const total: any = amount - (discount || 0);

    const metadata: checkoutMetadata = {
      user_id: user.id,
      email: user.email,
      order_id,
      car_name: name,
      amount,
      discount: discount || 0,
      total,
    };

    const days = getSumDaysOfDates(order.start_date, order.end_date);

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      billing_address_collection: 'auto',
      mode: 'payment',
      // customer_email: user.email,
      customer: C.id,
      line_items: [
        {
          price_data: {
            unit_amount: total * 100, //in cents
            currency: 'USD',
            product_data: {
              name: 'GORENT',
              description: `Payment for renting ${name} for ${dayjs(order.start_date).format('DD MMM YYYY')} ${days > 1 ? `- ${dayjs(order.end_date).format('DD MMM YYYY')} (${days} days)` : ''}`,
            },
          },
          quantity: 1,
        },
      ],
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata,
          custom_fields: [
            {
              name: 'Platform',
              value: 'Gorent',
            },
            {
              name: 'Car',
              value: order.car_name || name,
            },
            {
              name: 'Start Date',
              value: dayjs(order.start_date).format('DD MMM YYYY'),
            },
            {
              name: 'End Date',
              value: dayjs(order.end_date).format('DD MMM YYYY'),
            },
          ],
          description: `Valid invoice payment for renting ${name} for ${dayjs(order.start_date).format('DD MMM YYYY')} ${days > 1 ? `- ${dayjs(order.end_date).format('DD MMM YYYY')} (${days} days)` : ''}`,
        },
      },
      metadata,
      // success_url: `${env.APP_URL}?payment_status=succeeded`,
      // cancel_url: `${env.APP_URL}?payment_success=failed`,
      return_url: `${ENV.NEXTAUTH_URL}/orders`,
    });

    return NextResponse.json(session);
  } catch (error) {
    return handleError(error);
  }
};

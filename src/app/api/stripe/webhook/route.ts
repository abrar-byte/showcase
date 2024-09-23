import ENV from '@/utils/api/env';
import { checkoutMetadata, stripe } from '../helper';
import { prisma } from '@/utils/api/prisma';
import { deepConsole, handleError } from '@/utils/api';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  // payment_intent.succeeded
  // payment_intent.created
  // checkout.session.completed
  // mandate.updated
  // charge.succeeded
  // charge.updated
  try {
    // const headerPayload = headers();
    // const sig = headerPayload.get('stripe-signature') as any;
    const sig = req.headers.get('stripe-signature') as any;
    const body = await req.text();
    const endpointSecret = ENV.STRIPE.WEBHOOK_SECRET;
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // if (event.type === 'payment_intent.succeeded') {
    //   const obj = event.data.object;
    //   console.log('[payment_intent.succeeded]');
    //   deepConsole(obj);
    // }
    // if (event.type === 'payment_intent.created') {
    //   const obj = event.data.object;
    //   console.log('[payment_intent.created]');
    //   deepConsole(obj);
    // }

    // ----------------------------- checkout (including payment)
    if (event.type === 'checkout.session.completed') {
      const S = event.data.object;
      if (S.payment_status !== 'paid') throw new Error('Payment not paid');

      const {
        user_id,
        email,
        order_id,
        car_name,
        amount,
        discount,
        total,
      }: checkoutMetadata = S?.metadata as any;
      let invoice = null;

      if (S.invoice) {
        invoice = await stripe.invoices.retrieve(
          typeof S.invoice === 'string' ? S.invoice : S?.invoice?.id,
        );
      }

      const result = await prisma.order.update({
        where: { id: order_id },
        data: {
          status: 'PAID',
          car_name: car_name || null,
          amount,
          discount,
          total,
          paid_at: new Date(),
          s_payment_intent_id:
            typeof S.payment_intent === 'string'
              ? S.payment_intent
              : S?.payment_intent?.id,
          s_customer_id:
            typeof S.customer === 'string' ? S.customer : S.customer?.id,
          s_invoice_id: invoice?.id || '',
          s_hosted_invoice_url: invoice?.hosted_invoice_url || '',
        },
      });
      return NextResponse.json(result);
    }

    // ----------------------------- handling failed
    if (event.type.includes('failed')) {
      throw new Error(event.type);
    }
    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    return handleError(error);
  }
};

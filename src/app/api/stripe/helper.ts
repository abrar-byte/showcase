import Stripe from 'stripe';
import ENV from '@/utils/api/env';

export type checkoutMetadata = {
  user_id: string;
  email: string;
  order_id: string;
  car_name: string | null;
  amount: number;
  discount: number;
  total: number;
};

export type CheckoutBody = {
  order_id: string;
};

export const stripe = new Stripe(ENV.STRIPE.SECRET_KEY);

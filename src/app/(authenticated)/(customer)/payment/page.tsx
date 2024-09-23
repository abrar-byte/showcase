'use client';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baseURL } from '@/services/helpers';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function Page({ searchParams }: any) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  const id = searchParams?.id!;
  const router = useRouter();

  const session: any = useSession();
  const { status, data } = session || {};

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push(`/login`);
  //   }
  // }, [status]);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(`${baseURL}/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data?.token}`,
      },
      body: JSON.stringify({ order_id: id }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret)
      .catch((error) => console.log('Error bro', error));
  }, [data?.token, id]);

  const options = { fetchClientSecret };
  if (status === 'unauthenticated')
    return <div className="text-center w-full">Unauthorized</div>;
  if (status !== 'authenticated') return <Loading />;

  return (
    <div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

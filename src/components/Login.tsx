'use client';
import Button from '@/components/Button';
import EyeIcon from '@/components/icons/EyeIcon';
import EyeInvisibleIcon from '@/components/icons/EyeInvisibleIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import Input from '@/components/Input';
import Layout from '@/components/layout/Layout';
import Loading from '@/components/Loading';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Login {
  setDialog: (value?: boolean) => void;
}

export default function Login({ setDialog }: Login) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn('google');
      setLoading(false);

      setDialog(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 flex flex-col items-center space-y-5 w-full mx-3 min-w-[300px] lg:max-w-[500px]">
      <Image alt="logo" src={`/icons/logo.svg`} width={100} height={30} />
      <h2 className="text-center mt-5 text-gray-900 text-lg font-semibold leading-7">
        Let&apos;s Start with Gorent
      </h2>
      <p className="text-center mt-2 text-slate-600 text-sm leading-tight">
        To access all the functionalities and services, please log in to your
        account first.
      </p>
      <Button
        variant="light"
        outline
        icon={<GoogleIcon className="w-5 h-5" />}
        className="w-full mt-5"
        onClick={handleLogin}
        disabled={loading}
      >
        Login By Google
      </Button>
    </div>
  );
}

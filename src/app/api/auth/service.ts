import { prisma, prismaAny } from '@/utils/api/prisma';
import { Prisma, User } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

export const authUsingGoogle = async ({
  id_token,
}: {
  id_token: string;
}): Promise<any> => {
  prisma;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const data = ticket.getPayload();

  if (!data?.email || !data.email_verified) throw new Error('Unauthorized');
  let user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (user && !user.active) throw new Error('You were inactive');
  if (user) {
  } else {
    const payload: Prisma.UserUncheckedCreateInput = {
      email: data.email,
      fullname: data.name || '',
      role: 'USER',
    };
    if (data.picture) {
      payload.image = data.picture;
    }
    user = await prisma.user.create({ data: payload });
  }
  const token = signJwtToken(user, { expiresIn: '2d' });
  return { ...user, token };
};

export const verifyRole = async ({
  token,
  secret,
}: {
  token: string;
  secret: string;
}) => {
  if (!token || !secret || secret !== process.env.JWT_SECRET)
    throw new Error('Unauthorized');
  const user: any = verifyJwtToken(token);
  if (!user.email) throw new Error('Unauthorized');
  const res = await prisma.user.update({
    where: { email: user?.email },
    data: { role: 'ADMIN' },
  });
  const newToken = signJwtToken(user);
  return { ...res, token: newToken };
};

export const getUser = async () => {
  try {
    const auth = headers()?.get('Authorization');
    const token = auth?.split(' ')?.[1];
    if (!token) return null;
    const decoded: any = verifyJwtToken(token);
    if (!decoded?.email) return null;
    const user = await prisma.user.findFirstOrThrow({
      where: { email: decoded.email },
    });
    return user;
  } catch (error) {
    return null;
  }
};

type Options = {
  adminOnly?: boolean;
};

export const restrict = async (options: Options = {}) => {
  const { adminOnly } = options;
  const auth = headers()?.get('Authorization');
  const token = auth?.split(' ')?.[1];
  if (!token) throw new Error('Unauthorized');
  const decoded: any = verifyJwtToken(token);
  const user = await prisma.user.findFirstOrThrow({
    where: { email: decoded.email },
  });
  if (!user.active) throw new Error('You were inactive');
  if (adminOnly && user.role !== 'ADMIN') throw new Error('Admin Only');
  return user;
};

// signing jwt
export function signJwtToken(payload: any, options = {}) {
  const secret: any = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, options);
  return token;
}
export function verifyJwtToken(token: string) {
  const secret: any = process.env.JWT_SECRET;
  const payload = jwt.verify(token, secret);
  return payload;
}

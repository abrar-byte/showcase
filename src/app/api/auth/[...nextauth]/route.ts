import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { authUsingGoogle, verifyRole } from '../service';
import CredentialsProvider from 'next-auth/providers/credentials';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const authOptions: NextAuthOptions = {
  debug: false,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        token: { label: 'Token', type: 'text' },
        secret: { label: 'Secret', type: 'text' },
      },
      async authorize({ secret, token }: any) {
        try {
          if (!secret || !token) throw new Error('Wrong credentials');
          let payload: any = {
            secret,
            token,
          };

          const result = await verifyRole(payload);

          let resulted: any = result;
          if (result) {
            const { token, ...dataUser } = result;

            resulted = {
              profile: dataUser,
              token,
            };
          }
          return resulted;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 24 * 60 * 60,
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ account, profile, user, ...rest }: any) {
      try {
        const { provider, id_token } = account || {};
        if (provider === 'google' && id_token) {
          const result = await authUsingGoogle({ id_token });
          if (result) {
            const { token, ...dataUser } = result;
            user.profile = dataUser;
            user.token = token;
            return true;
          } else {
            throw new Error(result.message);
          }
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user, ...res }: any): Promise<any> {
      if (user) {
        token.user = user.profile;
        token.access_token = user.token;
      }
      return token;
    },
    async session({ session, token, ...res }: any): Promise<any> {
      session.user = token.user;
      session.token = token.access_token;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

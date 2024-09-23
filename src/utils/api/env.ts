const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DO: {
    ENDPOINT: process.env.DO_ENDPOINT!,
    BUCKET_NAME: process.env.DO_BUCKET_NAME!,
    SECRET_KEY: process.env.DO_SECRET_KEY!,
    ACCESS_KEY: process.env.DO_ACCESS_KEY!,
  },
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  },
};
export default ENV;

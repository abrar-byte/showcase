-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PAID', 'ON_GOING', 'COMPLETED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "fullname" TEXT,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" "USER_ROLE" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "garage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "garage_id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" BIGINT NOT NULL,
    "discount" INTEGER,
    "gasoline" INTEGER,
    "capacity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "steering" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "inactive_at" TIMESTAMP(3),
    "inactive_reason" TEXT,
    "can_drop_off" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_media" (
    "id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "cover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "car_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "tax" BIGINT,
    "discount" INTEGER NOT NULL,
    "total" BIGINT,
    "payment_id" TEXT,
    "payment_at" TIMESTAMP(3),
    "invoice" TEXT,
    "note" TEXT,
    "drop_off" BOOLEAN DEFAULT false,
    "drop_location" TEXT,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "status" "ORDER_STATUS" NOT NULL DEFAULT 'PAID',

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "car_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_garage_id_fkey" FOREIGN KEY ("garage_id") REFERENCES "garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_media" ADD CONSTRAINT "car_media_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

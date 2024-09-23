/*
  Warnings:

  - The primary key for the `car` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `garage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `garage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `tax` on the `order` table. All the data in the column will be lost.
  - Changed the type of `garage_id` on the `car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `link` to the `car_media` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `car_id` on the `car_media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `car_id` on the `favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `car_id` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "car" DROP CONSTRAINT "car_garage_id_fkey";

-- DropForeignKey
ALTER TABLE "car_media" DROP CONSTRAINT "car_media_car_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_car_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_car_id_fkey";

-- AlterTable
ALTER TABLE "car" DROP CONSTRAINT "car_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "garage_id",
ADD COLUMN     "garage_id" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "gasoline" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "car_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "car_media" ADD COLUMN     "link" TEXT NOT NULL,
DROP COLUMN "car_id",
ADD COLUMN     "car_id" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "favorite" DROP COLUMN "car_id",
ADD COLUMN     "car_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "garage" DROP CONSTRAINT "garage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "garage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order" DROP COLUMN "tax",
DROP COLUMN "car_id",
ADD COLUMN     "car_id" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_garage_id_fkey" FOREIGN KEY ("garage_id") REFERENCES "garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_media" ADD CONSTRAINT "car_media_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

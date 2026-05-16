/*
  Warnings:

  - You are about to drop the column `password` on the `Client` table. All the data in the column will be lost.
  - Made the column `phone` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "password",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `google_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "google_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "profiles";

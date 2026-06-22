/*
  Warnings:

  - You are about to drop the column `creted_at` on the `pets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orgs" ALTER COLUMN "whats_app" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "creted_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

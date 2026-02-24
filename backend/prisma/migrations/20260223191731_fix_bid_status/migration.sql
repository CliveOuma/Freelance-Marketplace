/*
  Warnings:

  - The `status` column on the `bids` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `proposals` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `bids` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_jobId_fkey";

-- DropForeignKey
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_writerId_fkey";

-- AlterTable
ALTER TABLE "bids" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "proposals";

-- DropEnum
DROP TYPE "ProposalStatus";

-- CreateIndex
CREATE INDEX "bids_jobId_idx" ON "bids"("jobId");

-- CreateIndex
CREATE INDEX "bids_status_idx" ON "bids"("status");

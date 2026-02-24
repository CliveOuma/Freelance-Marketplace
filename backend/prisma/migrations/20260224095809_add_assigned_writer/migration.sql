/*
  Warnings:

  - You are about to drop the column `bidAmount` on the `bids` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `bids` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "bids_createdAt_idx";

-- AlterTable
ALTER TABLE "bids" DROP COLUMN "bidAmount",
DROP COLUMN "message";

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "assignedWriterId" TEXT;

-- CreateIndex
CREATE INDEX "jobs_employerId_idx" ON "jobs"("employerId");

-- CreateIndex
CREATE INDEX "jobs_assignedWriterId_idx" ON "jobs"("assignedWriterId");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_assignedWriterId_fkey" FOREIGN KEY ("assignedWriterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

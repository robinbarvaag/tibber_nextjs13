/*
  Warnings:

  - Added the required column `userId` to the `Loans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loans" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

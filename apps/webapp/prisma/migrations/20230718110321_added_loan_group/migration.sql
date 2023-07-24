/*
  Warnings:

  - You are about to drop the `Loans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Loans" DROP CONSTRAINT "Loans_userId_fkey";

-- DropTable
DROP TABLE "Loans";

-- CreateTable
CREATE TABLE "LoanGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LoanGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "paymentTimeYears" INTEGER NOT NULL,
    "paymentTimeMonths" INTEGER NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "extraPaymentEachMonth" INTEGER NOT NULL,
    "extraPayments" INTEGER[],
    "fees" INTEGER NOT NULL,
    "insurance" INTEGER NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "loanGroupId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanGroup" ADD CONSTRAINT "LoanGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_loanGroupId_fkey" FOREIGN KEY ("loanGroupId") REFERENCES "LoanGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

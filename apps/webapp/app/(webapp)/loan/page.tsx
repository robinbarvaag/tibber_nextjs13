import LoanVisualizer from "#/components/loan-visualizer/LoanVisualizer";
import { getEdgeFriendlyToken } from "#/lib/token";
import prisma from "#/lib/prisma";

async function getUserLoans(userId: string) {
  const loans = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      loanGroups: {
        select: {
          id: true,
          name: true,
          loans: {
            select: {
              id: true,
              paymentTimeYears: true,
              paymentTimeMonths: true,
              loanAmount: true,
              extraPaymentEachMonth: true,
              extraPayments: true,
              fees: true,
              insurance: true,
              interestRate: true,
              gracePeriod: true,
            },
          },
        },
      },
    },
  });

  return loans;
}

export default async function Loan() {
  const token = await getEdgeFriendlyToken();
  const data = await getUserLoans(token?.sub ?? "");

  return (
    <div>
      <LoanVisualizer loanGroups={data} />
    </div>
  );
}

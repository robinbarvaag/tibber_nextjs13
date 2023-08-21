import { NextResponse, type NextRequest } from "next/server";
import prisma from "lib/prisma";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json();

    // await prisma.loans.update({
    //   where: {
    //     id: 9,
    //   },
    //   data: {
    //     savedLoanJson: JSON.stringify(body),
    //   },
    // });

    await prisma.loan.create({
      data: {
        extraPaymentEachMonth: body.extraPaymentEachMonth,
        fees: body.fees,
        gracePeriod: body.gracePeriod,
        insurance: body.insurance,
        interestRate: body.interestRate,
        loanAmount: body.loanAmount,
        paymentTimeMonths: body.paymentTimeMonths,
        paymentTimeYears: body.paymentTimeYears,
        userId: body.userId,
        loanGroupId: body.loanGroupId,
      },
    });

    return new Response("Patched", {
      status: 200,
    });
  } catch (error) {
    console.error("Hello?", JSON.stringify(error));
    return new Response(error, {
      status: 422,
    });
  }
}

// }

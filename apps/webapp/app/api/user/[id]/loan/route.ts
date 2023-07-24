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

    console.log(body.insurance);

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

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Params }
// ) {
//   const token = await getToken({ req: request });

//   if (!token) {
//     return new Response("Unauthorized", {
//       status: 401,
//     });
//   }

//   try {
//     const { id } = await userParamsSchema.parseAsync(params);

//     await db.transaction().execute(async (trx) => {
//       // delete settings
//       await trx.deleteFrom("user_settings").where("userId", "=", id).execute();
//       // delete work day details
//       await trx
//         .deleteFrom("user_work_day_detail")
//         .where("userId", "=", id)
//         .execute();
//       // delete user
//       await trx.deleteFrom("user").where("id", "=", id).execute();
//     });

//     return new Response("Deleted", {
//       status: 200,
//     });
//   } catch (error) {
//     console.error(JSON.stringify(error));

//     return new Response(error, {
//       status: 422,
//     });
//   }
// }

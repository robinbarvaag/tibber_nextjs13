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

    await prisma.loans.update({
      where: {
        id: 9,
      },
      data: {
        savedLoanJson: JSON.stringify(body),
      },
    });

    // await prisma.loans.create({
    //   data: {
    //     name: "test",
    //     id: 9,
    //     savedLoanJson: JSON.stringify(body),
    //   },
    // });

    return new Response("Patched", {
      status: 200,
    });
  } catch (error) {
    console.error(JSON.stringify(error));
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

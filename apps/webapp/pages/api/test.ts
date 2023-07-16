import { NextApiRequest, NextApiResponse } from "next";
import { type ServerRuntime } from "next";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "lib/prisma";

export default async function handler(req: any, res: any) {
  try {
    await prisma.loans.create({
      data: {
        name: "test",
        id: 2,
        savedLoanJson: "tester",
      },
    });
    res.status(200).json({ message: "Submitted" });
  } catch (error) {
    res.status(400).json({ error });
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

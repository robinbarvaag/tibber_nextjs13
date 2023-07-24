import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const getEdgeFriendlyToken = cache(async () => {
  // @ts-ignore
  const req: NextRequest = {
    headers: headers(),
    cookies: cookies(),
  };

  const token = await getToken({ req });

  return token;
});

export { getEdgeFriendlyToken };

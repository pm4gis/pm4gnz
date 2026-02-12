import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("UNAUTHORISED");
  }
  return session;
}

import { type MembershipRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: MembershipRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: MembershipRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: MembershipRole;
  }
}

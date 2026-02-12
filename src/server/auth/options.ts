import { PrismaAdapter } from "@auth/prisma-adapter";
import { MembershipRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/server/db/client";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { memberships: true }
        });

        if (!user || user.deletedAt) {
          return null;
        }

        const matches = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!matches) {
          return null;
        }

        const role = user.memberships[0]?.role ?? MembershipRole.READ_ONLY;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: MembershipRole }).role ?? MembershipRole.READ_ONLY;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as MembershipRole | undefined) ?? MembershipRole.READ_ONLY;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
};

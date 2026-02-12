import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/server/db/client";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z
    .string()
    .min(10)
    .regex(/[A-Z]/, "Password must include an upper-case letter")
    .regex(/[a-z]/, "Password must include a lower-case letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a symbol")
});

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `signup:${forwardedFor}`;

  if (!checkRateLimit(key, 10, 60_000)) {
    return NextResponse.json({ error: "Too many sign up attempts" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash
    },
    select: { id: true, email: true, name: true }
  });

  return NextResponse.json({ user }, { status: 201 });
}

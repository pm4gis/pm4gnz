import { MembershipRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";

const createOrgSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/)
    .min(3)
    .max(40)
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = createOrgSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.organisation.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Organisation slug already in use" }, { status: 409 });
    }

    const organisation = await prisma.organisation.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        memberships: {
          create: {
            userId: session.user.id,
            role: MembershipRole.ORG_ADMIN
          }
        },
        auditLogs: {
          create: {
            actorUserId: session.user.id,
            entityType: "Organisation",
            entityId: parsed.data.slug,
            action: "CREATE"
          }
        }
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    return NextResponse.json({ organisation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
}

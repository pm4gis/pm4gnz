import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db/client";
import { CreateOrgForm } from "./components/create-org-form";

export default async function AppHomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: { organisation: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 p-8">
      <h1 className="text-3xl font-semibold">Welcome, {session.user.name ?? session.user.email}</h1>
      <p className="text-slate-700">You are signed in. Step B foundations are now active.</p>

      <section className="rounded border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Your organisations</h2>
        <ul className="mt-2 list-disc pl-6 text-sm text-slate-700">
          {memberships.map((membership) => (
            <li key={membership.id}>
              {membership.organisation.name} ({membership.organisation.slug}) - {membership.role}
            </li>
          ))}
        </ul>
      </section>

      <CreateOrgForm />
    </main>
  );
}

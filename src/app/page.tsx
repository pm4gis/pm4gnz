import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 p-8">
      <h1 className="text-3xl font-semibold">ProjectHub MVP Scaffold</h1>
      <p className="text-slate-700">
        Step A and Step B foundations are ready with account creation, sign in and organisation membership.
      </p>
      <div className="flex gap-3">
        <Link className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/auth/signin">
          Sign in
        </Link>
        <Link className="rounded border border-slate-300 px-4 py-2 text-sm font-medium" href="/auth/signup">
          Create account
        </Link>
      </div>
      <ul className="list-disc space-y-1 pl-6 text-sm text-slate-600">
        <li>Next.js App Router with TypeScript and Tailwind CSS</li>
        <li>Prisma schema with multi-tenant foundations</li>
        <li>NextAuth credential authentication wiring</li>
        <li>Sign up endpoint with Zod validation and rate limiting</li>
      </ul>
    </main>
  );
}

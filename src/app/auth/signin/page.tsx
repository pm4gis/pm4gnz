"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("admin@demo.local");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-slate-600">Use your email and password to access your organisation.</p>
      <form
        className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow-sm"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/app"
          });
          if (result?.error) {
            setError("Invalid email or password");
            return;
          }
          window.location.href = "/app";
        }}
      >
        <label className="block text-sm">
          Email
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Sign in
        </button>
      </form>
      <p className="text-sm text-slate-600">
        Need an account? <Link className="underline" href="/auth/signup">Create one</Link>
      </p>
    </main>
  );
}

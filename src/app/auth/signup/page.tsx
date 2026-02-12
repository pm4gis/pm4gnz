"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form
        className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow-sm"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setMessage(null);
          const response = await fetch("/api/v1/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
          });
          const data = await response.json();
          if (!response.ok) {
            setError(data.error ?? "Unable to create account");
            return;
          }
          setMessage("Account created. You can sign in now.");
          setName("");
          setEmail("");
          setPassword("");
        }}
      >
        <label className="block text-sm">
          Name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
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
        {message ? <p className="text-sm text-green-700">{message}</p> : null}
        <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Create account
        </button>
      </form>
      <p className="text-sm text-slate-600">
        Already have an account? <Link className="underline" href="/auth/signin">Sign in</Link>
      </p>
    </main>
  );
}

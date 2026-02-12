"use client";

import { useState } from "react";

export function CreateOrgForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-2 rounded border border-slate-200 bg-white p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);

        const response = await fetch("/api/v1/orgs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug })
        });

        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error ?? "Unable to create organisation");
          return;
        }

        setMessage(`Organisation ${payload.organisation.name} created.`);
        setName("");
        setSlug("");
      }}
    >
      <h2 className="text-lg font-semibold">Create organisation</h2>
      <label className="block text-sm">
        Name
        <input className="mt-1 w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">
        Slug
        <input className="mt-1 w-full rounded border px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white" type="submit">
        Create
      </button>
    </form>
  );
}

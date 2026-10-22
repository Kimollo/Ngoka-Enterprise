"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Catalog, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { btnLeaf, btnOutline } from "@/components/styles";

type Draft = {
  id: string;
  category: string;
  name: string;
  price: string;
  unit: string;
  inStock: boolean;
  visible: boolean;
  note: string;
};

function toDraft(product: Product): Draft {
  return {
    id: product.id,
    category: product.category,
    name: product.name,
    price: product.price == null ? "" : String(product.price),
    unit: product.unit,
    inStock: product.inStock,
    visible: product.visible,
    note: product.note,
  };
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCatalog = useCallback(async () => {
    const response = await fetch("/api/admin/catalog");
    if (response.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    if (!response.ok) {
      setError("The price list could not be loaded.");
      setLoading(false);
      return;
    }
    const catalog = (await response.json()) as Catalog;
    setNotice(catalog.notice);
    setDrafts(catalog.products.map(toDraft));
    setAuthed(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "Could not sign in.");
      return;
    }
    setPassword("");
    setLoading(true);
    await loadCatalog();
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((current) =>
      current.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)),
    );
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const products = [];
    for (const draft of drafts) {
      const trimmed = draft.price.trim();
      let price: number | null = null;
      if (trimmed !== "") {
        const value = Number(trimmed);
        if (!Number.isFinite(value) || value < 0) {
          setError(`Enter a rand amount for ${draft.name}, or leave the price blank.`);
          return;
        }
        price = value;
      }
      products.push({
        id: draft.id,
        price,
        unit: draft.unit,
        inStock: draft.inStock,
        visible: draft.visible,
        note: draft.note,
      });
    }

    setSaving(true);
    const response = await fetch("/api/admin/catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notice, products }),
    });
    const body = (await response.json()) as Catalog & { error?: string };
    setSaving(false);
    if (!response.ok || !body.products) {
      setError(body.error ?? "The prices were not saved.");
      return;
    }
    setNotice(body.notice);
    setDrafts(body.products.map(toDraft));
    setMessage("Saved. The website now shows these prices and stock.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setDrafts([]);
    setMessage("");
    setError("");
  }

  return (
    <main id="main" className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf">
        Ngoka Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold text-ink">Prices and stock</h1>
      <p className="mt-3 leading-relaxed text-bark">
        The first egg row is the usual crate price. The second row is the price for 10 crates
        or more. Mark layers and broilers in stock when you have them. Groceries stay off the
        website. Customers still order by phone or WhatsApp.
      </p>
      <a href="/" className="mt-4 inline-block font-semibold text-leaf-dark underline">
        Back to the website
      </a>

      {loading ? <p className="mt-8 text-bark">Loading…</p> : null}

      {!loading && !authed ? (
        <form onSubmit={login} className="mt-8 max-w-md space-y-4 rounded-3xl border border-sand bg-paper p-5">
          <label className="block">
            <span className="font-semibold text-ink">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink"
              required
            />
          </label>
          {error ? <p className="text-clay">{error}</p> : null}
          <button type="submit" className={btnLeaf}>
            Sign in
          </button>
        </form>
      ) : null}

      {!loading && authed ? (
        <form onSubmit={save} className="mt-8 space-y-5">
          <label className="block">
            <span className="font-semibold text-ink">Note shown above the prices</span>
            <textarea
              value={notice}
              onChange={(event) => setNotice(event.target.value)}
              rows={3}
              maxLength={300}
              className="mt-2 w-full rounded-2xl border border-sand bg-paper px-4 py-3 text-ink"
            />
          </label>

          {drafts.map((draft) => {
            const previewPrice = draft.price.trim() === "" ? null : Number(draft.price);
            return (
              <fieldset key={draft.id} className="rounded-3xl border border-sand bg-paper p-5">
                <legend className="px-1 font-bold text-ink">{draft.name}</legend>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-leaf">
                  {draft.category}
                </p>
                <p className="mt-2 text-sm text-bark">
                  Customers will see:{" "}
                  {formatPrice({
                    price:
                      previewPrice == null || Number.isNaN(previewPrice) ? null : previewPrice,
                    currency: "R",
                    unit: draft.unit || "per unit",
                  })}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Price in rand</span>
                    <input
                      inputMode="decimal"
                      value={draft.price}
                      onChange={(event) => updateDraft(draft.id, { price: event.target.value })}
                      placeholder="Blank if no price yet"
                      className="mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Unit</span>
                    <input
                      value={draft.unit}
                      onChange={(event) => updateDraft(draft.id, { unit: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink"
                    />
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-ink">Short note</span>
                  <textarea
                    value={draft.note}
                    onChange={(event) => updateDraft(draft.id, { note: event.target.value })}
                    rows={2}
                    maxLength={280}
                    className="mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink"
                  />
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
                  <label className="flex items-center gap-2 font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={draft.inStock}
                      onChange={(event) =>
                        updateDraft(draft.id, { inStock: event.target.checked })
                      }
                    />
                    In stock
                  </label>
                  <label className="flex items-center gap-2 font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={draft.visible}
                      onChange={(event) =>
                        updateDraft(draft.id, { visible: event.target.checked })
                      }
                    />
                    Show on the website
                  </label>
                </div>
              </fieldset>
            );
          })}

          {error ? <p className="text-clay">{error}</p> : null}
          {message ? <p className="font-semibold text-leaf-dark">{message}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className={btnLeaf} disabled={saving}>
              {saving ? "Saving…" : "Save prices"}
            </button>
            <button type="button" className={btnOutline} onClick={logout}>
              Sign out
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}

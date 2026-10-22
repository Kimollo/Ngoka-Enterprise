import { NextRequest, NextResponse } from "next/server";
import { isAuthed, sameOrigin } from "@/lib/auth";
import { getCatalog, updateCatalog } from "@/lib/catalog";
import type { ProductUpdate } from "@/lib/types";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
}

function readUpdates(value: unknown): { notice: string; products: ProductUpdate[] } | string {
  if (!value || typeof value !== "object") return "The form could not be read.";
  const body = value as { notice?: unknown; products?: unknown };
  if (typeof body.notice !== "string") return "Add a short note about prices.";
  const notice = body.notice.trim();
  if (notice.length > 300) return "The price note is too long.";
  if (!Array.isArray(body.products)) return "The product list is missing.";

  const products: ProductUpdate[] = [];
  for (const item of body.products) {
    if (!item || typeof item !== "object") return "A product row could not be read.";
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string") return "A product is missing its id.";
    if (typeof row.unit !== "string" || row.unit.trim().length === 0 || row.unit.trim().length > 40) {
      return "Each product needs a short unit, such as per crate or per chicken.";
    }
    if (typeof row.note !== "string" || row.note.trim().length > 280) {
      return "Keep each note under 280 characters.";
    }
    if (typeof row.inStock !== "boolean" || typeof row.visible !== "boolean") {
      return "Stock and visibility must be ticked or unticked.";
    }

    let price: number | null;
    if (row.price === null || row.price === "") {
      price = null;
    } else if (
      typeof row.price !== "number" ||
      !Number.isFinite(row.price) ||
      row.price < 0 ||
      row.price > 100000
    ) {
      return "Enter a price in rand, or leave it blank.";
    } else {
      price = Math.round(row.price * 100) / 100;
    }

    products.push({
      id: row.id,
      price,
      unit: row.unit.trim(),
      inStock: row.inStock,
      visible: row.visible,
      note: row.note.trim(),
    });
  }

  return { notice, products };
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) return unauthorized();
  return NextResponse.json(await getCatalog());
}

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: "Open this page on the website and try again." },
      { status: 403 },
    );
  }
  if (!isAuthed(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The form could not be read." }, { status: 400 });
  }

  const parsed = readUpdates(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  try {
    const saved = await updateCatalog(parsed.notice, parsed.products);
    return NextResponse.json(saved);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "ENOSPC") {
      return NextResponse.json(
        { error: "The computer is out of disk space, so the price was not saved." },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "The price list could not be saved." }, { status: 500 });
  }
}

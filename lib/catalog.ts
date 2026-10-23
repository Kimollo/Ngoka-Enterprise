import { readFile, writeFile } from "fs/promises";
import path from "path";
import { getStore, type Store } from "@netlify/blobs";
import type { Catalog, Product, ProductUpdate } from "@/lib/types";
import seedCatalog from "@/data/catalog.json";

const catalogPath = path.join(process.cwd(), "data", "catalog.json");
const blobKey = "catalog";

function blobStore(): Store | null {
  try {
    return getStore({
      name: "ngoka",
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "MissingBlobsEnvironmentError") return null;
    throw error;
  }
}

async function fallbackCatalog(): Promise<Catalog> {
  try {
    return await readCatalogFile();
  } catch {
    return toCatalog(seedCatalog, "data/catalog.json");
  }
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Product;
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    (product.price === null || typeof product.price === "number") &&
    product.currency === "R" &&
    typeof product.unit === "string" &&
    typeof product.inStock === "boolean" &&
    typeof product.visible === "boolean" &&
    typeof product.note === "string"
  );
}

function toCatalog(value: unknown, source: string): Catalog {
  const parsed = value as Catalog;
  if (!parsed || !Array.isArray(parsed.products) || !parsed.products.every(isProduct)) {
    throw new Error(`${source} is not a valid price list.`);
  }
  return {
    notice: typeof parsed.notice === "string" ? parsed.notice : "",
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    products: parsed.products,
  };
}

async function readCatalogFile(): Promise<Catalog> {
  const raw = await readFile(catalogPath, "utf8");
  return toCatalog(JSON.parse(raw), "data/catalog.json");
}

export async function getCatalog(): Promise<Catalog> {
  const store = blobStore();
  if (!store) return fallbackCatalog();

  try {
    const stored: unknown = await store.get(blobKey, { type: "json" });
    if (stored) return toCatalog(stored, "The saved price list");
    return toCatalog(seedCatalog, "data/catalog.json");
  } catch {
    return fallbackCatalog();
  }
}

export async function updateCatalog(notice: string, updates: ProductUpdate[]) {
  const current = await getCatalog();
  const byId = new Map(updates.map((update) => [update.id, update]));
  const products = current.products.map((product) => {
    const update = byId.get(product.id);
    if (!update) return product;
    return {
      ...product,
      price: update.price,
      unit: update.unit,
      inStock: update.inStock,
      visible: update.visible,
      note: update.note,
    };
  });

  const next: Catalog = {
    notice,
    updatedAt: new Date().toISOString(),
    products,
  };

  const store = blobStore();
  if (store) {
    await store.setJSON(blobKey, next);
  } else {
    await writeFile(catalogPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  }
  return next;
}

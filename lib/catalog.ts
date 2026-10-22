import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Catalog, Product, ProductUpdate } from "@/lib/types";
import seedCatalog from "@/data/catalog.json";

const catalogPath = path.join(process.cwd(), "data", "catalog.json");
const redisKey = "ngoka:catalog";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

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
  if (!redis) return readCatalogFile();

  const stored = await redis.get<Catalog>(redisKey);
  if (stored) return toCatalog(stored, "The saved price list");

  const seed = toCatalog(seedCatalog, "data/catalog.json");
  await redis.set(redisKey, seed, { nx: true });
  return seed;
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

  if (redis) {
    await redis.set(redisKey, next);
  } else {
    await writeFile(catalogPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  }
  return next;
}

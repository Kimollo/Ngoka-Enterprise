import type { Product } from "@/lib/types";

export function formatRand(amount: number, currency: Product["currency"] = "R") {
  const value = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${currency}${value}`;
}

export function formatPrice(
  product: Pick<Product, "price" | "currency" | "unit">,
) {
  if (product.price == null) return "Price on request";
  return `${formatRand(product.price, product.currency)} ${product.unit}`;
}

export function formatUpdated(iso: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

import Image from "next/image";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import { site } from "@/data/site";
import { formatPrice, formatRand, formatUpdated } from "@/lib/format";
import SectionHeading from "@/components/SectionHeading";
import { btnLeaf } from "@/components/styles";

function StockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
        inStock ? "bg-leaf/15 text-leaf-dark" : "bg-clay/15 text-clay"
      }`}
    >
      {inStock ? "In stock" : "Out of stock"}
    </span>
  );
}

function ProductLine({ product }: { product: Product }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-sand py-3 first:border-t-0">
      <div>
        <p className="font-semibold text-ink">{product.name}</p>
        {product.inStock && product.price != null ? (
          <p className="text-bark">{formatPrice(product)}</p>
        ) : null}
      </div>
      <StockBadge inStock={product.inStock} />
    </div>
  );
}

function Card({
  title,
  image,
  alt,
  description,
  children,
}: {
  title: string;
  image: string;
  alt: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-sand bg-paper shadow-sm">
      <div className="relative h-48 bg-sand sm:h-56">
        <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        <p className="mt-2 leading-relaxed text-bark">{description}</p>
        <div className="mt-4 flex-1">{children}</div>
        <a href="#contact" className={`${btnLeaf} mt-5 w-full`}>
          Ask us
        </a>
      </div>
    </article>
  );
}

export default function Offerings({
  products,
  notice,
  updatedAt,
}: {
  products: Product[];
  notice: string;
  updatedAt: string | null;
}) {
  const visible = products.filter((product) => product.visible);
  const eggs = visible.find((product) => product.id === "eggs-crate");
  const bulk = visible.find((product) => product.id === "eggs-reseller");
  const chickens = visible.filter(
    (product) => product.id === "layers" || product.id === "broilers",
  );
  const noChickens = chickens.length > 0 && chickens.every((product) => !product.inStock);

  return (
    <section id="offerings" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading eyebrow="The shop" title="What we sell">
        {notice}
      </SectionHeading>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card
          title="Fresh Eggs"
          image="/images/eggs.jpg"
          alt="Placeholder photo of brown eggs in a carton"
          description="From our own chickens, sold by the crate."
        >
          {eggs ? (
            <div className="rounded-2xl bg-cream p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-2xl font-bold text-ink">
                  {eggs.inStock && eggs.price != null ? formatPrice(eggs) : "Eggs"}
                </p>
                <StockBadge inStock={eggs.inStock} />
              </div>
              {eggs.inStock && bulk?.price != null ? (
                <p className="mt-1 text-bark">
                  {formatRand(bulk.price)} a crate for 10 crates or more.
                </p>
              ) : null}
            </div>
          ) : null}
        </Card>

        <Card
          title="Layers & Broilers"
          image="/images/chickens.jpg"
          alt="Placeholder photo of brown hens"
          description={
            noChickens
              ? "From our own chickens. Ask us when the next ones are ready."
              : "From our own chickens."
          }
        >
          {chickens.length > 0 ? (
            <div className="rounded-2xl bg-cream px-4 py-1">
              {chickens.map((product) => (
                <ProductLine key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </Card>

        <Card
          title="Groceries & Essentials"
          image="/images/store.jpg"
          alt="Placeholder photo of fresh market produce"
          description="Daily groceries and household essentials. Ask us what is on the shelf today."
        />
      </div>

      <div className="mt-8 rounded-3xl border border-leaf/30 bg-leaf/10 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-ink">How to order</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-bark">
          <li>{site.leadTime}</li>
          <li>{site.delivery}</li>
          <li>{site.payments}</li>
        </ul>
      </div>

      {updatedAt ? (
        <p className="mt-4 text-sm text-bark">Prices updated {formatUpdated(updatedAt)}.</p>
      ) : null}
    </section>
  );
}

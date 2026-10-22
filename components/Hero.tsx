import Image from "next/image";
import type { Product } from "@/lib/types";
import { site, telHref, whatsappGreeting, whatsappHref } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { btnCream, btnLeaf } from "@/components/styles";

export default function Hero({ eggs }: { eggs?: Product }) {
  const eggPrice = eggs?.inStock && eggs.price != null ? formatPrice(eggs) : null;

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Placeholder photo of open farmland in warm evening light"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/40" />
      <div className="relative mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:min-h-[75svh] sm:pb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cream/90">
          {site.city}, Limpopo
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-cream sm:text-6xl">
          {site.name}
        </h1>
        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-cream sm:text-2xl">
          {site.tagline}
        </p>
        {eggPrice ? (
          <p className="mt-5 inline-flex w-fit rounded-full bg-cream/15 px-4 py-2 text-lg font-semibold text-cream ring-1 ring-cream/30">
            Eggs {eggPrice}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={telHref(site.phones.call.e164)} className={btnLeaf}>
            <PhoneIcon />
            Call us
          </a>
          <a
            href={whatsappHref(whatsappGreeting)}
            className={btnCream}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
        <p className="mt-5 text-sm text-cream/90">
          Call {site.phones.call.display}
          <span className="px-2" aria-hidden="true">
            ·
          </span>
          WhatsApp {site.phones.whatsapp.display}
        </p>
      </div>
    </section>
  );
}

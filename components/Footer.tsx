import { site, telHref, whatsappHref } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-28 pt-10 sm:flex-row sm:items-end sm:justify-between md:pb-10">
        <div>
          <p className="text-lg font-bold">{site.name}</p>
          <p className="mt-2">
            <a className="underline decoration-cream/40 underline-offset-4" href={telHref(site.phones.call.e164)}>
              {site.phones.call.display}
            </a>
          </p>
          <p className="mt-1">
            <a
              className="underline decoration-cream/40 underline-offset-4"
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {site.phones.whatsapp.display}
            </a>
          </p>
        </div>
        <p className="text-sm text-cream/80">
          © {year} {site.name}
          <span className="px-2" aria-hidden="true">
            ·
          </span>
          <a href="/admin" className="underline decoration-cream/40 underline-offset-4 hover:text-cream">
            Staff
          </a>
        </p>
      </div>
    </footer>
  );
}

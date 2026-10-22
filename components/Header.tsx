"use client";

import Link from "next/link";
import { useState } from "react";
import { site, telHref } from "@/data/site";
import { PhoneIcon } from "@/components/Icons";
import { btnLeaf } from "@/components/styles";

const links = [
  { href: "#offerings", label: "What we sell" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header id="top" className="sticky top-0 z-40 border-b border-sand bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="min-w-0 leading-tight"
          onClick={() => {
            setOpen(false);
            if (window.location.pathname === "/") window.scrollTo({ top: 0 });
          }}
        >
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
            Since {site.since}
          </span>
          <span className="block truncate text-lg font-bold text-ink">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Page">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink hover:text-leaf-dark"
            >
              {link.label}
            </a>
          ))}
          <a href={telHref(site.phones.call.e164)} className={`${btnLeaf} min-h-11 px-4`}>
            <PhoneIcon />
            Call us
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={telHref(site.phones.call.e164)}
            aria-label={`Call ${site.phones.call.display}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-leaf text-cream"
          >
            <PhoneIcon />
          </a>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full border border-sand bg-paper px-4 text-sm font-semibold text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          className="border-t border-sand bg-cream px-4 py-3 md:hidden"
          aria-label="Page"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-3 text-base font-semibold text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

import Image from "next/image";
import { site } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:pb-20 sm:pt-4">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand">
          <Image
            src="/images/about.jpg"
            alt="Placeholder photo of hens on a small farm"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div>
          <SectionHeading eyebrow={`Open since ${site.since}`} title="About Ngoka Enterprise">
            Ngoka Enterprise has been in Semorishi since {site.since}. The eggs, layers, and
            broilers come from our own chickens. The shop also keeps daily groceries and household
            essentials.
          </SectionHeading>
        </div>
      </div>
    </section>
  );
}

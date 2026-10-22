import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export default function SectionHeading({
  eyebrow,
  title,
  children,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {children ? <p className="mt-3 text-lg leading-relaxed text-bark">{children}</p> : null}
    </div>
  );
}

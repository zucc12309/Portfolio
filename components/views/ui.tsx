import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ViewHeader({ title, subtitle, children, className }: { title: string; subtitle?: string; children?: ReactNode; className?: string }) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="font-sans text-2xl font-bold tracking-tight text-retro-text sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-retro-text/70">{subtitle}</p> : null}
      </div>
      {children}
    </header>
  );
}

export function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-[13px] leading-6 text-retro-text/80">
          <span aria-hidden className="mt-[9px] size-1.5 shrink-0 bg-retro-green" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

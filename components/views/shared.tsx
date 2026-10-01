"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { ViewId } from "@/lib/os";
import { getApp } from "@/lib/os";
import { useOs } from "@/components/os/os-context";

/** A real anchor (#hash) that switches the OS view without a page load. */
export function ViewLink({ view, slug, children, className, ...props }: { view: ViewId; slug?: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const os = useOs();
  const hash = getApp(view).hash + (slug ? `/${slug}` : "");
  return (
    <a
      href={`#${hash}`}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        os.navigate(view, slug);
      }}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { labTree, type LabNode } from "@/lib/content";
import { PixelIcon } from "@/components/os/pixel-icon";
import { ViewHeader } from "@/components/views/ui";

export function LabView() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([labTree[0].name]));
  const allOpen = open.size === labTree.length;

  const toggle = (name: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const total = labTree.reduce((sum, node) => sum + (node.children?.length ?? 0), 0);

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
      <ViewHeader title="Product Lab" subtitle="Smaller prototypes, experiments and ideas that don't need a full case file. Folders expand; items link to code or the project they fed into.">
        <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(labTree.map((n) => n.name)))} className="os-btn h-9 px-3 text-[12px] uppercase">
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </ViewHeader>

      <div className="border border-retro-text/20 bg-[#06090d] font-mono shadow-retro">
        <p className="border-b border-retro-text/15 px-4 py-2 text-[12px] text-retro-text/65">
          <span className="text-retro-green">~/experiments</span> · {labTree.length} folders · {total} items
        </p>
        <ul className="py-2" aria-label="Experiments">
          {labTree.map((folder) => {
            const expanded = open.has(folder.name);
            const panelId = `lab-${folder.name.replace(/\W/g, "")}`;
            return (
              <li key={folder.name}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(folder.name)}
                  className="flex min-h-11 w-full items-center gap-3 px-4 text-left transition-colors hover:bg-retro-green/[0.06]"
                >
                  <span aria-hidden className="w-3 text-retro-text/55">
                    {expanded ? "▾" : "▸"}
                  </span>
                  <PixelIcon name="folder" className="size-5 shrink-0 text-retro-amber" />
                  <span className="text-sm text-retro-text">{folder.name}</span>
                  <span className="hidden truncate text-[12px] text-retro-text/55 sm:inline">— {folder.note}</span>
                  <span className="ml-auto text-[11px] text-retro-text/55">{folder.children?.length ?? 0}</span>
                </button>
                {expanded ? (
                  <ul id={panelId} className="fade-in mb-2 ml-[22px] border-l border-retro-text/20 sm:ml-[30px]">
                    {folder.children?.map((item) => <LabItem key={item.name} item={item} />)}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function LabItem({ item }: { item: LabNode }) {
  const body = (
    <>
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-retro-text">{item.name}</span>
        {item.tags?.map((tag) => (
          <span key={tag} className={tag === "live" ? "border border-retro-green/50 px-1.5 text-[10px] uppercase text-retro-green" : "text-[10px] uppercase tracking-wider text-retro-text/50"}>
            {tag}
          </span>
        ))}
        {item.external ? <ExternalLink aria-hidden className="size-3 text-retro-text/50" /> : null}
      </span>
      <span className="mt-0.5 block text-[12px] leading-5 text-retro-text/70">{item.note}</span>
    </>
  );

  const className = "block py-2 pl-4 pr-4 transition-colors";

  return (
    <li className="relative before:absolute before:left-0 before:top-[18px] before:h-px before:w-3 before:bg-retro-text/20">
      {item.href ? (
        item.external ? (
          <a href={item.href} target="_blank" rel="noreferrer" className={`${className} hover:bg-retro-green/[0.06]`}>
            {body}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <Link href={item.href} className={`${className} hover:bg-retro-green/[0.06]`}>
            {body}
          </Link>
        )
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  );
}

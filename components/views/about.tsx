"use client";

import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { profile, systemInfo } from "@/lib/content";
import { projects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { useOs } from "@/components/os/os-context";
import { BulletList } from "@/components/views/ui";

const tabs = ["General", "Installed", "Credentials"] as const;
type Tab = (typeof tabs)[number];

function profileAsText() {
  return [
    "PRIYANSHU_PATEL.EXE — System Properties",
    "",
    ...systemInfo.rows.map((row) => `${row.key.padEnd(16, " ")}${row.value}`),
    `${"STACK".padEnd(16, " ")}${["SQL", "Python", "Node", "React", "Flutter", "PostgreSQL", "REST APIs", "LLMs"].join(" · ")}`,
    "",
    `${profile.email} · ${profile.linkedin}`,
  ].join("\n");
}

export function AboutView() {
  const os = useOs();
  const [tab, setTab] = useState<Tab>("General");
  const [copied, setCopied] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    setTab(tabs[next]);
    tabRefs.current[next]?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profileAsText());
      setCopied(true);
      os.toast("System profile copied to clipboard");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      os.toast("Clipboard unavailable — try selecting the text instead");
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/#about`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Priyanshu Patel — System Properties", text: `${profile.name} · ${profile.trajectory}`, url });
        return;
      } catch {
        return;
      }
    }
    os.run({ type: "copy", text: url, message: "Link copied to clipboard" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl border border-retro-text/20 bg-black/20 shadow-retro">
        <div role="tablist" aria-label="System properties" className="flex gap-1 border-b border-retro-text/20 px-3 pt-3">
          {tabs.map((item, index) => (
            <button
              key={item}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`tab-${item}`}
              role="tab"
              type="button"
              aria-selected={tab === item}
              aria-controls={`panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              onClick={() => setTab(item)}
              onKeyDown={(event) => onTabKey(event, index)}
              className={cn(
                "-mb-px h-9 border border-b-0 px-4 text-[12px] uppercase tracking-wider transition-colors",
                tab === item ? "border-retro-text/25 bg-surface text-retro-green" : "border-transparent text-retro-text/65 hover:text-retro-text",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="p-4 sm:p-6">
          {tab === "General" ? <GeneralTab /> : null}
          {tab === "Installed" ? <InstalledTab /> : null}
          {tab === "Credentials" ? <CredentialsTab /> : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-retro-text/20 bg-black/20 p-3">
          <button type="button" onClick={copy} className="os-btn h-9 px-3 text-[12px] uppercase">
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />} Copy profile
          </button>
          <button type="button" onClick={share} className="os-btn h-9 px-3 text-[12px] uppercase">
            <Share2 className="size-3.5" aria-hidden /> Share
          </button>
          <button type="button" onClick={() => os.navigate("projects")} className="os-btn os-btn-primary h-9 min-w-24 px-3 text-[12px] uppercase">
            OK → Projects
          </button>
        </div>
      </div>
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <div className="flex flex-col items-center text-center">
        <Monitor />
        <p className="mt-3 font-pixel text-xl text-retro-text">PRIYANSHU OS</p>
        <p className="text-[11px] text-retro-text/60">Version 2.0 · build {projects.length}.0</p>
        <p className="mt-3 text-[11px] uppercase tracking-wider text-retro-text/55">Registered to</p>
        <p className="text-sm text-retro-text">{profile.name}</p>
      </div>
      <div className="min-w-0">
        <h2 className="sr-only">About Priyanshu Patel</h2>
        <dl className="divide-y divide-retro-text/10 border-y border-retro-text/10">
          {systemInfo.rows.map((row) => (
            <div key={row.key} className="grid gap-1 py-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-retro-green">{row.key}</dt>
              <dd className="text-[13px] text-retro-text">{row.value}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-retro-green">STACK</dt>
            <dd className="flex flex-wrap gap-1.5">
              {["SQL", "Python", "Node", "React", "Flutter", "PostgreSQL", "REST APIs", "LLMs"].map((item) => (
                <span key={item} className="os-chip">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <div className="mt-4 space-y-3 text-[13px] leading-6 text-retro-text/85">
          <p>
            I work where product, engineering and operations meet. My day job is gathering requirements, writing BRDs and SRS, investigating transaction data with SQL, defining API contracts and running
            UAT for insurance systems at scale.
          </p>
          <p>
            Outside of it, I build AI-native products end to end — memory and model routing, agent gateways, commerce agents, mobile apps. I&apos;m moving toward Product / AI Product roles, bringing business-analysis
            rigour and a builder&apos;s habit of shipping.
          </p>
        </div>
      </div>
    </div>
  );
}

function InstalledTab() {
  return (
    <div>
      <p className="text-[12px] text-retro-text/65">Device Manager — components installed on this system.</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {systemInfo.stack.map((group) => (
          <li key={group.group}>
            <p className="flex items-center gap-2 text-[13px] text-retro-text">
              <span aria-hidden className="text-retro-text/50">
                ▾
              </span>
              {group.group}
            </p>
            <ul className="ml-2 mt-1 border-l border-retro-text/20 pl-4">
              {group.items.map((item) => (
                <li key={item} className="flex items-center justify-between gap-3 py-0.5 text-[12px] text-retro-text/85">
                  <span>{item}</span>
                  <span className="text-[10px] uppercase tracking-wider text-retro-green">ok</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CredentialsTab() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section>
        <h3 className="os-label">Education</h3>
        <ul className="mt-2 space-y-2">
          {systemInfo.education.map((edu) => (
            <li key={edu.title} className="text-[13px] leading-5 text-retro-text">
              {edu.title}
              <span className="block text-[12px] text-retro-text/65">
                {edu.where} · {edu.when}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="os-label">Certifications</h3>
        <BulletList items={systemInfo.certifications} className="mt-2" />
      </section>
      <section>
        <h3 className="os-label">Recognition</h3>
        <BulletList items={systemInfo.awards} className="mt-2" />
      </section>
    </div>
  );
}

/** Pixel-art monitor showing the owner's initials. */
function Monitor() {
  return (
    <svg viewBox="0 0 48 44" className="pixel-icon h-auto w-36" role="img" aria-label="Retro computer displaying the initials PP">
      <rect x="2" y="2" width="44" height="32" fill="#1b222b" stroke="rgba(245,241,232,0.5)" strokeWidth="2" />
      <rect x="6" y="6" width="36" height="24" fill="#06090d" />
      {/* P */}
      <path d="M11 10h6v2h2v4h-2v2h-4v6h-2zM13 12v4h4v-4z" fill="rgb(var(--phosphor))" fillRule="evenodd" />
      {/* P */}
      <path d="M23 10h6v2h2v4h-2v2h-4v6h-2zM25 12v4h4v-4z" fill="rgb(var(--phosphor))" fillRule="evenodd" />
      <rect x="33" y="22" width="4" height="2" fill="rgb(var(--phosphor))" className="blink" />
      <rect x="18" y="34" width="12" height="4" fill="#1b222b" />
      <rect x="10" y="38" width="28" height="4" fill="#1b222b" stroke="rgba(245,241,232,0.5)" strokeWidth="1" />
    </svg>
  );
}

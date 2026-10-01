"use client";

import type { FormEvent } from "react";
import { useId, useState } from "react";
import { ArrowUpRight, Copy, Download, Github, GitFork, Linkedin, Mail, MapPin, Send, Star } from "lucide-react";
import { labTree, profile, skillCategories } from "@/lib/content";
import type { GithubStat } from "@/lib/github";
import { publicRepoUrls } from "@/lib/github";
import { projects } from "@/lib/projects";
import { useOs } from "@/components/os/os-context";
import { ViewHeader } from "@/components/views/ui";

/* ---------------------------------------------------------------- Skills */

export function SkillsView() {
  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
      <ViewHeader title="Skills & Tools" subtitle="What I use to take a problem from a vague requirement to a shipped system. Try `skills --verbose` in the terminal." />
      <div className="grid gap-4 lg:grid-cols-2">
        {skillCategories.map((category, index) => (
          <section key={category.title} className="reveal os-panel p-4 sm:p-5" style={{ animationDelay: `${index * 40}ms` }} aria-labelledby={`skill-${index}`}>
            <h3 id={`skill-${index}`} className="os-label">
              {category.title}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li key={skill} className="border border-retro-text/20 bg-black/30 px-3 py-1 text-[12px] text-retro-text/90">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="reveal os-panel p-4 sm:p-5">
        <h3 className="os-label">Currently exploring</h3>
        <p className="mt-2 text-[13px] leading-6 text-retro-text/85">
          Agent guardrails and approval UX, MCP as a product surface, memory that stays local, and product analytics for AI features.
        </p>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- GitHub */

function describeRepo(url: string) {
  const lower = url.toLowerCase();
  const project = projects.find((p) => p.repo?.toLowerCase() === lower);
  if (project) return { title: project.title, note: project.tagline };
  const lab = labTree.flatMap((folder) => folder.children ?? []).find((item) => item.href?.toLowerCase() === lower);
  return { title: url.split("/").pop() ?? url, note: lab?.note ?? "" };
}

export function GithubView({ stats }: { stats: GithubStat[] }) {
  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
      <ViewHeader title="Open Source" subtitle="Public repositories. Some products (RideCompare, LifePilot, LifeAdmin OS, Lecrec) live in private repos.">
        <a href={profile.github} target="_blank" rel="noreferrer" className="os-btn h-9 px-3 text-[12px] uppercase">
          <Github className="size-3.5" aria-hidden /> github.com/zucc12309
        </a>
      </ViewHeader>
      <ul className="grid gap-4 md:grid-cols-2">
        {publicRepoUrls.map((url, index) => {
          const stat = stats.find((item) => item.url.toLowerCase() === url.toLowerCase());
          const { title, note } = describeRepo(url);
          return (
            <li key={url} className="reveal" style={{ animationDelay: `${index * 40}ms` }}>
              <a href={url} target="_blank" rel="noreferrer" className="group flex h-full flex-col border border-retro-text/20 bg-black/30 p-4 transition-colors hover:border-retro-green/50">
                <span className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-retro-text">
                    <Github className="size-4 shrink-0 text-retro-text/70" aria-hidden />
                    <span className="truncate">{title}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-retro-text/50 transition-colors group-hover:text-retro-green" aria-hidden />
                </span>
                <span className="mt-2 text-[12px] leading-5 text-retro-text/75">{note}</span>
                <span className="mt-auto flex flex-wrap gap-4 pt-4 text-[11px] text-retro-text/65">
                  <span className="flex items-center gap-1">
                    <Star className="size-3" aria-hidden /> {stat?.stars ?? "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="size-3" aria-hidden /> {stat?.forks ?? "—"}
                  </span>
                  <span>{stat?.language ?? "—"}</span>
                  <span>{stat?.updatedAt ? `updated ${stat.updatedAt.slice(0, 10)}` : ""}</span>
                </span>
                <span className="sr-only"> (opens GitHub in a new tab)</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Contact */

const reasons = ["Product / AI Product role", "Business Analyst role", "Collaboration on an AI product", "Just saying hi"];

export function ContactView() {
  const os = useOs();
  const id = useId();
  const [name, setName] = useState("");
  const [reason, setReason] = useState(reasons[0]);
  const [message, setMessage] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const subject = `${reason}${name ? ` — from ${name}` : ""}`;
    const body = `${message}\n\n— ${name || "Sent from Priyanshu OS"}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    os.toast("Opening your email app…");
  };

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:p-8">
      <section className="reveal">
        <ViewHeader title="Let's talk" subtitle="I'm exploring Product and AI Product roles, and I'm always happy to talk to people building interesting things." />
        <p className="mt-4 flex items-center gap-2 text-[13px] text-retro-green">
          <span className="status-led" aria-hidden /> {profile.status}
        </p>
        <ul className="mt-6 grid gap-2">
          <li className="flex items-stretch gap-2">
            <a href={`mailto:${profile.email}`} className="os-btn h-11 flex-1 justify-start px-4 text-[13px]">
              <Mail className="size-4 text-retro-green" aria-hidden /> <span className="truncate">{profile.email}</span>
            </a>
            <button type="button" onClick={() => os.run({ type: "copy", text: profile.email, message: "Email copied to clipboard" })} className="os-btn h-11 w-11 shrink-0" aria-label="Copy email address" data-tip="Copy" data-tip-pos="top-end">
              <Copy className="size-4" aria-hidden />
            </button>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="os-btn h-11 w-full justify-start px-4 text-[13px]">
              <Linkedin className="size-4 text-retro-green" aria-hidden /> linkedin.com/in/priyanshupatel
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer" className="os-btn h-11 w-full justify-start px-4 text-[13px]">
              <Github className="size-4 text-retro-green" aria-hidden /> github.com/zucc12309
            </a>
          </li>
          <li>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="os-btn h-11 w-full justify-start px-4 text-[13px]">
              <Download className="size-4 text-retro-green" aria-hidden /> Resume (PDF)
            </a>
          </li>
        </ul>
        <p className="mt-4 flex items-center gap-2 text-[12px] text-retro-text/65">
          <MapPin className="size-3.5" aria-hidden /> {profile.location} · open to remote
        </p>
      </section>

      <section className="reveal" style={{ animationDelay: "60ms" }} aria-labelledby={`${id}-title`}>
        <form onSubmit={submit} className="border border-retro-text/20 bg-black/30 p-4 shadow-retro sm:p-5">
          <h3 id={`${id}-title`} className="retro-terminal text-sm">
            $ compose --to priyanshu
          </h3>
          <p className="mt-1 text-[12px] text-retro-text/60">Drafts an email in your mail app — nothing is sent from this site.</p>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-[11px] uppercase tracking-wider text-retro-text/65">
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} className="os-input h-11 px-3 text-base normal-case tracking-normal lg:text-sm" autoComplete="name" />
            </label>
            <label className="grid gap-1 text-[11px] uppercase tracking-wider text-retro-text/65">
              About
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="os-input h-11 px-3 text-base normal-case tracking-normal lg:text-sm">
                {reasons.map((item) => (
                  <option key={item} value={item} className="bg-surface">
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-[11px] uppercase tracking-wider text-retro-text/65">
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="os-input min-h-32 p-3 text-base normal-case tracking-normal lg:text-sm"
                placeholder="Hi Priyanshu, …"
              />
            </label>
            <button type="submit" className="os-btn os-btn-primary h-11 text-[13px] uppercase">
              <Send className="size-4" aria-hidden /> Open in email app
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

"use client";

import { ArrowRight, Download, Eye, FileText, Mail, Trophy, User } from "lucide-react";
import { headlineStats, profile, systemInfo } from "@/lib/content";
import { featuredProjects, projects } from "@/lib/projects";
import { AppTile, PixelIcon } from "@/components/os/pixel-icon";
import { OsWindow } from "@/components/os/window";
import { Terminal } from "@/components/os/terminal";
import { useOs } from "@/components/os/os-context";
import { ViewLink } from "@/components/views/shared";

const identityRows: { key: string; value: string; live?: boolean }[] = [
  { key: "user", value: profile.handle },
  { key: "role", value: `${profile.role} @ ${profile.company}` },
  { key: "building", value: profile.building },
  { key: "location", value: profile.location },
  { key: "status", value: profile.status, live: true },
];

export function HomeView() {
  const os = useOs();
  if (os.recruiterMode) return <RecruiterView />;

  return (
    <div className="grid gap-8 p-4 sm:p-6 lg:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:gap-8">
        <section aria-labelledby="hero-title" className="reveal min-w-0">
          <p className="os-label">Priyanshu OS v2.0 · logged in as guest</p>
          <h1 id="hero-title" className="mt-3 font-sans text-[40px] font-bold leading-[1.05] tracking-tight text-retro-text sm:text-5xl">
            Priyanshu Patel
          </h1>
          <p className="mt-2 font-pixel text-[26px] leading-tight text-retro-amber sm:text-[30px]">Business Analyst → Product / AI</p>
          <p className="mt-2 text-sm leading-6 text-retro-text/80">
            <span className="text-retro-green">AI Product Builder.</span> I turn business requirements into working systems — and ship AI-native products on the side.
          </p>

          <dl className="os-panel mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 p-4 text-[13px] leading-5">
            {identityRows.map((row) => (
              <div key={row.key} className="contents">
                <dt className="text-retro-text/55">{row.key}:</dt>
                <dd className={row.live ? "flex items-start gap-2 text-retro-green" : "text-retro-text"}>
                  {row.live ? <span className="status-led mt-1.5 shrink-0" aria-hidden /> : null}
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <nav aria-label="Primary actions" className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <ViewLink view="projects" className="os-btn os-btn-primary h-11 px-4 text-[13px] uppercase tracking-wide">
              <ArrowRight className="size-4" aria-hidden /> View work
            </ViewLink>
            <ViewLink view="about" className="os-btn h-11 px-4 text-[13px] uppercase tracking-wide">
              <User className="size-4" aria-hidden /> About me
            </ViewLink>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="os-btn h-11 px-4 text-[13px] uppercase tracking-wide">
              <Download className="size-4" aria-hidden /> Resume
            </a>
            <ViewLink view="contact" className="os-btn h-11 px-4 text-[13px] uppercase tracking-wide">
              <Mail className="size-4" aria-hidden /> Contact
            </ViewLink>
          </nav>
        </section>

        <section aria-label="Interactive terminal" className="reveal min-w-0" style={{ animationDelay: "60ms" }}>
          <OsWindow as="div" title="TERMINAL" icon={<PixelIcon name="terminal" className="size-4 text-retro-green" />} className="shadow-none">
            <Terminal className="h-[300px] sm:h-[352px]" />
          </OsWindow>
          <p className="mt-2 text-[11px] leading-5 text-retro-text/60">
            Optional — everything is also in the menus. Press <kbd className="border border-retro-text/25 px-1">Ctrl</kbd> / <kbd className="border border-retro-text/25 px-1">⌘</kbd> +{" "}
            <kbd className="border border-retro-text/25 px-1">K</kbd> for the command palette.
          </p>
        </section>
      </div>

      <section aria-label="Highlights" className="reveal grid grid-cols-2 gap-3 lg:grid-cols-4" style={{ animationDelay: "100ms" }}>
        {headlineStats.map((stat) => (
          <div key={stat.label} className="os-panel px-4 py-3">
            <p className="font-pixel text-[28px] leading-none text-retro-green">{stat.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-retro-text/65">{stat.label}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="recent-title" className="reveal" style={{ animationDelay: "140ms" }}>
        <div className="flex items-center justify-between gap-4">
          <h2 id="recent-title" className="os-label">
            Recently opened · featured projects
          </h2>
          <ViewLink view="projects" className="text-[12px] text-retro-text/75 underline-offset-4 hover:text-retro-green hover:underline">
            All {projects.length} projects →
          </ViewLink>
        </div>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                onClick={() => os.openQuickLook(project.slug)}
                className="group flex h-full w-full flex-col gap-3 border border-retro-text/15 bg-black/30 p-4 text-left transition-colors hover:border-retro-green/50 hover:bg-retro-green/[0.05]"
                aria-label={`${project.title}: ${project.tagline} Open quick look.`}
              >
                <span className="flex items-center gap-3">
                  <AppTile monogram={project.monogram} accent={project.accent} size="sm" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-retro-text">{project.title}</span>
                    <span className="block truncate text-[11px] text-retro-text/60">{project.file}</span>
                  </span>
                </span>
                <span className="text-[13px] leading-5 text-retro-text/80">{project.tagline}</span>
                <span className="mt-auto flex items-center justify-between text-[11px]">
                  <span className="text-retro-green">
                    {project.metrics[0].value} {project.metrics[0].label}
                  </span>
                  <span className="text-retro-text/60 transition-colors group-hover:text-retro-green">Quick look →</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RecruiterView() {
  const os = useOs();
  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
      <p className="reveal flex items-center gap-2 text-[12px] uppercase tracking-wider text-retro-green">
        <Eye className="size-3.5" aria-hidden /> Recruiter mode — the 30-second version
      </p>

      <section className="reveal grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="os-panel p-5">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-retro-text">{profile.name}</h1>
          <p className="mt-1 text-sm text-retro-amber">
            {profile.role} · {profile.company}
          </p>
          <p className="mt-1 text-[12px] text-retro-text/65">
            {profile.location} · {profile.trajectory}
          </p>
          <p className="mt-4 text-sm leading-7 text-retro-text/85">
            Business Analyst on Group Life products supporting a ₹1,500+ Cr premium portfolio and 2L+ monthly transactions. I own requirements, API contracts, SQL investigations and UAT — and I
            build AI-native products end-to-end on the side. Looking for Product / AI Product roles where business systems and shipping meet.
          </p>
          <p className="mt-4 flex items-center gap-2 text-[12px] text-retro-amber">
            <Trophy className="size-3.5" aria-hidden /> Tech Titan Award · EY Young Leaders finalist
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={profile.resume} target="_blank" rel="noreferrer" className="os-btn os-btn-primary h-10 px-4 text-[12px] uppercase">
              <FileText className="size-4" aria-hidden /> Resume
            </a>
            <a href={`mailto:${profile.email}`} className="os-btn h-10 px-4 text-[12px] uppercase">
              <Mail className="size-4" aria-hidden /> Email
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="os-btn h-10 px-4 text-[12px] uppercase">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="os-panel p-5">
          <p className="os-label">At a glance</p>
          <dl className="mt-3 space-y-2 text-[13px]">
            {systemInfo.rows.slice(0, 5).map((row) => (
              <div key={row.key} className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="text-retro-text/55">{row.key}</dt>
                <dd className="text-retro-text">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="os-label mt-5">Education</p>
          <p className="mt-2 text-[13px] text-retro-text/85">MBA (Finance & Business Analytics) + B.Tech (CSE), NMIMS MPSTME</p>
        </div>
      </section>

      <section className="reveal grid grid-cols-2 gap-3 lg:grid-cols-4">
        {headlineStats.map((stat) => (
          <div key={stat.label} className="os-panel px-4 py-3">
            <p className="font-pixel text-[28px] leading-none text-retro-green">{stat.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-retro-text/65">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="reveal">
        <p className="os-label">Top projects</p>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <li key={project.slug}>
              <button type="button" onClick={() => os.openQuickLook(project.slug)} className="os-panel block h-full w-full p-4 text-left transition-colors hover:border-retro-green/50">
                <span className="block text-sm font-semibold text-retro-text">{project.title}</span>
                <span className="mt-1 block text-[13px] leading-5 text-retro-text/80">{project.tagline}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

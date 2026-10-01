"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, ExternalLink, FileText, Github, Lock, Play } from "lucide-react";
import { featuredProjects, getProject, projectCategories, projects, type Project, type ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { AppTile } from "@/components/os/pixel-icon";
import { Modal } from "@/components/os/modal";
import { useOs } from "@/components/os/os-context";
import { BulletList, ViewHeader } from "@/components/views/ui";
import { ProjectScreen } from "@/components/views/project-screen";

type Filter = "All" | ProjectCategory;

export function ProjectsView() {
  const os = useOs();
  const [filter, setFilter] = useState<Filter>("All");
  const filtered = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);
  const showFeatured = filter === "All";
  const listed = showFeatured ? filtered.filter((p) => !p.featured) : filtered;

  return (
    <div className="grid gap-8 p-4 sm:p-6 lg:p-8">
      <ViewHeader title="Projects" subtitle="Products I've designed and built end-to-end. Each one opens like an app: problem, what I built, my role, decisions and impact.">
        <p className="text-[12px] text-retro-text/65">
          {filtered.length} of {projects.length} items
        </p>
      </ViewHeader>

      <div role="group" aria-label="Filter projects by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {(["All", ...projectCategories] as Filter[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
            className={cn("os-btn h-9 shrink-0 px-3 text-[12px]", filter === item && "os-btn-primary")}
          >
            {item}
          </button>
        ))}
      </div>

      {showFeatured ? (
        <section aria-labelledby="featured-title" className="grid gap-3">
          <h3 id="featured-title" className="os-label">
            ★ Featured
          </h3>
          <ul className="grid gap-4 xl:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <li key={project.slug} className="reveal" style={{ animationDelay: `${index * 50}ms` }}>
                <FeaturedCard project={project} onQuickLook={() => os.openQuickLook(project.slug)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="all-title" className="grid gap-3">
        <h3 id="all-title" className="os-label">
          {showFeatured ? "More projects" : `${filter} projects`}
        </h3>
        <div className="border border-retro-text/15">
          <div aria-hidden className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_120px_24px] gap-4 border-b border-retro-text/15 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-retro-text/55 md:grid">
            <span>Name</span>
            <span>Category</span>
            <span>Source</span>
            <span />
          </div>
          <ul>
            {listed.map((project) => (
              <li key={project.slug} className="border-b border-retro-text/10 last:border-b-0">
                <button
                  type="button"
                  onClick={() => os.openQuickLook(project.slug)}
                  className="group grid w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-retro-green/[0.06] focus-visible:bg-retro-green/[0.06] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_120px_24px] md:items-center md:gap-4"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <AppTile monogram={project.monogram} accent={project.accent} size="sm" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-retro-text">
                        {project.title}
                        {project.subtitle ? <span className="font-normal text-retro-text/60"> · {project.subtitle}</span> : null}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-5 text-retro-text/75">{project.tagline}</span>
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1.5 pl-11 md:pl-0">
                    {project.categories.map((c) => (
                      <span key={c} className="os-chip">
                        {c}
                      </span>
                    ))}
                  </span>
                  <span className="hidden items-center gap-1.5 text-[12px] text-retro-text/70 md:flex">
                    {project.repo ? <Github className="size-3.5" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
                    {project.repo ? "Open source" : "Private"}
                  </span>
                  <ChevronRight aria-hidden className="hidden size-4 text-retro-text/50 transition-transform group-hover:translate-x-0.5 group-hover:text-retro-green md:block" />
                </button>
              </li>
            ))}
            {listed.length === 0 ? <li className="px-4 py-6 text-sm text-retro-text/65">Nothing in this category yet.</li> : null}
          </ul>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ project, onQuickLook }: { project: Project; onQuickLook: () => void }) {
  return (
    <article className="flex h-full flex-col border border-retro-text/20 bg-black/30 shadow-retro" aria-labelledby={`card-${project.slug}`}>
      <div className="flex items-center gap-3 border-b border-retro-text/15 px-4 py-3">
        <AppTile monogram={project.monogram} accent={project.accent} />
        <div className="min-w-0">
          <h4 id={`card-${project.slug}`} className="text-base font-semibold text-retro-text">
            {project.title}
          </h4>
          <p className="truncate text-[11px] text-retro-text/60">{project.status}</p>
        </div>
      </div>
      <ProjectScreen project={project} compact />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-[13px] leading-6 text-retro-text/85">{project.tagline}</p>
        <dl className="grid grid-cols-2 gap-2">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="os-panel px-3 py-2">
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block font-pixel text-[22px] leading-none text-retro-green">{metric.value}</span>
                <span className="mt-1 block text-[11px] leading-4 text-retro-text/65">{metric.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
          {project.stack.slice(0, 5).map((tech) => (
            <li key={tech} className="os-chip">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2">
          <button type="button" onClick={onQuickLook} className="os-btn os-btn-primary h-10 flex-1 px-3 text-[12px] uppercase">
            Quick look
          </button>
          <Link href={`/projects/${project.slug}`} className="os-btn h-10 flex-1 px-3 text-[12px] uppercase">
            Case file <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function QuickLook({ slug, onClose }: { slug: string; onClose: () => void }) {
  const project = getProject(slug);
  if (!project) return null;

  return (
    <Modal
      title={`${project.file} — QUICK LOOK`}
      onClose={onClose}
      className="md:max-w-4xl"
      status={
        <>
          <span>{project.type}</span>
          <span className="hidden sm:inline">{project.categories.join(" · ")}</span>
          <span className="ml-auto">esc to close</span>
        </>
      }
    >
      <div className="grid gap-6 p-4 sm:p-6">
        <header className="flex items-start gap-4">
          <AppTile monogram={project.monogram} accent={project.accent} size="lg" />
          <div className="min-w-0">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-retro-text">
              {project.title}
              {project.subtitle ? <span className="text-lg font-normal text-retro-text/60"> · {project.subtitle}</span> : null}
            </h2>
            <p className="mt-0.5 text-[12px] uppercase tracking-wider text-retro-amber">{project.status}</p>
            <p className="mt-2 text-sm leading-6 text-retro-text/85">{project.tagline}</p>
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="os-panel px-3 py-2">
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block font-pixel text-[24px] leading-none text-retro-green">{metric.value}</span>
                <span className="mt-1 block text-[11px] leading-4 text-retro-text/65">{metric.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-6 md:grid-cols-2">
          <QuickSection label="Problem">
            <p className="text-[13px] leading-6 text-retro-text/85">{project.problem}</p>
          </QuickSection>
          <QuickSection label="My role">
            <p className="text-[13px] leading-6 text-retro-text/85">{project.role}</p>
          </QuickSection>
          <QuickSection label="What I built">
            <BulletList items={project.built} />
          </QuickSection>
          <QuickSection label="Key product decisions">
            <BulletList items={project.decisions} />
          </QuickSection>
        </div>

        <QuickSection label="Architecture">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px]">
            {project.architecture.map((node, index) => (
              <li key={node} className="flex items-center gap-2">
                <span className="border border-retro-text/20 bg-black/30 px-2 py-1 text-retro-text/85">{node}</span>
                {index < project.architecture.length - 1 ? (
                  <span aria-hidden className="text-retro-green">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </QuickSection>

        <QuickSection label="Stack">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech} className="os-chip">
                {tech}
              </li>
            ))}
          </ul>
        </QuickSection>

        <QuickSection label={project.image ? "Screenshot" : "Product loop"}>
          <ProjectScreen project={project} />
        </QuickSection>
      </div>

      <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-retro-text/15 bg-surface p-4 sm:px-6">
        <Link href={`/projects/${project.slug}`} className="os-btn os-btn-primary h-10 px-4 text-[12px] uppercase">
          Open full case file <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        {project.live ? (
          <Link href={project.live.href} className="os-btn h-10 px-4 text-[12px] uppercase">
            <Play className="size-3.5" aria-hidden /> {project.live.label}
          </Link>
        ) : null}
        {project.repo ? (
          <a href={project.repo} target="_blank" rel="noreferrer" className="os-btn h-10 px-4 text-[12px] uppercase">
            <Github className="size-3.5" aria-hidden /> GitHub <ExternalLink className="size-3" aria-hidden />
          </a>
        ) : (
          <span className="inline-flex h-10 items-center gap-2 border border-dashed border-retro-text/25 px-4 text-[12px] uppercase text-retro-text/60">
            <Lock className="size-3.5" aria-hidden /> Private repo
          </span>
        )}
        {project.caseStudy ? (
          <a href={project.caseStudy} className="os-btn h-10 px-4 text-[12px] uppercase">
            <FileText className="size-3.5" aria-hidden /> Case study
          </a>
        ) : null}
      </div>
    </Modal>
  );
}

function QuickSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="os-label mb-2">{label}</h3>
      {children}
    </section>
  );
}

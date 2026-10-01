import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Github, Lock, Play } from "lucide-react";
import { ArchitectureDiagram, ScreenshotGallery, WorkflowVisualization } from "@/components/project-simulators";
import { AppTile, PixelIcon } from "@/components/os/pixel-icon";
import { OsFooter } from "@/components/os/system-effects";
import { Kicker, OsWindow, Prompt } from "@/components/os/window";
import { Reveal } from "@/components/reveal";
import { BulletList } from "@/components/views/ui";
import { ProjectScreen } from "@/components/views/project-screen";
import { getProject, projects } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: `${project.title} | Priyanshu Patel`,
      description: project.tagline,
      images: [project.image ?? "/projects/memory-router.png"],
    },
  };
}

const hasGallery = new Set(["memory-router", "ridecompare", "ai-lifeadmin-os", "crm-workflow-automation"]);

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const index = projects.findIndex((item) => item.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const icon = <PixelIcon name="document" className="size-4 text-retro-green" />;

  return (
    <div className="min-h-screen font-mono text-[13px] text-retro-text">
      <div className="crt-overlay" aria-hidden />
      <header className="os-menubar">
        <div className="os-menubar-inner mx-auto flex max-w-[1400px] items-center gap-2 px-2 sm:px-4">
          <Link href="/#projects" className="flex h-9 items-center gap-2 px-2 hover:bg-retro-green/10 lg:h-7">
            <ArrowLeft className="size-4 text-retro-green" aria-hidden />
            <span className="font-pixel text-[19px] leading-none">PRIYANSHU OS</span>
          </Link>
          <nav aria-label="Breadcrumb" className="hidden min-w-0 text-[12px] text-retro-text/70 sm:block">
            <ol className="flex items-center gap-2">
              <li aria-hidden>/</li>
              <li>
                <Link href="/#projects" className="hover:text-retro-green">
                  PROJECTS
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="truncate text-retro-text">
                {project.file}
              </li>
            </ol>
          </nav>
          <span className="ml-auto text-[12px] text-retro-text/65">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </header>

      <main id="main-content" className="mx-auto grid max-w-[1400px] gap-6 px-3 py-4 pb-[calc(24px+var(--safe-bottom))] sm:px-5 sm:py-6">
        <OsWindow title={project.file} icon={icon} className="reveal">
          <div className="border-b border-retro-text/10 px-4 py-2 sm:px-6">
            <Prompt command={`open ${project.slug} --case-file`} className="truncate text-[12px]" />
          </div>
          <div className="grid gap-8 p-4 sm:p-6 lg:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <AppTile monogram={project.monogram} accent={project.accent} size="lg" />
                <div className="min-w-0">
                  <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{project.title}</h1>
                  {project.subtitle ? <p className="text-sm text-retro-text/70">{project.subtitle}</p> : null}
                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-retro-amber">
                    {project.type} · {project.status}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-retro-text">{project.tagline}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-retro-text/80">{project.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.live ? (
                  <Link href={project.live.href} className="os-btn os-btn-primary h-10 px-4 text-[12px] uppercase">
                    <Play className="size-4" aria-hidden /> {project.live.label}
                  </Link>
                ) : null}
                {project.repo ? (
                  <a href={project.repo} target="_blank" rel="noreferrer" className="os-btn h-10 px-4 text-[12px] uppercase">
                    <Github className="size-4" aria-hidden /> View code <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : (
                  <span className="inline-flex h-10 items-center gap-2 border border-dashed border-retro-text/25 px-4 text-[12px] uppercase text-retro-text/65">
                    <Lock className="size-4" aria-hidden /> Private repository
                  </span>
                )}
                {project.caseStudy ? (
                  <a href={project.caseStudy} className="os-btn h-10 px-4 text-[12px] uppercase">
                    <FileText className="size-4" aria-hidden /> Case study
                  </a>
                ) : null}
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="os-panel px-3 py-2">
                    <dt className="sr-only">{metric.label}</dt>
                    <dd>
                      <span className="block font-pixel text-[26px] leading-none text-retro-green">{metric.value}</span>
                      <span className="mt-1 block text-[11px] leading-4 text-retro-text/65">{metric.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0">
              <ProjectScreen project={project} />
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tech stack">
                {project.stack.map((tech) => (
                  <li key={tech} className="os-chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </OsWindow>

        <OsWindow title="CASE_STUDY.TXT" icon={icon}>
          <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2">
            <Block index="01" label="Problem">
              <p className="text-sm leading-7 text-retro-text/85">{project.problem}</p>
            </Block>
            <Block index="02" label="Solution">
              <p className="text-sm leading-7 text-retro-text/85">{project.solution}</p>
            </Block>
            <Block index="03" label="What I built">
              <BulletList items={project.built} />
            </Block>
            <Block index="04" label="My role">
              <p className="text-sm leading-7 text-retro-text/85">{project.role}</p>
            </Block>
          </div>
        </OsWindow>

        <section className="grid gap-6 lg:grid-cols-2">
          <OsWindow title="DECISIONS.LOG" icon={icon}>
            <div className="p-4 sm:p-6">
              <Kicker index="05">Key product decisions</Kicker>
              <BulletList items={project.decisions} className="mt-3" />
            </div>
          </OsWindow>
          <OsWindow title="FEATURES.LST" icon={icon}>
            <div className="p-4 sm:p-6">
              <Kicker index="06">Features</Kicker>
              <BulletList items={project.features} className="mt-3" />
            </div>
          </OsWindow>
        </section>

        <OsWindow title="ARCHITECTURE.SYS" icon={icon}>
          <div className="p-4 sm:p-6">
            <Kicker index="07">Architecture</Kicker>
            <div className="mt-4">
              <ArchitectureDiagram project={project} />
            </div>
          </div>
        </OsWindow>

        <OsWindow title={hasGallery.has(project.slug) ? "GALLERY.EXE" : "FLOW.EXE"} icon={icon}>
          <div id="gallery" className="p-4 sm:p-6">
            <Kicker index="08">{hasGallery.has(project.slug) ? "Screens & system view" : "User flow"}</Kicker>
            <div className="mt-4">{hasGallery.has(project.slug) ? <ScreenshotGallery project={project} /> : <WorkflowVisualization flows={project.flows} accent={project.accent} />}</div>
          </div>
        </OsWindow>

        {project.challenges || project.learnings || project.roadmap ? (
          <section className="grid gap-6 lg:grid-cols-3">
            {project.challenges ? (
              <OsWindow title="CHALLENGES.TXT" icon={icon}>
                <Reveal className="p-4 sm:p-6">
                  <Kicker>Challenges</Kicker>
                  <BulletList items={project.challenges} className="mt-3" />
                </Reveal>
              </OsWindow>
            ) : null}
            {project.learnings ? (
              <OsWindow title="LEARNINGS.TXT" icon={icon}>
                <Reveal className="p-4 sm:p-6">
                  <Kicker>What I learned</Kicker>
                  <BulletList items={project.learnings} className="mt-3" />
                </Reveal>
              </OsWindow>
            ) : null}
            {project.roadmap ? (
              <OsWindow title="ROADMAP.TXT" icon={icon}>
                <Reveal className="p-4 sm:p-6">
                  <Kicker>Roadmap</Kicker>
                  <BulletList items={project.roadmap} className="mt-3" />
                </Reveal>
              </OsWindow>
            ) : null}
          </section>
        ) : null}

        <nav aria-label="More projects" className="grid gap-3 sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} className="os-btn h-auto justify-start gap-3 p-4 text-left">
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wider text-retro-text/60">Previous</span>
              <span className="block truncate text-sm">{prev.title}</span>
            </span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="os-btn h-auto justify-end gap-3 p-4 text-right">
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wider text-retro-text/60">Next</span>
              <span className="block truncate text-sm">{next.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </nav>
      </main>
      <OsFooter />
    </div>
  );
}

function Block({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <section className="os-panel p-4 sm:p-5">
      <h2>
        <Kicker index={index}>{label}</Kicker>
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

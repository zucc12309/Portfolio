import { Trophy } from "lucide-react";
import { earlierRoles, experience, systemInfo } from "@/lib/content";
import { buildSteps } from "@/lib/projects";
import { BulletList } from "@/components/views/ui";
import { Kicker } from "@/components/os/window";

const modules = [
  { id: "01", title: "What I owned", items: experience.owned },
  { id: "02", title: "What I built", items: experience.built },
  { id: "03", title: "Impact", items: experience.impact },
];

export function ExperienceView() {
  return (
    <div className="grid gap-8 p-4 sm:p-6 lg:p-8">
      <header className="reveal flex flex-wrap items-start justify-between gap-4 border border-retro-text/20 bg-black/30 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-retro-green">
            <span className="status-led" aria-hidden /> Process running · {experience.period}
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-retro-text sm:text-3xl">{experience.company}</h2>
          <p className="mt-1 font-pixel text-[22px] leading-tight text-retro-amber">{experience.role}</p>
          <p className="mt-1 text-[12px] text-retro-text/65">
            {experience.location} · {experience.scope} · Agile delivery
          </p>
        </div>
        <p className="award-glow flex items-center gap-2 border border-retro-amber/50 bg-retro-amber/10 px-3 py-2 text-[12px] text-retro-amber">
          <Trophy className="size-4" aria-hidden /> Tech Titan Award
        </p>
      </header>

      <section aria-label="Impact metrics" className="reveal" style={{ animationDelay: "50ms" }}>
        <dl className="grid grid-cols-2 border-l border-t border-retro-text/15 md:grid-cols-3 xl:grid-cols-6">
          {experience.metrics.map((metric) => (
            <div key={metric.label} className="border-b border-r border-retro-text/15 bg-black/20 p-4">
              <dt className="text-[11px] uppercase tracking-wider text-retro-text/65">{metric.label}</dt>
              <dd className="mt-1">
                <span className="block font-pixel text-[34px] leading-none text-retro-green">{metric.value}</span>
                <span className="mt-1 block text-[11px] text-retro-text/55">{metric.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Capabilities" className="reveal" style={{ animationDelay: "80ms" }}>
        <ul className="flex flex-wrap gap-2">
          {experience.capabilities.map((cap) => (
            <li key={cap} className="border border-retro-green/35 bg-retro-green/[0.07] px-3 py-1 text-[12px] text-retro-text/90">
              {cap}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {modules.map((module, index) => (
          <section key={module.id} className="reveal os-panel p-4 sm:p-5" style={{ animationDelay: `${100 + index * 40}ms` }} aria-labelledby={`mod-${module.id}`}>
            <h3 id={`mod-${module.id}`}>
              <Kicker index={module.id}>{module.title}</Kicker>
            </h3>
            <BulletList items={module.items} className="mt-3" />
          </section>
        ))}
        <section className="reveal os-panel p-4 sm:p-5" style={{ animationDelay: "220ms" }} aria-labelledby="mod-04">
          <h3 id="mod-04">
            <Kicker index="04">Tech / Tools</Kicker>
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {experience.tools.map((tool) => (
              <li key={tool} className="os-chip">
                {tool}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] leading-5 text-retro-text/65">Day to day: Jira + Confluence for delivery, Postman for API contracts, DBeaver + SQL for investigations, Camunda for workflow.</p>
        </section>
      </div>

      <section className="reveal" aria-labelledby="process-title">
        <h3 id="process-title" className="os-label">
          How I take a requirement to production
        </h3>
        <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          {buildSteps.map((step, index) => (
            <li key={step} className="border border-retro-text/15 bg-black/30 px-3 py-2">
              <span className="font-pixel text-[18px] text-retro-green">{String(index + 1).padStart(2, "0")}</span>
              <span className="block text-[12px] text-retro-text/85">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="reveal" aria-labelledby="earlier-title">
          <h3 id="earlier-title" className="os-label">
            Earlier processes
          </h3>
          <ul className="mt-3 space-y-3">
            {earlierRoles.map((role) => (
              <li key={role.org} className="border-l-2 border-retro-text/25 pl-4">
                <p className="text-sm font-semibold text-retro-text">{role.role}</p>
                <p className="text-[12px] text-retro-text/65">
                  {role.org} · {role.period}
                </p>
                <BulletList items={role.points} className="mt-1" />
              </li>
            ))}
          </ul>
        </section>
        <section className="reveal" aria-labelledby="edu-title">
          <h3 id="edu-title" className="os-label">
            Education & certifications
          </h3>
          <ul className="mt-3 space-y-2">
            {systemInfo.education.map((edu) => (
              <li key={edu.title} className="text-[13px]">
                <span className="text-retro-text">{edu.title}</span>
                <span className="block text-[12px] text-retro-text/65">
                  {edu.where} · {edu.when}
                </span>
              </li>
            ))}
          </ul>
          <BulletList items={systemInfo.certifications} className="mt-3" />
        </section>
      </div>
    </div>
  );
}

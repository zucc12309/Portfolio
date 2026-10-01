import Image from "next/image";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** A project's "screen": the real screenshot when there is one, otherwise its product loop. */
export function ProjectScreen({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden border-b border-retro-text/15 bg-black", compact ? "aspect-[16/8]" : "aspect-[16/9] border")}>
        <Image src={project.image} alt={`${project.title} screenshot`} fill sizes={compact ? "(max-width: 1280px) 100vw, 33vw" : "(max-width: 768px) 100vw, 720px"} className="object-cover object-top opacity-90" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col justify-center gap-1 border-b border-retro-text/15 bg-[#06090d] px-4 py-3 font-mono text-[12px]", compact ? "aspect-[16/8]" : "aspect-[16/9] border px-6")}>
      <p className="text-retro-text/55">$ {project.slug} --trace</p>
      {project.flows.map((step, index) => (
        <p key={step} className="text-retro-text/85">
          <span className="text-retro-green">{String(index + 1).padStart(2, "0")}</span> <span className="text-retro-text/40">→</span> {step}
        </p>
      ))}
    </div>
  );
}

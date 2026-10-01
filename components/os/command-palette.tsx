"use client";

import { useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { profile } from "@/lib/content";
import type { OsAction } from "@/lib/os";
import { projects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/os/modal";
import type { OsSettings } from "@/components/os/os-context";

type Item = { id: string; group: string; label: string; hint?: string; keywords?: string; action: OsAction };

function buildItems(settings: OsSettings, recruiterMode: boolean): Item[] {
  const appItems: Item[] = [
    { id: "projects", group: "Apps", label: "Open Projects", hint: "C:\\PROJECTS", keywords: "work portfolio products case", action: { type: "view", view: "projects" } },
    { id: "experience", group: "Apps", label: "View Experience", hint: "WORK_HISTORY.EXE", keywords: "digit insurance career job history", action: { type: "view", view: "experience" } },
    { id: "about", group: "Apps", label: "About Priyanshu", hint: "PRIYANSHU_PATEL.EXE", keywords: "system info profile bio", action: { type: "view", view: "about" } },
    { id: "terminal", group: "Apps", label: "Open Terminal", hint: "`", keywords: "shell console command line", action: { type: "terminal" } },
    { id: "lab", group: "Apps", label: "Open Lab", hint: "C:\\EXPERIMENTS", keywords: "experiments prototypes ai", action: { type: "view", view: "lab" } },
    { id: "skills", group: "Apps", label: "Skills & Tools", hint: "SKILLS.SYS", keywords: "stack sql python", action: { type: "view", view: "skills" } },
    { id: "github-app", group: "Apps", label: "Open-source repos", hint: "GITHUB.EXE", keywords: "repositories stars", action: { type: "view", view: "github" } },
    { id: "contact", group: "Apps", label: "Contact", hint: "CONTACT.EXE", keywords: "email hire message", action: { type: "view", view: "contact" } },
    { id: "home", group: "Apps", label: "Go to Desktop", hint: "WELCOME.EXE", keywords: "home start", action: { type: "view", view: "home" } },
  ];

  const projectItems: Item[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    group: "Projects",
    label: project.title,
    hint: project.featured ? "★ featured" : project.status,
    keywords: `${project.subtitle ?? ""} ${project.stack.join(" ")} ${project.categories.join(" ")}`,
    action: { type: "view", view: "projects", slug: project.slug },
  }));

  const linkItems: Item[] = [
    { id: "resume", group: "Links", label: "Open Resume", hint: "PDF", keywords: "cv download", action: { type: "url", href: profile.resume, newTab: true } },
    { id: "github", group: "Links", label: "GitHub", hint: "github.com/zucc12309", keywords: "code", action: { type: "url", href: profile.github, newTab: true } },
    { id: "linkedin", group: "Links", label: "LinkedIn", hint: "/in/priyanshupatel", action: { type: "url", href: profile.linkedin, newTab: true } },
    { id: "email", group: "Links", label: "Email Priyanshu", hint: profile.email, keywords: "mail contact", action: { type: "url", href: `mailto:${profile.email}` } },
    { id: "copy-email", group: "Links", label: "Copy email address", keywords: "clipboard", action: { type: "copy", text: profile.email, message: "Email copied to clipboard" } },
  ];

  const systemItems: Item[] = [
    { id: "recruiter", group: "System", label: recruiterMode ? "Exit recruiter mode" : "Recruiter mode (30-second view)", keywords: "hiring summary quick", action: { type: "recruiter" } },
    { id: "crt", group: "System", label: settings.crt ? "Turn CRT effects off" : "Turn CRT effects on", keywords: "scanlines effects display accessibility", action: { type: "crt", on: !settings.crt } },
    { id: "sound", group: "System", label: settings.sound ? "Mute UI sounds" : "Enable UI sounds", keywords: "audio sfx", action: { type: "sound", on: !settings.sound } },
    {
      id: "phosphor",
      group: "System",
      label: settings.phosphor === "green" ? "Switch to amber phosphor" : "Switch to green phosphor",
      keywords: "theme colour color monitor",
      action: { type: "phosphor", value: settings.phosphor === "green" ? "amber" : "green" },
    },
    { id: "reboot", group: "System", label: "Reboot Priyanshu OS", keywords: "restart boot", action: { type: "reboot" } },
  ];

  return [...appItems, ...projectItems, ...linkItems, ...systemItems];
}

function score(item: Item, query: string) {
  if (!query) return 1;
  const label = item.label.toLowerCase();
  const hay = `${label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.every((term) => hay.includes(term))) return 0;
  return label.startsWith(terms[0]) ? 3 : label.includes(terms[0]) ? 2 : 1;
}

export function CommandPalette({ onClose, onRun, settings, recruiterMode }: { onClose: () => void; onRun: (action: OsAction) => void; settings: OsSettings; recruiterMode: boolean }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const items = useMemo(() => buildItems(settings, recruiterMode), [settings, recruiterMode]);

  const results = useMemo(() => {
    const scored = items.map((item, order) => ({ item, s: score(item, query), order })).filter((r) => r.s > 0);
    if (query) scored.sort((a, b) => b.s - a.s || a.order - b.order);
    return scored.map((r) => r.item);
  }, [items, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const activeItem = results[activeIndex];

  const select = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    // Run after the palette unmounts so focus restoration doesn't fight navigation.
    window.setTimeout(() => onRun(item.action), 0);
  };

  const move = (delta: number) => {
    if (!results.length) return;
    const next = (activeIndex + delta + results.length) % results.length;
    setActive(next);
    listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
  };

  let lastGroup = "";

  return (
    <Modal
      title="COMMAND.COM"
      onClose={onClose}
      initialFocus={inputRef}
      className="md:max-w-xl"
      status={
        <>
          <span className="hidden sm:inline">↑↓ navigate</span>
          <span className="hidden sm:inline">↵ open</span>
          <span>esc close</span>
          <span className="ml-auto">{results.length} results</span>
        </>
      }
    >
      <div className="flex items-center gap-2 border-b border-retro-text/15 px-4">
        <Search aria-hidden className="size-4 shrink-0 text-retro-green" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              move(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              move(-1);
            } else if (event.key === "Enter") {
              event.preventDefault();
              select(activeItem);
            } else if (event.key === "Home" && !query) {
              event.preventDefault();
              setActive(0);
            }
          }}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={activeItem ? `palette-${activeItem.id}` : undefined}
          aria-autocomplete="list"
          aria-label="Search commands"
          placeholder="Type a command or search…"
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-retro-text outline-none placeholder:text-retro-text/45 lg:text-sm"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
        />
        <kbd className="hidden border border-retro-text/25 px-1.5 text-[11px] text-retro-text/60 sm:inline">ESC</kbd>
      </div>
      <ul ref={listRef} id="palette-list" role="listbox" aria-label="Commands" className="max-h-[60vh] overflow-y-auto p-2 md:max-h-[420px]">
        {results.length === 0 ? <li className="px-3 py-6 text-center text-sm text-retro-text/60">No matching commands. Try “projects” or “resume”.</li> : null}
        {results.map((item, index) => {
          const showGroup = item.group !== lastGroup;
          lastGroup = item.group;
          return (
            <li key={item.id} role="presentation">
              {showGroup ? (
                <p role="presentation" className="px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.16em] text-retro-text/55 first:pt-1">
                  {item.group}
                </p>
              ) : null}
              <div
                id={`palette-${item.id}`}
                role="option"
                aria-selected={index === activeIndex}
                data-index={index}
                onMouseMove={() => setActive(index)}
                onClick={() => select(item)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 border border-transparent px-3 text-sm sm:min-h-9",
                  index === activeIndex ? "border-retro-green/50 bg-retro-green/12 text-retro-green" : "text-retro-text/85",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.hint ? <span className="hidden max-w-[45%] truncate text-[11px] text-retro-text/55 sm:block">{item.hint}</span> : null}
                {index === activeIndex ? <CornerDownLeft aria-hidden className="size-3.5 shrink-0" /> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {results.length} results
      </p>
    </Modal>
  );
}


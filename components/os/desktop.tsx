"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Command, Eye, FolderOpen, Home, Menu, Monitor, MonitorOff, TerminalSquare, Volume2, VolumeX } from "lucide-react";
import { profile } from "@/lib/content";
import type { GithubStat } from "@/lib/github";
import { apps, getApp, parseHash, type OsAction, type ViewId } from "@/lib/os";
import { playSfx, setSoundEnabled } from "@/lib/sfx";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/os/command-palette";
import { OsContext, type OsApi, type OsSettings } from "@/components/os/os-context";
import { PixelIcon } from "@/components/os/pixel-icon";
import { BootOverlay, Bsod, MatrixRain, OsFooter, Toasts, type Toast } from "@/components/os/system-effects";
import { Terminal } from "@/components/os/terminal";
import { OsWindow, Prompt } from "@/components/os/window";
import { AboutView } from "@/components/views/about";
import { ExperienceView } from "@/components/views/experience";
import { HomeView } from "@/components/views/home";
import { LabView } from "@/components/views/lab";
import { ContactView, GithubView, SkillsView } from "@/components/views/more";
import { ProjectsView, QuickLook } from "@/components/views/projects";

type WinState = "normal" | "minimized" | "maximized";

const SETTINGS_KEY = "pos-settings";
const defaultSettings: OsSettings = { crt: true, sound: false, phosphor: "green" };
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const desktopIcons: { label: string; icon: Parameters<typeof PixelIcon>[0]["name"]; tip: string; action: OsAction }[] = [
  { label: "Projects", icon: "folder", tip: "8 products, 3 featured", action: { type: "view", view: "projects" } },
  { label: "Work History", icon: "briefcase", tip: "Digit Life Insurance", action: { type: "view", view: "experience" } },
  { label: "About Me", icon: "computer", tip: "System properties", action: { type: "view", view: "about" } },
  { label: "Lab", icon: "flask", tip: "Experiments & prototypes", action: { type: "view", view: "lab" } },
  { label: "Terminal", icon: "terminal", tip: "Command line ( ` )", action: { type: "terminal" } },
  { label: "Resume.pdf", icon: "document", tip: "Opens in a new tab", action: { type: "url", href: profile.resume, newTab: true } },
  { label: "Skills", icon: "gear", tip: "Skills & tools", action: { type: "view", view: "skills" } },
  { label: "GitHub", icon: "branch", tip: "Open-source repos", action: { type: "view", view: "github" } },
  { label: "Contact", icon: "mail", tip: "Get in touch", action: { type: "view", view: "contact" } },
];

function isEditable(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export function Desktop({ stats }: { stats: GithubStat[] }) {
  const router = useRouter();
  const [view, setView] = useState<ViewId>("home");
  const [quickLook, setQuickLook] = useState<string | null>(null);
  const [winState, setWinState] = useState<WinState>("normal");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [bsod, setBsod] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [settings, setSettings] = useState<OsSettings>(defaultSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [startedAt] = useState(() => Date.now());
  const settingsLoaded = useRef(false);
  const settingsRef = useRef(settings);
  const bodyRef = useRef<HTMLDivElement>(null);
  const toastId = useRef(0);

  const app = getApp(view);

  /* ---------------- settings ---------------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") as Partial<OsSettings>;
      setSettings((prev) => ({ ...prev, ...saved }));
    } catch {
      // ignore corrupt or unavailable storage
    }
    settingsLoaded.current = true;
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
    const root = document.documentElement;
    root.dataset.crt = settings.crt ? "on" : "off";
    root.dataset.phosphor = settings.phosphor;
    setSoundEnabled(settings.sound);
    if (!settingsLoaded.current) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  /* ---------------- toasts ---------------- */
  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }, []);

  /* ---------------- navigation ---------------- */
  const scrollTop = useCallback(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
  }, []);

  const navigate = useCallback(
    (next: ViewId, slug?: string) => {
      const target = getApp(next);
      const url = next === "home" ? window.location.pathname + window.location.search : `#${target.hash}${slug ? `/${slug}` : ""}`;
      window.history.pushState(null, "", url);
      setView(next);
      setQuickLook(next === "projects" && slug ? slug : null);
      setWinState((prev) => (prev === "minimized" ? "normal" : prev));
      scrollTop();
      playSfx("open");
    },
    [scrollTop],
  );

  useEffect(() => {
    const sync = () => {
      const parsed = parseHash(window.location.hash);
      setView(parsed.view);
      setQuickLook(parsed.slug ?? null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const openQuickLook = useCallback((slug: string) => {
    setQuickLook(slug);
    playSfx("open");
  }, []);

  const closeQuickLook = useCallback(() => {
    setQuickLook(null);
    if (window.location.hash.includes("/")) window.history.replaceState(null, "", "#projects");
    playSfx("close");
  }, []);

  /* ---------------- actions ---------------- */
  const run = useCallback(
    (action: OsAction) => {
      switch (action.type) {
        case "view":
          if (action.slug && action.view === "projects" && view !== "projects") navigate("projects", action.slug);
          else if (action.slug) openQuickLook(action.slug);
          else navigate(action.view);
          break;
        case "url":
          if (action.newTab) window.open(action.href, "_blank", "noopener,noreferrer");
          else if (action.href.startsWith("/") && !/\.(pdf|html)$/.test(action.href)) router.push(action.href);
          else window.location.href = action.href;
          break;
        case "terminal":
          setTerminalOpen(true);
          playSfx("open");
          break;
        case "palette":
          setPaletteOpen(true);
          break;
        case "bsod":
          setTerminalOpen(false);
          setBsod(true);
          break;
        case "matrix":
          setMatrix(true);
          break;
        case "phosphor":
          setSettings((prev) => ({ ...prev, phosphor: action.value }));
          toast(`Phosphor: ${action.value}`);
          break;
        case "sound":
          setSoundEnabled(action.on);
          setSettings((prev) => ({ ...prev, sound: action.on }));
          if (action.on) playSfx("toggle");
          toast(`UI sounds ${action.on ? "on" : "off"}`);
          break;
        case "crt":
          setSettings((prev) => ({ ...prev, crt: action.on }));
          toast(`CRT effects ${action.on ? "on" : "off"}`);
          break;
        case "recruiter":
          toast(recruiterMode ? "Recruiter mode off" : "Recruiter mode on — the 30-second version");
          setRecruiterMode(!recruiterMode);
          navigate("home");
          break;
        case "copy":
          navigator.clipboard?.writeText(action.text).then(
            () => toast(action.message),
            () => toast("Clipboard unavailable"),
          );
          break;
        case "reboot":
          try {
            sessionStorage.removeItem("pos-booted");
          } catch {
            // ignore
          }
          window.location.assign("/");
          break;
      }
    },
    [navigate, openQuickLook, recruiterMode, router, toast, view],
  );

  /* ---------------- global keyboard ---------------- */
  useEffect(() => {
    let konami = 0;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (isEditable(event.target)) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        const next = settingsRef.current.phosphor === "amber" ? "green" : "amber";
        setSettings((prev) => ({ ...prev, phosphor: next }));
        toast(next === "amber" ? "KONAMI CODE ACCEPTED · amber phosphor unlocked" : "KONAMI CODE ACCEPTED · green phosphor restored");
        playSfx("boot");
        return;
      }

      if (event.key === "`" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setTerminalOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast]);

  /* ---------------- developer console easter egg ---------------- */
  useEffect(() => {
    const w = window as unknown as { __posGreeted?: boolean };
    if (w.__posGreeted) return;
    w.__posGreeted = true;
    console.log(
      "%c PRIYANSHU OS v2.0 %c\n\nHello, fellow developer 👋\nYou opened the console, so you're my kind of person.\n\n→ Source: https://github.com/zucc12309/Portfolio\n→ Say hi: " +
        profile.email +
        "\n→ Secret: type `sudo hire priyanshu` in the terminal.\n",
      "background:#8BE78B;color:#0B0F14;font-weight:bold;padding:4px 8px;font-family:monospace",
      "color:#F5F1E8;font-family:monospace",
    );
  }, []);

  const api: OsApi = useMemo(
    () => ({ view, settings, recruiterMode, startedAt, navigate, run, toast, openQuickLook, closeQuickLook }),
    [view, settings, recruiterMode, startedAt, navigate, run, toast, openQuickLook, closeQuickLook],
  );

  const minimize = () => {
    setWinState("minimized");
    playSfx("close");
  };
  const toggleMaximize = () => setWinState((prev) => (prev === "maximized" ? "normal" : "maximized"));
  const restore = () => {
    setWinState((prev) => (prev === "minimized" ? "normal" : prev));
    playSfx("open");
  };

  return (
    <OsContext.Provider value={api}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <BootOverlay />
      <div className="crt-overlay" aria-hidden />

      <div className="os-shell font-mono text-[13px] text-retro-text">
        <Menubar view={view} recruiterMode={recruiterMode} onNavigate={navigate} onPalette={() => setPaletteOpen(true)} onRecruiter={() => run({ type: "recruiter" })} />

        <div className="os-main-pad relative lg:flex lg:min-h-0 lg:gap-4 lg:p-4">
          <DesktopWallpaper visible={winState === "minimized"} />
          <DesktopIcons hidden={winState === "maximized"} onRun={run} />

          <OsWindow
            key={view}
            id="main-window"
            title={app.title}
            icon={<PixelIcon name={app.icon} className="size-4 text-retro-green" />}
            className="os-main-window os-window-anim z-10 min-h-0 border-x-0 shadow-none lg:flex-1 lg:border-x lg:shadow-[inset_1px_1px_0_var(--bevel-light),0_0_0_1px_rgba(0,0,0,0.6),4px_4px_0_0_rgba(0,0,0,0.5),0_24px_48px_-16px_rgba(0,0,0,0.7)]"
            data-state={winState}
            aria-label={`${app.label} window`}
            titleBarProps={{ onDoubleClick: toggleMaximize }}
            controls={{
              onMinimize: minimize,
              onMaximize: toggleMaximize,
              maximized: winState === "maximized",
              onClose: view === "home" ? minimize : () => navigate("home"),
              closeLabel: view === "home" ? "Minimize to desktop" : "Close — back to desktop",
            }}
            status={
              <>
                <span className="truncate">C:\USERS\GUEST\{app.label.toUpperCase().replace(/\s/g, "_")}</span>
                <span className="ml-auto hidden shrink-0 sm:inline">⌘K commands</span>
                <span className="hidden shrink-0 sm:inline">` terminal</span>
              </>
            }
          >
            <div ref={bodyRef} id="main-content" tabIndex={-1} className="os-window-body flex-1 outline-none">
              <div className="border-b border-retro-text/10 px-4 py-2 sm:px-6 lg:px-8">
                <Prompt command={app.command} className="truncate text-[12px]" />
              </div>
              <main>
                {view === "home" && <HomeView />}
                {view === "projects" && <ProjectsView />}
                {view === "experience" && <ExperienceView />}
                {view === "about" && <AboutView />}
                {view === "lab" && <LabView />}
                {view === "skills" && <SkillsView />}
                {view === "github" && <GithubView stats={stats} />}
                {view === "contact" && <ContactView />}
              </main>
              <OsFooter className="mt-4" />
            </div>
          </OsWindow>
        </div>

        <Taskbar
          app={app.title}
          winState={winState}
          terminalOpen={terminalOpen}
          settings={settings}
          onStart={() => setPaletteOpen(true)}
          onToggleWindow={() => (winState === "minimized" ? restore() : minimize())}
          onTerminal={() => setTerminalOpen((open) => !open)}
          onRun={run}
          onBsod={() => setBsod(true)}
        />
        <MobileDock view={view} terminalOpen={terminalOpen} onNavigate={navigate} onTerminal={() => setTerminalOpen((open) => !open)} onMenu={() => setPaletteOpen(true)} />
      </div>

      {terminalOpen ? <TerminalWindow onClose={() => setTerminalOpen(false)} /> : null}
      {quickLook ? <QuickLook slug={quickLook} onClose={closeQuickLook} /> : null}
      {paletteOpen ? <CommandPalette settings={settings} recruiterMode={recruiterMode} onClose={() => setPaletteOpen(false)} onRun={run} /> : null}
      {matrix ? <MatrixRain onDone={() => setMatrix(false)} /> : null}
      {bsod ? <Bsod onDismiss={() => setBsod(false)} /> : null}
      <Toasts toasts={toasts} />
    </OsContext.Provider>
  );
}

/* ======================================================================== */

function Menubar({
  view,
  recruiterMode,
  onNavigate,
  onPalette,
  onRecruiter,
}: {
  view: ViewId;
  recruiterMode: boolean;
  onNavigate: (view: ViewId) => void;
  onPalette: () => void;
  onRecruiter: () => void;
}) {
  const now = useClock();
  const menuApps = apps.filter((a) => ["projects", "experience", "about", "lab", "contact"].includes(a.id));

  return (
    <header className="os-menubar">
      <div className="os-menubar-inner flex items-center gap-2 px-2 sm:px-3">
        <button type="button" onClick={onPalette} className="flex h-9 items-center gap-2 px-2 hover:bg-retro-green/10 lg:h-7" aria-label="Open command palette" data-tip="Command palette · ⌘K" data-tip-pos="bottom">
          <PixelIcon name="computer" className="size-5 text-retro-green" />
          <span className="font-pixel text-[19px] leading-none text-retro-text">PRIYANSHU OS</span>
        </button>
        <nav aria-label="Main" className="hidden items-center lg:flex">
          <span aria-hidden className="mx-2 h-4 w-px bg-retro-text/20" />
          {menuApps.map((item) => (
            <a
              key={item.id}
              href={`#${item.hash}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.id);
              }}
              aria-current={view === item.id ? "page" : undefined}
              className={cn("flex h-7 items-center px-3 text-[12px] transition-colors hover:bg-retro-green/10", view === item.id ? "text-retro-green" : "text-retro-text/80")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onRecruiter}
            aria-pressed={recruiterMode}
            className={cn(
              "hidden h-7 items-center gap-1.5 border px-2 text-[11px] uppercase transition-colors md:flex",
              recruiterMode ? "recruiter-pulse border-retro-green/60 bg-retro-green/10 text-retro-green" : "border-retro-text/20 text-retro-text/70 hover:text-retro-text",
            )}
            data-tip="30-second summary for hiring teams"
            data-tip-pos="bottom"
          >
            <Eye className="size-3" aria-hidden /> Recruiter mode
          </button>
          <span className="hidden items-center gap-1.5 text-[11px] uppercase text-retro-green xl:flex">
            <span className="status-led" aria-hidden /> Available
          </span>
          <button type="button" onClick={onPalette} className="hidden h-7 items-center gap-1 border border-retro-text/20 px-2 text-[11px] text-retro-text/75 hover:text-retro-text lg:flex" aria-label="Open command palette">
            <Command className="size-3" aria-hidden />K
          </button>
          <span className="px-1 text-[12px] tabular-nums text-retro-text/75 lg:hidden" aria-label="Current time">
            {now ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
          </span>
          <button type="button" onClick={onPalette} className="grid size-11 place-items-center lg:hidden" aria-label="Open menu and command palette">
            <Command className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}

function DesktopWallpaper({ visible }: { visible: boolean }) {
  return (
    <div aria-hidden={!visible} className={cn("pointer-events-none absolute inset-0 hidden place-items-center transition-opacity duration-200 lg:grid", visible ? "opacity-100" : "opacity-0")}>
      <div className="text-center">
        <p className="font-pixel text-6xl text-retro-text/80">PRIYANSHU OS</p>
        <p className="mt-2 text-[12px] text-retro-text/60">Window minimized · click an icon, the taskbar, or press ⌘K</p>
      </div>
    </div>
  );
}

function DesktopIcons({ hidden, onRun }: { hidden: boolean; onRun: (action: OsAction) => void }) {
  return (
    <nav aria-label="Desktop" className={cn("relative z-[11] hidden w-[92px] shrink-0 lg:block", hidden && "lg:hidden")}>
      <ul className="grid gap-1">
        {desktopIcons.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => onRun(item.action)}
              className="group flex w-full flex-col items-center gap-1 border border-transparent px-1 py-2 text-center focus-visible:border-retro-green/60 focus-visible:bg-retro-green/10"
              data-tip={item.tip}
              data-tip-pos="right"
            >
              <PixelIcon name={item.icon} className="size-9 text-retro-text/90 transition-transform duration-150 group-hover:-translate-y-0.5 group-active:translate-y-0" />
              <span className="px-1 text-[11px] leading-tight text-retro-text/85 group-hover:bg-retro-green/20 group-hover:text-retro-text group-focus-visible:bg-retro-green group-focus-visible:text-bg">
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TerminalWindow({ onClose }: { onClose: () => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const size = { w: 600, h: 400 };

  useEffect(() => {
    setPos({ x: Math.max(16, window.innerWidth - size.w - 32), y: Math.max(48, window.innerHeight - size.h - 44 - 32) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button") || !pos || window.innerWidth < 1024) return;
    drag.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const x = Math.min(Math.max(0, event.clientX - drag.current.dx), window.innerWidth - size.w);
    const y = Math.min(Math.max(32, event.clientY - drag.current.dy), window.innerHeight - 44 - 32);
    setPos({ x, y });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const style = pos ? ({ "--tx": `${pos.x}px`, "--ty": `${pos.y}px` } as CSSProperties) : undefined;

  return (
    <OsWindow
      as="div"
      role="dialog"
      aria-label="Terminal"
      title="TERMINAL — guest@priyanshu-os"
      icon={<PixelIcon name="terminal" className="size-4 text-retro-green" />}
      className="os-float os-terminal-window fade-in font-mono text-[13px] text-retro-text"
      style={style}
      controls={{ onClose, closeLabel: "Close terminal" }}
      titleBarProps={{ onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, className: "lg:cursor-grab lg:active:cursor-grabbing touch-none" }}
    >
      <Terminal variant="window" autoFocus onExit={onClose} className="min-h-0 flex-1" />
    </OsWindow>
  );
}

function Taskbar({
  app,
  winState,
  terminalOpen,
  settings,
  onStart,
  onToggleWindow,
  onTerminal,
  onRun,
  onBsod,
}: {
  app: string;
  winState: WinState;
  terminalOpen: boolean;
  settings: OsSettings;
  onStart: () => void;
  onToggleWindow: () => void;
  onTerminal: () => void;
  onRun: (action: OsAction) => void;
  onBsod: () => void;
}) {
  const now = useClock();
  const clicks = useRef<number[]>([]);

  const onLed = () => {
    const t = Date.now();
    clicks.current = [...clicks.current.filter((c) => t - c < 2000), t];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      onBsod();
    }
  };

  return (
    <footer className="os-taskbar relative z-40 hidden h-[var(--taskbar-h)] items-center gap-2 px-2 lg:flex" aria-label="Taskbar">
      <button type="button" onClick={onStart} className="os-btn h-8 px-3 text-[12px] font-semibold" aria-label="Start — open command palette" data-tip="Start · ⌘K">
        <PixelIcon name="computer" className="size-4 text-retro-green" /> Start
      </button>
      <span aria-hidden className="h-6 w-px bg-retro-text/20" />
      <button
        type="button"
        onClick={onToggleWindow}
        aria-pressed={winState !== "minimized"}
        className={cn("os-btn h-8 min-w-40 max-w-64 justify-start px-3 text-[12px]", winState !== "minimized" && "os-btn-primary")}
        data-tip={winState === "minimized" ? "Restore window" : "Minimize window"}
      >
        <FolderOpen className="size-3.5 shrink-0" aria-hidden /> <span className="truncate">{app}</span>
      </button>
      {terminalOpen ? (
        <button type="button" onClick={onTerminal} className="os-btn os-btn-primary h-8 px-3 text-[12px]" data-tip="Close terminal">
          <TerminalSquare className="size-3.5" aria-hidden /> Terminal
        </button>
      ) : null}

      <div className="ml-auto flex h-8 items-center gap-1 border border-retro-text/15 bg-black/30 px-2 shadow-[inset_1px_1px_0_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => onRun({ type: "crt", on: !settings.crt })}
          aria-pressed={settings.crt}
          aria-label="CRT effects"
          className="grid size-7 place-items-center text-retro-text/75 hover:text-retro-text"
          data-tip={settings.crt ? "CRT effects: on" : "CRT effects: off"}
        >
          {settings.crt ? <Monitor className="size-3.5" aria-hidden /> : <MonitorOff className="size-3.5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={() => onRun({ type: "sound", on: !settings.sound })}
          aria-pressed={settings.sound}
          aria-label="UI sounds"
          className="grid size-7 place-items-center text-retro-text/75 hover:text-retro-text"
          data-tip={settings.sound ? "Sounds: on" : "Sounds: off"}
        >
          {settings.sound ? <Volume2 className="size-3.5" aria-hidden /> : <VolumeX className="size-3.5" aria-hidden />}
        </button>
        <button type="button" onClick={onLed} aria-label="System status: online" className="grid size-7 place-items-center" data-tip="System status: online" data-tip-pos="top-end">
          <span className="status-led" aria-hidden />
        </button>
        <span className="pl-1 text-[12px] tabular-nums text-retro-text/80">
          {now ? `${now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : ""}
        </span>
      </div>
    </footer>
  );
}

function MobileDock({
  view,
  terminalOpen,
  onNavigate,
  onTerminal,
  onMenu,
}: {
  view: ViewId;
  terminalOpen: boolean;
  onNavigate: (view: ViewId) => void;
  onTerminal: () => void;
  onMenu: () => void;
}) {
  const items: { id: ViewId; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "experience", label: "Work", icon: Briefcase },
  ];

  const base = "flex h-full flex-1 flex-col items-center justify-center gap-1 text-[11px] transition-colors active:bg-retro-green/10";

  return (
    <nav className="os-dock lg:hidden" aria-label="Dock">
      <div className="os-dock-inner flex">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id && !terminalOpen;
          return (
            <a
              key={item.id}
              href={`#${getApp(item.id).hash}`}
              onClick={(event) => {
                event.preventDefault();
                if (terminalOpen) onTerminal();
                onNavigate(item.id);
              }}
              aria-current={active ? "page" : undefined}
              className={cn(base, active ? "text-retro-green" : "text-retro-text/75")}
            >
              <Icon className="size-5" aria-hidden />
              {item.label}
            </a>
          );
        })}
        <button type="button" onClick={onTerminal} aria-pressed={terminalOpen} className={cn(base, terminalOpen ? "text-retro-green" : "text-retro-text/75")}>
          <TerminalSquare className="size-5" aria-hidden />
          Terminal
        </button>
        <button type="button" onClick={onMenu} className={cn(base, "text-retro-text/75")}>
          <Menu className="size-5" aria-hidden />
          More
        </button>
      </div>
    </nav>
  );
}

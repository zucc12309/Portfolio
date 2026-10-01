"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/lib/content";
import { projects } from "@/lib/projects";
import { playSfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Boot sequence. The overlay is server-rendered but only visible when the  */
/* inline head script sets html[data-boot="1"] (first visit per session,    */
/* no reduced-motion), so there is no flash of content before it.           */
/* ------------------------------------------------------------------------ */

const bootLines = [
  "CPU: product-thinking core ................ OK",
  "Memory test: ₹1,500 Cr portfolio .......... OK",
  `Mounting /projects ........................ ${projects.length} found`,
  "Loading AI subsystems (MCP, routing) ...... OK",
  "Loading WORK_HISTORY.EXE .................. OK",
  "Starting desktop for guest ................",
];

export function BootOverlay() {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.boot !== "1") return;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setLeaving(true);
      try {
        sessionStorage.setItem("pos-booted", "1");
      } catch {
        // storage unavailable
      }
      window.setTimeout(() => {
        delete root.dataset.boot;
      }, 220);
    };

    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= bootLines.length) {
        window.clearInterval(timer);
        window.setTimeout(finish, 260);
      }
    }, 150);

    const skip = () => {
      window.clearInterval(timer);
      finish();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  const progress = Math.round((count / bootLines.length) * 100);

  return (
    <div className="boot-overlay boot-screen fixed inset-0 z-[100] items-center justify-center px-4 font-mono text-[13px] text-retro-green" data-leaving={leaving} aria-hidden>
      <div className="w-full max-w-xl">
        <p className="font-pixel text-2xl text-retro-text">PRIYANSHU OS v2.0</p>
        <p className="mt-1 text-retro-text/60">BIOS rev. 2 · Bengaluru build</p>
        <div className="mt-6 min-h-[9rem] space-y-1">
          {bootLines.slice(0, count).map((line) => (
            <p key={line} className="term-line whitespace-pre-wrap">
              {line}
            </p>
          ))}
          {count < bootLines.length ? <span className="boot-cursor inline-block h-4 w-2 bg-retro-green" /> : null}
        </div>
        <div className="mt-6 h-4 border border-retro-green/40 bg-black">
          <div className="boot-progress h-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 flex justify-between text-xs text-retro-text/60">
          <span>{progress}% loaded</span>
          <span>press any key to skip</span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* BSOD easter egg                                                          */
/* ------------------------------------------------------------------------ */

export function Bsod({ onDismiss }: { onDismiss: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playSfx("error");
    ref.current?.focus();
    const armedAt = Date.now();
    const dismiss = () => {
      if (Date.now() - armedAt > 500) onDismiss();
    };
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [onDismiss]);

  return (
    <div ref={ref} tabIndex={-1} role="alertdialog" aria-modal="true" aria-label="Blue screen easter egg. Press any key to continue." className="bsod fixed inset-0 z-[110] flex items-center justify-center p-6 font-mono text-sm leading-7 outline-none sm:text-base">
      <div className="max-w-2xl">
        <p className="text-center">
          <span className="bsod-tag px-2">PRIYANSHU OS</span>
        </p>
        <p className="mt-6">A fatal exception 0E has occurred at 0028:C0FFEE in VXD PRODUCT_THINKING(01).</p>
        <p>The current session will be terminated.</p>
        <p className="mt-4">*&nbsp; Reason: TOO_MANY_SIDE_PROJECTS</p>
        <p>*&nbsp; Memory dump: 8 products, 1 terminal, 0 regrets</p>
        <p className="mt-6 text-center">Press any key to continue _</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Matrix rain easter egg (canvas, ~6s, exits on any input)                 */
/* ------------------------------------------------------------------------ */

export function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const size = 16;
    const columns = Math.ceil(window.innerWidth / size);
    const drops = Array.from({ length: columns }, () => Math.random() * -40);
    const glyphs = "アイウエオカキクケコサシスセソ0123456789PRIYANSHU{}<>/$#";
    const phosphor = getComputedStyle(document.documentElement).getPropertyValue("--phosphor").trim().split(/\s+/).join(",");

    let frame = 0;
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(5,6,10,0.14)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${size - 2}px monospace`;
      drops.forEach((y, i) => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = Math.random() > 0.96 ? "#e8ffe8" : `rgb(${phosphor})`;
        ctx.fillText(char, i * size, y * size);
        drops[i] = y * size > window.innerHeight && Math.random() > 0.975 ? 0 : y + 1;
      });
      frame += 1;
      if (frame < 360) raf = window.requestAnimationFrame(draw);
      else onDone();
    };

    if (reduce) {
      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = `rgb(${phosphor})`;
      ctx.font = "16px monospace";
      ctx.fillText("Wake up, guest... (motion reduced — press any key)", 24, 48);
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    // Ignore the keystroke/tap that launched the effect (it may still be propagating).
    const armedAt = Date.now();
    const exit = () => {
      if (Date.now() - armedAt > 300) onDone();
    };
    window.addEventListener("keydown", exit);
    window.addEventListener("pointerdown", exit);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", exit);
      window.removeEventListener("pointerdown", exit);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-[105] h-full w-full bg-[#05060a]" />;
}

/* ------------------------------------------------------------------------ */
/* Toasts                                                                   */
/* ------------------------------------------------------------------------ */

export type Toast = { id: number; message: string };

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed right-4 z-[95] flex font-mono flex-col items-end gap-2 [bottom:calc(var(--dock-h)+var(--safe-bottom)+12px)] lg:[bottom:calc(var(--taskbar-h)+12px)]"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="fade-in max-w-[calc(100vw-32px)] border border-retro-green/50 bg-[#0d1117] px-4 py-2 text-[12px] text-retro-text shadow-retro">
          <span className="mr-2 text-retro-green">›</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Footer — the OS is still running                                         */
/* ------------------------------------------------------------------------ */

const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE;

function formatBuildDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

export function OsFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-retro-text/15 bg-black/25 px-4 py-4 text-[11px] text-retro-text/70 sm:px-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:flex-wrap sm:items-center">
          <div className="col-span-2 flex items-center gap-2 font-pixel text-[15px] text-retro-text sm:col-span-1">PRIYANSHU OS v2.0</div>
          <div className="flex items-center gap-2">
            <dt className="text-retro-text/55">STATUS</dt>
            <dd className="flex items-center gap-1.5 text-retro-green">
              <span className="status-led" aria-hidden /> ONLINE
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-retro-text/55">BUILT WITH</dt>
            <dd>Next.js · React · TypeScript</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-retro-text/55">LAST UPDATED</dt>
            <dd>
              <time dateTime={buildDate}>{formatBuildDate(buildDate)}</time>
            </dd>
          </div>
        </dl>
        <nav aria-label="Profiles" className="flex gap-2">
          <a href={profile.github} target="_blank" rel="noreferrer" className="os-btn h-9 px-3" aria-label="GitHub (opens in new tab)">
            <Github className="size-3.5" /> <span className="hidden sm:inline">GitHub</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="os-btn h-9 px-3" aria-label="LinkedIn (opens in new tab)">
            <Linkedin className="size-3.5" /> <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <a href={`mailto:${profile.email}`} className="os-btn h-9 px-3" aria-label="Email Priyanshu">
            <Mail className="size-3.5" /> <span className="hidden sm:inline">Email</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}

"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { complete, quickCommands, runCommand, type TermLine } from "@/lib/terminal";
import { playSfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";
import { useOs } from "@/components/os/os-context";

type Entry = { id: number; line: TermLine; delay: number };

const WELCOME = "Welcome to Priyanshu OS. Type `help` to explore, or tap a command below.";
const PROMPT = "guest@priyanshu-os:~$";

const lineClass: Record<Exclude<TermLine["kind"], "links">, string> = {
  in: "text-retro-text",
  out: "text-retro-text/85",
  dim: "text-retro-text/60",
  accent: "text-retro-green",
  warn: "text-retro-amber",
  err: "text-[#ff8a80]",
  pre: "text-retro-amber whitespace-pre leading-tight",
};

type TerminalProps = {
  variant?: "inline" | "window";
  autoFocus?: boolean;
  onExit?: () => void;
  className?: string;
};

export function Terminal({ variant = "inline", autoFocus = false, onExit, className }: TerminalProps) {
  const os = useOs();
  const inputId = useId();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typed, setTyped] = useState(0);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Type the welcome line once (instant for reduced motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(WELCOME.length);
      return;
    }
    const timer = window.setInterval(() => {
      setTyped((count) => {
        if (count >= WELCOME.length) {
          window.clearInterval(timer);
          return count;
        }
        return count + 2;
      });
    }, 16);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (autoFocus && window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, typed]);

  const push = useCallback((lines: TermLine[]) => {
    setEntries((prev) => [...prev, ...lines.map((line, index) => ({ id: ++idRef.current, line, delay: Math.min(index * 16, 240) }))]);
  }, []);

  const execute = useCallback(
    (raw: string) => {
      const command = raw.trim();
      const echo: TermLine = { kind: "in", text: `${PROMPT} ${command}` };
      if (!command) {
        push([echo]);
        return;
      }
      const nextHistory = [...history, command].slice(-50);
      setHistory(nextHistory);
      setCursor(null);

      const result = runCommand(command, { history: nextHistory, startedAt: os.startedAt, inWindow: variant === "window" });
      playSfx(result.lines.some((l) => l.kind === "err") ? "error" : "click");

      if (result.clear) {
        setEntries([]);
      } else {
        push([echo, ...result.lines]);
      }
      result.actions?.forEach((action) => os.run(action));
      if (result.exit) onExit?.();
    },
    [history, onExit, os, push, variant],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      execute(value);
      setValue("");
      return;
    }
    if (event.key === "ArrowUp") {
      if (!history.length) return;
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
      return;
    }
    if (event.key === "ArrowDown") {
      if (cursor === null) return;
      event.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
      return;
    }
    if (event.key === "Tab" && value.trim()) {
      const completion = complete(value);
      if (completion) {
        event.preventDefault();
        setValue(completion);
      }
      return;
    }
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
      return;
    }
    if (event.key === "Escape") {
      if (variant === "window") onExit?.();
      else inputRef.current?.blur();
    }
  };

  const focusInput = () => {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={cn("flex min-h-0 flex-col bg-[#06090d] font-mono text-[13px] leading-6", className)}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- convenience: clicking output focuses the input */}
      <div ref={scrollRef} onClick={focusInput} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-3">
        <p className="text-retro-green">
          {WELCOME.slice(0, typed)}
          {typed < WELCOME.length ? <span aria-hidden className="boot-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-retro-green" /> : null}
        </p>
        <div role="log" aria-live="polite" aria-label="Terminal output" className="mt-1">
          {entries.map(({ id, line, delay }) => (
            <TerminalLine key={id} line={line} delay={delay} onAction={(action) => os.run(action)} />
          ))}
        </div>
        <div className="flex items-center gap-2 pb-3">
          <label htmlFor={inputId} className="shrink-0 text-retro-text/60">
            <span className="hidden sm:inline">{PROMPT}</span>
            <span className="sm:hidden">~$</span>
            <span className="sr-only"> terminal command</span>
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent text-base text-retro-text caret-retro-green outline-none placeholder:text-retro-text/40 lg:text-[13px]"
            placeholder={entries.length ? "" : "type a command…"}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            aria-describedby={`${inputId}-hint`}
          />
          <span id={`${inputId}-hint`} className="sr-only">
            Type help and press Enter. Up and down arrows browse history, Tab completes.
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-retro-text/15 bg-black/40 px-3 py-2 [scrollbar-width:none]" aria-label="Quick commands">
        {quickCommands.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => execute(command)}
            className="os-btn h-8 shrink-0 px-3 text-[12px] text-retro-text/85 sm:h-7 sm:px-2 sm:text-[11px]"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}

function TerminalLine({ line, delay, onAction }: { line: TermLine; delay: number; onAction: (action: Extract<TermLine, { kind: "links" }>["links"][number]["action"]) => void }) {
  if (line.kind === "links") {
    return (
      <div className="term-line my-1 flex flex-wrap gap-2" style={{ animationDelay: `${delay}ms` }}>
        {line.links.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAction(link.action);
            }}
            className="border border-retro-green/50 bg-retro-green/10 px-2 text-[12px] leading-6 text-retro-green transition-colors hover:bg-retro-green/20"
          >
            [ {link.label} ]
          </button>
        ))}
      </div>
    );
  }
  return (
    <p className={cn("term-line whitespace-pre-wrap break-words", lineClass[line.kind])} style={{ animationDelay: `${delay}ms` }}>
      {line.text}
    </p>
  );
}

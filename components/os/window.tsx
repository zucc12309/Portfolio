import type { HTMLAttributes, ReactNode } from "react";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type WindowControls = {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  maximized?: boolean;
  closeLabel?: string;
};

type OsWindowProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  controls?: WindowControls;
  /** Spread onto the title bar (drag handlers, double-click to maximise). */
  titleBarProps?: HTMLAttributes<HTMLDivElement>;
  status?: ReactNode;
  as?: "section" | "div";
} & Omit<HTMLAttributes<HTMLElement>, "title">;

export function OsWindow({ title, icon, children, className, bodyClassName, controls, titleBarProps, status, as: Tag = "section", ...rest }: OsWindowProps) {
  return (
    <Tag className={cn("os-window", className)} aria-label={rest["aria-label"] ?? title} {...rest}>
      <div {...titleBarProps} className={cn("os-titlebar", titleBarProps?.className)}>
        {icon ? <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span> : null}
        <span className="os-title">{title}</span>
        <span aria-hidden className="os-titlebar-stripes" />
        <WindowControlButtons controls={controls} />
      </div>
      <div className={cn("flex min-h-0 flex-1 flex-col", bodyClassName)}>{children}</div>
      {status ? (
        <div className="flex h-7 shrink-0 items-center gap-4 overflow-hidden border-t border-retro-text/15 bg-black/30 px-3 text-[11px] text-retro-text/65">{status}</div>
      ) : null}
    </Tag>
  );
}

function WindowControlButtons({ controls }: { controls?: WindowControls }) {
  // Windows without behaviour get no buttons — decorative controls that do nothing feel broken.
  if (!controls || (!controls.onClose && !controls.onMinimize && !controls.onMaximize)) return null;

  return (
    <span className="flex items-center gap-1">
      {controls.onMinimize ? (
        <button type="button" className="os-control" data-ctl="min" onClick={controls.onMinimize} aria-label="Minimize window" data-tip="Minimize" data-tip-pos="bottom">
          <Minus className="size-3" />
        </button>
      ) : null}
      {controls.onMaximize ? (
        <button
          type="button"
          className="os-control"
          data-ctl="max"
          onClick={controls.onMaximize}
          aria-label={controls.maximized ? "Restore window" : "Maximize window"}
          aria-pressed={controls.maximized}
          data-tip={controls.maximized ? "Restore" : "Maximize"}
          data-tip-pos="bottom"
        >
          {controls.maximized ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
        </button>
      ) : null}
      {controls.onClose ? (
        <button
          type="button"
          className="os-control"
          data-variant="close"
          onClick={controls.onClose}
          aria-label={controls.closeLabel ?? "Close window"}
          data-tip={controls.closeLabel ?? "Close"}
          data-tip-pos="bottom-end"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  );
}

export function Prompt({ command, className }: { command: string; className?: string }) {
  return (
    <p className={cn("retro-terminal text-sm", className)}>
      <span className="text-retro-text/55">guest@priyanshu-os:~$</span> {command}
    </p>
  );
}

/** Section kicker in the "[01] TITLE" style used across windows. */
export function Kicker({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("os-label flex items-center gap-2", className)}>
      {index ? <span className="text-retro-text/55">[{index}]</span> : null}
      {children}
    </p>
  );
}

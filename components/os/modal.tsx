"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";
import { OsWindow } from "@/components/os/window";
import { cn } from "@/lib/utils";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Traps Tab inside `ref`, closes on Escape, restores focus to the opener on unmount. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, onClose: () => void, initialFocus?: RefObject<HTMLElement | null>) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    (initialFocus?.current ?? node)?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, initialFocus]);
}

type ModalProps = {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  labelledBy?: string;
  initialFocus?: RefObject<HTMLElement | null>;
  status?: ReactNode;
};

export function Modal({ title, icon, onClose, children, className, bodyClassName, initialFocus, status }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, onClose, initialFocus);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="os-modal-backdrop font-mono text-[13px] text-retro-text"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={cn("os-modal flex flex-col outline-none", className)}>
        <OsWindow as="div" title={title} icon={icon} controls={{ onClose }} className="min-h-0 w-full flex-1" bodyClassName={cn("overflow-y-auto overscroll-contain", bodyClassName)} status={status}>
          {children}
        </OsWindow>
      </div>
    </div>
  );
}

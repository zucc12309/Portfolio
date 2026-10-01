"use client";

import { createContext, useContext } from "react";
import type { OsAction, ViewId } from "@/lib/os";

export type OsSettings = {
  crt: boolean;
  sound: boolean;
  phosphor: "green" | "amber";
};

export type OsApi = {
  view: ViewId;
  settings: OsSettings;
  recruiterMode: boolean;
  startedAt: number;
  navigate: (view: ViewId, slug?: string) => void;
  run: (action: OsAction) => void;
  toast: (message: string) => void;
  openQuickLook: (slug: string) => void;
  closeQuickLook: () => void;
};

export const OsContext = createContext<OsApi | null>(null);

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used inside <Desktop>");
  return ctx;
}

import type { PixelIconName } from "@/components/os/pixel-icon";

export type ViewId = "home" | "about" | "experience" | "projects" | "lab" | "skills" | "github" | "contact";

export type AppDef = {
  id: ViewId;
  hash: string;
  label: string;
  /** Window title, styled as a filename */
  title: string;
  icon: PixelIconName;
  command: string;
  tip: string;
};

export const apps: AppDef[] = [
  { id: "home", hash: "top", label: "Home", title: "WELCOME.EXE", icon: "computer", command: "boot --session guest", tip: "Start here" },
  { id: "projects", hash: "projects", label: "Projects", title: "C:\\PROJECTS", icon: "folder", command: "ls ~/projects", tip: "8 products, 3 featured" },
  { id: "experience", hash: "experience", label: "Work History", title: "WORK_HISTORY.EXE", icon: "briefcase", command: "work_history --company digit", tip: "Digit Life Insurance" },
  { id: "about", hash: "about", label: "About Me", title: "PRIYANSHU_PATEL.EXE", icon: "computer", command: "sysinfo --user priyanshu", tip: "System properties" },
  { id: "lab", hash: "lab", label: "Lab", title: "C:\\EXPERIMENTS", icon: "flask", command: "tree ~/experiments", tip: "Prototypes & experiments" },
  { id: "skills", hash: "skills", label: "Skills", title: "SKILLS.SYS", icon: "gear", command: "skills --list", tip: "Skills & tools" },
  { id: "github", hash: "github", label: "GitHub", title: "GITHUB.EXE", icon: "branch", command: "gh repo list --public", tip: "Open-source repos" },
  { id: "contact", hash: "contact", label: "Contact", title: "CONTACT.EXE", icon: "mail", command: "contact --open", tip: "Get in touch" },
];

export function getApp(id: ViewId) {
  return apps.find((app) => app.id === id) ?? apps[0];
}

/** Parses "#projects/memory-router" → { view: "projects", slug: "memory-router" } */
export function parseHash(hash: string): { view: ViewId; slug?: string } {
  const [head, slug] = hash.replace(/^#/, "").split("/");
  const app = apps.find((item) => item.hash === head || item.id === head);
  return { view: app?.id ?? "home", slug: app?.id === "projects" && slug ? slug : undefined };
}

export type OsAction =
  | { type: "view"; view: ViewId; slug?: string }
  | { type: "url"; href: string; newTab?: boolean }
  | { type: "terminal" }
  | { type: "palette" }
  | { type: "bsod" }
  | { type: "matrix" }
  | { type: "phosphor"; value: "green" | "amber" }
  | { type: "sound"; on: boolean }
  | { type: "crt"; on: boolean }
  | { type: "recruiter" }
  | { type: "copy"; text: string; message: string }
  | { type: "reboot" };

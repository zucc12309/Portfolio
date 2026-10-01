import { experience, profile, skillCategories, systemInfo, labTree } from "@/lib/content";
import { findProject, projects } from "@/lib/projects";
import type { OsAction, ViewId } from "@/lib/os";

export type TermLine =
  | { kind: "in" | "out" | "dim" | "accent" | "warn" | "err" | "pre"; text: string }
  | { kind: "links"; links: { label: string; action: OsAction }[] };

export type CommandResult = {
  lines: TermLine[];
  actions?: OsAction[];
  clear?: boolean;
  exit?: boolean;
};

export type CommandContext = {
  history: string[];
  startedAt: number;
  inWindow: boolean;
};

const out = (text: string): TermLine => ({ kind: "out", text });
const dim = (text: string): TermLine => ({ kind: "dim", text });
const accent = (text: string): TermLine => ({ kind: "accent", text });
const err = (text: string): TermLine => ({ kind: "err", text });
const links = (...items: { label: string; action: OsAction }[]): TermLine => ({ kind: "links", links: items });
const view = (v: ViewId, slug?: string): OsAction => ({ type: "view", view: v, slug });

const pad = (value: string, width: number) => value.padEnd(width, " ");

/** Public commands shown in help + used for tab completion. Hidden ones are not listed. */
export const commandNames = [
  "help",
  "about",
  "projects",
  "experience",
  "skills",
  "lab",
  "contact",
  "resume",
  "github",
  "linkedin",
  "open",
  "ls",
  "cd",
  "whoami",
  "date",
  "uptime",
  "history",
  "theme",
  "sound",
  "clear",
  "exit",
];

export const quickCommands = ["help", "about", "projects", "experience", "skills", "contact"];

const dirs: Record<string, ViewId> = {
  "~": "home",
  "/": "home",
  "..": "home",
  home: "home",
  projects: "projects",
  "projects/": "projects",
  experience: "experience",
  work: "experience",
  about: "about",
  lab: "lab",
  experiments: "lab",
  "experiments/": "lab",
  skills: "skills",
  github: "github",
  contact: "contact",
};

export function complete(input: string): string | null {
  const value = input.trimStart();
  if (!value) return null;
  const parts = value.split(/\s+/);
  if (parts.length === 1) {
    const match = commandNames.filter((name) => name.startsWith(parts[0].toLowerCase()));
    return match.length === 1 ? `${match[0]} ` : null;
  }
  if (parts[0] === "open" && parts.length === 2) {
    const match = projects.filter((p) => p.slug.startsWith(parts[1].toLowerCase()));
    return match.length === 1 ? `open ${match[0].slug}` : null;
  }
  if (parts[0] === "cd" && parts.length === 2) {
    const match = Object.keys(dirs).filter((d) => /^[a-z]/.test(d) && !d.endsWith("/") && d.startsWith(parts[1].toLowerCase()));
    return match.length === 1 ? `cd ${match[0]}` : null;
  }
  return null;
}

function formatUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ${s % 60}s`;
}

export function runCommand(raw: string, ctx: CommandContext): CommandResult {
  const input = raw.trim();
  const lower = input.toLowerCase().replace(/\s+/g, " ");
  const [cmd, ...args] = lower.split(" ");
  const arg = args.join(" ");

  if (!cmd) return { lines: [] };

  // ---- Hidden / easter-egg commands -------------------------------------
  if (lower === "sudo hire priyanshu" || lower === "sudo hire") {
    return {
      lines: [
        dim("[sudo] password for guest: ********"),
        out("Verifying credentials..."),
        accent("  ✓ ₹1,500+ Cr premium portfolio supported"),
        accent("  ✓ 8 products built across AI, commerce and fintech"),
        accent("  ✓ Tech Titan Award"),
        out("Permission granted. Opening a secure channel to priyanshu..."),
        links({ label: "compose email", action: { type: "url", href: `mailto:${profile.email}?subject=${encodeURIComponent("Let's work together")}` } }),
      ],
    };
  }
  if (cmd === "sudo") {
    return { lines: [err("guest is not in the sudoers file. This incident will be reported."), dim("hint: there is exactly one sudo command that works here.")] };
  }
  if (cmd === "matrix") {
    return { lines: [accent("Wake up, guest..."), dim("(press any key or tap to exit)")], actions: [{ type: "matrix" }] };
  }
  if (cmd === "coffee" || lower === "make coffee") {
    return {
      lines: [
        { kind: "pre", text: "      ( (\n       ) )\n    ........\n    |      |]\n    \\      /\n     `----'" },
        out("Brewing... done. Productivity +12%. Bug count −3."),
      ],
    };
  }
  if (cmd === "secret" || cmd === "secrets") {
    return {
      lines: [
        accent("There are a few secrets in this OS:"),
        out("  1. a terminal command that grants elevated hiring privileges"),
        out("  2. a 30-year-old cheat code — ↑ ↑ ↓ ↓ ← → ← → B A"),
        out("  3. the system status light in the tray is... sensitive to clicks"),
        out("  4. something printed in your browser's developer console"),
        dim("Also try: matrix · coffee · skills --verbose"),
      ],
    };
  }
  if (cmd === "crash" || cmd === "bsod" || lower.startsWith("rm -rf")) {
    return { lines: [err("Fatal exception 0E has occurred...")], actions: [{ type: "bsod" }] };
  }
  if (cmd === "hello" || cmd === "hi" || cmd === "hey") {
    return { lines: [out("Hello! 👋 Type `help` to see what I can do, or `about` to meet Priyanshu.")] };
  }
  if (cmd === "pwd") return { lines: [out("/home/guest")] };
  if (cmd === "echo") return { lines: [out(input.slice(5))] };

  // ---- Public commands ---------------------------------------------------
  switch (cmd) {
    case "help":
    case "?":
    case "man":
      return {
        lines: [
          accent("PRIYANSHU OS — available commands"),
          out(`  ${pad("about", 22)}who Priyanshu is`),
          out(`  ${pad("projects", 22)}list products  (open <name>)`),
          out(`  ${pad("experience", 22)}work history at Digit Life Insurance`),
          out(`  ${pad("skills [--verbose]", 22)}skills and tools`),
          out(`  ${pad("lab", 22)}experiments and prototypes`),
          out(`  ${pad("contact · resume", 22)}get in touch / download CV`),
          out(`  ${pad("github · linkedin", 22)}open profiles`),
          out(`  ${pad("ls · cd <dir>", 22)}browse the file system`),
          out(`  ${pad("whoami · date · uptime", 22)}system info`),
          out(`  ${pad("theme green|amber", 22)}switch phosphor colour`),
          out(`  ${pad("sound on|off", 22)}UI sounds`),
          out(`  ${pad("history · clear", 22)}terminal housekeeping`),
          dim("Tab completes · ↑/↓ history · Ctrl/⌘ + K opens the command palette."),
          dim("Some commands are not listed. Try `secret`."),
        ],
      };

    case "about":
    case "whois":
      return {
        lines: [
          accent(`${profile.name} — ${profile.trajectory}`),
          out(`${profile.role} @ ${profile.company}, ${profile.location}.`),
          out(profile.summary),
          out("Building: Memory Router, LifePilot, RideCompare and more."),
          links({ label: "open PRIYANSHU_PATEL.EXE", action: view("about") }),
        ],
      };

    case "whoami":
      return {
        lines: [
          out("guest"),
          dim("…though statistically you're a recruiter, a founder, or a fellow builder. Welcome either way."),
          dim(`The owner of this machine is ${profile.handle} — ${profile.trajectory.toLowerCase()}.`),
        ],
      };

    case "projects":
    case "work-samples":
      return {
        lines: [
          accent(`${projects.length} products in ~/projects  (★ = featured)`),
          ...projects.map((p) => out(`  ${p.featured ? "★" : " "} ${pad(p.slug, 26)}${p.tagline.length > 64 ? `${p.tagline.slice(0, 62)}…` : p.tagline}`)),
          dim("Run `open <name>` for the full case, e.g. `open memory-router`."),
          links({ label: "open C:\\PROJECTS", action: view("projects") }),
        ],
      };

    case "experience":
    case "work":
      return {
        lines: [
          accent(`${experience.company} — ${experience.role}`),
          dim(`${experience.period} · ${experience.location} · ${experience.scope}`),
          ...experience.metrics.map((m) => out(`  ${pad(m.value, 12)}${m.label}`)),
          links({ label: "open WORK_HISTORY.EXE", action: view("experience") }),
        ],
      };

    case "skills": {
      const verbose = args.includes("--verbose") || args.includes("-v");
      if (verbose) {
        return {
          lines: [
            accent("skills --verbose  ·  loading full manifest"),
            ...skillCategories.flatMap((c) => [out(`[${c.title}]`), dim(`  ${c.skills.join(" · ")}`)]),
            out("[Installed components]"),
            ...systemInfo.stack.map((s) => dim(`  ${pad(s.group, 12)}${s.items.join(", ")}`)),
            accent("All modules loaded. 0 errors, 0 warnings, 1 strong opinion about API error handling."),
          ],
        };
      }
      return {
        lines: [
          ...skillCategories.map((c) => out(`${pad(c.title, 20)}${c.skills.slice(0, 4).join(" · ")}`)),
          dim("Try `skills --verbose` for the full manifest."),
          links({ label: "open SKILLS.SYS", action: view("skills") }),
        ],
      };
    }

    case "lab":
    case "experiments":
      return {
        lines: [
          accent("~/experiments"),
          ...labTree.map((node) => out(`  ├── ${pad(node.name, 18)}${node.children?.length ?? 0} items`)),
          links({ label: "open C:\\EXPERIMENTS", action: view("lab") }),
        ],
      };

    case "contact":
    case "email":
      return {
        lines: [
          out(`email     ${profile.email}`),
          out(`linkedin  linkedin.com/in/priyanshupatel`),
          out(`github    github.com/zucc12309`),
          links(
            { label: "compose email", action: { type: "url", href: `mailto:${profile.email}` } },
            { label: "copy email", action: { type: "copy", text: profile.email, message: "Email copied to clipboard" } },
            { label: "open CONTACT.EXE", action: view("contact") },
          ),
        ],
      };

    case "resume":
    case "cv":
      return { lines: [out("Opening resume (PDF) in a new tab...")], actions: [{ type: "url", href: profile.resume, newTab: true }] };

    case "github":
      return { lines: [out("Opening github.com/zucc12309 ...")], actions: [{ type: "url", href: profile.github, newTab: true }] };

    case "linkedin":
      return { lines: [out("Opening LinkedIn ...")], actions: [{ type: "url", href: profile.linkedin, newTab: true }] };

    case "open":
    case "run": {
      if (!arg) return { lines: [err("usage: open <project>"), dim("Try `ls projects`.")] };
      if (dirs[arg]) return { lines: [out(`Opening ${arg} ...`)], actions: [view(dirs[arg])] };
      const project = findProject(arg);
      if (!project) return { lines: [err(`open: no such file: ${arg}`), dim("Try `ls projects`.")] };
      return {
        lines: [out(`Launching ${project.file} ...`)],
        actions: [{ type: "url", href: `/projects/${project.slug}` }],
      };
    }

    case "ls":
    case "dir": {
      if (arg.startsWith("projects")) {
        return { lines: projects.map((p) => out(`${p.slug}/`)) };
      }
      if (arg.startsWith("experiments") || arg.startsWith("lab")) {
        return { lines: labTree.map((node) => out(node.name)) };
      }
      return {
        lines: [
          out("about.txt     experience/   projects/     experiments/"),
          out("skills.sys    github.lnk    contact.exe   resume.pdf"),
        ],
      };
    }

    case "cd": {
      const target = dirs[arg || "~"];
      if (!target) return { lines: [err(`cd: no such directory: ${arg}`)] };
      return { lines: [dim(`→ ${arg || "~"}`)], actions: [view(target)] };
    }

    case "cat": {
      if (arg === "about.txt") return runCommand("about", ctx);
      if (arg === "resume.pdf") return { lines: [err("cat: resume.pdf: binary file — try `resume`")] };
      return { lines: [err(`cat: ${arg || "?"}: no such file`)] };
    }

    case "date":
      return { lines: [out(new Date().toString())] };

    case "uptime":
      return { lines: [out(`up ${formatUptime(Date.now() - ctx.startedAt)} · 1 user · load average: curious, focused, caffeinated`)] };

    case "history":
      return { lines: ctx.history.length ? ctx.history.map((h, i) => dim(`${String(i + 1).padStart(4, " ")}  ${h}`)) : [dim("(empty)")] };

    case "theme": {
      if (arg === "amber" || arg === "green") {
        return { lines: [out(`Phosphor set to ${arg}.`)], actions: [{ type: "phosphor", value: arg }] };
      }
      return { lines: [err("usage: theme green|amber")] };
    }

    case "sound": {
      if (arg === "on" || arg === "off") {
        return { lines: [out(`UI sounds ${arg}.`)], actions: [{ type: "sound", on: arg === "on" }] };
      }
      return { lines: [err("usage: sound on|off")] };
    }

    case "clear":
    case "cls":
      return { lines: [], clear: true };

    case "exit":
    case "quit":
      if (ctx.inWindow) return { lines: [], exit: true };
      return { lines: [dim("This terminal is part of the furniture. Try the window controls instead.")] };

    default:
      return { lines: [err(`command not found: ${cmd}`), dim("Type `help` for available commands.")] };
  }
}

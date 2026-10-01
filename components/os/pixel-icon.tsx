import { cn } from "@/lib/utils";

// 12×12 bitmaps. "#" = outline (currentColor), "o" = body fill, "x" = accent.
const bitmaps = {
  folder: [
    "............",
    ".####.......",
    "#oooo#......",
    "#ooooo######",
    "#oooooooooo#",
    "#oooooooooo#",
    "#oooooooooo#",
    "#oooooooooo#",
    "#oooooooooo#",
    "#oooooooooo#",
    "############",
    "............",
  ],
  terminal: [
    "############",
    "#oooooooooo#",
    "#oxoooooooo#",
    "#ooxooooooo#",
    "#oxooxxxooo#",
    "#oooooooooo#",
    "#oooooooooo#",
    "############",
    "....####....",
    "..########..",
    "............",
    "............",
  ],
  document: [
    ".#######....",
    ".#ooooo##...",
    ".#ooooo#o#..",
    ".#ooooo####.",
    ".#oxxxxxoo#.",
    ".#oooooooo#.",
    ".#oxxxxxxo#.",
    ".#oooooooo#.",
    ".#oxxxxxoo#.",
    ".#oooooooo#.",
    ".##########.",
    "............",
  ],
  computer: [
    ".##########.",
    ".#xxxxxxxx#.",
    ".#xoooooox#.",
    ".#xoooooox#.",
    ".#xxxxxxxx#.",
    ".##########.",
    "....####....",
    "############",
    "#oooooo#xx##",
    "############",
    "............",
    "............",
  ],
  briefcase: [
    "............",
    "....####....",
    "....#..#....",
    "############",
    "#oooooooooo#",
    "#oooooooooo#",
    "#ooooxxoooo#",
    "############",
    "#oooooooooo#",
    "#oooooooooo#",
    "############",
    "............",
  ],
  flask: [
    "...######...",
    "....#oo#....",
    "....#oo#....",
    "....#oo#....",
    "...#oooo#...",
    "..#oooooo#..",
    ".#xxxxxxxx#.",
    ".#xxoxxxox#.",
    "#xxxxxxoxxx#",
    "#xoxxxxxxxx#",
    "############",
    "............",
  ],
  mail: [
    "............",
    "############",
    "##oooooooo##",
    "#o#oooooo#o#",
    "#oo#oooo#oo#",
    "#ooo#xx#ooo#",
    "#oooo##oooo#",
    "#oooooooooo#",
    "############",
    "............",
    "............",
    "............",
  ],
  gear: [
    ".....##.....",
    "..#.####.#..",
    ".##########.",
    "..###oo###..",
    ".###oooo###.",
    "####oxxo####",
    "####oxxo####",
    ".###oooo###.",
    "..###oo###..",
    ".##########.",
    "..#.####.#..",
    ".....##.....",
  ],
  branch: [
    "..##....##..",
    ".#xx#..#xx#.",
    ".#xx#..#xx#.",
    "..##....##..",
    "..##....##..",
    "..##...##...",
    "..##..##....",
    "..#####.....",
    "..##........",
    ".#xx#.......",
    ".#xx#.......",
    "..##........",
  ],
} as const;

export type PixelIconName = keyof typeof bitmaps;

type Rect = { x: number; y: number; w: number; c: string };

function toRects(rows: readonly string[]): Rect[] {
  const rects: Rect[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < 12) {
      const c = row[x] ?? ".";
      let w = 1;
      while (x + w < 12 && row[x + w] === c) w += 1;
      if (c !== ".") rects.push({ x, y, w, c });
      x += w;
    }
  });
  return rects;
}

const cache = new Map<PixelIconName, Rect[]>();

const fills: Record<string, string> = {
  "#": "currentColor",
  o: "var(--pixel-fill, rgba(245,241,232,0.16))",
  x: "var(--pixel-accent, rgb(var(--phosphor)))",
};

export function PixelIcon({ name, className, title }: { name: PixelIconName; className?: string; title?: string }) {
  let rects = cache.get(name);
  if (!rects) {
    rects = toRects(bitmaps[name]);
    cache.set(name, rects);
  }

  return (
    <svg
      viewBox="0 0 12 12"
      className={cn("pixel-icon", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={fills[r.c]} />
      ))}
    </svg>
  );
}

/** Square app icon with a pixel monogram, used for projects. */
export function AppTile({ monogram, accent, size = "md" }: { monogram: string; accent: "cyan" | "mint" | "blue" | "amber"; size?: "sm" | "md" | "lg" }) {
  const accentClass = {
    cyan: "text-cyan border-cyan/50 bg-cyan/10",
    mint: "text-mint border-mint/50 bg-mint/10",
    blue: "text-blue border-blue/50 bg-blue/10",
    amber: "text-amber border-amber/50 bg-amber/10",
  }[accent];
  const sizeClass = { sm: "size-8 text-[15px]", md: "size-10 text-lg", lg: "size-14 text-2xl" }[size];

  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center border font-pixel leading-none shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),2px_2px_0_rgba(0,0,0,0.55)]", accentClass, sizeClass)}
    >
      {monogram}
    </span>
  );
}

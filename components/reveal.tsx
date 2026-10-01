import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

/** Lightweight CSS fade-up (no JS animation runtime). Respects reduced motion via globals.css. */
export function Reveal({ children, className, delay = 0, style, ...props }: RevealProps) {
  return (
    <div className={cn("reveal", className)} style={{ animationDelay: `${Math.round(delay * 1000)}ms`, ...style }} {...props}>
      {children}
    </div>
  );
}

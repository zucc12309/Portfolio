/** Static desktop wallpaper: faint grid + soft corner light. No runtime animation. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0B0F14]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.014)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(169,112,255,0.06),transparent_32%),radial-gradient(circle_at_85%_90%,rgb(var(--phosphor)/0.05),transparent_36%)]" />
    </div>
  );
}

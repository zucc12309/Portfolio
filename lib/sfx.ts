// Tiny synthesized UI sounds. Off by default; nothing is downloaded.
// Call `setSoundEnabled(true)` from a user gesture, then `playSfx(name)` anywhere.

export type SfxName = "click" | "open" | "close" | "error" | "boot" | "toggle";

const tones: Record<SfxName, { freq: number[]; dur: number; type: OscillatorType }> = {
  click: { freq: [880], dur: 0.03, type: "square" },
  toggle: { freq: [660, 990], dur: 0.04, type: "square" },
  open: { freq: [440, 660], dur: 0.05, type: "triangle" },
  close: { freq: [660, 440], dur: 0.05, type: "triangle" },
  error: { freq: [220, 160], dur: 0.09, type: "sawtooth" },
  boot: { freq: [330, 495, 660], dur: 0.08, type: "triangle" },
};

let enabled = false;
let ctx: AudioContext | null = null;

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function playSfx(name: SfxName) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    ctx ??= new AudioCtor();
    if (ctx.state === "suspended") void ctx.resume();
    const { freq, dur, type } = tones[name];
    const start = ctx.currentTime;
    freq.forEach((f, index) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      const t = start + index * dur;
      osc.type = type;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    });
  } catch {
    // Audio is a nicety; ignore failures.
  }
}

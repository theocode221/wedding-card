type WebAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const MUTE_KEY = "egg_reveal_sfx_muted_v1";

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;
let loadedMute = false;

function loadMuted() {
  if (loadedMute) return;
  loadedMute = true;
  try {
    const v = window.localStorage.getItem(MUTE_KEY);
    isMuted = v === "1";
  } catch {
    isMuted = false;
  }
}

function saveMuted() {
  try {
    window.localStorage.setItem(MUTE_KEY, isMuted ? "1" : "0");
  } catch {
    /* ignore storage failure */
  }
}

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  loadMuted();
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = isMuted ? 0 : 0.9;
  masterGain.connect(audioCtx.destination);
  return audioCtx;
}

function withLiveAudio(run: (ctx: AudioContext, out: GainNode) => void) {
  const ctx = ensureContext();
  if (!ctx || !masterGain) return;
  if (ctx.state !== "running") return;
  run(ctx, masterGain);
}

function playTone(opts: {
  type?: OscillatorType;
  fromHz: number;
  toHz?: number;
  gain?: number;
  durMs: number;
  attackMs?: number;
  releaseMs?: number;
}) {
  withLiveAudio((ctx, out) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();

    osc.type = opts.type ?? "triangle";
    osc.frequency.setValueAtTime(opts.fromHz, now);
    if (opts.toHz) osc.frequency.exponentialRampToValueAtTime(opts.toHz, now + opts.durMs / 1000);

    const max = opts.gain ?? 0.12;
    const a = (opts.attackMs ?? 8) / 1000;
    const r = (opts.releaseMs ?? 110) / 1000;
    const end = now + opts.durMs / 1000;

    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(max, now + a);
    amp.gain.exponentialRampToValueAtTime(0.0001, end + r);

    osc.connect(amp);
    amp.connect(out);
    osc.start(now);
    osc.stop(end + r + 0.01);
  });
}

function playNoise(opts: { durMs: number; gain?: number; highpassHz?: number }) {
  withLiveAudio((ctx, out) => {
    const now = ctx.currentTime;
    const dur = opts.durMs / 1000;
    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = opts.highpassHz ?? 280;

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(opts.gain ?? 0.16, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.04);

    src.connect(hp);
    hp.connect(amp);
    amp.connect(out);
    src.start(now);
    src.stop(now + dur + 0.05);
  });
}

export function primeEggRevealSfx() {
  const ctx = ensureContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
}

export function getEggRevealSfxMuted(): boolean {
  if (typeof window !== "undefined") loadMuted();
  return isMuted;
}

export function setEggRevealSfxMuted(next: boolean) {
  isMuted = next;
  const ctx = ensureContext();
  if (ctx && masterGain) masterGain.gain.value = isMuted ? 0 : 0.9;
  saveMuted();
}

export function toggleEggRevealSfxMuted(): boolean {
  const next = !getEggRevealSfxMuted();
  setEggRevealSfxMuted(next);
  return next;
}

export function eggCrackSfxTap(which: 1 | 2 | 3) {
  primeEggRevealSfx();
  if (which === 1) playTone({ fromHz: 280, toHz: 230, durMs: 80, gain: 0.08 });
  else if (which === 2) {
    playTone({ fromHz: 240, toHz: 190, durMs: 90, gain: 0.09 });
    window.setTimeout(() => playTone({ fromHz: 330, toHz: 260, durMs: 70, gain: 0.06 }), 36);
  } else {
    playTone({ fromHz: 210, toHz: 130, durMs: 130, gain: 0.1 });
    window.setTimeout(() => playNoise({ durMs: 80, gain: 0.12, highpassHz: 420 }), 42);
  }
}

export function revealCelebrationSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 360, toHz: 510, durMs: 130, gain: 0.08, type: "sine" });
  window.setTimeout(() => playTone({ fromHz: 510, toHz: 710, durMs: 140, gain: 0.08, type: "sine" }), 110);
  window.setTimeout(() => playTone({ fromHz: 710, toHz: 920, durMs: 160, gain: 0.08, type: "sine" }), 220);
}

export function revealCheerSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 520, toHz: 760, durMs: 90, gain: 0.08 });
  window.setTimeout(() => playTone({ fromHz: 760, toHz: 980, durMs: 110, gain: 0.08 }), 70);
}

export function revealUiTapSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 460, toHz: 380, durMs: 70, gain: 0.055, type: "square" });
}

export function gameCatchGoodSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 610, toHz: 820, durMs: 95, gain: 0.07, type: "triangle" });
}

export function gameBombSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 180, toHz: 85, durMs: 150, gain: 0.12, type: "sawtooth" });
  window.setTimeout(() => playNoise({ durMs: 120, gain: 0.18, highpassHz: 180 }), 40);
}

export function gameResultSfx(score: number) {
  primeEggRevealSfx();
  if (score >= 13) {
    playTone({ fromHz: 520, toHz: 780, durMs: 130, gain: 0.09, type: "sine" });
    window.setTimeout(() => playTone({ fromHz: 780, toHz: 1040, durMs: 160, gain: 0.095, type: "sine" }), 120);
    return;
  }
  if (score >= 6) {
    playTone({ fromHz: 430, toHz: 590, durMs: 130, gain: 0.08 });
    window.setTimeout(() => playTone({ fromHz: 590, toHz: 700, durMs: 130, gain: 0.075 }), 110);
    return;
  }
  playTone({ fromHz: 300, toHz: 220, durMs: 180, gain: 0.07, type: "triangle" });
}

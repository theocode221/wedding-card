type WebAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

/** Legacy mute flag — removed UI; clear so SFX stays on by default. */
const LEGACY_MUTE_KEY = "egg_reveal_sfx_muted_v1";

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let clearedLegacyMute = false;

function clearLegacyMutePreference() {
  if (clearedLegacyMute) return;
  clearedLegacyMute = true;
  try {
    window.localStorage.removeItem(LEGACY_MUTE_KEY);
  } catch {
    /* ignore */
  }
}

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  clearLegacyMutePreference();
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.82;
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

    osc.type = opts.type ?? "square";
    osc.frequency.setValueAtTime(opts.fromHz, now);
    if (opts.toHz) osc.frequency.exponentialRampToValueAtTime(opts.toHz, now + opts.durMs / 1000);

    const max = opts.gain ?? 0.1;
    const a = (opts.attackMs ?? 2) / 1000;
    const r = (opts.releaseMs ?? 70) / 1000;
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
    hp.frequency.value = opts.highpassHz ?? 320;

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(opts.gain ?? 0.14, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.03);

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

export function eggCrackSfxTap(which: 1 | 2 | 3) {
  primeEggRevealSfx();
  if (which === 1) {
    playTone({ fromHz: 340, toHz: 210, durMs: 58, gain: 0.07, type: "square", attackMs: 1, releaseMs: 45 });
  } else if (which === 2) {
    playTone({ fromHz: 300, toHz: 200, durMs: 62, gain: 0.075, type: "triangle", attackMs: 1, releaseMs: 48 });
    window.setTimeout(
      () => playTone({ fromHz: 420, toHz: 280, durMs: 52, gain: 0.055, type: "square", attackMs: 1, releaseMs: 40 }),
      28,
    );
  } else {
    playTone({ fromHz: 200, toHz: 95, durMs: 120, gain: 0.095, type: "sawtooth", attackMs: 2, releaseMs: 85 });
    window.setTimeout(() => playNoise({ durMs: 65, gain: 0.11, highpassHz: 480 }), 35);
  }
}

export function revealCelebrationSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 440, toHz: 660, durMs: 95, gain: 0.075, type: "square", attackMs: 1, releaseMs: 55 });
  window.setTimeout(
    () => playTone({ fromHz: 660, toHz: 880, durMs: 100, gain: 0.078, type: "square", attackMs: 1, releaseMs: 58 }),
    85,
  );
  window.setTimeout(
    () => playTone({ fromHz: 880, toHz: 1180, durMs: 120, gain: 0.072, type: "triangle", attackMs: 1, releaseMs: 70 }),
    175,
  );
}

export function revealCheerSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 620, toHz: 920, durMs: 72, gain: 0.07, type: "square", attackMs: 1, releaseMs: 48 });
  window.setTimeout(
    () => playTone({ fromHz: 780, toHz: 1100, durMs: 88, gain: 0.065, type: "triangle", attackMs: 1, releaseMs: 52 }),
    55,
  );
}

export function revealUiTapSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 720, toHz: 420, durMs: 42, gain: 0.045, type: "square", attackMs: 1, releaseMs: 32 });
}

export function gameCatchGoodSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 720, toHz: 980, durMs: 55, gain: 0.065, type: "square", attackMs: 1, releaseMs: 38 });
  window.setTimeout(
    () => playTone({ fromHz: 1180, toHz: 1560, durMs: 70, gain: 0.05, type: "triangle", attackMs: 1, releaseMs: 45 }),
    22,
  );
}

export function gameBombSfx() {
  primeEggRevealSfx();
  playTone({ fromHz: 160, toHz: 55, durMs: 140, gain: 0.11, type: "sawtooth", attackMs: 2, releaseMs: 90 });
  window.setTimeout(() => playNoise({ durMs: 95, gain: 0.15, highpassHz: 200 }), 28);
}

export function gameResultSfx(score: number) {
  primeEggRevealSfx();
  if (score >= 13) {
    playTone({ fromHz: 520, toHz: 780, durMs: 95, gain: 0.08, type: "square", attackMs: 1, releaseMs: 52 });
    window.setTimeout(
      () => playTone({ fromHz: 780, toHz: 1040, durMs: 110, gain: 0.082, type: "square", attackMs: 1, releaseMs: 58 }),
      95,
    );
    window.setTimeout(
      () => playTone({ fromHz: 1040, toHz: 1400, durMs: 130, gain: 0.075, type: "triangle", attackMs: 1, releaseMs: 65 }),
      195,
    );
    return;
  }
  if (score >= 6) {
    playTone({ fromHz: 400, toHz: 560, durMs: 100, gain: 0.072, type: "triangle", attackMs: 1, releaseMs: 52 });
    window.setTimeout(
      () => playTone({ fromHz: 560, toHz: 760, durMs: 110, gain: 0.07, type: "square", attackMs: 1, releaseMs: 55 }),
      95,
    );
    return;
  }
  playTone({ fromHz: 280, toHz: 180, durMs: 150, gain: 0.065, type: "triangle", attackMs: 2, releaseMs: 75 });
}

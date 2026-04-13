import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CongratulationCard } from "../components/CongratulationCard";
import { InteractiveButtons } from "../components/InteractiveButtons";
import { SenderForm } from "../components/SenderForm";
import { publicUrl } from "../lib/publicAsset";
import "../styles/congratulation.css";

/** Optional background music — place a file at `public/music/congratulation.mp3` */
const MUSIC_SRC = publicUrl("music/congratulation.mp3");

const MAIN_MESSAGE = `Bagaikan bulan dan bintang yang saling melengkapi,
Begitulah kalian dipertemukan dalam takdir Ilahi.
Semoga cinta yang disulam hari ini
Mekar hingga ke syurga yang abadi.`;

const EXTRA_VERSES = `Di hari yang penuh berkah ini,
Kami mengangkat doa supaya rumah tangga kalian
Dipenuhi rahmat, sabar, dan kasih yang tidak berbelah bahagi.

Selamat pengantin baru — semoga bahagia dunia akhirat.`;

const HERO_SUBTITLE = "Semoga ikatan kalian diberkati-Nya, hari ini dan selamanya.";

const TOAST_MS = 3200;

type FxParticle = {
  id: number;
  kind: "heart" | "sparkle";
  left: string;
  top?: string;
  delay: number;
  char?: string;
};

export function CongratulationCardPage() {
  const navigate = useNavigate();
  const toastId = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [senderName, setSenderName] = useState("");
  const [shortMessage, setShortMessage] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [decorOn, setDecorOn] = useState(false);
  const [particles, setParticles] = useState<FxParticle[]>([]);
  const particleId = useRef(0);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setToastVisible(true);
    window.setTimeout(() => {
      setToastVisible(false);
      window.setTimeout(() => setToast(null), 400);
    }, TOAST_MS);
  }, []);

  useEffect(() => {
    if (!musicOn) {
      audioRef.current?.pause();
      return;
    }
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.35;
    el.play().catch(() => {
      showToast("Muzik tidak dapat dimainkan — pastikan fail ada di /music/congratulation.mp3");
      setMusicOn(false);
    });
  }, [musicOn, showToast]);

  const spawnPrayerFx = useCallback(() => {
    const hearts = ["💗", "💕", "🤍", "✨"];
    const next: FxParticle[] = [];
    for (let i = 0; i < 14; i++) {
      particleId.current += 1;
      const isSparkle = i % 3 === 0;
      next.push({
        id: particleId.current,
        kind: isSparkle ? "sparkle" : "heart",
        left: `${8 + Math.random() * 84}%`,
        top: isSparkle ? `${20 + Math.random() * 50}%` : undefined,
        delay: Math.random() * 0.35,
        char: hearts[i % hearts.length],
      });
    }
    setParticles((p) => [...p, ...next]);
    window.setTimeout(() => {
      setParticles((p) => p.filter((x) => !next.some((n) => n.id === x.id)));
    }, 3000);
  }, []);

  const handleSendUcapan = () => {
    const payload = {
      sender: senderName.trim(),
      note: shortMessage.trim(),
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem("wedding_congrats_last", JSON.stringify(payload));
    } catch {
      /* ignore quota */
    }
    showToast(
      senderName.trim()
        ? `Ucapan tersimpan — terima kasih, ${senderName.trim().split(/\s+/)[0]}!`
        : "Ucapan anda telah direkodkan. Terima kasih!",
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link disalin!");
    } catch {
      showToast("Salin manual: " + url.slice(0, 48) + "…");
    }
  };

  const toggleReadMore = () => setReadMoreOpen((v) => !v);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="congrats-page">
      <div className="congrats-page__wash" aria-hidden />
      <div className="congrats-page__batik" aria-hidden />
      <div
        className={`congrats-page__decor-overlay ${decorOn ? "congrats-page__decor-overlay--on" : ""}`}
        aria-hidden
      />

      <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" />

      <div className="congrats-fx-layer" aria-hidden>
        {particles.map((p) =>
          p.kind === "heart" ? (
            <span
              key={p.id}
              className="congrats-heart"
              style={{ left: p.left, animationDelay: `${p.delay}s` }}
              role="presentation"
            >
              {p.char}
            </span>
          ) : (
            <span
              key={p.id}
              className="congrats-sparkle"
              style={{ left: p.left, top: p.top, animationDelay: `${p.delay}s` }}
            />
          ),
        )}
      </div>

      <div
        id={toastId}
        className={`congrats-toast ${toastVisible ? "congrats-toast--show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>

      <div className="congrats-page__inner">
        <button type="button" className="congrats-back" onClick={handleBack}>
          ← Kembali ke jemputan
        </button>

        <CongratulationCard
          title="Ucapan Istimewa Buat Pengantin"
          subtitle={HERO_SUBTITLE}
          mainMessage={MAIN_MESSAGE}
          showMoreVerses={readMoreOpen}
          extraVerses={EXTRA_VERSES}
        />

        <SenderForm
          senderName={senderName}
          shortMessage={shortMessage}
          onSenderNameChange={setSenderName}
          onShortMessageChange={setShortMessage}
        />

        <InteractiveButtons
          onSendUcapan={handleSendUcapan}
          onPrayer={spawnPrayerFx}
          onShare={handleShare}
          onToggleMusic={() => setMusicOn((m) => !m)}
          musicOn={musicOn}
          onToggleDecor={() => setDecorOn((d) => !d)}
          decorOn={decorOn}
          onReadMore={toggleReadMore}
          readMoreOpen={readMoreOpen}
        />
      </div>
    </div>
  );
}

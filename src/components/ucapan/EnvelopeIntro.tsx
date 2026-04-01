import { publicUrl } from "../../lib/publicAsset";

const CLOSE_SRC = publicUrl("assets/close-envelope.png");
const OPEN_SRC = publicUrl("assets/open-envelope.png");

export type EnvelopeIntroProps = {
  envelopeStarted: boolean;
  onBukaSurat: () => void;
};

export function EnvelopeIntro({ envelopeStarted, onBukaSurat }: EnvelopeIntroProps) {
  return (
    <div className="ucapan-envelope-intro">
      <h1 className="ucapan-envelope-intro__title">Selamat Pengantin Baru</h1>

      <div
        className={["ucapan-env-scene", envelopeStarted ? "ucapan-env-scene--revealed" : ""]
          .filter(Boolean)
          .join(" ")}
        aria-live="polite"
      >
        <div className="ucapan-env-scene__shadow" aria-hidden />
        <div className="ucapan-env-closed">
          <img
            className="ucapan-env-img ucapan-env-img--closed"
            src={CLOSE_SRC}
            alt=""
            width={640}
            height={480}
            decoding="async"
          />
        </div>
        <div className="ucapan-env-open">
          <img
            className="ucapan-env-img ucapan-env-img--open"
            src={OPEN_SRC}
            alt=""
            width={640}
            height={480}
            decoding="async"
          />
        </div>
      </div>

      {!envelopeStarted && (
        <button type="button" className="ucapan-buka-surat" onClick={onBukaSurat}>
          <span className="ucapan-buka-surat__text">Buka Surat</span>
        </button>
      )}
    </div>
  );
}

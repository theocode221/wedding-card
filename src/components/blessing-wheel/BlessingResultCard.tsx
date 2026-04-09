import { useEffect, useId, useMemo, useState } from "react";
import type { BlessingSegment } from "../../data/blessings";
import { blessingPortraitCandidateUrls } from "../../data/blessingWheelAssets";

/** Square portrait inset inside 100×100 viewBox (room for stroke). */
const F = { inset: 4, size: 92, rx: 10 };

export type BlessingResultCardProps = {
  blessing: BlessingSegment | null;
  visible: boolean;
  pulse: boolean;
};

export function BlessingResultCard({ blessing, visible, pulse }: BlessingResultCardProps) {
  const reactId = useId().replace(/:/g, "");
  const clipId = `br-portrait-${reactId}`;
  const [imgOk, setImgOk] = useState(true);
  const [urlIndex, setUrlIndex] = useState(0);

  const portraitUrls = useMemo(() => blessingPortraitCandidateUrls(blessing?.id ?? ""), [blessing?.id]);

  useEffect(() => {
    setImgOk(true);
    setUrlIndex(0);
  }, [blessing?.id]);

  if (!blessing) return null;

  const imgSrc = portraitUrls[urlIndex] ?? portraitUrls[0];

  const onImgError = () => {
    if (urlIndex + 1 < portraitUrls.length) {
      setUrlIndex((i) => i + 1);
    } else {
      setImgOk(false);
    }
  };

  const { inset, size, rx } = F;

  return (
    <div
      className={[
        "blessing-result",
        visible ? "blessing-result--visible" : "",
        pulse ? "blessing-result--pulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="region"
      aria-live="polite"
      aria-label="Keputusan roda doa"
    >
      <p className="blessing-result__eyebrow">Keberkatan terpilih</p>

      <div className="blessing-result__headRow">
        <h2 className="blessing-result__title">{blessing.label}</h2>
        <div className="blessing-result__portraitWrap">
          <svg className="blessing-result__portraitSvg" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <rect x={inset} y={inset} width={size} height={size} rx={rx} ry={rx} />
              </clipPath>
            </defs>

            <g clipPath={`url(#${clipId})`}>
              {imgOk ? (
                <image
                  key={imgSrc}
                  href={imgSrc}
                  x={inset}
                  y={inset}
                  width={size}
                  height={size}
                  preserveAspectRatio="xMidYMid slice"
                  onError={onImgError}
                />
              ) : (
                <rect
                  x={inset}
                  y={inset}
                  width={size}
                  height={size}
                  rx={rx}
                  ry={rx}
                  className="blessing-result__portraitFallback"
                />
              )}
            </g>

            <g pointerEvents="none">
              <rect
                x={inset}
                y={inset}
                width={size}
                height={size}
                rx={rx}
                ry={rx}
                fill="none"
                stroke="rgba(90, 60, 50, 0.45)"
                strokeWidth={2.25}
              />
              <rect
                x={inset}
                y={inset}
                width={size}
                height={size}
                rx={rx}
                ry={rx}
                fill="none"
                stroke="rgba(255, 248, 242, 0.9)"
                strokeWidth={1}
              />
            </g>
          </svg>
        </div>
      </div>
      <p className="blessing-result__body">{blessing.message}</p>
    </div>
  );
}

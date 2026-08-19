import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "../../data/portfolioCatalog";
import { PORTFOLIO_DEMO_COUPLE_LABEL } from "../../data/portfolioDemoNames";

const IFRAME_WIDTH = 390;
const IFRAME_HEIGHT = 844; /* used for frame size only */

type PortfolioLivePreviewProps = {
  item: PortfolioItem;
  src: string;
  playing: boolean;
};

function PortfolioPoster({ item }: { item: PortfolioItem }) {
  return (
    <div className="portfolio-poster">
      {item.previewImage ? (
        <img
          className="portfolio-card__img"
          src={item.previewImage}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="portfolio-card__swatch"
          style={{ background: item.previewGradient ?? "linear-gradient(145deg, #5c101c, #b0893a)" }}
          aria-hidden
        />
      )}
      {item.posterHasCopy ? null : (
        <div className="portfolio-poster__names">
          <p className="portfolio-poster__kicker">Demo</p>
          <p className="portfolio-poster__couple">{PORTFOLIO_DEMO_COUPLE_LABEL}</p>
        </div>
      )}
    </div>
  );
}

export function PortfolioLivePreview({ item, src, playing }: PortfolioLivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [frameReady, setFrameReady] = useState(false);
  const [playToken, setPlayToken] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateScale = () => {
      const width = node.getBoundingClientRect().width;
      if (width > 0) setScale(width / IFRAME_WIDTH);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) {
      setFrameReady(false);
      return;
    }
    setFrameReady(false);
    setPlayToken((token) => token + 1);
  }, [playing, src]);

  return (
    <div
      ref={containerRef}
      className={[
        "portfolio-live-preview",
        playing ? "portfolio-live-preview--playing" : "",
        frameReady ? "portfolio-live-preview--ready" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PortfolioPoster item={item} />
      {playing ? (
        <iframe
          key={`${src}-${playToken}`}
          className="portfolio-live-preview__frame"
          src={src}
          title={`Pratonton ${item.title}`}
          loading="eager"
          tabIndex={-1}
          onLoad={() => setFrameReady(true)}
          style={{
            width: IFRAME_WIDTH,
            height: IFRAME_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />
      ) : null}
    </div>
  );
}

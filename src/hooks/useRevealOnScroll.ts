import { useEffect, useRef, useState } from "react";

export type UseRevealOnScrollOptions = {
  /**
   * Positive bottom margin starts the reveal slightly before the block enters the viewport
   * (feels more responsive while scrolling).
   */
  rootMargin?: string;
  threshold?: number | number[];
};

const DEFAULT_ROOT_MARGIN = "0px 0px 14% 0px";
const DEFAULT_THRESHOLD = 0.06;

export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options?: UseRevealOnScrollOptions,
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  const rootMargin = options?.rootMargin ?? DEFAULT_ROOT_MARGIN;
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, threshold]);

  return { ref, visible };
}

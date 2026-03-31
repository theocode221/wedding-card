import { useEffect, useId, useMemo, useState } from "react";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import { scrollRevealClass, type ScrollRevealVariant } from "./ScrollReveal";
import { getRemaining, pad } from "./countdownUtils";

export type CountdownProps = {
  weddingDateTime: string;
  className?: string;
  subtitle?: string;
  scrollVariant?: ScrollRevealVariant;
};

export function Countdown({
  weddingDateTime,
  className = "",
  subtitle = "Until we say “I do”",
  scrollVariant = "up",
}: CountdownProps) {
  const titleId = useId();
  const target = useMemo(() => new Date(weddingDateTime), [weddingDateTime]);
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  const [tick, setTick] = useState(() => getRemaining(target, new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(getRemaining(target, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: tick.days },
    { label: "Hours", value: tick.hours },
    { label: "Minutes", value: tick.minutes },
    { label: "Seconds", value: tick.seconds },
  ];

  return (
    <section
      ref={ref}
      className={`shared-countdown ${scrollRevealClass(visible, scrollVariant)} ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <div className="shared-countdown__inner">
        <p className="shared-countdown__eyebrow">Counting down</p>
        <h2 className="shared-countdown__title" id={titleId}>
          {subtitle}
        </h2>
        {tick.done ? (
          <p className="shared-countdown__done">Today is the day — see you at the venue.</p>
        ) : (
          <div className="shared-countdown__grid" role="timer" aria-live="polite" aria-atomic="true">
            {units.map((u) => (
              <div key={u.label} className="shared-countdown__unit">
                <span className="shared-countdown__value">{u.label === "Days" ? u.value : pad(u.value)}</span>
                <span className="shared-countdown__unit-label">{u.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useId, useState } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import {
  CLASSIC_ATURCARA,
  type ClassicAturcaraIcon,
  type ClassicAturcaraItem,
} from "./classicInviteData";

function AturcaraIcon({ icon }: { icon: ClassicAturcaraIcon }) {
  switch (icon) {
    case "rings":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <circle cx="15.5" cy="21" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24.5" cy="21" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15.5 12.2 17.2 9.4h-3.4Z" fill="currentColor" />
          <path d="M24.5 12.2 26.2 9.4h-3.4Z" fill="currentColor" />
        </svg>
      );
    case "lantern":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <path
            d="M20 7v3.2M14.5 12.5h11M15.2 12.5c0 4.2-1.8 8.2-1.8 12.4 0 2.4 3 4.1 6.6 4.1s6.6-1.7 6.6-4.1c0-4.2-1.8-8.2-1.8-12.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M16.8 18.2h6.4M16.2 23.2h7.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="20" cy="33.2" r="1.3" fill="currentColor" />
        </svg>
      );
    case "couple":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <circle cx="14.5" cy="13.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8.2 28.8c.4-5.2 2.8-8.2 6.3-8.2s5.9 3 6.3 8.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="25.5" cy="13.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M19.2 28.8c.4-5.2 2.8-8.2 6.3-8.2s5.9 3 6.3 8.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <path
            d="M24.8 9.2a11.4 11.4 0 1 0 6 17.8 9.6 9.6 0 1 1-6-17.8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function Step({
  item,
  index,
  active,
  onSelect,
}: {
  item: ClassicAturcaraItem;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="classic-aturcara__item">
      <button
        type="button"
        className={`classic-aturcara__step${active ? " is-active" : ""}`}
        onClick={onSelect}
        aria-current={active ? "step" : undefined}
      >
        <span className="classic-aturcara__node" aria-hidden>
          <span className="classic-aturcara__icon">
            <AturcaraIcon icon={item.icon} />
          </span>
        </span>
        <span className="classic-aturcara__copy">
          <span className="classic-aturcara__time">{item.time}</span>
          <span className="classic-aturcara__label">{item.title}</span>
        </span>
        <span className="classic-aturcara__index" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
      </button>
    </li>
  );
}

/** Tentatif majlis — quiet gold timeline (Laila structure, classic surface). */
export function ClassicAturcara() {
  const listId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = CLASSIC_ATURCARA;

  return (
    <ScrollReveal as="section" variant="up" className="classic-aturcara" delayMs={160}>
      <p className="classic-kicker">Hari bahagia</p>
      <h2 className="classic-title" id={listId}>
        Aturcara Majlis
      </h2>
      <p className="classic-prose classic-aturcara__lead">
        Ikuti perjalanan hari — dari akad hingga majlis berakhir.
      </p>
      <ol className="classic-aturcara__list" aria-labelledby={listId}>
        {items.map((item, index) => (
          <Step
            key={item.title}
            item={item}
            index={index}
            active={index === activeIndex}
            onSelect={() => setActiveIndex(index)}
          />
        ))}
      </ol>
    </ScrollReveal>
  );
}

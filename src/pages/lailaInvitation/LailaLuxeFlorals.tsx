import {
  LAILA_LUXE_1213_CORNER_BOTTOM,
  LAILA_LUXE_1213_CORNER_TOP,
  LAILA_LUXE_CORNER_BOTTOM,
  LAILA_LUXE_CORNER_TOP,
} from "./lailaInviteData";

/** Same TL/BR plates as /laila/luxe — only `src` differs when you pass 13/12. */
export function LailaLuxeFlorals({
  variant,
  ready = true,
  cornerTop = LAILA_LUXE_CORNER_TOP,
  cornerBottom = LAILA_LUXE_CORNER_BOTTOM,
}: {
  variant: "cover" | "details";
  ready?: boolean;
  cornerTop?: string;
  cornerBottom?: string;
}) {
  const readyClass = ready ? " ll-florals--ready" : "";
  return (
    <div className={`ll-florals ll-florals--${variant}${readyClass}`} aria-hidden="true">
      <img
        className="ll-florals__plate ll-florals__plate--tl"
        src={cornerTop}
        alt=""
        decoding="async"
        fetchPriority={variant === "cover" ? "high" : "auto"}
        draggable={false}
      />
      <img
        className="ll-florals__plate ll-florals__plate--br"
        src={cornerBottom}
        alt=""
        decoding="async"
        fetchPriority={variant === "cover" ? "high" : "auto"}
        draggable={false}
      />
    </div>
  );
}

export const LAILA_LUXE_1213_FLORAL_PROPS = {
  cornerTop: LAILA_LUXE_1213_CORNER_TOP,
  cornerBottom: LAILA_LUXE_1213_CORNER_BOTTOM,
} as const;

import { LAILA_LUXE_BUTTERFLY } from "./lailaInviteData";

/** Static KB butterfly on the oval (10.png) — unchanged across Luxe variants. */
export function LailaLuxeOvalButterfly({ ready }: { ready: boolean }) {
  return (
    <div className={`ll-oval-bf${ready ? " ll-oval-bf--ready" : ""}`} aria-hidden="true">
      <img className="ll-oval-bf__img" src={LAILA_LUXE_BUTTERFLY} alt="" decoding="async" draggable={false} />
    </div>
  );
}

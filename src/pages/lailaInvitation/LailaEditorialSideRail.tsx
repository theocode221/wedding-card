import { LAILA_EDITORIAL_SIDE } from "./lailaInviteData";

/** Full-height left rail — KB `11.png` only, no crop. */
export function LailaEditorialSideRail({ className = "" }: { className?: string }) {
  return (
    <img
      className={`le-side-rail${className ? ` ${className}` : ""}`}
      src={LAILA_EDITORIAL_SIDE}
      alt=""
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  );
}

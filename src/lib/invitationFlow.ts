/** Routes used when navigating between framed invitation ↔ galeri / RSVP */

export const INVITATION_PATH_DEFAULT = "/jemputan-frame" as const;
export const INVITATION_PATH_MAROON = "/jemputan-frame-maroon" as const;
export const INVITATION_PATH_WHITE_GOLD = "/jemputan-frame-white-gold" as const;

export type InvitationFramePath =
  | typeof INVITATION_PATH_DEFAULT
  | typeof INVITATION_PATH_MAROON
  | typeof INVITATION_PATH_WHITE_GOLD;

export type InvitationSatelliteSkin = "default" | "maroon" | "whiteGold";

export type InvitationFlowState = {
  skipCinematic?: boolean;
  scrollTo?: "details" | "top";
  /** Used by Galeri / RSVP to navigate back to the correct framed invitation */
  invitationReturnPath?: string;
  invitationSkin?: InvitationSatelliteSkin;
};

const FRAME_PATHS: readonly InvitationFramePath[] = [
  INVITATION_PATH_DEFAULT,
  INVITATION_PATH_MAROON,
  INVITATION_PATH_WHITE_GOLD,
];

function isAllowedReturnPath(p: string): p is InvitationFramePath {
  return (FRAME_PATHS as readonly string[]).includes(p);
}

export function skinFromInvitationPath(path: InvitationFramePath): InvitationSatelliteSkin {
  if (path === INVITATION_PATH_MAROON) return "maroon";
  if (path === INVITATION_PATH_WHITE_GOLD) return "whiteGold";
  return "default";
}

export function resolveInvitationReturnPath(state: unknown): InvitationFramePath {
  if (!state || typeof state !== "object") return INVITATION_PATH_DEFAULT;
  const raw = (state as InvitationFlowState).invitationReturnPath;
  return typeof raw === "string" && isAllowedReturnPath(raw) ? raw : INVITATION_PATH_DEFAULT;
}

export function resolveInvitationSatelliteSkin(state: unknown): InvitationSatelliteSkin {
  if (!state || typeof state !== "object") return "default";
  const s = (state as InvitationFlowState).invitationSkin;
  if (s === "maroon" || s === "whiteGold") return s;
  return "default";
}

/** BEM modifier for Galeri / RSVP when opened from a themed invitation */
export function invitationSatellitePageModifier(
  skin: InvitationSatelliteSkin,
  prefix: "gallery-page" | "rsvp-page",
): string {
  if (skin === "maroon") return `${prefix}--maroon`;
  if (skin === "whiteGold") return `${prefix}--white-gold`;
  return "";
}

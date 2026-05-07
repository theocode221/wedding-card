/** Routes used when navigating between framed invitation ↔ galeri / RSVP */

export const INVITATION_PATH_DEFAULT = "/jemputan-frame" as const;
export const INVITATION_PATH_MAROON = "/jemputan-frame-maroon" as const;

export type InvitationSatelliteSkin = "default" | "maroon";

export type InvitationFlowState = {
  skipCinematic?: boolean;
  scrollTo?: "details" | "top";
  /** Used by Galeri / RSVP to navigate back to the correct framed invitation */
  invitationReturnPath?: string;
  invitationSkin?: InvitationSatelliteSkin;
};

function isAllowedReturnPath(p: string): p is typeof INVITATION_PATH_DEFAULT | typeof INVITATION_PATH_MAROON {
  return p === INVITATION_PATH_DEFAULT || p === INVITATION_PATH_MAROON;
}

export function resolveInvitationReturnPath(state: unknown): typeof INVITATION_PATH_DEFAULT | typeof INVITATION_PATH_MAROON {
  if (!state || typeof state !== "object") return INVITATION_PATH_DEFAULT;
  const raw = (state as InvitationFlowState).invitationReturnPath;
  return typeof raw === "string" && isAllowedReturnPath(raw) ? raw : INVITATION_PATH_DEFAULT;
}

export function resolveInvitationSatelliteSkin(state: unknown): InvitationSatelliteSkin {
  if (!state || typeof state !== "object") return "default";
  const s = (state as InvitationFlowState).invitationSkin;
  return s === "maroon" ? "maroon" : "default";
}

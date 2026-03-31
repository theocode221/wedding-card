import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_WEDDING_EVENT } from "../data/mockEvent";
import type { TemplateProps, ThemeId } from "../types/event";
import { ElegantTemplate, FloralTemplate, TraditionalTemplate } from "../templates";

const TEMPLATES: Record<ThemeId, ComponentType<TemplateProps>> = {
  traditional: TraditionalTemplate,
  floral: FloralTemplate,
  elegant: ElegantTemplate,
};

const THEME_ORDER: ThemeId[] = ["traditional", "floral", "elegant"];

export function InvitePage() {
  const navigate = useNavigate();
  const [themeOverride, setThemeOverride] = useState<ThemeId | null>(null);

  const event = useMemo(
    () => ({
      ...MOCK_WEDDING_EVENT,
      theme: themeOverride ?? MOCK_WEDDING_EVENT.theme,
    }),
    [themeOverride],
  );

  const Template = TEMPLATES[event.theme];
  const isDev = import.meta.env.DEV;
  const activeTheme = themeOverride ?? MOCK_WEDDING_EVENT.theme;

  return (
    <>
      {isDev && (
        <div className="theme-dev-toggle" role="group" aria-label="Theme preview (development only)">
          <span className="theme-dev-toggle__label">Theme</span>
          {THEME_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              data-active={activeTheme === t ? "true" : "false"}
              onClick={() => setThemeOverride(t)}
            >
              {t}
            </button>
          ))}
          {themeOverride !== null && (
            <button type="button" data-active="false" onClick={() => setThemeOverride(null)}>
              Mock default
            </button>
          )}
        </div>
      )}
      <Template event={event} onRsvp={() => navigate("/rsvp")} />
    </>
  );
}

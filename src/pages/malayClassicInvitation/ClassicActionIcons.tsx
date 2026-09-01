/** Small brand marks for location & calendar actions. */

export function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.6 5.4 11.2 6.1 12 .3.4.8.4 1.1 0 .7-.8 6.1-7.4 6.1-12 0-3.6-2.9-6.5-6.8-6.5Zm0 9.1a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"
      />
    </svg>
  );
}

export function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M7 3.2h1.6v1.4h6.8V3.2H17v1.4h1.4c1.2 0 2.1.9 2.1 2.1v12.2c0 1.2-.9 2.1-2.1 2.1H5.6c-1.2 0-2.1-.9-2.1-2.1V6.7c0-1.2.9-2.1 2.1-2.1H7V3.2Zm11.4 7.1H5.6v8.6h12.8V10.3Zm0-1.6V6.7H5.6v2H18.4Z"
      />
    </svg>
  );
}

/** Simplified Waze mark — teal bubble + smile. */
export function IconWaze({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#33ccff"
        d="M12 2.2C6.9 2.2 2.8 6 2.8 10.7c0 2.6 1.2 4.9 3.1 6.5l-.7 3.4 3.6-1.5c1 .3 2.1.5 3.2.5 5.1 0 9.2-3.8 9.2-8.9S17.1 2.2 12 2.2Z"
      />
      <circle cx="9.1" cy="10.2" r="1.35" fill="#1a3a4a" />
      <circle cx="14.9" cy="10.2" r="1.35" fill="#1a3a4a" />
      <path
        d="M8.4 13.2c.9 1.3 2.2 2 3.6 2s2.7-.7 3.6-2"
        fill="none"
        stroke="#1a3a4a"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Simplified Google Maps pin mark. */
export function IconGoogleMaps({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#34A853" d="M12 22s7.2-6.4 7.2-12.2A7.2 7.2 0 0 0 12 2.6 7.2 7.2 0 0 0 4.8 9.8C4.8 15.6 12 22 12 22Z" />
      <circle cx="12" cy="9.8" r="2.7" fill="#fff" />
      <path fill="#EA4335" d="M12 2.6v7.2l5.1-5.1A7.17 7.17 0 0 0 12 2.6Z" opacity="0.9" />
      <path fill="#FBBC04" d="M12 9.8 6.9 4.7A7.17 7.17 0 0 0 4.8 9.8H12Z" opacity="0.85" />
      <path fill="#4285F4" d="M12 9.8h7.2A7.17 7.17 0 0 0 17.1 4.7L12 9.8Z" opacity="0.9" />
    </svg>
  );
}

/** Official-style Google “G” mark. */
export function IconGoogle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

/** Alias kept for calendar menu. */
export function IconGoogleCalendar({ className }: { className?: string }) {
  return <IconGoogle className={className} />;
}

/** Official-style Apple mark. */
export function IconApple({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1d1d1f"
        d="M16.7 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.4ZM14.6 5.8c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z"
      />
    </svg>
  );
}

/** Alias kept for calendar menu. */
export function IconAppleCalendar({ className }: { className?: string }) {
  return <IconApple className={className} />;
}

/** Phone / WhatsApp contact mark. */
export function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.6 14.4c-.4-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-.9 1.1-.3.2-.7 0a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.4 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.5-.1-.6-.1-.2-.7-1.7-.9-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.6-.4Z"
      />
      <path
        fill="currentColor"
        d="M12.1 2.1C6.6 2.1 2.1 6.5 2.1 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3A9.9 9.9 0 0 0 12.1 22C17.6 22 22 17.5 22 12S17.6 2.1 12.1 2.1Zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 0 1 4 12c0-4.4 3.6-8 8.1-8s8 3.6 8 8-3.6 8.1-8 8.1Z"
        opacity="0.92"
      />
    </svg>
  );
}

import { useEffect, useRef, useState } from "react";

export type TypingTextProps = {
  text: string;
  speedMs?: number;
  onComplete?: () => void;
  className?: string;
  /** Preserve newlines (poetic paragraphs) */
  multiline?: boolean;
};

export function TypingText({ text, speedMs = 48, onComplete, className = "", multiline = false }: TypingTextProps) {
  const [i, setI] = useState(0);
  const reported = useRef(false);

  useEffect(() => {
    setI(0);
    reported.current = false;
  }, [text]);

  useEffect(() => {
    if (i >= text.length) return;
    const id = window.setTimeout(() => setI((n) => n + 1), speedMs);
    return () => window.clearTimeout(id);
  }, [i, text.length, speedMs]);

  useEffect(() => {
    if (i !== text.length || text.length === 0 || reported.current) return;
    reported.current = true;
    onComplete?.();
  }, [i, text.length, onComplete]);

  return (
    <p className={[className, multiline ? "ucapan-typing--pre" : ""].filter(Boolean).join(" ")}>
      {text.slice(0, i)}
      {i < text.length && <span className="ucapan-typing-caret" aria-hidden />}
    </p>
  );
}

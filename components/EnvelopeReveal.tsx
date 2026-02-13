"use client";

import { useState } from "react";

type Props = {
  title?: string | null;
  preview?: string | null;
  letter: string;
  ps?: string | null;
};

export default function EnvelopeReveal({ letter, ps }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="env-wrap">
      {!open ? (
        <button type="button" className="env-closed" onClick={() => setOpen(true)}>
          <div className="env-card">
            <div className="env-flap" />
            <div className="env-body" />
            <div className="env-seal" aria-hidden>
              ♥
            </div>
            <div className="env-hint">
              Tap to open <span className="env-hint-ico">💌</span>
            </div>
          </div>
        </button>
      ) : (
        <div className="paper">
          <article className="paper-body">{letter}</article>
          {ps?.trim() ? <p className="paper-ps">PS: {ps}</p> : null}
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState, type CSSProperties } from "react";
import { getSignatureMusicLabel, getSignatureMusicSrc, type SignatureMusic } from "@/lib/signature";

type Props = {
  music: SignatureMusic;
  ink: string;
  border: string;
  compact?: boolean;
};

export default function SignatureSoundtrack({ music, ink, border, compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  if (music === "none") return null;

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <div style={compact ? compactWrapStyle : wrapStyle}>
      <button
        type="button"
        onClick={toggle}
        style={{
          ...buttonStyle,
          color: ink,
          borderColor: border,
          background: playing ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.38)",
        }}
      >
        <span>{playing ? "Pause" : "Play"}</span>
        <span>{getSignatureMusicLabel(music)}</span>
      </button>
      <audio
        ref={audioRef}
        preload="none"
        src={getSignatureMusicSrc(music)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

const compactWrapStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
};

const buttonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 38,
  borderRadius: 999,
  border: "1px solid",
  padding: "0 13px",
  fontSize: 13,
  fontWeight: 900,
  cursor: "pointer",
};

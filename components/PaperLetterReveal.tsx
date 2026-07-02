"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LetterCelebration from "./LetterCelebration";
import {
  getSignatureAccentFontFamily,
  getSignatureBodyFontFamily,
  getSignatureMusicLabel,
  getSignatureMusicSrc,
  type SignatureFont,
  type SignatureMusic,
  type SignaturePhoto,
  type SignatureTheme,
} from "@/lib/signature";

type SignatureAddOns = {
  theme: Exclude<SignatureTheme, "auto">;
  font: SignatureFont;
  music: SignatureMusic;
  photos: SignaturePhoto[];
  photoBackground?: boolean;
};

type Props = {
  occasion?: string | null;
  title: string;
  recipientLine?: string | null;
  preview?: string | null;
  letter: string;
  ps?: string | null;
  senderName?: string | null;
  senderRole?: string | null;
  ctaHref?: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaButtonText?: string;
  signatureAddOns?: SignatureAddOns | null;
};

type OccasionTheme = {
  seal: string;
  cornerOne: string;
  cornerTwo: string;
  symbols: string[];
  centerSymbol: string;
  glow: string;
};

type SignaturePalette = {
  accent: string;
  ink: string;
  paper: string;
  wash: string;
  tape: string;
  label: string;
};

type CoverKind = "romantic" | "celebration" | "calm" | "warm";

const occasionThemes: Record<string, OccasionTheme> = {
  love: {
    seal: "💘",
    cornerOne: "💞",
    cornerTwo: "❤️",
    symbols: ["💘", "💞", "💗", "🌹", "✨"],
    centerSymbol: "💘",
    glow: "rgba(255,92,146,0.56)",
  },
  "mothers-day": {
    seal: "💐",
    cornerOne: "🌸",
    cornerTwo: "🌷",
    symbols: ["💐", "🌸", "🌷", "✨", "💗"],
    centerSymbol: "💐",
    glow: "rgba(255,205,225,0.58)",
  },
  "womens-day": {
    seal: "🌷",
    cornerOne: "🌷",
    cornerTwo: "✨",
    symbols: ["🌷", "🌸", "⭐", "✨", "💫"],
    centerSymbol: "🌷",
    glow: "rgba(255,205,235,0.54)",
  },
  birthday: {
    seal: "🎈",
    cornerOne: "🎂",
    cornerTwo: "🎉",
    symbols: ["🎈", "🎈", "🎊", "🎉", "✨"],
    centerSymbol: "🎈",
    glow: "rgba(255,226,150,0.58)",
  },
  "fathers-day": {
    seal: "⭐",
    cornerOne: "⭐",
    cornerTwo: "🏆",
    symbols: ["⭐", "🏆", "✨", "💫", "🤎"],
    centerSymbol: "⭐",
    glow: "rgba(255,221,150,0.52)",
  },
  appreciation: {
    seal: "🙏",
    cornerOne: "✨",
    cornerTwo: "💛",
    symbols: ["✨", "💛", "⭐", "🙏", "💫"],
    centerSymbol: "✨",
    glow: "rgba(255,232,160,0.54)",
  },
  "just-because": {
    seal: "💌",
    cornerOne: "💌",
    cornerTwo: "✨",
    symbols: ["💌", "✨", "💗", "🌙", "⭐"],
    centerSymbol: "💌",
    glow: "rgba(235,210,255,0.52)",
  },
  cheeky: {
    seal: "😏",
    cornerOne: "✨",
    cornerTwo: "🔥",
    symbols: ["😏", "✨", "🔥", "💫", "💋"],
    centerSymbol: "😏",
    glow: "rgba(255,154,205,0.52)",
  },
};

const safeOccasionThemes: Record<string, OccasionTheme> = {
  love: {
    seal: "\u{1F498}",
    cornerOne: "\u{1F49E}",
    cornerTwo: "\u{2764}\u{FE0F}",
    symbols: ["\u{1F498}", "\u{1F49E}", "\u{1F497}", "\u{1F339}", "\u{2728}"],
    centerSymbol: "\u{1F498}",
    glow: "rgba(255,92,146,0.56)",
  },
  "mothers-day": {
    seal: "\u{1F490}",
    cornerOne: "\u{1F338}",
    cornerTwo: "\u{1F337}",
    symbols: ["\u{1F490}", "\u{1F338}", "\u{1F337}", "\u{2728}", "\u{1F497}"],
    centerSymbol: "\u{1F490}",
    glow: "rgba(255,205,225,0.58)",
  },
  "womens-day": {
    seal: "\u{1F337}",
    cornerOne: "\u{1F337}",
    cornerTwo: "\u{2728}",
    symbols: ["\u{1F337}", "\u{1F338}", "\u{2B50}", "\u{2728}", "\u{1F4AB}"],
    centerSymbol: "\u{1F337}",
    glow: "rgba(255,205,235,0.54)",
  },
  birthday: {
    seal: "\u{1F382}",
    cornerOne: "\u{1F382}",
    cornerTwo: "\u{1F389}",
    symbols: ["\u{1F388}", "\u{1F382}", "\u{1F38A}", "\u{1F389}", "\u{2728}"],
    centerSymbol: "\u{1F382}",
    glow: "rgba(255,226,150,0.58)",
  },
  "fathers-day": {
    seal: "\u{2B50}",
    cornerOne: "\u{2B50}",
    cornerTwo: "\u{1F3C6}",
    symbols: ["\u{2B50}", "\u{1F3C6}", "\u{2728}", "\u{1F4AB}", "\u{1F90E}"],
    centerSymbol: "\u{2B50}",
    glow: "rgba(255,221,150,0.52)",
  },
  appreciation: {
    seal: "\u{1F64F}",
    cornerOne: "\u{2728}",
    cornerTwo: "\u{1F49B}",
    symbols: ["\u{2728}", "\u{1F49B}", "\u{2B50}", "\u{1F64F}", "\u{1F4AB}"],
    centerSymbol: "\u{2728}",
    glow: "rgba(255,232,160,0.54)",
  },
  "just-because": {
    seal: "\u{1F48C}",
    cornerOne: "\u{1F48C}",
    cornerTwo: "\u{2728}",
    symbols: ["\u{1F48C}", "\u{2728}", "\u{1F497}", "\u{1F319}", "\u{2B50}"],
    centerSymbol: "\u{1F48C}",
    glow: "rgba(235,210,255,0.52)",
  },
  cheeky: {
    seal: "\u{1F60F}",
    cornerOne: "\u{2728}",
    cornerTwo: "\u{1F525}",
    symbols: ["\u{1F60F}", "\u{2728}", "\u{1F525}", "\u{1F4AB}", "\u{1F48B}"],
    centerSymbol: "\u{1F60F}",
    glow: "rgba(255,154,205,0.52)",
  },
  situationship: {
    seal: "\u{1F4AC}",
    cornerOne: "\u{1F4AC}",
    cornerTwo: "\u{2728}",
    symbols: ["\u{1F4AC}", "\u{1F525}", "\u{1F49B}", "\u{2728}", "\u{1F4AB}"],
    centerSymbol: "\u{1F4AC}",
    glow: "rgba(255,154,205,0.44)",
  },
};

const signaturePalettes: Record<Exclude<SignatureTheme, "auto">, SignaturePalette> = {
  "romantic-photobook": {
    accent: "#b83265",
    ink: "#5a2e3d",
    paper:
      "linear-gradient(180deg, rgba(255,249,244,0.99), rgba(248,232,225,0.99))",
    wash:
      "radial-gradient(circle at 20% 12%, rgba(255,183,205,0.30), transparent 32%), radial-gradient(circle at 82% 18%, rgba(181,72,111,0.16), transparent 30%)",
    tape: "rgba(255,212,224,0.72)",
    label: "Photobook",
  },
  "memory-album": {
    accent: "#8a6232",
    ink: "#57412f",
    paper:
      "linear-gradient(180deg, rgba(255,250,239,0.99), rgba(241,231,211,0.99))",
    wash:
      "radial-gradient(circle at 16% 12%, rgba(245,214,162,0.32), transparent 34%), radial-gradient(circle at 86% 20%, rgba(132,84,38,0.13), transparent 30%)",
    tape: "rgba(232,207,164,0.72)",
    label: "Memory album",
  },
  "celebration-board": {
    accent: "#a46511",
    ink: "#5a3d2b",
    paper:
      "linear-gradient(180deg, rgba(255,252,235,0.99), rgba(246,234,204,0.99))",
    wash:
      "radial-gradient(circle at 18% 12%, rgba(255,224,138,0.34), transparent 34%), radial-gradient(circle at 86% 16%, rgba(255,145,77,0.13), transparent 30%)",
    tape: "rgba(255,226,150,0.74)",
    label: "Celebration page",
  },
  "quiet-keepsake": {
    accent: "#6b5b95",
    ink: "#47394f",
    paper:
      "linear-gradient(180deg, rgba(251,249,255,0.99), rgba(235,230,245,0.99))",
    wash:
      "radial-gradient(circle at 20% 12%, rgba(217,199,255,0.30), transparent 34%), radial-gradient(circle at 84% 18%, rgba(80,66,125,0.13), transparent 30%)",
    tape: "rgba(220,210,248,0.74)",
    label: "Keepsake",
  },
  "blue-keepsake": {
    accent: "#3f7fbf",
    ink: "#213a55",
    paper:
      "linear-gradient(180deg, rgba(246,251,255,0.99), rgba(226,238,249,0.99))",
    wash:
      "radial-gradient(circle at 18% 12%, rgba(143,196,232,0.30), transparent 34%), radial-gradient(circle at 84% 20%, rgba(58,112,168,0.15), transparent 30%)",
    tape: "rgba(176,215,241,0.76)",
    label: "Blue keepsake",
  },
  "garden-note": {
    accent: "#4f8d62",
    ink: "#314a37",
    paper:
      "linear-gradient(180deg, rgba(250,255,247,0.99), rgba(232,242,225,0.99))",
    wash:
      "radial-gradient(circle at 18% 12%, rgba(177,220,176,0.30), transparent 34%), radial-gradient(circle at 84% 20%, rgba(86,139,93,0.13), transparent 30%)",
    tape: "rgba(193,225,187,0.76)",
    label: "Garden note",
  },
};

const signatureFontFamilies: Record<SignatureFont, string> = {
  classic: getSignatureBodyFontFamily(),
  "love-note": getSignatureBodyFontFamily(),
  storybook: getSignatureBodyFontFamily(),
  "bright-hand": getSignatureBodyFontFamily(),
  clean: getSignatureBodyFontFamily(),
  "movie-script": getSignatureBodyFontFamily(),
  "casual-note": getSignatureBodyFontFamily(),
  "elegant-serif": getSignatureBodyFontFamily(),
};

const signatureTitleFontFamilies: Record<SignatureFont, string> = {
  classic: getSignatureAccentFontFamily("classic"),
  "love-note": getSignatureAccentFontFamily("love-note"),
  storybook: getSignatureAccentFontFamily("storybook"),
  "bright-hand": getSignatureAccentFontFamily("bright-hand"),
  clean: getSignatureAccentFontFamily("clean"),
  "movie-script": getSignatureAccentFontFamily("movie-script"),
  "casual-note": getSignatureAccentFontFamily("casual-note"),
  "elegant-serif": getSignatureAccentFontFamily("elegant-serif"),
};

const signatureClosingFontFamilies: Record<SignatureFont, string> = {
  classic: getSignatureAccentFontFamily("classic"),
  "love-note": getSignatureAccentFontFamily("love-note"),
  storybook: getSignatureAccentFontFamily("storybook"),
  "bright-hand": getSignatureAccentFontFamily("bright-hand"),
  clean: getSignatureAccentFontFamily("clean"),
  "movie-script": getSignatureAccentFontFamily("movie-script"),
  "casual-note": getSignatureAccentFontFamily("casual-note"),
  "elegant-serif": getSignatureAccentFontFamily("elegant-serif"),
};

function getOccasionTheme(occasion?: string | null) {
  return safeOccasionThemes[occasion || ""] ?? safeOccasionThemes.love;
}

function makeTypingParticles(symbols: string[]) {
  return Array.from({ length: 18 }, (_, index) => ({
    symbol: symbols[index % symbols.length],
    left: `${4 + ((index * 11.7) % 92)}%`,
    delay: `${(index % 9) * 0.75}s`,
    duration: `${8 + (index % 5) * 0.85}s`,
    size: 18 + (index % 4) * 5,
  }));
}

function buildSignature(senderRole?: string | null, senderName?: string | null) {
  const cleanRole = senderRole?.trim();
  const cleanName = senderName?.trim();

  if (cleanRole && cleanName) {
    const lower = cleanRole.toLowerCase();
    const mapped =
      lower === "son"
        ? "Your son"
        : lower === "daughter"
        ? "Your daughter"
        : lower === "husband"
        ? "Your husband"
        : lower === "wife"
        ? "Your wife"
        : lower === "partner"
        ? "Your partner"
        : lower === "grandchild"
        ? "Your grandchild"
        : lower === "friend"
        ? "Your friend"
        : lower === "brother"
        ? "Your brother"
        : lower === "sister"
        ? "Your sister"
        : lower === "nephew"
        ? "Your nephew"
        : lower === "niece"
        ? "Your niece"
        : `Your ${cleanRole}`;

    return `- ${mapped}, ${cleanName}`;
  }

  if (cleanName) return `- With love, ${cleanName}`;
  if (cleanRole) return `- Your ${cleanRole}`;
  return "- With love";
}

function SignaturePhotoPage({
  photos,
  palette,
}: {
  photos: SignaturePhoto[];
  palette: SignaturePalette;
}) {
  if (!photos.length) return null;

  return (
    <aside
      aria-label="Signature photo memories"
      style={{
        float: "right",
        width: "clamp(170px, 24%, 250px)",
        maxWidth: "100%",
        margin: "0 0 18px 26px",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: photos.length === 1 ? 190 : 250,
        }}
      >
        <div style={{ position: "relative", minHeight: photos.length === 1 ? 190 : 250 }}>
          {photos.slice(0, 3).map((photo, index) => {
            const position = photoPosition(index, photos.length);

            return (
              <figure
                key={photo.id}
                className="signature-photo-card"
                style={{
                  "--photo-rotate": position.rotate,
                  position: "absolute",
                  left: position.left,
                  top: position.top,
                  width: position.width,
                  margin: 0,
                  borderRadius: 14,
                  background: "#fffaf7",
                  padding: "7px 7px 11px",
                  boxShadow: "0 14px 26px rgba(52,35,30,0.22)",
                  transform: `rotate(${position.rotate})`,
                  zIndex: 5 + index,
                } as React.CSSProperties}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -8,
                    width: 48,
                    height: 16,
                    borderRadius: 5,
                    background: palette.tape,
                    transform: "translateX(-50%) rotate(-2deg)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  }}
                />
                <img
                  src={photo.src}
                  alt={photo.caption || "Signature memory"}
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    borderRadius: 9,
                    display: "block",
                  }}
                />
                {photo.caption ? (
                  <figcaption
                    style={{
                      marginTop: 8,
                      color: "rgba(55,37,32,0.74)",
                      fontSize: 11,
                      lineHeight: 1.3,
                      textAlign: "center",
                      whiteSpace: "normal",
                    }}
                  >
                    {photo.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function SignatureClosedCover({
  title,
  preview,
  occasion,
  seal,
  photos,
  palette,
  music,
  titleFontFamily,
}: {
  title: string;
  preview?: string | null;
  occasion?: string | null;
  seal: string;
  photos: SignaturePhoto[];
  palette: SignaturePalette;
  music: SignatureMusic;
  titleFontFamily: string;
}) {
  const cover = getSignatureCoverStyle(occasion, palette);
  const primaryPhoto = photos[0];
  const label = coverLabel(occasion);

  return (
    <div
      style={{
        position: "relative",
        minHeight: 430,
        borderRadius: 34,
        background: cover.background,
        border: `1px solid ${cover.border}`,
        boxShadow: "0 30px 90px rgba(0,0,0,0.42)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 34%, rgba(255,255,255,0.10), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.08), transparent 48%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 20,
          borderRadius: 26,
          border: `1px solid ${cover.border}`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.92fr) minmax(230px, 1.08fr)",
          gap: 22,
          alignItems: "center",
          minHeight: 430,
          padding: "36px 40px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              border: `1px solid ${cover.border}`,
              background: "rgba(255,255,255,0.08)",
              color: cover.softText,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            {label}
          </div>

          <h2
            style={{
              margin: "18px 0 0",
              color: cover.text,
              fontFamily: titleFontFamily,
              fontSize: "clamp(30px, 4.8vw, 46px)",
              lineHeight: 1.05,
              letterSpacing: 0,
            }}
          >
            {title}
          </h2>

          {preview?.trim() ? (
            <p
              style={{
                margin: "14px 0 0",
                color: cover.softText,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {preview}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 9,
              marginTop: 22,
            }}
          >
            {music !== "none" ? (
              <span style={{ ...coverPillStyle, borderColor: cover.border, color: cover.softText }}>
                {musicLabel(music)}
              </span>
            ) : null}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: 260,
            display: "grid",
            placeItems: "center",
          }}
        >
          <CoverDecorations kind={cover.kind} />

          <div
            style={{
              position: "relative",
              width: "min(100%, 300px)",
              aspectRatio: "1 / 1",
              borderRadius: cover.kind === "romantic" ? 26 : 30,
              background: "rgba(255,255,255,0.92)",
              padding: 12,
              transform: cover.kind === "romantic" ? "rotate(-2deg)" : "rotate(1deg)",
              boxShadow: "0 24px 52px rgba(0,0,0,0.32)",
            }}
          >
            <CoverPhotoFrame kind={cover.kind} />

            <div
              style={{
                position: "absolute",
                left: "50%",
                top: -11,
                width: 82,
                height: 24,
                borderRadius: 8,
                background: cover.tape,
                transform: "translateX(-50%) rotate(1deg)",
                boxShadow: "0 5px 12px rgba(0,0,0,0.12)",
              }}
            />

            {primaryPhoto ? (
              <img
                src={primaryPhoto.src}
                alt={primaryPhoto.caption || "Signature cover photo"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 18,
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 18,
                  background:
                    "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.8), rgba(255,255,255,0.20)), linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 54,
                }}
              >
                {seal}
              </div>
            )}
          </div>

          {photos.slice(1, 3).map((photo, index) => (
            <div
              key={photo.id}
              style={{
                position: "absolute",
                width: 106,
                height: 86,
                right: index === 0 ? 8 : "auto",
                left: index === 1 ? 2 : "auto",
                bottom: index === 0 ? 16 : "auto",
                top: index === 1 ? 12 : "auto",
                borderRadius: 16,
                background: "#fff",
                padding: 7,
                transform: `rotate(${index === 0 ? 6 : -5}deg)`,
                boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
              }}
            >
              <img
                src={photo.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 11,
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 28,
          textAlign: "center",
          color: cover.softText,
          fontSize: 17,
          fontWeight: 800,
        }}
      >
          Tap to open {seal}
        </div>
    </div>
  );
}

function CoverPhotoFrame({ kind }: { kind: CoverKind }) {
  if (kind === "romantic") {
    return (
      <div style={{ position: "absolute", inset: -28, pointerEvents: "none", zIndex: 4 }}>
        {rosePetals.map((petal, index) => (
          <span
            key={`petal-${index}`}
            style={{
              position: "absolute",
              left: petal.left,
              top: petal.top,
              width: petal.size,
              height: petal.size * 1.55,
              borderRadius: "58% 42% 62% 38%",
              background:
                "radial-gradient(circle at 36% 28%, rgba(255,185,198,0.98), rgba(224,28,66,0.96) 44%, rgba(116,6,32,0.94) 100%)",
              boxShadow: "0 7px 12px rgba(80,0,20,0.26)",
              transform: `rotate(${petal.rotate}deg)`,
              opacity: petal.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  if (kind === "celebration") {
    return (
      <div style={{ position: "absolute", inset: -22, pointerEvents: "none", zIndex: 4 }}>
        {confettiBits.map((bit, index) => (
          <span
            key={`confetti-${index}`}
            style={{
              position: "absolute",
              left: bit.left,
              top: bit.top,
              width: bit.w,
              height: bit.h,
              borderRadius: bit.round ? 999 : 3,
              background: bit.color,
              transform: `rotate(${bit.rotate}deg)`,
              boxShadow: "0 5px 10px rgba(0,0,0,0.18)",
              opacity: 0.94,
            }}
          />
        ))}
      </div>
    );
  }

  if (kind === "calm") {
    return (
      <div style={{ position: "absolute", inset: -18, pointerEvents: "none", zIndex: 4 }}>
        {calmGlints.map((glint, index) => (
          <span
            key={`glint-${index}`}
            style={{
              position: "absolute",
              left: glint.left,
              top: glint.top,
              width: glint.size,
              height: glint.size,
              borderRadius: 999,
              border: "1px solid rgba(221,232,255,0.62)",
              background: "rgba(255,255,255,0.20)",
              boxShadow: "0 0 18px rgba(171,210,255,0.30)",
              opacity: glint.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: -20, pointerEvents: "none", zIndex: 4 }}>
      {pressedLeaves.map((leaf, index) => (
        <span
          key={`leaf-${index}`}
          style={{
            position: "absolute",
            left: leaf.left,
            top: leaf.top,
            width: leaf.w,
            height: leaf.h,
            borderRadius: "70% 0 70% 0",
            background:
              "linear-gradient(135deg, rgba(214,184,116,0.95), rgba(106,126,75,0.82))",
            transform: `rotate(${leaf.rotate}deg)`,
            boxShadow: "0 6px 12px rgba(0,0,0,0.18)",
            opacity: 0.88,
          }}
        />
      ))}
    </div>
  );
}

function CoverDecorations({ kind }: { kind: CoverKind }) {
  const symbols =
    kind === "romantic"
      ? ["♥", "♡", "✦", "♥", "♡", "✧"]
      : kind === "celebration"
      ? ["✦", "✧", "★", "✦", "•", "★"]
      : kind === "calm"
      ? ["✦", "·", "✧", "·", "✦", "·"]
      : ["✧", "•", "✦", "•", "✧", "✦"];

  return (
    <div style={{ position: "absolute", inset: -8, pointerEvents: "none" }}>
      {coverSymbols(kind).map((symbol, index) => (
        <span
          key={`${symbol}-${index}`}
          style={{
            position: "absolute",
            left: `${8 + ((index * 17) % 78)}%`,
            top: `${6 + ((index * 23) % 74)}%`,
            color: kind === "romantic" ? "rgba(255,92,146,0.72)" : "rgba(255,255,255,0.36)",
            fontSize: index % 2 === 0 ? 28 : 18,
            transform: `rotate(${index % 2 === 0 ? -12 : 12}deg)`,
            opacity: 0.72,
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}

const rosePetals = [
  { left: "2%", top: "16%", size: 18, rotate: -42, opacity: 0.98 },
  { left: "8%", top: "6%", size: 15, rotate: 28, opacity: 0.9 },
  { left: "20%", top: "-2%", size: 20, rotate: -18, opacity: 0.96 },
  { left: "38%", top: "-5%", size: 16, rotate: 44, opacity: 0.9 },
  { left: "58%", top: "-3%", size: 21, rotate: -34, opacity: 0.98 },
  { left: "76%", top: "4%", size: 17, rotate: 22, opacity: 0.92 },
  { left: "88%", top: "15%", size: 22, rotate: 46, opacity: 0.98 },
  { left: "94%", top: "36%", size: 16, rotate: -24, opacity: 0.88 },
  { left: "90%", top: "62%", size: 20, rotate: 32, opacity: 0.96 },
  { left: "78%", top: "84%", size: 17, rotate: -46, opacity: 0.9 },
  { left: "58%", top: "91%", size: 22, rotate: 18, opacity: 0.98 },
  { left: "36%", top: "90%", size: 16, rotate: -28, opacity: 0.9 },
  { left: "17%", top: "82%", size: 21, rotate: 38, opacity: 0.96 },
  { left: "3%", top: "58%", size: 16, rotate: -18, opacity: 0.88 },
  { left: "-2%", top: "36%", size: 22, rotate: 28, opacity: 0.98 },
];

const confettiBits = [
  { left: "4%", top: "18%", w: 16, h: 8, rotate: -16, color: "#ff5a8f" },
  { left: "18%", top: "2%", w: 10, h: 20, rotate: 18, color: "#ffd166", round: true },
  { left: "38%", top: "-3%", w: 18, h: 7, rotate: 36, color: "#45c2ff" },
  { left: "64%", top: "3%", w: 12, h: 18, rotate: -24, color: "#8ce05f", round: true },
  { left: "84%", top: "18%", w: 18, h: 8, rotate: 14, color: "#f9a03f" },
  { left: "91%", top: "48%", w: 12, h: 18, rotate: 38, color: "#ff5a8f" },
  { left: "72%", top: "86%", w: 18, h: 8, rotate: -22, color: "#ffd166" },
  { left: "42%", top: "94%", w: 12, h: 18, rotate: 18, color: "#45c2ff", round: true },
  { left: "12%", top: "82%", w: 18, h: 8, rotate: 28, color: "#8ce05f" },
  { left: "-2%", top: "50%", w: 12, h: 18, rotate: -12, color: "#f9a03f", round: true },
];

const calmGlints = [
  { left: "6%", top: "16%", size: 22, opacity: 0.8 },
  { left: "23%", top: "2%", size: 12, opacity: 0.58 },
  { left: "76%", top: "7%", size: 18, opacity: 0.7 },
  { left: "92%", top: "38%", size: 13, opacity: 0.52 },
  { left: "72%", top: "88%", size: 20, opacity: 0.68 },
  { left: "18%", top: "80%", size: 14, opacity: 0.56 },
  { left: "-1%", top: "52%", size: 16, opacity: 0.52 },
];

const pressedLeaves = [
  { left: "5%", top: "14%", w: 14, h: 30, rotate: -42 },
  { left: "24%", top: "-2%", w: 12, h: 25, rotate: 28 },
  { left: "82%", top: "12%", w: 14, h: 30, rotate: 36 },
  { left: "90%", top: "60%", w: 12, h: 26, rotate: -24 },
  { left: "58%", top: "90%", w: 14, h: 30, rotate: 38 },
  { left: "12%", top: "78%", w: 12, h: 26, rotate: -32 },
];

function coverSymbols(kind: CoverKind) {
  if (kind === "romantic") {
    return ["\u{2665}", "\u{2661}", "\u{1F339}", "\u{2665}", "\u{2661}", "\u{2726}"];
  }

  if (kind === "celebration") {
    return ["\u{2726}", "\u{2727}", "\u{1F389}", "\u{2B50}", "\u{1F388}", "\u{2728}"];
  }

  if (kind === "calm") {
    return ["\u{2726}", "\u{00B7}", "\u{2727}", "\u{00B7}", "\u{2726}", "\u{00B7}"];
  }

  return ["\u{2727}", "\u{2022}", "\u{2726}", "\u{2022}", "\u{2727}", "\u{2726}"];
}

function getSignatureCoverStyle(occasion: string | null | undefined, palette: SignaturePalette) {
  const kind =
    occasion === "love" || occasion === "cheeky" || occasion === "confession" || occasion === "situationship"
      ? "romantic"
      : occasion === "birthday" || occasion === "congratulations"
      ? "celebration"
      : occasion === "faith" || occasion === "closure" || occasion === "ex"
      ? "calm"
      : "warm";

  if (kind === "romantic") {
    return {
      kind,
      text: "#fff7fb",
      softText: "rgba(255,230,239,0.82)",
      border: "rgba(255,195,209,0.28)",
      tape: "rgba(255,195,209,0.78)",
      background:
        "radial-gradient(circle at 76% 22%, rgba(255,92,146,0.22), transparent 28%), radial-gradient(circle at 20% 84%, rgba(255,195,209,0.12), transparent 26%), linear-gradient(150deg, #090306 0%, #250712 44%, #120307 100%)",
    } as const;
  }

  if (kind === "celebration") {
    return {
      kind,
      text: "#fff9ea",
      softText: "rgba(255,249,234,0.80)",
      border: "rgba(255,224,138,0.30)",
      tape: "rgba(255,226,150,0.78)",
      background:
        "radial-gradient(circle at 76% 22%, rgba(255,224,138,0.22), transparent 28%), linear-gradient(150deg, #170d03 0%, #432609 48%, #160b03 100%)",
    } as const;
  }

  if (kind === "calm") {
    return {
      kind,
      text: "#fbf8ff",
      softText: "rgba(246,240,255,0.80)",
      border: "rgba(217,199,255,0.30)",
      tape: "rgba(220,210,248,0.78)",
      background:
        "radial-gradient(circle at 76% 22%, rgba(217,199,255,0.20), transparent 28%), linear-gradient(150deg, #09070f 0%, #241a35 50%, #09070f 100%)",
    } as const;
  }

  return {
    kind,
    text: "#fffaf0",
    softText: "rgba(255,250,240,0.78)",
    border: palette.tape,
    tape: palette.tape,
    background:
      "radial-gradient(circle at 76% 22%, rgba(245,214,162,0.18), transparent 28%), linear-gradient(150deg, #100803 0%, #34200f 50%, #120804 100%)",
  } as const;
}

function coverLabel(occasion?: string | null) {
  if (occasion === "birthday") return "Birthday Letter";
  if (occasion === "love" || occasion === "confession") return "Love Letter";
  if (occasion === "congratulations") return "Congratulations";
  if (occasion === "friend") return "Friend Letter";
  if (occasion === "faith") return "Faith Letter";
  if (occasion === "closure") return "Closure Letter";
  if (occasion === "apology") return "Apology Letter";
  if (occasion === "situationship" || occasion === "cheeky") return "Unfiltered Letter";
  if (occasion === "thank-you" || occasion === "appreciation") return "Thank You Letter";
  return "Signature Letter";
}

const coverPillStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid",
  background: "rgba(255,255,255,0.08)",
  padding: "8px 11px",
  fontSize: 12,
  fontWeight: 900,
};

function photoPosition(index: number, count: number) {
  if (count === 1) {
    return { left: "8%", top: "22px", width: "84%", rotate: "-2deg" };
  }

  const positions = [
    { left: "0%", top: "30px", width: "67%", rotate: "-5deg" },
    { left: "38%", top: "118px", width: "60%", rotate: "4deg" },
    { left: "48%", top: "8px", width: "48%", rotate: "3deg" },
  ];

  return positions[index] ?? positions[0];
}

function musicLabel(music: SignatureMusic) {
  return getSignatureMusicLabel(music);
}

export default function PaperLetterReveal({
  occasion,
  title,
  recipientLine,
  preview,
  letter,
  ps,
  senderName,
  senderRole,
  signatureAddOns,
  ctaHref = "/create",
  ctaTitle = "Aww \u{1F60C} Want one like this?",
  ctaBody = "Now go make one for your person in seconds.",
  ctaButtonText = "Create my letter \u{1F48C}",
}: Props) {
  const [opened, setOpened] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typedPs, setTypedPs] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFinishGlow, setShowFinishGlow] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [soundtrackPlaying, setSoundtrackPlaying] = useState(false);

  const theme = getOccasionTheme(occasion);
  const typingParticles = useMemo(
    () => makeTypingParticles(theme.symbols),
    [theme.symbols]
  );
  const signature = useMemo(
    () => buildSignature(senderRole, senderName),
    [senderRole, senderName]
  );
  const signaturePalette = signatureAddOns
    ? signaturePalettes[signatureAddOns.theme]
    : null;
  const letterFontFamily = signatureAddOns
    ? signatureFontFamilies[signatureAddOns.font]
    : 'Georgia, "Times New Roman", serif';
  const titleFontFamily = signatureAddOns
    ? signatureTitleFontFamilies[signatureAddOns.font]
    : 'Georgia, "Times New Roman", serif';
  const closingFontFamily = signatureAddOns
    ? signatureClosingFontFamilies[signatureAddOns.font]
    : '"Segoe Script", "Brush Script MT", cursive';
  const hasSignaturePhotos = Boolean(signatureAddOns?.photos.length);
  const hasOpeningSoundtrack = Boolean(signatureAddOns && signatureAddOns.music !== "none");

  const soundtrackRef = useRef<HTMLAudioElement | null>(null);
  const typingAnchorRef = useRef<HTMLDivElement | null>(null);
  const followRafRef = useRef<number | null>(null);
  const lastFollowTimeRef = useRef(0);

  function stopWritingSoundtrack() {
    const audio = soundtrackRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setSoundtrackPlaying(false);
  }

  async function startWritingSoundtrack() {
    const audio = soundtrackRef.current;
    if (!audio || !hasOpeningSoundtrack) return false;

    audio.loop = true;
    audio.currentTime = 0;
    try {
      await audio.play();
      setSoundtrackPlaying(true);
      return true;
    } catch {
      // Browsers may block audio if the open action is not treated as a gesture.
      setSoundtrackPlaying(false);
      return false;
    }
  }

  async function toggleWritingSoundtrack() {
    const audio = soundtrackRef.current;
    if (!audio || !hasOpeningSoundtrack) return;

    if (!audio.paused) {
      audio.pause();
      setSoundtrackPlaying(false);
      return;
    }

    audio.loop = true;
    try {
      await audio.play();
      setSoundtrackPlaying(true);
    } catch {
      setSoundtrackPlaying(false);
    }
  }

  function openLetter() {
    if (opened) return;

    setOpened(true);
    void startWritingSoundtrack();
  }

  useEffect(() => {
    if (!opened) return;

    setTypedText("");
    setTypedPs("");
    setShowSignature(false);
    setShowCelebration(false);
    setShowFinishGlow(false);
    setIsTypingActive(true);

    let cancelled = false;
    let mainTimeout: number | null = null;
    let psTimeout: number | null = null;
    let finishTimeout: number | null = null;
    let glowTimeout: number | null = null;
    let celebrationTimeout: number | null = null;

    const fullText = letter || "";
    const charDelay = 42;
    let i = 0;

    const finish = () => {
      finishTimeout = window.setTimeout(() => {
        if (cancelled) return;

        setIsTypingActive(false);
        stopWritingSoundtrack();
        setShowSignature(true);
        setShowCelebration(true);
        setShowFinishGlow(true);
        navigator.vibrate?.(120);

        glowTimeout = window.setTimeout(() => setShowFinishGlow(false), 2200);
        celebrationTimeout = window.setTimeout(() => {
          if (!cancelled) setShowCelebration(false);
        }, 3600);
      }, 220);
    };

    const typePs = () => {
      if (!ps?.trim()) {
        finish();
        return;
      }

      const psText = `PS: ${ps.trim()}`;
      let j = 0;

      const nextPs = () => {
        if (cancelled) return;

        if (j < psText.length) {
          setTypedPs(psText.slice(0, j + 1));
          const ch = psText[j];
          j += 1;
          let delay = charDelay;

          if (ch === "." || ch === "!" || ch === "?") delay += 130;
          else if (ch === "," || ch === ";" || ch === ":") delay += 80;
          else if (ch === "\n") delay += 110;
          else if (ch === " ") delay -= 8;

          psTimeout = window.setTimeout(nextPs, Math.max(delay, 22));
          return;
        }

        finish();
      };

      nextPs();
    };

    const next = () => {
      if (cancelled) return;

      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        const ch = fullText[i];
        i += 1;
        let delay = charDelay;

        if (ch === "." || ch === "!" || ch === "?") delay += 105;
        else if (ch === "," || ch === ";" || ch === ":") delay += 70;
        else if (ch === "\n") delay += 110;
        else if (ch === " ") delay -= 8;

        mainTimeout = window.setTimeout(next, Math.max(delay, 22));
        return;
      }

      typePs();
    };

    next();

    return () => {
      cancelled = true;
      if (mainTimeout) window.clearTimeout(mainTimeout);
      if (psTimeout) window.clearTimeout(psTimeout);
      if (finishTimeout) window.clearTimeout(finishTimeout);
      if (glowTimeout) window.clearTimeout(glowTimeout);
      if (celebrationTimeout) window.clearTimeout(celebrationTimeout);
      stopWritingSoundtrack();
    };
  }, [opened, letter, ps]);

  useEffect(() => {
    if (!opened || !isTypingActive) return;

    let stoppedByUser = false;
    let stopTimer: number | null = null;

    const stopFollowingTemporarily = () => {
      stoppedByUser = true;
      if (stopTimer) window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        stoppedByUser = false;
      }, 900);
    };

    const onWheel = () => stopFollowingTemporarily();
    const onTouchStart = () => stopFollowingTemporarily();
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "PageUp" ||
        e.key === "PageDown" ||
        e.key === "Home" ||
        e.key === "End" ||
        e.key === " "
      ) {
        stopFollowingTemporarily();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    const followTyping = (now: number) => {
      const anchor = typingAnchorRef.current;

      if (!anchor || !isTypingActive) return;

      if (now - lastFollowTimeRef.current < 120) {
        followRafRef.current = requestAnimationFrame(followTyping);
        return;
      }

      lastFollowTimeRef.current = now;

      if (!stoppedByUser) {
        const rect = anchor.getBoundingClientRect();
        const desiredLineY = window.innerHeight * 0.78;
        const delta = rect.bottom - desiredLineY;

        if (delta > 26) {
          window.scrollTo({
            top: window.scrollY + Math.min(delta * 0.28, 20),
            behavior: "auto",
          });
        }
      }

      followRafRef.current = requestAnimationFrame(followTyping);
    };

    followRafRef.current = requestAnimationFrame(followTyping);

    return () => {
      if (followRafRef.current) cancelAnimationFrame(followRafRef.current);
      if (stopTimer) window.clearTimeout(stopTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [opened, isTypingActive]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {hasOpeningSoundtrack && signatureAddOns ? (
        <audio
          ref={soundtrackRef}
          preload="none"
          loop
          src={getSignatureMusicSrc(signatureAddOns.music)}
          onPlay={() => setSoundtrackPlaying(true)}
          onPause={() => setSoundtrackPlaying(false)}
          onEnded={() => setSoundtrackPlaying(false)}
        />
      ) : null}

      <style jsx>{`
        @keyframes finishGlowFade {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          18% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.03);
          }
        }

        @keyframes caretBlink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        @keyframes occasionFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -34px, 0) rotate(0deg) scale(0.78);
          }
          12% {
            opacity: 0.34;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 118vh, 0) rotate(26deg) scale(1.08);
          }
        }

        .signature-photo-card {
          transform-origin: center;
          transition: transform 180ms ease;
        }

        .signature-photo-card:hover {
          transform: translateY(-2px) rotate(var(--photo-rotate));
        }

        .signature-letter-body::after {
          content: "";
          display: block;
          clear: both;
        }

        @media (max-width: 760px) {
          aside[aria-label="Signature photo memories"] {
            float: none;
            width: 100%;
            min-width: 0;
            margin: 0 0 22px;
          }
        }
      `}</style>

      {showFinishGlow ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 30,
            animation: "finishGlowFade 2.2s ease-out forwards",
            background: `radial-gradient(circle at center, ${theme.glow} 0%, rgba(255,244,229,0.18) 35%, rgba(255,244,229,0) 72%)`,
          }}
        />
      ) : null}

      {!opened ? (
        <div
          onClick={openLetter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLetter();
            }
          }}
          style={{
            maxWidth: signatureAddOns && signaturePalette ? 640 : 560,
            margin: "28px auto 0",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {signatureAddOns && signaturePalette ? (
            <SignatureClosedCover
              title={title}
              preview={preview}
              occasion={occasion}
              seal={theme.seal}
              photos={signatureAddOns.photos}
              palette={signaturePalette}
              music={signatureAddOns.music}
              titleFontFamily={titleFontFamily}
            />
          ) : (
          <div
            style={{
              position: "relative",
              height: 360,
              borderRadius: 28,
              background:
                "linear-gradient(180deg, rgba(70,20,35,0.95), rgba(22,14,16,0.98))",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(145deg, transparent 49.5%, rgba(255,255,255,0.08) 50%, transparent 50.5%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "56%",
                clipPath: "polygon(0 0, 100% 0, 50% 72%)",
                background:
                  "linear-gradient(180deg, rgba(98,20,52,0.95), rgba(56,11,28,0.95))",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            {hasSignaturePhotos ? (
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  right: 34,
                  top: 42,
                  height: 148,
                  pointerEvents: "none",
                }}
              >
                {signatureAddOns?.photos.slice(0, 3).map((photo, index) => (
                  <div
                    key={photo.id}
                    style={{
                      position: "absolute",
                      width: index === 0 ? 132 : 102,
                      height: index === 0 ? 106 : 82,
                      left: index === 0 ? "8%" : index === 1 ? "54%" : "34%",
                      top: index === 0 ? 16 : index === 1 ? 0 : 56,
                      transform: `rotate(${index === 0 ? -6 : index === 1 ? 5 : -2}deg)`,
                      borderRadius: 14,
                      background: "#fff",
                      padding: 7,
                      boxShadow: "0 14px 28px rgba(0,0,0,0.28)",
                    }}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 10,
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "52%",
                transform: "translate(-50%, -50%)",
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff5b97, #c026d3)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 10px 30px rgba(255,91,151,0.35)",
                fontSize: 30,
              }}
            >
              {theme.seal}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 18,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              Tap to open {"\u{1F48C}"}
            </div>
          </div>
          )}
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            background:
              signaturePalette?.paper ||
              "linear-gradient(180deg, rgba(251,244,232,0.98), rgba(244,235,220,0.98))",
            borderRadius: 30,
            padding: "34px 42px 34px",
            color: signaturePalette?.ink || "#5a3d2b",
            boxShadow: signaturePalette
              ? `0 30px 82px rgba(0,0,0,0.34), 0 0 0 1px ${signaturePalette.tape} inset`
              : "0 26px 70px rgba(0,0,0,0.30)",
            border: signaturePalette
              ? `1px solid ${signaturePalette.tape}`
              : "1px solid rgba(130, 90, 60, 0.16)",
            overflow: "hidden",
          }}
        >
          {signaturePalette ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: signaturePalette.wash,
                opacity: 0.95,
                zIndex: 0,
              }}
            />
          ) : null}
          {hasSignaturePhotos && signatureAddOns?.photoBackground === true ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `linear-gradient(${signaturePalette ? "rgba(255,250,246,0.84), rgba(255,250,246,0.90)" : "rgba(251,244,232,0.86), rgba(251,244,232,0.92)"}), url(${signatureAddOns.photos[0].src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.34,
                zIndex: 0,
              }}
            />
          ) : null}
          {isTypingActive ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 0,
              }}
            >
              {typingParticles.map((particle, index) => (
                <span
                  key={`${particle.symbol}-${index}`}
                  style={{
                    position: "absolute",
                    top: -42,
                    left: particle.left,
                    fontSize: particle.size,
                    opacity: 0,
                    animation: `occasionFall ${particle.duration} linear ${particle.delay} infinite`,
                    filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
                    willChange: "transform, opacity",
                  }}
                >
                  {particle.symbol}
                </span>
              ))}
            </div>
          ) : null}

          <LetterCelebration
            show={showCelebration}
            symbols={theme.symbols}
            centerSymbol={theme.centerSymbol}
          />

          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              fontSize: 22,
              opacity: 0.55,
            }}
          >
            {theme.cornerOne}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 18,
              fontSize: 22,
              opacity: 0.55,
            }}
          >
            {theme.cornerTwo}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.07,
              backgroundImage:
                "radial-gradient(rgba(80,60,40,0.35) 0.7px, transparent 0.7px)",
              backgroundSize: "10px 10px",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ marginBottom: 12, fontSize: 18, opacity: 0.8, fontStyle: "italic" }}>
              {recipientLine?.trim() || "To you:"}
            </div>

            <div
              style={{
                fontSize: 28,
                lineHeight: 1.2,
                marginBottom: 26,
                fontFamily: titleFontFamily,
                color: signaturePalette?.ink || "#5a3d2b",
              }}
            >
              {title}
            </div>

            {preview?.trim() ? (
              <div style={{ marginBottom: 24, fontSize: 16, opacity: 0.78, fontStyle: "italic" }}>
                {preview}
              </div>
            ) : null}

            {hasOpeningSoundtrack && signatureAddOns ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "-4px 0 24px",
                }}
              >
                <button
                  type="button"
                  onClick={() => void toggleWritingSoundtrack()}
                  aria-pressed={soundtrackPlaying}
                  style={{
                    border: `1px solid ${signaturePalette?.tape || "rgba(130,90,60,0.18)"}`,
                    background: "rgba(255,255,255,0.52)",
                    color: signaturePalette?.ink || "#5a3d2b",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  {soundtrackPlaying ? "Pause" : "Play"} {musicLabel(signatureAddOns.music)}
                </button>
              </div>
            ) : null}

            <div
              className="signature-letter-body"
              style={{
                minHeight: 280,
                whiteSpace: "pre-wrap",
                fontSize: 21,
                lineHeight: 1.85,
                fontFamily: letterFontFamily,
                color: signaturePalette?.ink || "#5a3d2b",
              }}
            >
              {hasSignaturePhotos && signatureAddOns && signaturePalette ? (
                <SignaturePhotoPage photos={signatureAddOns.photos} palette={signaturePalette} />
              ) : null}
              {typedText}
              {typedText.length < (letter?.length || 0) ? (
                <span style={{ opacity: 0.9, animation: "caretBlink 1s steps(1) infinite" }}>
                  |
                </span>
              ) : null}
            </div>

            {typedPs ? (
              <div
                style={{
                  marginTop: 26,
                  fontSize: 18,
                  fontStyle: "italic",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                  fontFamily: letterFontFamily,
                  color: signaturePalette?.ink || "#5a3d2b",
                }}
              >
                {typedPs}
                {typedPs.length < (`PS: ${ps?.trim() || ""}`).length ? (
                  <span style={{ opacity: 0.9, animation: "caretBlink 1s steps(1) infinite" }}>
                    |
                  </span>
                ) : null}
              </div>
            ) : null}

            <div ref={typingAnchorRef} style={{ height: 2, width: "100%" }} />

            {showSignature ? (
              <div style={{ marginTop: 34, textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 22,
                    marginBottom: 10,
                    fontFamily: closingFontFamily,
                    color: signaturePalette?.ink || "#5a3d2b",
                  }}
                >
                  {signature}
                </div>
              </div>
            ) : null}

            <div
              style={{
                marginTop: 34,
                borderRadius: 24,
                border: "1px solid rgba(90, 61, 43, 0.12)",
                background:
                  "linear-gradient(135deg, rgba(126, 32, 84, 0.10), rgba(255,255,255,0.35))",
                padding: "22px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#5a3d2b" }}>
                  {ctaTitle}
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(90, 61, 43, 0.88)" }}>
                  {ctaBody}
                </div>
              </div>

              <Link
                href={ctaHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 22px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #8a0f4d, #5b0d2c)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 16,
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 24px rgba(91, 13, 44, 0.20)",
                }}
              >
                {ctaButtonText}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

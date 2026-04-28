"use client";

import React from "react";

type Props = {
  show: boolean;
  symbols?: string[];
  centerSymbol?: string;
};

type Particle = {
  symbol: string;
  left: string;
  delay: string;
  size: number;
  duration: string;
};

const DEFAULT_SYMBOLS = ["💖", "✨", "💐", "💕", "🌸", "💫", "💗", "🌷", "💞", "⭐"];

function makeBottomWave(
  count: number,
  startDelay: number,
  durationBase: number,
  symbols: string[]
): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    symbol: symbols[i % symbols.length],
    left: `${2 + ((i * 5.3) % 96)}%`,
    delay: `${startDelay + (i % 10) * 0.08}s`,
    size: 18 + (i % 4) * 4,
    duration: `${durationBase + (i % 5) * 0.2}s`,
  }));
}

function makeTopWave(
  count: number,
  startDelay: number,
  durationBase: number,
  symbols: string[]
): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    symbol: symbols[(i + 2) % symbols.length],
    left: `${1 + ((i * 6.1) % 98)}%`,
    delay: `${startDelay + (i % 9) * 0.09}s`,
    size: 18 + (i % 4) * 4,
    duration: `${durationBase + (i % 4) * 0.22}s`,
  }));
}

function makeBurstItems(symbols: string[]) {
  return Array.from({ length: 14 }, (_, i) => ({
    symbol: symbols[i % symbols.length],
    angle: `${i * 26}deg`,
    distance: `${110 + (i % 5) * 16}px`,
    delay: `${0.9 + (i % 8) * 0.05}s`,
    size: 18 + (i % 4) * 4,
  }));
}

export default function LetterCelebration({
  show,
  symbols = DEFAULT_SYMBOLS,
  centerSymbol = "✨",
}: Props) {
  if (!show) return null;

  const bottomWaveOne = makeBottomWave(16, 0.0, 4.8, symbols);
  const bottomWaveTwo = makeBottomWave(12, 0.75, 5.0, symbols);
  const topWaveOne = makeTopWave(14, 0.2, 4.2, symbols);
  const topWaveTwo = makeTopWave(10, 0.95, 4.35, symbols);
  const burstItems = makeBurstItems(symbols);

  return (
    <>
      <style>{`
        @keyframes floatUpAbundant {
          0% {
            opacity: 0;
            transform: translate3d(0, 46px, 0) scale(0.72) rotate(0deg);
          }
          12% {
            opacity: 0.78;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -125vh, 0) scale(1.12) rotate(18deg);
          }
        }

        @keyframes rainDownAbundant {
          0% {
            opacity: 0;
            transform: translate3d(0, -46px, 0) scale(0.76) rotate(0deg);
          }
          12% {
            opacity: 0.78;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 118vh, 0) scale(1.1) rotate(-20deg);
          }
        }

        @keyframes centerBurst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0.35);
          }
          16% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)) scale(1.05);
          }
        }

        @keyframes softFlash {
          0% {
            opacity: 0;
          }
          18% {
            opacity: 0.32;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes sparklePulse {
          0% {
            opacity: 0;
            transform: scale(0.4);
          }
          20% {
            opacity: 0.86;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.35);
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "softFlash 2s ease-out forwards",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.58) 0%, rgba(255,240,245,0.24) 28%, rgba(255,240,245,0) 65%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            transform: "translate(-50%, -50%)",
            fontSize: 46,
            opacity: 0,
            animation: "sparklePulse 1.5s ease-out 0.95s forwards",
            filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
          }}
        >
          {centerSymbol}
        </div>

        {[...bottomWaveOne, ...bottomWaveTwo].map((item, index) => (
          <span
            key={`bottom-${index}`}
            style={{
              position: "absolute",
              bottom: -34,
              left: item.left,
              fontSize: item.size,
              animation: `floatUpAbundant ${item.duration} ease-out ${item.delay} forwards`,
              filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
              willChange: "transform, opacity",
            }}
          >
            {item.symbol}
          </span>
        ))}

        {[...topWaveOne, ...topWaveTwo].map((item, index) => (
          <span
            key={`top-${index}`}
            style={{
              position: "absolute",
              top: -34,
              left: item.left,
              fontSize: item.size + 2,
              animation: `rainDownAbundant ${item.duration} ease-out ${item.delay} forwards`,
              filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
              willChange: "transform, opacity",
            }}
          >
            {item.symbol}
          </span>
        ))}

        {burstItems.map((item, index) => (
          <span
            key={`burst-${index}`}
            style={
              {
                position: "absolute",
                left: "50%",
                top: "48%",
                fontSize: item.size,
                animation: `centerBurst 1.65s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay} forwards`,
                filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
                "--angle": item.angle,
                "--distance": item.distance,
                willChange: "transform, opacity",
              } as React.CSSProperties
            }
          >
            {item.symbol}
          </span>
        ))}
      </div>
    </>
  );
}

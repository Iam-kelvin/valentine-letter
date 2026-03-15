"use client";

type Props = {
  show: boolean;
};

const items = [
  { symbol: "💖", left: "8%", delay: "0s", size: 26 },
  { symbol: "✨", left: "18%", delay: "0.25s", size: 20 },
  { symbol: "💐", left: "28%", delay: "0.1s", size: 24 },
  { symbol: "💕", left: "40%", delay: "0.4s", size: 28 },
  { symbol: "🌸", left: "52%", delay: "0.15s", size: 22 },
  { symbol: "💫", left: "64%", delay: "0.5s", size: 20 },
  { symbol: "💗", left: "74%", delay: "0.2s", size: 26 },
  { symbol: "✨", left: "86%", delay: "0.35s", size: 18 },
];

export default function LetterCelebration({ show }: Props) {
  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes floatUpLove {
          0% {
            transform: translateY(0) scale(0.85) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          100% {
            transform: translateY(-140px) scale(1.12) rotate(8deg);
            opacity: 0;
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
        {items.map((item, index) => (
          <span
            key={index}
            style={{
              position: "absolute",
              bottom: 18,
              left: item.left,
              fontSize: item.size,
              animation: `floatUpLove 2.8s ease-out ${item.delay} forwards`,
              filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>
    </>
  );
}

"use client";

type Props = {
  show: boolean;
};

const bottomItems = [
  { symbol: "💖", left: "5%", delay: "0s", size: 26, duration: "4.8s" },
  { symbol: "✨", left: "12%", delay: "0.2s", size: 20, duration: "5.1s" },
  { symbol: "💐", left: "19%", delay: "0.08s", size: 24, duration: "5s" },
  { symbol: "💕", left: "27%", delay: "0.32s", size: 28, duration: "4.9s" },
  { symbol: "🌸", left: "35%", delay: "0.12s", size: 22, duration: "5.2s" },
  { symbol: "💫", left: "43%", delay: "0.42s", size: 20, duration: "5s" },
  { symbol: "💗", left: "51%", delay: "0.18s", size: 26, duration: "4.8s" },
  { symbol: "✨", left: "59%", delay: "0.3s", size: 18, duration: "5.15s" },
  { symbol: "🌷", left: "67%", delay: "0.1s", size: 24, duration: "4.9s" },
  { symbol: "💞", left: "75%", delay: "0.34s", size: 26, duration: "5.2s" },
  { symbol: "⭐", left: "83%", delay: "0.16s", size: 20, duration: "5s" },
  { symbol: "💐", left: "91%", delay: "0.38s", size: 24, duration: "4.95s" },
];

const topItems = [
  { symbol: "✨", left: "7%", delay: "0.45s", size: 24, duration: "4.4s" },
  { symbol: "🌸", left: "16%", delay: "0.6s", size: 22, duration: "4.6s" },
  { symbol: "💖", left: "25%", delay: "0.5s", size: 26, duration: "4.3s" },
  { symbol: "🌷", left: "34%", delay: "0.72s", size: 24, duration: "4.5s" },
  { symbol: "💞", left: "43%", delay: "0.56s", size: 25, duration: "4.35s" },
  { symbol: "⭐", left: "52%", delay: "0.8s", size: 20, duration: "4.55s" },
  { symbol: "💐", left: "61%", delay: "0.64s", size: 24, duration: "4.4s" },
  { symbol: "✨", left: "70%", delay: "0.9s", size: 20, duration: "4.6s" },
  { symbol: "🌸", left: "79%", delay: "0.68s", size: 22, duration: "4.5s" },
  { symbol: "💖", left: "88%", delay: "0.84s", size: 26, duration: "4.35s" },
];

const burstItems = [
  { symbol: "💖", angle: "0deg", distance: "120px", delay: "1.05s", size: 24 },
  { symbol: "✨", angle: "30deg", distance: "140px", delay: "1.11s", size: 18 },
  { symbol: "🌸", angle: "60deg", distance: "126px", delay: "1.17s", size: 22 },
  { symbol: "💐", angle: "90deg", distance: "146px", delay: "1.23s", size: 24 },
  { symbol: "💗", angle: "120deg", distance: "128px", delay: "1.29s", size: 24 },
  { symbol: "🌷", angle: "150deg", distance: "144px", delay: "1.35s", size: 22 },
  { symbol: "⭐", angle: "180deg", distance: "122px", delay: "1.41s", size: 18 },
  { symbol: "💞", angle: "210deg", distance: "142px", delay: "1.47s", size: 24 },
  { symbol: "💖", angle: "240deg", distance: "132px", delay: "1.53s", size: 24 },
  { symbol: "✨", angle: "270deg", distance: "148px", delay: "1.59s", size: 18 },
  { symbol: "🌸", angle: "300deg", distance: "126px", delay: "1.65s", size: 22 },
  { symbol: "💐", angle: "330deg", distance: "144px", delay: "1.71s", size: 24 },
];

export default function LetterCelebration({ show }: Props) {
  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes floatUpFull {
          0% {
            opacity: 0;
            transform: translate3d(0, 40px, 0) scale(0.8) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -115vh, 0) scale(1.18) rotate(18deg);
          }
        }

        @keyframes rainDownFull {
          0% {
            opacity: 0;
            transform: translate3d(0, -40px, 0) scale(0.85) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 115vh, 0) scale(1.12) rotate(-20deg);
          }
        }

        @keyframes centerBurst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0.4);
          }
          18% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)) scale(1.15);
          }
        }

        @keyframes softFlash {
          0% {
            opacity: 0;
          }
          18% {
            opacity: 0.42;
          }
          100% {
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "softFlash 1.8s ease-out forwards",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.55) 0%, rgba(255,240,245,0.22) 28%, rgba(255,240,245,0) 65%)",
          }}
        />

        {bottomItems.map((item, index) => (
          <span
            key={`bottom-${index}`}
            style={{
              position: "absolute",
              bottom: -30,
              left: item.left,
              fontSize: item.size,
              animation: `floatUpFull ${item.duration} ease-out ${item.delay} forwards`,
              filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
            }}
          >
            {item.symbol}
          </span>
        ))}

        {topItems.map((item, index) => (
          <span
            key={`top-${index}`}
            style={{
              position: "absolute",
              top: -30,
              left: item.left,
              fontSize: item.size,
              animation: `rainDownFull ${item.duration} ease-out ${item.delay} forwards`,
              filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
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
                top: "50%",
                fontSize: item.size,
                animation: `centerBurst 1.7s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay} forwards`,
                filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.12))",
                "--angle": item.angle,
                "--distance": item.distance,
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
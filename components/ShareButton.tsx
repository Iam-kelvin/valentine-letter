"use client";

import { useEffect, useState } from "react";

type Props = {
  title?: string | null;
  text?: string | null;
};

export default function ShareButton({ title, text }: Props) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  const cleanTitle = title?.trim() || "Letterly letter";
  const cleanText = text?.trim() || "I made you a letter on Letterly.";

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  async function share() {
    const url = currentUrl || window.location.href;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const file = await createShareImageFile(url);

      if (
        file &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: cleanTitle,
            text: cleanText,
            url,
            files: [file],
          });
          return;
        } catch (error) {
          if ((error as DOMException)?.name === "AbortError") return;
        }
      }

      const shareAttempts: ShareData[] = [
        { title: cleanTitle, text: cleanText, url },
        { title: cleanTitle, url },
        { url },
      ];

      for (const shareData of shareAttempts) {
        try {
          if (typeof navigator.canShare === "function" && !navigator.canShare(shareData)) {
            continue;
          }

          await navigator.share(shareData);
          return;
        } catch (error) {
          if ((error as DOMException)?.name === "AbortError") return;
        }
      }
    }

    await copyLink(url);
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setStatus("copied");
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <button
      onClick={() => void share()}
      className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/5"
      type="button"
      title="Open your device share sheet"
    >
      {status === "copied" ? "Link copied" : "Share"}
    </button>
  );
}

async function createShareImageFile(url: string) {
  if (typeof document === "undefined") return null;

  try {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#21000a");
    bg.addColorStop(0.55, "#4b0619");
    bg.addColorStop(1, "#160005");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.arc(980, 120, 260, 0, Math.PI * 2);
    ctx.fill();

    roundRect(ctx, 84, 78, 1032, 474, 42);
    ctx.fillStyle = "rgba(255, 248, 239, 0.96)";
    ctx.fill();

    roundRect(ctx, 118, 112, 964, 406, 28);
    ctx.strokeStyle = "rgba(126, 32, 84, 0.18)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#7e2054";
    ctx.font = "700 34px Arial, sans-serif";
    ctx.fillText("Letterly", 150, 166);

    ctx.fillStyle = "#4b2634";
    ctx.font = "700 58px Georgia, serif";
    wrapCanvasText(ctx, "A letter was made for you", 150, 244, 760, 68, 2);

    ctx.fillStyle = "#6b4a52";
    ctx.font = "30px Arial, sans-serif";
    wrapCanvasText(ctx, "Open it privately, read it slowly, and keep the link close.", 150, 388, 760, 42, 2);

    ctx.fillStyle = "#8b0f46";
    ctx.font = "700 28px Arial, sans-serif";
    ctx.fillText(new URL(url).host, 150, 486);

    ctx.fillStyle = "#8b0f46";
    ctx.font = "76px Arial, sans-serif";
    ctx.fillText("\u{1F48C}", 920, 330);

    const blob = await canvasToBlob(canvas);
    if (!blob) return null;

    return new File([blob], "letterly-letter.png", { type: "image/png" });
  } catch {
    return null;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.92);
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
      continue;
    }

    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) lines.push(line);

  lines.slice(0, maxLines).forEach((lineText, index) => {
    const isLastClipped = index === maxLines - 1 && words.join(" ").length > lines.join(" ").length;
    ctx.fillText(isLastClipped ? `${lineText.replace(/[.,;:!?]*$/, "")}...` : lineText, x, y + index * lineHeight);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

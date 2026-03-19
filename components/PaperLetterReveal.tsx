"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LetterCelebration from "./LetterCelebration";

type Props = {
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
};

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

    return `— ${mapped}, ${cleanName}`;
  }

  if (cleanName) return `— With love, ${cleanName}`;
  if (cleanRole) return `— Your ${cleanRole}`;
  return "— With love";
}

export default function PaperLetterReveal({
  title,
  recipientLine,
  preview,
  letter,
  ps,
  senderName,
  senderRole,
  ctaHref = "/create/mothers-day",
  ctaTitle = "Aww 😌 Want one like this?",
  ctaBody = "Now go make one for your person in seconds.",
  ctaButtonText = "Create my letter 💌",
}: Props) {
    const [opened, setOpened] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [typedPs, setTypedPs] = useState("");
    const [showSignature, setShowSignature] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showFinishGlow, setShowFinishGlow] = useState(false);
    const [isTypingActive, setIsTypingActive] = useState(false);

  const signature = useMemo(
    () => buildSignature(senderRole, senderName),
    [senderRole, senderName]
  );

  const typingAnchorRef = useRef<HTMLDivElement | null>(null);
  const followRafRef = useRef<number | null>(null);
  const lastFollowTimeRef = useRef(0);

  useEffect(() => {
    if (!opened) return;
        setIsTypingActive(true);

    let cancelled = false;
    let mainTimeout: number | null = null;
    let psTimeout: number | null = null;
    let finishTimeout: number | null = null;
    let glowTimeout: number | null = null;

    let i = 0;
    const fullText = letter || "";
    const charDelay = 42;

    function next() {
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

      if (ps?.trim()) {
        let j = 0;
        const psText = `PS: ${ps.trim()}`;

        function nextPs() {
          if (cancelled) return;

          if (j < psText.length) {
            setTypedPs(psText.slice(0, j + 1));
            const ch2 = psText[j];
            j += 1;

            let delay = charDelay;

            if (ch2 === "." || ch2 === "!" || ch2 === "?") delay += 130;
            else if (ch2 === "," || ch2 === ";" || ch2 === ":") delay += 80;
            else if (ch2 === "\n") delay += 110;
            else if (ch2 === " ") delay -= 8;

            psTimeout = window.setTimeout(nextPs, Math.max(delay, 22));
          } else {
            finishTimeout = window.setTimeout(() => {
              if (!cancelled) {
                setIsTypingActive(false);
                setShowSignature(true);
                setShowCelebration(true);
                setShowFinishGlow(true);
                navigator.vibrate?.(120);

                glowTimeout = window.setTimeout(() => {
                  setShowFinishGlow(false);
                }, 2200);

                window.setTimeout(() => {
                  if (!cancelled) setShowCelebration(false);
                }, 3600);
              }
            }, 220);
          }
        }

        nextPs();
        return;
      }

      finishTimeout = window.setTimeout(() => {
        if (!cancelled) {
          setIsTypingActive(false);
          setShowSignature(true);
          setShowCelebration(true);
          setShowFinishGlow(true);
          navigator.vibrate?.(120);

          glowTimeout = window.setTimeout(() => {
            setShowFinishGlow(false);
          }, 2200);

          window.setTimeout(() => {
            if (!cancelled) setShowCelebration(false);
          }, 3600);
        }
      }, 220);
    }

    next();

    return () => {
      cancelled = true;
      if (mainTimeout) window.clearTimeout(mainTimeout);
      if (psTimeout) window.clearTimeout(psTimeout);
      if (finishTimeout) window.clearTimeout(finishTimeout);
      if (glowTimeout) window.clearTimeout(glowTimeout);
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

      if (!anchor || !isTypingActive) {
        return;
      }

      if (now - lastFollowTimeRef.current < 120) {
        followRafRef.current = requestAnimationFrame(followTyping);
        return;
      }

      lastFollowTimeRef.current = now;

      if (!stoppedByUser) {
        const rect = anchor.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const desiredLineY = viewportHeight * 0.78;
        const delta = rect.bottom - desiredLineY;

        if (delta > 26) {
          const nextTop =
            window.scrollY + Math.min(delta * 0.28, 20);

          window.scrollTo({
            top: nextTop,
            behavior: "auto",
          });
        }
      }

      followRafRef.current = requestAnimationFrame(followTyping);
    };

    followRafRef.current = requestAnimationFrame(followTyping);

    return () => {
      if (followRafRef.current) {
        cancelAnimationFrame(followRafRef.current);
      }

      if (stopTimer) {
        window.clearTimeout(stopTimer);
      }

      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [opened, isTypingActive]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
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
      `}</style>

      {showFinishGlow ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 30,
            animation: "finishGlowFade 2.2s ease-out forwards",
            background:
              "radial-gradient(circle at center, rgba(255,244,229,0.55) 0%, rgba(255,244,229,0.18) 35%, rgba(255,244,229,0) 72%)",
          }}
        />
      ) : null}

      {!opened ? (
        <div
          onClick={() => setOpened(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpened(true);
          }}
          style={{
            maxWidth: 420,
            margin: "28px auto 0",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              height: 280,
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
                fontSize: 28,
              }}
            >
              💐
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
              Tap to open 💌
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            background:
              "linear-gradient(180deg, rgba(251,244,232,0.98), rgba(244,235,220,0.98))",
            borderRadius: 30,
            padding: "34px 42px 34px",
            color: "#5a3d2b",
            boxShadow: "0 26px 70px rgba(0,0,0,0.30)",
            border: "1px solid rgba(130, 90, 60, 0.16)",
            overflow: "hidden",
          }}
        >
          <LetterCelebration show={showCelebration} />

          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              fontSize: 22,
              opacity: 0.55,
            }}
          >
            🌸
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
            💗
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

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                marginBottom: 12,
                fontSize: 18,
                opacity: 0.8,
                fontStyle: "italic",
              }}
            >
              {recipientLine?.trim() || "To you:"}
            </div>

            <div
              style={{
                fontSize: 28,
                lineHeight: 1.2,
                marginBottom: 26,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {title}
            </div>

            {preview?.trim() ? (
              <div
                style={{
                  marginBottom: 24,
                  fontSize: 16,
                  opacity: 0.78,
                  fontStyle: "italic",
                }}
              >
                {preview}
              </div>
            ) : null}

            <div
              style={{
                minHeight: 280,
                whiteSpace: "pre-wrap",
                fontSize: 21,
                lineHeight: 1.85,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {typedText}
              {typedText.length < (letter?.length || 0) ? (
                <span
                  style={{
                    opacity: 0.9,
                    animation: "caretBlink 1s steps(1) infinite",
                  }}
                >
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
                }}
              >
                {typedPs}
                {typedPs.length < (`PS: ${ps?.trim() || ""}`).length ? (
                  <span
                    style={{
                      opacity: 0.9,
                      animation: "caretBlink 1s steps(1) infinite",
                    }}
                  >
                    |
                  </span>
                ) : null}
              </div>
            ) : null}

            <div ref={typingAnchorRef} style={{ height: 2, width: "100%" }} />

            {showSignature ? (
              <div
                style={{
                  marginTop: 34,
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    marginBottom: 10,
                    fontFamily: 'Georgia, "Times New Roman", serif',
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
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "#5a3d2b",
                  }}
                >
                  {ctaTitle}
                </div>

                <div
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "rgba(90, 61, 43, 0.88)",
                  }}
                >
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
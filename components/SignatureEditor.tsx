"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import {
  getDefaultSignatureMusic,
  getSignatureAccentFontFamily,
  getSignatureBodyFontFamily,
  getSignatureMusicLabel,
  signatureFonts,
  signatureMusic,
  signatureThemes,
  type SignatureFont,
  type SignatureMusic,
  type SignaturePhoto,
  type SignatureTheme,
} from "@/lib/signature";

type Props = {
  slug: string;
  occasion: string;
  initialTitle: string;
  initialPreview: string;
  initialLetter: string;
  initialPs: string;
  initialTheme: SignatureTheme;
  initialFont: SignatureFont;
  initialMusic: SignatureMusic;
  initialPhotos: SignaturePhoto[];
  initialPhotoBackground: boolean;
  initialEditCount: number;
  initialRegenerateCount: number;
  editLimit: number;
  regenerateLimit: number;
};

type BusyState = "saving" | "regenerating" | null;

const maxPhotoBytes = 900 * 1024;
const maxPhotos = 3;

export default function SignatureEditor({
  slug,
  occasion,
  initialTitle,
  initialPreview,
  initialLetter,
  initialPs,
  initialTheme,
  initialFont,
  initialMusic,
  initialPhotos,
  initialPhotoBackground,
  initialEditCount,
  initialRegenerateCount,
  editLimit,
  regenerateLimit,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [preview, setPreview] = useState(initialPreview);
  const [letter, setLetter] = useState(initialLetter);
  const [ps, setPs] = useState(initialPs);
  const [theme, setTheme] = useState<SignatureTheme>(initialTheme);
  const [font, setFont] = useState<SignatureFont>(initialFont);
  const [music, setMusic] = useState<SignatureMusic>(initialMusic);
  const [photos, setPhotos] = useState<SignaturePhoto[]>(initialPhotos);
  const [photoBackground, setPhotoBackground] = useState(initialPhotoBackground);
  const [editCount, setEditCount] = useState(initialEditCount);
  const [regenerateCount, setRegenerateCount] = useState(initialRegenerateCount);
  const [busy, setBusy] = useState<BusyState>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editRemaining = Math.max(0, editLimit - editCount);
  const regenerateRemaining = Math.max(0, regenerateLimit - regenerateCount);
  const suggestedMusic = getDefaultSignatureMusic(occasion);

  const payload = useMemo(
    () => ({ title, preview, letter, ps, theme, font, music, photos, photoBackground }),
    [title, preview, letter, ps, theme, font, music, photos, photoBackground]
  );

  async function save() {
    if (editRemaining <= 0) {
      setError("This Premium Letter has reached its edit limit.");
      return;
    }

    setBusy("saving");
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/letters/${slug}/signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Could not save changes.");

      setEditCount(Number(data.signature_edit_count ?? editCount + 1));
      setRegenerateCount(Number(data.signature_regenerate_count ?? regenerateCount));
      setMessage("Saved. Use View letter to see the final share page.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setBusy(null);
    }
  }

  async function regenerate() {
    if (regenerateRemaining <= 0) {
      setError("This Premium Letter has reached its regenerate limit.");
      return;
    }

    setBusy("regenerating");
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/letters/${slug}/signature/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Could not regenerate.");

      setTitle(data.title ?? title);
      setPreview(data.preview ?? preview);
      setLetter(data.letter ?? letter);
      setPs(data.ps ?? ps);
      setEditCount(Number(data.signature_edit_count ?? editCount));
      setRegenerateCount(Number(data.signature_regenerate_count ?? regenerateCount + 1));
      setMessage("Regenerated and saved. Review the preview, then View letter.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not regenerate.");
    } finally {
      setBusy(null);
    }
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError(null);

    if (!files.length) return;

    const availableSlots = maxPhotos - photos.length;
    if (availableSlots <= 0) {
      setError("You can keep up to 3 photos on one Premium Letter.");
      return;
    }

    const accepted = files.slice(0, availableSlots);
    const tooLarge = accepted.find((file) => file.size > maxPhotoBytes);
    if (tooLarge) {
      setError("Use photos under 900KB each for now.");
      return;
    }

    const nextPhotos = await Promise.all(
      accepted.map(async (file) => ({
        id: `${Date.now()}-${file.name}`,
        src: await readFileAsDataUrl(file),
        caption: "",
      }))
    );

    setPhotos((current) => [...current, ...nextPhotos].slice(0, maxPhotos));
  }

  function updateCaption(id: string, caption: string) {
    setPhotos((current) =>
      current.map((photo) => (photo.id === id ? { ...photo, caption } : photo))
    );
  }

  function removePhoto(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
  }

  return (
    <div style={shellStyle}>
      <div style={headerStyle}>
        <div>
          <div style={eyebrowStyle}>Premium Letter</div>
          <h1 style={titleStyle}>Edit Premium</h1>
          <p style={headerHelpStyle}>
            Make the changes, check the preview, then save.
          </p>
        </div>
        <div style={headerActionsStyle}>
          <CounterPill label="Edits left" value={editRemaining} />
          <CounterPill label="Regens left" value={regenerateRemaining} />
          <Link href={`/l/${slug}`} style={viewLinkStyle}>
            View letter
          </Link>
        </div>
      </div>

      <div style={gridStyle}>
        <section style={panelStyle}>
          <label style={labelStyle}>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            Preview
            <textarea
              value={preview}
              onChange={(event) => setPreview(event.target.value)}
              maxLength={140}
              rows={3}
              style={textareaStyle}
            />
          </label>

          <label style={labelStyle}>
            Letter
            <textarea
              value={letter}
              onChange={(event) => setLetter(event.target.value)}
              rows={14}
              style={{ ...textareaStyle, minHeight: 340 }}
            />
          </label>

          <label style={labelStyle}>
            PS
            <textarea
              value={ps}
              onChange={(event) => setPs(event.target.value)}
              maxLength={280}
              rows={3}
              style={textareaStyle}
            />
          </label>
        </section>

        <aside style={panelStyle}>
          <LiveSignaturePreview
            title={title}
            preview={preview}
            ps={ps}
            theme={theme}
            font={font}
            music={music}
            photos={photos}
            photoBackground={photoBackground}
            occasion={occasion}
          />

          <GuideCard />

          <ControlGroup label="Theme">
            {signatureThemes.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTheme(item.key)}
                style={optionStyle(theme === item.key)}
              >
                <span>{item.label}</span>
                <small style={hintStyle}>{item.hint}</small>
              </button>
            ))}
          </ControlGroup>

          <ControlGroup label="Font">
            <div style={compactOptionsStyle}>
              {signatureFonts.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFont(item.key)}
                  style={optionStyle(font === item.key)}
                >
                  <span
                    style={{
                      fontFamily: getSignatureAccentFontFamily(item.key),
                      fontSize: item.key === "clean" ? 18 : 22,
                      lineHeight: 1.08,
                      fontWeight: item.key === "clean" ? 850 : 700,
                    }}
                  >
                    {item.label}
                  </span>
                  <small style={hintStyle}>{item.hint}</small>
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Soundtrack">
            {music === "none" ? (
              <button
                type="button"
                onClick={() => setMusic(suggestedMusic)}
                style={suggestedMusicStyle}
              >
                Suggested for this occasion: {getSignatureMusicLabel(suggestedMusic)}
              </button>
            ) : null}
            <div style={compactOptionsStyle}>
              {signatureMusic.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMusic(item.key)}
                  style={optionStyle(music === item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Photos">
            <input type="file" accept="image/*" multiple onChange={addPhotos} style={fileInputStyle} />

            {photos.length ? (
              <label style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={photoBackground}
                  onChange={(event) => setPhotoBackground(event.target.checked)}
                />
                Use first photo as a soft letter background
              </label>
            ) : null}

            {photos.length ? (
              <div style={photoListStyle}>
                {photos.map((photo) => (
                  <div key={photo.id} style={photoRowStyle}>
                    <img src={photo.src} alt="" style={thumbStyle} />
                    <input
                      value={photo.caption ?? ""}
                      onChange={(event) => updateCaption(photo.id, event.target.value)}
                      placeholder="Caption"
                      maxLength={80}
                      style={captionInputStyle}
                    />
                    <button type="button" onClick={() => removePhoto(photo.id)} style={removeButtonStyle}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </ControlGroup>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={save}
              disabled={!!busy || editRemaining <= 0}
              style={actionButtonStyle("primary", !!busy || editRemaining <= 0)}
            >
              {busy === "saving" ? "Saving..." : `Save changes (${editRemaining} left)`}
            </button>
            <button
              type="button"
              onClick={regenerate}
              disabled={!!busy || regenerateRemaining <= 0}
              style={actionButtonStyle("secondary", !!busy || regenerateRemaining <= 0)}
            >
              {busy === "regenerating"
                ? "Rewriting..."
                : `Rewrite letter (${regenerateRemaining} left)`}
            </button>
          </div>

          {message ? <p style={messageStyle}>{message}</p> : null}
          {error ? <p style={errorStyle}>{error}</p> : null}
        </aside>
      </div>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={groupStyle}>
      <div style={groupLabelStyle}>{label}</div>
      {children}
    </div>
  );
}

function CounterPill({ label, value }: { label: string; value: number }) {
  return (
    <span style={counterPillStyle}>
      <strong>{value}</strong> {label}
    </span>
  );
}

function GuideCard() {
  return (
    <div style={guideCardStyle}>
      <strong>How this page works</strong>
      <p style={guideTextStyle}>
        Save keeps your edits. Rewrite replaces the whole letter and saves the new version.
      </p>
    </div>
  );
}

function LiveSignaturePreview({
  title,
  preview,
  ps,
  theme,
  font,
  music,
  photos,
  photoBackground,
  occasion,
}: {
  title: string;
  preview: string;
  ps: string;
  theme: SignatureTheme;
  font: SignatureFont;
  music: SignatureMusic;
  photos: SignaturePhoto[];
  photoBackground: boolean;
  occasion: string;
}) {
  const colors = previewColors(theme, occasion);
  const titleFont = getSignatureAccentFontFamily(font);
  const bodyFont = getSignatureBodyFontFamily();

  return (
    <div
      style={{
        ...previewShellStyle,
        background:
          photoBackground && photos[0]
            ? `linear-gradient(rgba(255,250,246,0.86), rgba(255,250,246,0.92)), url(${photos[0].src})`
            : colors.background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderColor: colors.border,
      }}
    >
      <div style={previewTopRowStyle}>
        <span style={{ ...previewBadgeStyle, color: colors.accent, borderColor: colors.border }}>
          Preview
        </span>
        {music !== "none" ? (
          <span style={{ ...previewBadgeStyle, color: colors.ink, borderColor: colors.border }}>
            {getSignatureMusicLabel(music)}
          </span>
        ) : null}
      </div>

      <h2 style={{ ...previewTitleStyle, color: colors.ink, fontFamily: titleFont }}>
        {title || "Untitled letter"}
      </h2>
      <p style={{ ...previewCopyStyle, color: colors.softInk, fontFamily: bodyFont }}>
        {preview || "Your preview will appear here."}
      </p>

      {photos.length ? (
        <div style={previewPhotosStyle}>
          {photos.slice(0, 3).map((photo, index) => (
            <img
              key={photo.id}
              src={photo.src}
              alt=""
              style={{
                ...previewPhotoStyle,
                transform: `rotate(${index === 0 ? -4 : index === 1 ? 3 : -1}deg)`,
              }}
            />
          ))}
        </div>
      ) : null}

      {ps.trim() ? (
        <p style={{ ...previewPsStyle, color: colors.softInk, fontFamily: bodyFont }}>
          PS: {ps.trim()}
        </p>
      ) : null}

      <p
        style={{
          margin: "14px 0 0",
          textAlign: "right",
          color: colors.ink,
          fontFamily: titleFont,
          fontSize: font === "clean" ? 18 : 24,
          lineHeight: 1.2,
        }}
      >
        - With love
      </p>
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read this photo."));
    reader.readAsDataURL(file);
  });
}

function optionStyle(active: boolean): React.CSSProperties {
  return {
    width: "100%",
    borderRadius: 13,
    border: active ? "1px solid rgba(255,195,209,0.72)" : "1px solid rgba(255,255,255,0.14)",
    background: active ? "rgba(255,195,209,0.14)" : "rgba(255,255,255,0.045)",
    color: "#fff",
    padding: "10px 11px",
    display: "grid",
    gap: 3,
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 800,
  };
}

function actionButtonStyle(kind: "primary" | "secondary", disabled: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: 16,
    minHeight: 50,
    fontWeight: 950,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.54 : 1,
  };

  if (kind === "primary") {
    return {
      ...base,
      border: 0,
      background: "#fff",
      color: "#1a1014",
    };
  }

  return {
    ...base,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
  };
}

function previewColors(theme: SignatureTheme, occasion: string) {
  const key =
    theme === "auto"
      ? occasion === "birthday" || occasion === "congratulations"
        ? "celebration-board"
        : occasion === "faith" || occasion === "closure" || occasion === "ex"
        ? "quiet-keepsake"
        : occasion === "love" || occasion === "confession"
        ? "romantic-photobook"
        : "memory-album"
      : theme;

  if (key === "celebration-board") {
    return {
      background: "linear-gradient(135deg, rgba(255,245,213,0.92), rgba(255,229,164,0.72))",
      border: "rgba(255,224,138,0.44)",
      ink: "#4f3219",
      softInk: "rgba(79,50,25,0.72)",
      accent: "#9d5f05",
    };
  }

  if (key === "quiet-keepsake") {
    return {
      background: "linear-gradient(135deg, rgba(248,244,255,0.92), rgba(225,217,247,0.72))",
      border: "rgba(217,199,255,0.44)",
      ink: "#3d3148",
      softInk: "rgba(61,49,72,0.72)",
      accent: "#655091",
    };
  }

  if (key === "blue-keepsake") {
    return {
      background: "linear-gradient(135deg, rgba(246,251,255,0.94), rgba(219,236,249,0.76))",
      border: "rgba(176,215,241,0.52)",
      ink: "#213a55",
      softInk: "rgba(33,58,85,0.72)",
      accent: "#3f7fbf",
    };
  }

  if (key === "garden-note") {
    return {
      background: "linear-gradient(135deg, rgba(250,255,247,0.94), rgba(223,240,218,0.74))",
      border: "rgba(193,225,187,0.52)",
      ink: "#314a37",
      softInk: "rgba(49,74,55,0.72)",
      accent: "#4f8d62",
    };
  }

  if (key === "romantic-photobook") {
    return {
      background: "linear-gradient(135deg, rgba(255,247,250,0.94), rgba(255,222,232,0.74))",
      border: "rgba(255,195,209,0.52)",
      ink: "#5d2f3f",
      softInk: "rgba(93,47,63,0.72)",
      accent: "#b83265",
    };
  }

  return {
    background: "linear-gradient(135deg, rgba(255,250,239,0.94), rgba(235,217,185,0.70))",
    border: "rgba(232,207,164,0.48)",
    ink: "#57412f",
    softInk: "rgba(87,65,47,0.72)",
    accent: "#8a6232",
  };
}

function previewTitleFont(font: SignatureFont) {
  if (font === "love-note") return '"Segoe Script", "Brush Script MT", cursive';
  if (font === "bright-hand") return '"Comic Sans MS", "Segoe Print", cursive';
  if (font === "clean") return 'Arial, "Helvetica Neue", sans-serif';
  return 'Georgia, "Times New Roman", serif';
}

function previewBodyFont(font: SignatureFont) {
  if (font === "clean") return 'Arial, "Helvetica Neue", sans-serif';
  if (font === "bright-hand") return '"Trebuchet MS", Arial, sans-serif';
  return 'Georgia, "Times New Roman", serif';
}

const shellStyle: React.CSSProperties = {
  maxWidth: 1160,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  marginBottom: 22,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: 10,
  alignItems: "center",
};

const headerHelpStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: "rgba(255,255,255,0.62)",
  lineHeight: 1.6,
  maxWidth: 580,
};

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  padding: "7px 11px",
  color: "#ffc3d1",
  fontSize: 12,
  fontWeight: 900,
};

const titleStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: "clamp(30px, 4vw, 44px)",
  lineHeight: 1.05,
  letterSpacing: 0,
};

const viewLinkStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  color: "#fff",
  padding: "10px 14px",
  textDecoration: "none",
  fontWeight: 850,
};

const counterPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  minHeight: 40,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.78)",
  padding: "0 12px",
  fontSize: 13,
  fontWeight: 800,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
  gap: 18,
};

const panelStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(255,255,255,0.045)",
  padding: 16,
  boxShadow: "0 18px 48px rgba(0,0,0,0.20)",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  marginBottom: 15,
  color: "rgba(255,255,255,0.82)",
  fontSize: 14,
  fontWeight: 800,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.24)",
  color: "#fff",
  padding: "13px 14px",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.6,
};

const groupStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginBottom: 18,
};

const groupLabelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.82)",
  fontSize: 14,
  fontWeight: 900,
};

const compactOptionsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(138px, 1fr))",
  gap: 8,
};

const hintStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.58)",
  fontWeight: 600,
};

const suggestedMusicStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(255,195,209,0.34)",
  background: "rgba(255,195,209,0.10)",
  color: "#ffd0dc",
  padding: "11px 12px",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 850,
};

const guideCardStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(0,0,0,0.14)",
  padding: 12,
  marginBottom: 14,
  color: "#fff",
};

const guideTextStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.62)",
  fontSize: 13,
  lineHeight: 1.6,
};

const previewShellStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid",
  padding: 16,
  margin: "0 0 14px",
  boxShadow: "0 16px 42px rgba(0,0,0,0.18)",
};

const previewTopRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 12,
};

const previewBadgeStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid",
  background: "rgba(255,255,255,0.45)",
  padding: "6px 9px",
  fontSize: 11,
  fontWeight: 900,
};

const previewTitleStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 26,
  lineHeight: 1.12,
  letterSpacing: 0,
};

const previewCopyStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.65,
};

const previewPhotosStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 14,
  alignItems: "center",
};

const previewPhotoStyle: React.CSSProperties = {
  width: 76,
  height: 58,
  objectFit: "cover",
  borderRadius: 10,
  border: "5px solid rgba(255,255,255,0.84)",
  boxShadow: "0 10px 18px rgba(50,28,28,0.16)",
};

const previewPsStyle: React.CSSProperties = {
  margin: "14px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  fontStyle: "italic",
};

const fileInputStyle: React.CSSProperties = {
  width: "100%",
  color: "rgba(255,255,255,0.78)",
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  color: "rgba(255,255,255,0.72)",
  fontSize: 13,
  fontWeight: 800,
};

const photoListStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const photoRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "58px 1fr auto",
  gap: 9,
  alignItems: "center",
};

const thumbStyle: React.CSSProperties = {
  width: 58,
  height: 46,
  objectFit: "cover",
  borderRadius: 10,
};

const captionInputStyle: React.CSSProperties = {
  ...inputStyle,
  padding: "10px 11px",
  fontSize: 14,
};

const removeButtonStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "transparent",
  color: "rgba(255,255,255,0.72)",
  padding: "9px 10px",
  cursor: "pointer",
};

const actionsStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 18,
};

const messageStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: "#baf7d0",
  fontSize: 13,
};

const errorStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: "#ff9bad",
  fontSize: 13,
};

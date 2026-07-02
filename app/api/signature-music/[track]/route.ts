import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Track =
  | "birthday-pop"
  | "romantic-groove"
  | "celebration-pop"
  | "friendship-bright"
  | "cheeky-bounce"
  | "gratitude-soul"
  | "faith-ambient"
  | "closure-calm"
  | "apology-soft";

type TrackConfig = {
  name: string;
  bpm: number;
  chords: number[][];
  melody: number[];
  bass: number[];
  percussion: "party" | "groove" | "light" | "none";
  swing?: number;
};

const legacyTrackMap: Record<string, Track> = {
  "soft-piano": "closure-calm",
  "slow-dance": "romantic-groove",
  "warm-rnb": "gratitude-soul",
};

const tracks: Record<Track, TrackConfig> = {
  "birthday-pop": {
    name: "Birthday Song",
    bpm: 118,
    chords: [
      [261.63, 329.63, 392.0],
      [349.23, 440.0, 523.25],
      [392.0, 493.88, 587.33],
      [261.63, 329.63, 523.25],
    ],
    melody: [523.25, 523.25, 587.33, 523.25, 698.46, 659.25, 523.25, 523.25, 587.33, 523.25, 783.99, 698.46],
    bass: [130.81, 174.61, 196.0, 130.81],
    percussion: "party",
  },
  "romantic-groove": {
    name: "Slow Dance",
    bpm: 86,
    chords: [
      [220.0, 277.18, 329.63],
      [196.0, 246.94, 293.66],
      [174.61, 220.0, 261.63],
      [196.0, 246.94, 329.63],
    ],
    melody: [440.0, 493.88, 523.25, 493.88, 440.0, 392.0, 349.23, 392.0, 440.0],
    bass: [110.0, 98.0, 87.31, 98.0],
    percussion: "groove",
    swing: 0.08,
  },
  "celebration-pop": {
    name: "Celebration Pop",
    bpm: 124,
    chords: [
      [293.66, 369.99, 440.0],
      [329.63, 415.3, 493.88],
      [246.94, 311.13, 369.99],
      [392.0, 493.88, 587.33],
    ],
    melody: [587.33, 659.25, 739.99, 659.25, 587.33, 493.88, 587.33, 659.25, 880.0],
    bass: [146.83, 164.81, 123.47, 196.0],
    percussion: "party",
  },
  "friendship-bright": {
    name: "Friendship Pop",
    bpm: 108,
    chords: [
      [261.63, 329.63, 392.0],
      [293.66, 369.99, 440.0],
      [220.0, 261.63, 329.63],
      [349.23, 440.0, 523.25],
    ],
    melody: [523.25, 587.33, 659.25, 587.33, 523.25, 440.0, 493.88, 523.25],
    bass: [130.81, 146.83, 110.0, 174.61],
    percussion: "light",
  },
  "cheeky-bounce": {
    name: "Cheeky Bounce",
    bpm: 112,
    chords: [
      [196.0, 246.94, 329.63],
      [220.0, 277.18, 369.99],
      [246.94, 311.13, 415.3],
      [174.61, 220.0, 293.66],
    ],
    melody: [392.0, 440.0, 392.0, 493.88, 523.25, 493.88, 440.0, 587.33],
    bass: [98.0, 110.0, 123.47, 87.31],
    percussion: "groove",
    swing: 0.1,
  },
  "gratitude-soul": {
    name: "Thank You Soul",
    bpm: 78,
    chords: [
      [174.61, 220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66, 369.99],
      [164.81, 207.65, 246.94, 311.13],
      [185.0, 233.08, 277.18, 349.23],
    ],
    melody: [392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 329.63],
    bass: [87.31, 98.0, 82.41, 92.5],
    percussion: "groove",
    swing: 0.06,
  },
  "faith-ambient": {
    name: "Faith Instrumental",
    bpm: 64,
    chords: [
      [261.63, 329.63, 392.0],
      [220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66],
      [174.61, 220.0, 261.63],
    ],
    melody: [523.25, 493.88, 440.0, 392.0, 440.0, 493.88, 523.25],
    bass: [130.81, 110.0, 98.0, 87.31],
    percussion: "none",
  },
  "closure-calm": {
    name: "Peaceful Instrumental",
    bpm: 70,
    chords: [
      [220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66],
      [174.61, 220.0, 261.63],
      [146.83, 174.61, 220.0],
    ],
    melody: [440.0, 392.0, 349.23, 329.63, 349.23, 392.0, 440.0],
    bass: [110.0, 98.0, 87.31, 73.42],
    percussion: "none",
  },
  "apology-soft": {
    name: "Soft Apology",
    bpm: 72,
    chords: [
      [196.0, 246.94, 293.66],
      [174.61, 220.0, 261.63],
      [220.0, 261.63, 329.63],
      [164.81, 207.65, 246.94],
    ],
    melody: [392.0, 349.23, 329.63, 293.66, 329.63, 349.23, 392.0],
    bass: [98.0, 87.31, 110.0, 82.41],
    percussion: "none",
  },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ track: string }> }
) {
  const { track } = await params;
  const resolvedTrack = resolveTrack(track);

  if (!resolvedTrack) {
    return NextResponse.json({ error: "Track not found." }, { status: 404 });
  }

  const wav = makeTrack(tracks[resolvedTrack]);

  return new Response(wav, {
    headers: {
      "Content-Type": "audio/wav",
      "Content-Length": String(wav.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${tracks[resolvedTrack].name
        .replace(/\s+/g, "-")
        .toLowerCase()}.wav"`,
    },
  });
}

function resolveTrack(value: string): Track | null {
  if (value in legacyTrackMap) return legacyTrackMap[value];
  return value in tracks ? (value as Track) : null;
}

function makeTrack(config: TrackConfig) {
  const sampleRate = 44100;
  const duration = 22;
  const samples = new Float32Array(sampleRate * duration);
  const beat = 60 / config.bpm;

  for (let bar = 0; bar < Math.ceil(duration / (beat * 4)); bar += 1) {
    const chord = config.chords[bar % config.chords.length];
    const bass = config.bass[bar % config.bass.length];
    const barStart = bar * beat * 4;

    addNote(samples, sampleRate, bass, barStart, beat * 3.7, 0.12, "bass");
    chord.forEach((frequency, index) => {
      addNote(samples, sampleRate, frequency, barStart + index * 0.05, beat * 3.75, 0.045, "pad");
      addNote(samples, sampleRate, frequency * 2, barStart + beat * (index + 0.3), beat * 0.72, 0.032, "pluck");
    });
  }

  config.melody.forEach((frequency, index) => {
    const swingOffset = index % 2 === 1 ? (config.swing ?? 0) : 0;
    const start = beat * 1.2 + index * beat * 0.72 + swingOffset;
    addNote(samples, sampleRate, frequency, start, beat * 0.62, 0.085, "lead");
  });

  addPercussion(samples, sampleRate, beat, duration, config.percussion);
  fade(samples, sampleRate, 1.2);
  normalize(samples, 0.82);

  return encodeWav(samples, sampleRate);
}

function addPercussion(
  samples: Float32Array,
  sampleRate: number,
  beat: number,
  duration: number,
  style: TrackConfig["percussion"]
) {
  if (style === "none") return;

  const totalBeats = Math.floor(duration / beat);
  for (let i = 0; i < totalBeats; i += 1) {
    const time = i * beat;
    if (i % 4 === 0) addDrum(samples, sampleRate, time, 0.08, 0.12, "kick");
    if (style !== "light" && i % 4 === 2) addDrum(samples, sampleRate, time, 0.055, 0.08, "snare");
    if (style === "party" && i % 2 === 1) addDrum(samples, sampleRate, time, 0.025, 0.045, "hat");
    if (style === "groove" && i % 2 === 1) addDrum(samples, sampleRate, time + beat * 0.08, 0.02, 0.036, "hat");
  }
}

function addDrum(
  samples: Float32Array,
  sampleRate: number,
  startSeconds: number,
  durationSeconds: number,
  gain: number,
  voice: "kick" | "snare" | "hat"
) {
  const start = Math.max(0, Math.floor(startSeconds * sampleRate));
  const length = Math.floor(durationSeconds * sampleRate);
  const end = Math.min(samples.length, start + length);

  for (let i = start; i < end; i += 1) {
    const t = (i - start) / sampleRate;
    const p = (i - start) / Math.max(1, length);
    const env = Math.pow(1 - p, voice === "kick" ? 2.4 : 3.4);
    const noise = Math.sin((i * 12.9898 + 78.233) * 43758.5453) % 1;
    const wave =
      voice === "kick"
        ? Math.sin(2 * Math.PI * (92 - p * 44) * t)
        : voice === "snare"
        ? noise * 0.8 + Math.sin(2 * Math.PI * 180 * t) * 0.2
        : noise;
    samples[i] += wave * env * gain;
  }
}

function addNote(
  samples: Float32Array,
  sampleRate: number,
  frequency: number,
  startSeconds: number,
  durationSeconds: number,
  gain: number,
  voice: "pad" | "pluck" | "lead" | "bass"
) {
  const start = Math.max(0, Math.floor(startSeconds * sampleRate));
  const length = Math.floor(durationSeconds * sampleRate);
  const end = Math.min(samples.length, start + length);

  for (let i = start; i < end; i += 1) {
    const t = (i - start) / sampleRate;
    const local = (i - start) / Math.max(1, length);
    const env = envelope(local, voice);
    const wave = waveform(frequency, t, voice);
    samples[i] += wave * env * gain;
  }
}

function waveform(frequency: number, t: number, voice: "pad" | "pluck" | "lead" | "bass") {
  const base = Math.sin(2 * Math.PI * frequency * t);

  if (voice === "bass") {
    return base * 0.82 + Math.sin(2 * Math.PI * frequency * 0.5 * t) * 0.18;
  }

  if (voice === "pluck") {
    return base * 0.62 + Math.sin(2 * Math.PI * frequency * 2.01 * t) * 0.24;
  }

  if (voice === "lead") {
    return base * 0.68 + Math.sin(2 * Math.PI * frequency * 2 * t) * 0.14;
  }

  return base * 0.5 + Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.22;
}

function envelope(position: number, voice: "pad" | "pluck" | "lead" | "bass") {
  const attack = voice === "pad" ? 0.16 : voice === "bass" ? 0.04 : 0.025;
  const release = voice === "pad" ? 0.32 : 0.2;

  if (position < attack) return position / attack;
  if (position > 1 - release) return Math.max(0, (1 - position) / release);
  return voice === "pluck" ? 0.72 : 1;
}

function fade(samples: Float32Array, sampleRate: number, seconds: number) {
  const count = Math.floor(seconds * sampleRate);
  for (let i = 0; i < count; i += 1) {
    const amount = i / count;
    samples[i] *= amount;
    samples[samples.length - 1 - i] *= amount;
  }
}

function normalize(samples: Float32Array, target: number) {
  let max = 0;
  for (const sample of samples) max = Math.max(max, Math.abs(sample));
  if (max === 0) return;

  const scale = target / max;
  for (let i = 0; i < samples.length; i += 1) samples[i] *= scale;
}

function encodeWav(samples: Float32Array, sampleRate: number) {
  const dataLength = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (const sample of samples) {
    const value = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

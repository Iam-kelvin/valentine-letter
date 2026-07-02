// "use client";

// import { useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getOccasion } from "@/lib/occasions";

// type Length = "short" | "medium" | "long";
// type Privacy = "low" | "medium" | "high";

// export default function OccasionCreatePage() {
//   const router = useRouter();
//   const params = useParams();
//   const occasionKey = String(params.occasion || "");
//   const occasion = getOccasion(occasionKey);

//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const [senderName, setSenderName] = useState("");
//   const [recipientName, setRecipientName] = useState("");
//   const [senderRole, setSenderRole] = useState("");
//   const [recipientType, setRecipientType] = useState("");
//   const [tone, setTone] = useState("");
//   const [length, setLength] = useState<Length>("medium");
//   const [privateDetailLevel, setPrivateDetailLevel] = useState<Privacy>("medium");

//   const [memoriesText, setMemoriesText] = useState("");
//   const [qualitiesText, setQualitiesText] = useState("");
//   const [futurePlansText, setFuturePlansText] = useState("");
//   const [insideJokesText, setInsideJokesText] = useState("");
//   const [callToAction, setCallToAction] = useState("");
//   const [extraEmotional, setExtraEmotional] = useState(false);

//   const [password, setPassword] = useState("");
//   const [expiryMode, setExpiryMode] = useState<"never" | "24h" | "7d">("never");

//   const expiresAt = useMemo(() => {
//     if (expiryMode === "never") return null;
//     const now = new Date();
//     if (expiryMode === "24h") {
//       return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
//     }
//     return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
//   }, [expiryMode]);

//   function toList(s: string) {
//     return s
//       .split("\n")
//       .map((x) => x.trim())
//       .filter(Boolean);
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!occasion) return;

//     setErr(null);
//     setLoading(true);

//     try {
//       const payload = {
//         occasion: occasion.key,
//         senderName,
//         recipientName,
//         senderRole,
//         recipientType,
//         tone,
//         length,
//         privateDetailLevel,
//         memories: toList(memoriesText),
//         qualities: toList(qualitiesText),
//         futurePlans: toList(futurePlansText),
//         insideJokes: toList(insideJokesText),
//         callToAction: callToAction.trim() || undefined,
//         extraEmotional,
//         password: password.trim() || undefined,
//         expiresAt,
//       };

//       const res = await fetch("/api/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error ?? "Failed to generate");
//       }

//       router.push(`/l/${data.slug}`);
//     } catch (e: any) {
//       setErr(e?.message ?? "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!occasion) {
//     return (
//       <main style={{ maxWidth: 820, margin: "0 auto", padding: 28 }}>
//         <h1>Occasion not found</h1>
//       </main>
//     );
//   }

//   return (
//     <main style={{ maxWidth: 820, margin: "0 auto", padding: 28, lineHeight: 1.6 }}>
//       <h1 style={{ fontSize: 34, marginBottom: 8 }}>
//         {occasion.emoji} {occasion.title}
//       </h1>

//       <p style={{ opacity: 0.8, marginBottom: 18 }}>{occasion.subtitle}</p>

//       <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//           <input
//             required
//             value={senderName}
//             onChange={(e) => setSenderName(e.target.value)}
//             placeholder="Your name"
//             style={{ padding: 10 }}
//           />
//           <input
//             required
//             value={recipientName}
//             onChange={(e) => setRecipientName(e.target.value)}
//             placeholder="Their name"
//             style={{ padding: 10 }}
//           />
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//           <select value={senderRole} onChange={(e) => setSenderRole(e.target.value)} style={{ padding: 10 }}>
//             <option value="">Who is sending this?</option>
//             {occasion.senderRoles.map((role) => (
//               <option key={role} value={role}>
//                 {role}
//               </option>
//             ))}
//           </select>

//           <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)} style={{ padding: 10 }}>
//             <option value="">Who is receiving this?</option>
//             {occasion.recipientTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
//           <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ padding: 10 }}>
//             <option value="">Choose tone</option>
//             {occasion.tones.map((t) => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>

//           <select value={length} onChange={(e) => setLength(e.target.value as Length)} style={{ padding: 10 }}>
//             <option value="short">Short</option>
//             <option value="medium">Medium</option>
//             <option value="long">Long</option>
//           </select>

//           <select
//             value={privateDetailLevel}
//             onChange={(e) => setPrivateDetailLevel(e.target.value as Privacy)}
//             style={{ padding: 10 }}
//           >
//             <option value="low">Low detail</option>
//             <option value="medium">Medium detail</option>
//             <option value="high">High detail</option>
//           </select>
//         </div>

//         <textarea
//           value={memoriesText}
//           onChange={(e) => setMemoriesText(e.target.value)}
//           placeholder="Special memories (one per line)"
//           rows={5}
//           style={{ padding: 10 }}
//         />

//         <textarea
//           value={qualitiesText}
//           onChange={(e) => setQualitiesText(e.target.value)}
//           placeholder="Their qualities (one per line)"
//           rows={3}
//           style={{ padding: 10 }}
//         />

//         <textarea
//           value={futurePlansText}
//           onChange={(e) => setFuturePlansText(e.target.value)}
//           placeholder="Future hopes or plans (one per line)"
//           rows={3}
//           style={{ padding: 10 }}
//         />

//         <textarea
//           value={insideJokesText}
//           onChange={(e) => setInsideJokesText(e.target.value)}
//           placeholder="Inside jokes or specific details (optional)"
//           rows={3}
//           style={{ padding: 10 }}
//         />

//         <input
//           value={callToAction}
//           onChange={(e) => setCallToAction(e.target.value)}
//           placeholder="Optional ending request"
//           style={{ padding: 10 }}
//         />

//         <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           <input
//             type="checkbox"
//             checked={extraEmotional}
//             onChange={(e) => setExtraEmotional(e.target.checked)}
//           />
//           Make it extra emotional 🥹
//         </label>

//         <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: "8px 0" }} />

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password lock (optional)"
//             style={{ padding: 10 }}
//           />

//           <select value={expiryMode} onChange={(e) => setExpiryMode(e.target.value as any)} style={{ padding: 10 }}>
//             <option value="never">No expiry</option>
//             <option value="24h">Expires in 24 hours</option>
//             <option value="7d">Expires in 7 days</option>
//           </select>
//         </div>

//         <button type="submit" disabled={loading} style={{ padding: "12px 16px", borderRadius: 999 }}>
//           {loading ? "Generating..." : occasion.buttonText}
//         </button>

//         {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
//       </form>
//     </main>
//   );
// }

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOccasion } from "@/lib/occasions";
import { getOccasionPageBackground } from "@/lib/occasion-themes";

type Length = "short" | "medium" | "long";
type Privacy = "low" | "medium" | "high";

function toList(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function getSuggestions(occasionKey: string) {
  switch (occasionKey) {
    case "mothers-day":
      return {
        memories: "- The sacrifices you made for me\n- How you always showed up for me\n- Childhood moments I still remember",
        insideJokes: "- That thing you always say\n- Family sayings only we understand\n- Sweet names you call me",
        qualities: "- Strong\n- Loving\n- Prayerful\n- Selfless",
        futurePlans: "- Taking care of you more\n- Making you proud\n- Spending more time together",
        cta: 'e.g., "Happy Mother’s Day, Mom. I love you always."',
      };

    case "fathers-day":
      return {
        memories: "- Times you showed up when it mattered\n- Lessons you taught me without making a big speech\n- Quiet sacrifices I understand more now",
        insideJokes: "- The phrase you always say\n- Family jokes only we understand\n- Your classic dad advice",
        qualities: "- Steady\n- Protective\n- Hardworking\n- Dependable",
        futurePlans: "- Making you proud\n- Spending more time together\n- Carrying what you taught me forward",
        cta: 'e.g., "Happy Father\'s Day. I appreciate you more than I say."',
      };

    case "womens-day":
      return {
        memories: "- Moments where you inspired me\n- Times you showed strength\n- Ways you’ve impacted my life",
        insideJokes: "- Funny moments we've shared\n- Little things that always make me smile",
        qualities: "- Strong\n- Intelligent\n- Kind\n- Resilient",
        futurePlans: "- Watching you achieve your dreams\n- Celebrating more wins with you\n- Supporting you always",
        cta: 'e.g., "Happy Women’s Day. Keep shining and being incredible."',
      };

    case "birthday":
      return {
        memories: "- Our favorite memories together\n- The best birthday we shared\n- Fun moments I’ll never forget",
        insideJokes: "- That funny thing only we understand\n- Our nickname for each other",
        qualities: "- Kind\n- Funny\n- Loyal\n- Inspiring",
        futurePlans: "- More wins this year\n- More laughter together\n- More beautiful memories",
        cta: 'e.g., "Happy birthday, and may this new year be your best yet."',
      };

    case "appreciation":
      return {
        memories: "- Times you helped me\n- Moments I felt supported by you\n- What I’ll always remember about your kindness",
        insideJokes: "- Shared moments that still make me smile",
        qualities: "- Thoughtful\n- Reliable\n- Generous\n- Encouraging",
        futurePlans: "- Staying grateful for you\n- Continuing this bond\n- Saying thank you more often",
        cta: 'e.g., "Thank you for being such a blessing in my life."',
      };

    case "just-because":
      return {
        memories: "- Random beautiful moments\n- Why I’m thinking of you today\n- Little things you do that matter to me",
        insideJokes: "- The silly things that make us laugh",
        qualities: "- Sweet\n- Genuine\n- Caring\n- Memorable",
        futurePlans: "- More good moments ahead\n- Staying close\n- More memories together",
        cta: 'e.g., "I just wanted you to know you mean a lot to me."',
      };

    case "cheeky":
      return {
        memories: "- The first time I noticed you differently\n- That look you gave me\n- The conversation I keep replaying",
        insideJokes: "- The teasing thing we keep doing\n- That nickname you pretend to hate\n- The moment we both knew what was happening",
        qualities: "- Confident\n- Funny\n- Fine\n- Hard to ignore",
        futurePlans: "- Seeing where this goes\n- One honest conversation\n- More of this tension, but less pretending",
        cta: 'e.g., "So... are we going to keep pretending or say it properly?"',
      };

    case "apology":
      return {
        memories: "- What I said that hurt you\n- The moment I realized I was wrong\n- What I should have handled differently",
        insideJokes: "- Only include this if it softens the note without dodging accountability",
        qualities: "- Patient\n- Honest\n- Deserving of respect\n- Someone I should have listened to better",
        futurePlans: "- Taking responsibility without excuses\n- Giving you space if you need it\n- Doing better in a specific way",
        cta: 'e.g., "I am sorry, and I understand if you need time."',
      };

    case "congratulations":
      return {
        memories: "- The late nights you kept going\n- The first step you took toward this\n- The moment I knew you could do it",
        insideJokes: "- The phrase you kept saying during the journey\n- The little celebration we promised",
        qualities: "- Disciplined\n- Brave\n- Consistent\n- Hardworking",
        futurePlans: "- Bigger doors opening\n- Taking a real moment to celebrate\n- Watching you grow even more",
        cta: 'e.g., "I am so proud of how far you have come."',
      };

    case "closure":
      return {
        memories: "- What I am grateful for\n- What this chapter taught me\n- The moment I knew things had changed",
        insideJokes: "- A small memory that can be held gently, not used to reopen things",
        qualities: "- Important to me\n- Part of my growth\n- Someone I once cared for deeply",
        futurePlans: "- Letting go with peace\n- Wishing you well\n- Moving forward without bitterness",
        cta: 'e.g., "I will always wish you well, but I am letting this go."',
      };

    case "miss-you":
      return {
        memories: "- The sound of your laugh\n- The place that feels quieter now\n- The small habit of yours I keep noticing is gone",
        insideJokes: "- The line I almost text you\n- The joke that is not as funny without you",
        qualities: "- Comforting\n- Familiar\n- Easy to be around\n- Hard to replace",
        futurePlans: "- Hearing your voice soon\n- Sitting together again\n- One simple moment I wish we could repeat",
        cta: 'e.g., "I miss you. That is really all I wanted to say."',
      };

    case "thank-you":
      return {
        memories: "- The day you showed up for me\n- The advice I still use\n- The help you gave when I was overwhelmed",
        insideJokes: "- A small shared moment from that season\n- Something you said that still makes me smile",
        qualities: "- Thoughtful\n- Reliable\n- Generous\n- Present",
        futurePlans: "- Returning the kindness when I can\n- Staying grateful out loud\n- Carrying what you taught me forward",
        cta: 'e.g., "Thank you for that specific thing. It meant more than you know."',
      };

    case "situationship":
      return {
        memories: "- The almost-date that felt like a date\n- The late replies I pretended did not bother me\n- The moment things started feeling confusing",
        insideJokes: "- The teasing that made things feel less casual\n- The nickname we never explained",
        qualities: "- Easy to talk to\n- Hard to read\n- Familiar\n- A little dangerous for my peace",
        futurePlans: "- Being honest about what this is\n- Asking where we actually stand\n- Choosing clarity over guessing",
        cta: 'e.g., "I just need to know if this is something or if I am imagining it."',
      };

    case "ex":
      return {
        memories: "- A good moment I can still admit mattered\n- What I miss without wanting to beg\n- What I finally understand now",
        insideJokes: "- A memory that feels tender, not manipulative\n- Something that used to be ours",
        qualities: "- Familiar\n- Important once\n- Hard to forget\n- Part of my story",
        futurePlans: "- Accepting what changed\n- Healing properly\n- Letting the good parts stay good",
        cta: 'e.g., "I still care, but I am not writing this to pressure you."',
      };

    case "confession":
      return {
        memories: "- The first time I caught myself looking at you differently\n- The conversation I replayed too many times\n- The moment I almost said it",
        insideJokes: "- The joke that made me realize I liked you\n- The thing we say that feels like more than a joke",
        qualities: "- Easy to like\n- Unintentionally charming\n- Kind\n- Hard to ignore",
        futurePlans: "- Finally being honest\n- Letting you know without pressure\n- Seeing what happens after the truth is out",
        cta: 'e.g., "I like you. I have for a while."',
      };

    case "friend":
      return {
        memories: "- The chaotic day we still laugh about\n- The time you had my back\n- The random moment that explains our friendship perfectly",
        insideJokes: "- Our weird nickname\n- The phrase only we understand\n- That story nobody else needs to hear",
        qualities: "- Funny\n- Loyal\n- Real\n- Slightly dramatic in the best way",
        futurePlans: "- More random calls\n- More wins together\n- Staying close even when life gets busy",
        cta: 'e.g., "Basically, you are stuck with me."',
      };

    case "faith":
      return {
        memories: "- A season God carried us through\n- A prayer that was answered slowly\n- A moment that strengthened my faith",
        insideJokes: "- A church moment we still laugh about\n- A phrase that reminds us to keep trusting",
        qualities: "- Faithful\n- Steady\n- Prayerful\n- Full of grace",
        futurePlans: "- Praying for your peace\n- Trusting God with what comes next\n- Believing this season still has purpose",
        cta: 'e.g., "I am praying for you, gently and sincerely."',
      };

    case "love":
    default:
      return {
        memories: "- First date at the beach\n- That time we got lost and laughed\n- Late night calls",
        insideJokes: '- “CEO of snacks”\n- “Don’t start”\n- “Blue car!”',
        qualities: "- Kind\n- Loyal\n- Funny\n- Ambitious",
        futurePlans: "- Trip to Abuja\n- Start the business together\n- Movie night every Friday",
        cta: 'e.g., "Be my Valentine tonight"',
      };
  }
}

function getFutureFieldLabel(occasionKey: string) {
  switch (occasionKey) {
    case "apology":
      return "Accountability / repair (one per line)";
    case "closure":
    case "ex":
      return "What you are releasing or accepting (one per line)";
    case "situationship":
    case "confession":
      return "What you want to say next (one per line)";
    case "miss-you":
      return "What you miss or hope for (one per line)";
    case "thank-you":
      return "Impact / appreciation (one per line)";
    case "friend":
      return "More memories or promises (one per line)";
    case "faith":
      return "Prayers / hopes (one per line)";
    case "congratulations":
      return "Future wishes (one per line)";
    case "love":
      return "Future plans (one per line)";
    default:
      return "Hopes / prayers / future wishes (one per line)";
  }
}

export default function OccasionCreatePage() {
  const router = useRouter();
  const params = useParams();
  const occasionKey = String(params.occasion || "");
  const occasion = getOccasion(occasionKey);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [extraEmotional, setExtraEmotional] = useState(false);
  
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [senderRole, setSenderRole] = useState("");
  const [recipientType, setRecipientType] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState<Length>("medium");
  const [privateDetailLevel, setPrivateDetailLevel] = useState<Privacy>("medium");
  const [occasionDetails, setOccasionDetails] = useState("");

  const [memoriesText, setMemoriesText] = useState("");
  const [insideJokesText, setInsideJokesText] = useState("");
  const [qualitiesText, setQualitiesText] = useState("");
  const [futurePlansText, setFuturePlansText] = useState("");
  const [callToAction, setCallToAction] = useState("");

  const [password, setPassword] = useState("");
  const [expiryMode, setExpiryMode] = useState<"never" | "24h" | "7d">("never");

  const expiresAt = useMemo(() => {
    if (expiryMode === "never") return null;
    const now = new Date();
    if (expiryMode === "24h") {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }, [expiryMode]);

  if (!occasion) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 28 }}>
        <h1>Occasion not found</h1>
      </main>
    );
  }

  const suggestions = getSuggestions(occasion.key);
  const isLove = occasion.key === "love";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const payload = {
        occasion: occasion.key,
        senderName,
        recipientName,
        relationship: relationship || undefined,
        senderRole: senderRole || undefined,
        recipientType: recipientType || undefined,
        tone,
        length,
        qualityTier: "standard",
        occasionDetails: occasionDetails.trim() || undefined,
        privateDetailLevel,
        memories: toList(memoriesText),
        insideJokes: toList(insideJokesText),
        qualities: toList(qualitiesText),
        futurePlans: toList(futurePlansText),
        callToAction: callToAction.trim() || undefined,
        extraEmotional,
        password: password.trim() || undefined,
        expiresAt,
    };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to generate");
      }

      router.push(`/l/${data.slug}`);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: getOccasionPageBackground(occasion.key),
        color: "inherit",
        padding: "20px 16px 28px",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
      <Link
        href="/"
        style={{
          color: "inherit",
          textDecoration: "none",
          opacity: 0.9,
          display: "inline-block",
          marginBottom: 22,
        }}
      >
        ← Home
      </Link>

      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 40, margin: "0 0 6px", lineHeight: 1.1 }}>
            {occasion.title} {occasion.emoji}
        </h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
            {occasion.subtitle}
        </p>
      </div>

      <form id="letter-form" onSubmit={onSubmit} autoComplete="off" style={{ display: "grid", gap: 16 }}>
        {/* Card 1 */}
        <section
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
            padding: 16,
          }}
        >
          <div style={twoColumnGridStyle}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 16 }}>
                Your name (sender)
              </label>
              <input
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., Kelvin"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 16 }}>
                Their name (recipient)
              </label>
              <input
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Sarah"
                style={inputStyle}
              />
            </div>
          </div>

          {isLove ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
                marginTop: 12,
              }}
            >
              <div>
                <label style={labelStyle}>Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Choose relationship</option>
                  {occasion.senderRoles.map((role) => (
                    <option key={role} value={role} style={optionStyle}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Choose tone</option>
                  {occasion.tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as Length)}
                  style={selectStyle}
                >
                  <option value="short" style={optionStyle}>Short</option>
                  <option value="medium" style={optionStyle}>Medium</option>
                </select>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
                marginTop: 12,
              }}
            >
              <div>
                <label style={labelStyle}>Who is sending this?</label>
                <select
                  value={senderRole}
                  onChange={(e) => setSenderRole(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Choose sender</option>
                  {occasion.senderRoles.map((role) => (
                    <option key={role} value={role} style={optionStyle}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Who is receiving it?</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Choose recipient</option>
                  {occasion.recipientTypes.map((type) => (
                    <option key={type} value={type} style={optionStyle}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Choose tone</option>
                  {occasion.tones.map((t) => (
                    <option key={t} value={t} style={optionStyle}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {occasion.key === "congratulations" ? (
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>What are you congratulating them for?</label>
              <input
                required
                value={occasionDetails}
                onChange={(e) => setOccasionDetails(e.target.value)}
                placeholder="e.g., Graduating from university, getting a new job, winning an award, starting a business"
                style={inputStyle}
                autoComplete="off"
                name="occasion_details"
                id="occasion_details"
              />
            </div>
          ) : null}

          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Detail level</label>
            <select
              value={privateDetailLevel}
              onChange={(e) => setPrivateDetailLevel(e.target.value as Privacy)}
              style={selectStyle}
            >
              <option value="low" style={optionStyle}>Low detail</option>
              <option value="medium" style={optionStyle}>Medium detail</option>
              <option value="high" style={optionStyle}>High detail</option>
            </select>
          </div>

        </section>

        {/* Card 2 */}
        <section
          style={{
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
            padding: 22,
          }}
        >
          <FieldBlock
            label="Memories (one per line)"
            value={memoriesText}
            onChange={setMemoriesText}
            placeholder={suggestions.memories}
            rows={5}
          />

          <FieldBlock
            label="Inside jokes (one per line)"
            value={insideJokesText}
            onChange={setInsideJokesText}
            placeholder={suggestions.insideJokes}
            rows={4}
          />

          <FieldBlock
            label="Their qualities (one per line)"
            value={qualitiesText}
            onChange={setQualitiesText}
            placeholder={suggestions.qualities}
            rows={4}
          />

          <FieldBlock
            label={getFutureFieldLabel(occasion.key)}
            value={futurePlansText}
            onChange={setFuturePlansText}
            placeholder={suggestions.futurePlans}
            rows={4}
          />

          <div style={{ marginTop: 18 }}>
            <label style={labelStyle}>Call-to-action (optional)</label>
            <input
               value={callToAction}
               onChange={(e) => setCallToAction(e.target.value)}
               placeholder={suggestions.cta}
               style={inputStyle}
               autoComplete="off"
               name="letter_cta"
               id="letter_cta"
            />
          </div>
          <div style={{ marginTop: 18 }}>
            <label
                style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
                cursor: "pointer",
                }}
            >
                <input
                type="checkbox"
                checked={extraEmotional}
                onChange={(e) => setExtraEmotional(e.target.checked)}
                style={{ width: 18, height: 18 }}
                />
                Make it extra emotional ✨
            </label>
        </div>
        </section>

        {/* Card 3 */}
        <section
          style={{
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
            padding: 22,
          }}
        >
          <div style={twoColumnGridStyle}>
            <div>
              <label style={labelStyle}>Password lock (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password to lock this letter"
                style={inputStyle}
                autoComplete="new-password"
                name="letter_password"
                id="letter_password"
              />
            </div>
            <div>
              <label style={labelStyle}>Expiry</label>
              <select
                value={expiryMode}
                onChange={(e) => setExpiryMode(e.target.value as any)}
                style={selectStyle}
              >
                <option value="never" style={optionStyle}>No expiry</option>
                <option value="24h" style={optionStyle}>Expires in 24 hours</option>
                <option value="7d" style={optionStyle}>Expires in 7 days</option>
              </select>
            </div>
          </div>
        </section>

        <button
            type="submit"
            disabled={loading}
            style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.10)",
            color: "inherit",
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
        }}
        >
          {loading ? "Generating..." : occasion.buttonText}
        </button>

        {err ? (
          <p style={{ color: "#ff7b93", marginTop: -8 }}>{err}</p>
        ) : null}
      </form>
      </div>
    </main>
  );
}

function FieldBlock({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows: number;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={textareaStyle}
      />
    </div>
  );
}

// const labelStyle: React.CSSProperties = {
//   display: "block",
//   marginBottom: 8,
//   fontSize: 16,
// };

// const inputStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "18px 18px",
//   borderRadius: 18,
//   border: "1px solid rgba(255,255,255,0.18)",
//   background: "rgba(255,255,255,0.08)",
//   color: "inherit",
//   fontSize: 16,
//   outline: "none",
// };

// const selectStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "18px 18px",
//   borderRadius: 18,
//   border: "1px solid rgba(255,255,255,0.18)",
//   background: "rgba(255,255,255,0.08)",
//   color: "inherit",
//   fontSize: 16,
//   outline: "none",
// };

// const textareaStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "18px 18px",
//   borderRadius: 18,
//   border: "1px solid rgba(255,255,255,0.18)",
//   background: "rgba(255,255,255,0.08)",
//   color: "inherit",
//   fontSize: 16,
//   outline: "none",
//   resize: "vertical",
// };

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 14,
};

const twoColumnGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "inherit",
  fontSize: 14,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.6)",
  color: "white",
  fontSize: 14,
  outline: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "18px",
  paddingRight: "38px",
  colorScheme: "dark",
};

const optionStyle: React.CSSProperties = {
  background: "#111",
  color: "white",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "inherit",
  fontSize: 14,
  outline: "none",
  resize: "vertical",
};

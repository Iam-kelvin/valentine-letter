export type OccasionKey =
  | "love"
  | "mothers-day"
  | "birthday"
  | "appreciation"
  | "just-because";

export const OCCASIONS = {
  love: {
    key: "love",
    label: "Romantic Love",
    emoji: "❤️",
    title: "Create a Love Letter",
    subtitle: "Write something sweet, unforgettable, and deeply personal.",
    buttonText: "Create a love letter",
    path: "/create/love",
    senderRoles: [
      "Boyfriend",
      "Girlfriend",
      "Husband",
      "Wife",
      "Partner",
      "Fiancé / Fiancée",
      "Crush",
      "Other",
    ],
    recipientTypes: [
      "My Love",
      "My Crush",
      "My Partner",
      "My Spouse",
      "Someone Special",
    ],
    tones: ["Romantic", "Cute", "Poetic", "Playful", "Spicy PG-13"],
  },

  "mothers-day": {
    key: "mothers-day",
    label: "Mother’s Day",
    emoji: "🌸",
    title: "Create a Mother’s Day Letter",
    subtitle: "Write something beautiful for the woman who shaped your life.",
    buttonText: "Create a Mother’s Day letter",
    path: "/create/mothers-day",
    senderRoles: [
      "Son",
      "Daughter",
      "Husband / Partner",
      "Boyfriend",
      "Friend",
      "Family Member",
      "Church Member",
      "Other",
    ],
    recipientTypes: [
      "My Mother",
      "My Wife (mother of my children)",
      "Expecting Mother",
      "Single Mother",
      "Grandmother",
      "Church Mother",
      "Mother Figure",
    ],
    tones: [
      "Heartfelt",
      "Grateful",
      "Emotional",
      "Inspirational",
      "Faith-based",
      "Lighthearted",
    ],
  },

  birthday: {
    key: "birthday",
    label: "Birthday",
    emoji: "🎂",
    title: "Create a Birthday Letter",
    subtitle: "Make their day personal, warm, and unforgettable.",
    buttonText: "Create a birthday letter",
    path: "/create/birthday",
    senderRoles: ["Friend", "Partner", "Sibling", "Parent", "Child", "Other"],
    recipientTypes: ["Friend", "Partner", "Sibling", "Parent", "Child", "Other"],
    tones: ["Warm", "Funny", "Heartfelt", "Celebratory"],
  },

  appreciation: {
    key: "appreciation",
    label: "Appreciation",
    emoji: "🙏",
    title: "Create an Appreciation Letter",
    subtitle: "Say thank you in a way they’ll actually remember.",
    buttonText: "Create an appreciation letter",
    path: "/create/appreciation",
    senderRoles: ["Friend", "Family", "Colleague", "Student", "Other"],
    recipientTypes: ["Friend", "Family", "Mentor", "Teacher", "Other"],
    tones: ["Warm", "Respectful", "Heartfelt", "Faith-based"],
  },

  "just-because": {
    key: "just-because",
    label: "Just Because",
    emoji: "💌",
    title: "Create a Just-Because Letter",
    subtitle: "No holiday needed. Just say what’s on your heart.",
    buttonText: "Create a just-because letter",
    path: "/create/just-because",
    senderRoles: ["Friend", "Partner", "Family", "Other"],
    recipientTypes: ["Someone Special", "Friend", "Family", "Other"],
    tones: ["Sweet", "Heartfelt", "Poetic", "Playful"],
  },
} as const;

export function getOccasion(key: string) {
  return OCCASIONS[key as OccasionKey] ?? null;
}
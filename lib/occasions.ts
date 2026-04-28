export type OccasionKey =
  | "love"
  | "mothers-day"
  | "fathers-day"
  | "womens-day"
  | "birthday"
  | "appreciation"
  | "just-because"
  | "cheeky";

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
      "Niece",
      "Nephew",
      "Brother",
      "Sister",
      "Husband / Partner",
      "Boyfriend",
      "Friend",
      "Family Friend",
      "Church Member",
      "Future father of your children",
      "Mentor",
      "Other",
    ],
    recipientTypes: [
      "My Mother",
      "My Wife",
      "Girlfriend",
      "My Aunt",
      "My Sister",
      "My Mother-in-Law",
      "Expecting Mother",
      "Single Mother",
      "Grandmother",
      "Church Mother",
      "Mother Figure",
      "Future Mother",
      "A Woman Who Will Make a Great Mother"
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

  "fathers-day": {
    key: "fathers-day",
    label: "Father's Day",
    emoji: "🧔🏾‍♂️",
    title: "Create a Father's Day Letter",
    subtitle: "Write something grounded and grateful for the man who showed up.",
    buttonText: "Create a Father's Day letter",
    path: "/create/fathers-day",
    senderRoles: [
      "Son",
      "Daughter",
      "Child",
      "Wife / Partner",
      "Friend",
      "Family Member",
      "Other",
    ],
    recipientTypes: [
      "My Father",
      "My Husband",
      "Stepfather",
      "Grandfather",
      "Father Figure",
      "Expecting Father",
      "A Man Who Showed Up",
      "Other",
    ],
    tones: ["Warm", "Grounded", "Appreciative", "Respectful", "Lighthearted"],
  },

  "womens-day": {
  key: "womens-day",
  label: "Women’s Day",
  emoji: "🌷",
  title: "Create a Women’s Day Message",
  subtitle: "Celebrate the strength, beauty, and impact of women.",
  buttonText: "Create a Women’s Day message",
  path: "/create/womens-day",
  senderRoles: [
    "Friend",
    "Partner",
    "Sibling",
    "Child",
    "Colleague",
    "Mentor",
    "Other",
  ],
  recipientTypes: [
    "Friend",
    "Sister",
    "Partner",
    "Mother",
    "Mentor",
    "Colleague",
    "Woman I admire",
  ],
  tones: [
    "Appreciative",
    "Empowering",
    "Inspirational",
    "Celebratory",
    "Heartfelt",
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

  cheeky: {
    key: "cheeky",
    label: "Cheeky",
    emoji: "😏",
    title: "Create a Cheeky Letter",
    subtitle: "Write something playful, bold, flirty, and still tasteful.",
    buttonText: "Create a cheeky letter",
    path: "/create/cheeky",
    senderRoles: ["Crush", "Partner", "Situationship", "Friend", "Secret Admirer", "Other"],
    recipientTypes: ["Crush", "Partner", "Someone I'm Flirting With", "Someone Special", "Other"],
    tones: ["Playful", "Bold", "Flirty", "Teasing", "Spicy PG-13"],
  },
} as const;

export function getOccasion(key: string) {
  return OCCASIONS[key as OccasionKey] ?? null;
}

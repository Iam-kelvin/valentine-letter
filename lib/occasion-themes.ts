export const occasionPageThemes: Record<string, string> = {
  love:
    "radial-gradient(circle at 18% 0%, rgba(255, 92, 146, 0.18), transparent 32%), radial-gradient(circle at 88% 12%, rgba(190, 24, 93, 0.16), transparent 28%), linear-gradient(180deg, #1d030b 0%, #090306 46%, #12050a 100%)",
  "mothers-day":
    "radial-gradient(circle at 18% 0%, rgba(251, 207, 232, 0.20), transparent 30%), radial-gradient(circle at 82% 14%, rgba(244, 114, 182, 0.14), transparent 28%), linear-gradient(180deg, #240716 0%, #0d0508 48%, #1a0710 100%)",
  "womens-day":
    "radial-gradient(circle at 18% 0%, rgba(244, 114, 182, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(251, 191, 36, 0.12), transparent 28%), linear-gradient(180deg, #1d0614 0%, #080407 48%, #130710 100%)",
  birthday:
    "radial-gradient(circle at 20% 0%, rgba(251, 191, 36, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(56, 189, 248, 0.12), transparent 28%), linear-gradient(180deg, #1f1304 0%, #080604 48%, #150c05 100%)",
  "fathers-day":
    "radial-gradient(circle at 20% 0%, rgba(180, 83, 9, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(250, 204, 21, 0.10), transparent 28%), linear-gradient(180deg, #1b1006 0%, #080604 48%, #120d07 100%)",
  appreciation:
    "radial-gradient(circle at 18% 0%, rgba(250, 204, 21, 0.16), transparent 30%), radial-gradient(circle at 84% 18%, rgba(244, 114, 182, 0.10), transparent 28%), linear-gradient(180deg, #1d1304 0%, #080604 48%, #130d05 100%)",
  "just-because":
    "radial-gradient(circle at 18% 0%, rgba(216, 180, 254, 0.16), transparent 30%), radial-gradient(circle at 84% 18%, rgba(251, 113, 133, 0.12), transparent 28%), linear-gradient(180deg, #14071d 0%, #070408 48%, #100715 100%)",
  cheeky:
    "radial-gradient(circle at 18% 0%, rgba(251, 113, 133, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(249, 115, 22, 0.12), transparent 28%), linear-gradient(180deg, #210716 0%, #080407 48%, #160710 100%)",
  apology:
    "radial-gradient(circle at 18% 0%, rgba(148, 163, 184, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(244, 114, 182, 0.10), transparent 28%), linear-gradient(180deg, #151018 0%, #070506 48%, #12090d 100%)",
  congratulations:
    "radial-gradient(circle at 18% 0%, rgba(250, 204, 21, 0.18), transparent 30%), radial-gradient(circle at 84% 18%, rgba(34, 197, 94, 0.12), transparent 28%), linear-gradient(180deg, #1f1604 0%, #060704 48%, #111307 100%)",
  closure:
    "radial-gradient(circle at 18% 0%, rgba(125, 211, 252, 0.13), transparent 30%), radial-gradient(circle at 84% 18%, rgba(203, 213, 225, 0.10), transparent 28%), linear-gradient(180deg, #09141b 0%, #050607 48%, #0d1116 100%)",
  "miss-you":
    "radial-gradient(circle at 18% 0%, rgba(251, 113, 133, 0.14), transparent 30%), radial-gradient(circle at 84% 18%, rgba(147, 197, 253, 0.11), transparent 28%), linear-gradient(180deg, #190817 0%, #060507 48%, #0d0b18 100%)",
  "thank-you":
    "radial-gradient(circle at 18% 0%, rgba(252, 211, 77, 0.15), transparent 30%), radial-gradient(circle at 84% 18%, rgba(255, 255, 255, 0.08), transparent 28%), linear-gradient(180deg, #1a1205 0%, #070605 48%, #120f08 100%)",
  situationship:
    "radial-gradient(circle at 18% 0%, rgba(244, 114, 182, 0.15), transparent 30%), radial-gradient(circle at 84% 18%, rgba(45, 212, 191, 0.10), transparent 28%), linear-gradient(180deg, #180914 0%, #060506 48%, #081414 100%)",
  ex:
    "radial-gradient(circle at 18% 0%, rgba(167, 139, 250, 0.14), transparent 30%), radial-gradient(circle at 84% 18%, rgba(148, 163, 184, 0.10), transparent 28%), linear-gradient(180deg, #100b1b 0%, #060507 48%, #100d13 100%)",
  confession:
    "radial-gradient(circle at 18% 0%, rgba(251, 113, 133, 0.16), transparent 30%), radial-gradient(circle at 84% 18%, rgba(251, 191, 36, 0.10), transparent 28%), linear-gradient(180deg, #1d0710 0%, #070506 48%, #130910 100%)",
  friend:
    "radial-gradient(circle at 18% 0%, rgba(56, 189, 248, 0.14), transparent 30%), radial-gradient(circle at 84% 18%, rgba(250, 204, 21, 0.12), transparent 28%), linear-gradient(180deg, #071722 0%, #050607 48%, #111005 100%)",
  faith:
    "radial-gradient(circle at 18% 0%, rgba(251, 191, 36, 0.13), transparent 30%), radial-gradient(circle at 84% 18%, rgba(192, 132, 252, 0.10), transparent 28%), linear-gradient(180deg, #151005 0%, #060506 48%, #100b14 100%)",
};

export function getOccasionPageBackground(occasion?: string | null) {
  return occasionPageThemes[occasion || ""] ?? occasionPageThemes.love;
}

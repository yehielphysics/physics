/* הגדרות משותפות לשני פאנלי הניהול: הציבורי (/admin/) והפרטי (/my/) */
import structure from "../data/structure.json";
import siteData from "../data/site.json";

/** המאגר הציבורי של האתר, למשל "yehiel/physics" (נקבע אוטומטית ב-GitHub Actions) */
export const PUBLIC_REPO = process.env.GITHUB_REPOSITORY || "OWNER/REPO";

/** המאגר הפרטי לחומרים אישיים. ברירת מחדל: <שם-המאגר>-private */
export const PRIVATE_REPO = (siteData as { privateRepo?: string }).privateRepo || `${PUBLIC_REPO}-private`;

export const TYPE_OPTIONS = [
  { label: "דף עבודה אינטראקטיבי (HTML)", value: "interactive" },
  { label: "PDF", value: "pdf" },
  { label: "Word", value: "word" },
  { label: "מצגת", value: "slides" },
  { label: "סימולציה / הדמיה (HTML)", value: "simulation" },
  { label: "סרטון (YouTube)", value: "video" },
  { label: "קישור חיצוני", value: "link" },
];

export const ALL_SUBTOPICS = [...new Set(structure.topics.flatMap((t) => t.subtopics ?? []))];

/** רשימת נושאים כאפשרויות בחירה, למשל "בגרות · מכניקה" */
export const TOPIC_OPTIONS = structure.topics.map((t) => {
  const level = structure.levels.find((l) => l.id === t.level);
  return { label: structure.levels.length > 1 && level ? `${level.name} · ${t.name}` : t.name, value: t.id };
});

export const LEVEL_OPTIONS = structure.levels.map((l) => ({ label: l.name, value: l.id }));

export const COMMIT_MESSAGES = {
  create: "הוספה: {{slug}}",
  update: "עדכון: {{slug}}",
  delete: "מחיקה: {{slug}}",
  uploadMedia: "העלאת קובץ: {{path}}",
  deleteMedia: "מחיקת קובץ: {{path}}",
};

export function yamlResponse(config: unknown) {
  return new Response(JSON.stringify(config, null, 2), {
    headers: { "Content-Type": "application/yaml; charset=utf-8" },
  });
}

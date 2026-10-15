import { getCollection, type CollectionEntry } from "astro:content";
import structure from "../data/structure.json";
import siteData from "../data/site.json";

export type Item = CollectionEntry<"items">;
export type Level = (typeof structure.levels)[number];
export type Topic = (typeof structure.topics)[number];

export const SITE = siteData;
export const LEVELS: Level[] = structure.levels.filter((l) => l.visible !== false);
export const TOPICS: Topic[] = structure.topics.filter((t) => LEVELS.some((l) => l.id === t.level));

/** האם להציג את שכבת הרמות בממשק (רק כשיש יותר מרמה אחת) */
export const MULTI_LEVEL = LEVELS.length > 1;

export const TYPES: Record<string, { label: string; action: string }> = {
  interactive: { label: "דף עבודה אינטראקטיבי", action: "פתיחה במסך מלא" },
  pdf: { label: "PDF", action: "פתיחת ה-PDF" },
  word: { label: "Word", action: "הורדה" },
  slides: { label: "מצגת", action: "פתיחת המצגת" },
  simulation: { label: "סימולציה", action: "הפעלה במסך מלא" },
  video: { label: "סרטון", action: "צפייה" },
  link: { label: "קישור", action: "מעבר לקישור" },
};

/** מוסיף את נתיב הבסיס של האתר (חשוב ב-GitHub Pages) */
export function url(path = "/"): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
export const topicById = (id: string) => TOPICS.find((t) => t.id === id);
export const topicsOfLevel = (levelId: string) => TOPICS.filter((t) => t.level === levelId);

export const levelUrl = (l: Level) => url(`/${l.id}/`);
export const topicUrl = (t: Topic) => url(`/${t.level}/${t.id}/`);
export const itemUrl = (i: Item) => url(`/items/${i.id}/`);

/** קישור לקובץ/משאב של החומר */
export function itemHref(i: Item): string {
  return url(i.data.file || i.data.url || "#");
}

let cache: Item[] | null = null;
/** כל החומרים שפורסמו, מהחדש לישן */
export async function getItems(): Promise<Item[]> {
  if (cache) return cache;
  const all = await getCollection("items", (e) => !e.data.draft);
  for (const i of all) {
    if (!topicById(i.data.topic)) {
      console.warn(`[אזהרה] לחומר "${i.data.title}" (${i.id}) יש נושא לא מוכר: "${i.data.topic}"`);
    }
  }
  cache = all.sort((a, b) => {
    const d = b.data.date.getTime() - a.data.date.getTime();
    return d !== 0 ? d : (a.data.order ?? 0) - (b.data.order ?? 0);
  });
  return cache;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" });
}

export function countLabel(n: number): string {
  if (n === 0) return "בקרוב";
  if (n === 1) return "חומר אחד";
  return `${n} חומרים`;
}

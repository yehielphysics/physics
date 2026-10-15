import type { APIRoute } from "astro";
import { getItems, topicById, levelById, TYPES, itemUrl } from "../lib/data";

/* אינדקס חיפוש שנבנה אוטומטית מכל החומרים */
export const GET: APIRoute = async () => {
  const items = await getItems();
  const index = items.map((i) => {
    const topic = topicById(i.data.topic);
    const level = topic ? levelById(topic.level) : undefined;
    return {
      id: i.id,
      title: i.data.title,
      description: i.data.description ?? "",
      type: i.data.type,
      typeLabel: TYPES[i.data.type]?.label ?? "",
      topic: topic?.name ?? "",
      level: level?.name ?? "",
      subtopic: i.data.subtopic ?? "",
      tags: i.data.tags ?? [],
      date: i.data.date.toISOString().slice(0, 10),
      url: itemUrl(i),
    };
  });
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
};

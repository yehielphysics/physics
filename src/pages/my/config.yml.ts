import type { APIRoute } from "astro";
import { PRIVATE_REPO, TYPE_OPTIONS, TOPIC_OPTIONS, ALL_SUBTOPICS, COMMIT_MESSAGES, yamlResponse } from "../../lib/cms";

/*
 * הגדרות האזור הפרטי (/my/).
 * הכל נשמר במאגר GitHub *פרטי* נפרד — לא מתפרסם באתר ולא גלוי לאף אחד אחר.
 * הנושאים נלקחים אוטומטית ממבנה האתר, כך ששני האזורים מסודרים אותו דבר.
 */

const config = {
  backend: {
    name: "github",
    repo: PRIVATE_REPO,
    branch: "main",
    auth_methods: ["token"],
    commit_messages: COMMIT_MESSAGES,
  },
  media_folder: "files",
  public_folder: "/files",
  collections: [
    {
      name: "materials",
      label: "החומרים שלי",
      label_singular: "חומר",
      description: "הארכיון האישי: מבחנים ופתרונות, מחוונים, קבצי מקור, טיוטות. רק אתה רואה את זה.",
      folder: "materials",
      extension: "md",
      format: "frontmatter",
      create: true,
      identifier_field: "title",
      slug: { template: "{{year}}{{month}}{{day}}-{{title}}", editable: false },
      summary: "{{title}} · {{topic}} · {{status}}",
      sortable_fields: ["date", "title", "topic", "status"],
      view_groups: [
        { label: "נושא", field: "topic" },
        { label: "סטטוס", field: "status" },
        { label: "סוג", field: "type" },
      ],
      view_filters: [
        { label: "מוכן לפרסום", field: "status", pattern: "ready" },
        { label: "טיוטות", field: "status", pattern: "draft" },
      ],
      fields: [
        { name: "title", label: "כותרת", widget: "string" },
        { name: "topic", label: "נושא", widget: "select", options: [{ label: "כללי / ללא נושא", value: "general" }, ...TOPIC_OPTIONS], default: "general" },
        { name: "subtopic", label: "תת-נושא", widget: "select", options: ALL_SUBTOPICS, required: false },
        { name: "type", label: "סוג", widget: "select", options: [...TYPE_OPTIONS, { label: "אחר", value: "other" }], default: "pdf" },
        {
          name: "files", label: "קבצים", widget: "list", required: false,
          hint: "אפשר לצרף כמה קבצים, למשל שאלון + פתרון + קובץ Word לעריכה.",
          fields: [
            { name: "label", label: "תיאור הקובץ", widget: "string", required: false, hint: "למשל: פתרון מלא" },
            { name: "file", label: "קובץ", widget: "file" },
          ],
        },
        { name: "url", label: "קישור", widget: "string", required: false },
        {
          name: "status", label: "סטטוס", widget: "select", default: "draft",
          options: [
            { label: "טיוטה / בעבודה", value: "draft" },
            { label: "מוכן לפרסום", value: "ready" },
            { label: "פורסם באתר", value: "published" },
            { label: "פרטי — לא לפרסום", value: "private" },
          ],
        },
        { name: "date", label: "תאריך", widget: "datetime", time_format: false, date_format: "DD.MM.YYYY", format: "YYYY-MM-DD" },
        { name: "tags", label: "תגיות", widget: "list", required: false },
        { name: "body", label: "הערות", widget: "markdown", required: false, hint: "הערות לעצמך: מתי השתמשת, מה לשפר, וכו'." },
      ],
    },
    {
      name: "notes",
      label: "פתקים",
      label_singular: "פתק",
      description: "רעיונות, תכנון שיעורים, רשימות — טקסט חופשי.",
      folder: "notes",
      extension: "md",
      format: "frontmatter",
      create: true,
      identifier_field: "title",
      slug: { template: "{{year}}{{month}}{{day}}-{{title}}", editable: false },
      sortable_fields: ["date", "title"],
      fields: [
        { name: "title", label: "כותרת", widget: "string" },
        { name: "date", label: "תאריך", widget: "datetime", time_format: false, date_format: "DD.MM.YYYY", format: "YYYY-MM-DD" },
        { name: "tags", label: "תגיות", widget: "list", required: false },
        { name: "body", label: "תוכן", widget: "markdown", required: false },
      ],
    },
  ],
};

export const GET: APIRoute = () => yamlResponse(config);

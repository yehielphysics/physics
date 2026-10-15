import type { APIRoute } from "astro";
import { PUBLIC_REPO, TYPE_OPTIONS, TOPIC_OPTIONS, LEVEL_OPTIONS, ALL_SUBTOPICS, COMMIT_MESSAGES, yamlResponse } from "../../lib/cms";

/*
 * הגדרות פאנל הניהול הציבורי (Sveltia CMS).
 * נוצר אוטומטית בזמן הבנייה, כך ששם המאגר ב-GitHub נקבע לבד.
 */

const config = {
  backend: {
    name: "github",
    repo: PUBLIC_REPO,
    branch: "main",
    auth_methods: ["token"],
    commit_messages: COMMIT_MESSAGES,
  },
  media_folder: "public/files",
  public_folder: "/files",
  collections: [
    {
      name: "items",
      label: "חומרי לימוד",
      label_singular: "חומר לימוד",
      description: "כל דף עבודה, סיכום, מצגת או סימולציה הוא פריט אחד.",
      folder: "src/content/items",
      extension: "md",
      format: "frontmatter",
      create: true,
      identifier_field: "title",
      slug: {
        template: "{{title}}",
        editable: true,
        pattern: ["^[a-z0-9]+(-[a-z0-9]+)*$", "רק אותיות אנגליות קטנות, ספרות ומקפים. למשל: newton-second-law"],
        hint: "מזהה קבוע באנגלית שיופיע בכתובת הדף, למשל momentum-worksheet-1. לא כדאי לשנות אחרי הפרסום.",
      },
      summary: "{{title}} · {{topic}} · {{date | date('DD.MM.YYYY')}}",
      sortable_fields: ["date", "title", "topic"],
      view_groups: [{ label: "נושא", field: "topic" }, { label: "סוג", field: "type" }],
      fields: [
        { name: "title", label: "כותרת", widget: "string" },
        {
          name: "topic", label: "נושא", widget: "select", options: TOPIC_OPTIONS,
          hint: "נושא חדש שהוספת ב'הגדרות האתר' יופיע כאן אחרי כ-2 דקות (ורענון הדף).",
        },
        {
          name: "subtopic", label: "תת-נושא", widget: "select", required: false,
          options: ALL_SUBTOPICS,
          hint: "לא חובה. תת-נושא חדש מוסיפים קודם ב'הגדרות האתר ← מבנה'.",
        },
        { name: "type", label: "סוג", widget: "select", options: TYPE_OPTIONS, default: "interactive" },
        {
          name: "file", label: "קובץ", widget: "file", required: false,
          hint: "מעלים כאן את הקובץ (HTML / PDF / Word / מצגת). אם החומר הוא קישור — משאירים ריק וממלאים 'קישור'.",
        },
        { name: "url", label: "קישור", widget: "string", required: false, hint: "לסרטון YouTube, מצגת Google וכו'." },
        { name: "description", label: "תיאור קצר", widget: "text", required: false, hint: "משפט-שניים. מופיע בכרטיס ובתוצאות גוגל." },
        { name: "date", label: "תאריך", widget: "datetime", time_format: false, date_format: "DD.MM.YYYY", format: "YYYY-MM-DD" },
        { name: "tags", label: "תגיות", widget: "list", required: false, hint: "מילות מפתח לחיפוש, מופרדות בפסיק." },
        { name: "draft", label: "טיוטה (לא מוצג באתר)", widget: "boolean", default: false, required: false },
        {
          name: "body", label: "תוכן נוסף בדף (לא חובה)", widget: "markdown", required: false,
          hint: "הסבר, הוראות או פתרון שיופיעו מתחת לחומר. נוסחאות: $F=ma$ או $$E=mc^2$$",
        },
      ],
    },
    {
      name: "settings",
      label: "הגדרות האתר",
      files: [
        {
          name: "structure",
          label: "מבנה: רמות, נושאים ותתי-נושאים",
          file: "src/data/structure.json",
          format: "json",
          fields: [
            {
              name: "levels", label: "רמות", label_singular: "רמה", widget: "list",
              summary: "{{icon}} {{name}}",
              fields: [
                { name: "id", label: "מזהה באנגלית", widget: "string", hint: "למשל bagrut, university. לא לשנות אחרי שנוצר." },
                { name: "name", label: "שם", widget: "string" },
                { name: "icon", label: "אימוג'י", widget: "string", required: false },
                { name: "description", label: "תיאור", widget: "string", required: false },
                { name: "visible", label: "מוצג באתר", widget: "boolean", default: true },
              ],
            },
            {
              name: "topics", label: "נושאים", label_singular: "נושא", widget: "list",
              summary: "{{icon}} {{name}} ({{level}})",
              fields: [
                { name: "id", label: "מזהה באנגלית", widget: "string", hint: "ייחודי בכל האתר, למשל mechanics או uni-quantum. לא לשנות אחרי שנוצר." },
                {
                  name: "level", label: "רמה", widget: "select", options: LEVEL_OPTIONS,
                  hint: "רמה חדשה: מוסיפים אותה קודם, שומרים, ואחרי כ-2 דקות היא תופיע כאן.",
                },
                { name: "name", label: "שם", widget: "string" },
                { name: "icon", label: "אימוג'י", widget: "string", required: false },
                { name: "description", label: "תיאור", widget: "string" },
                { name: "subtopics", label: "תתי-נושאים", widget: "list", required: false },
              ],
            },
          ],
        },
        {
          name: "site",
          label: "פרטי האתר",
          file: "src/data/site.json",
          format: "json",
          fields: [
            { name: "title", label: "שם האתר", widget: "string" },
            { name: "tagline", label: "שורת משנה", widget: "string" },
            { name: "description", label: "תיאור לגוגל", widget: "text" },
            { name: "author", label: "שם המחבר", widget: "string" },
            { name: "customDomain", label: "דומיין אישי", widget: "string", required: false, hint: "רק אחרי שחיברת דומיין ב-GitHub. למשל physics.co.il" },
            { name: "privateRepo", label: "מאגר פרטי (לאזור /my/)", widget: "string", required: false, hint: "ריק = ברירת מחדל: <שם-המאגר>-private. לשנות רק אם קראת למאגר הפרטי בשם אחר, בפורמט user/repo." },
            { name: "googleSiteVerification", label: "קוד אימות Google Search Console", widget: "string", required: false },
            { name: "goatcounterCode", label: "קוד GoatCounter (סטטיסטיקות)", widget: "string", required: false },
            {
              name: "features", label: "יכולות", widget: "object", collapsed: true,
              fields: [{ name: "accounts", label: "חשבונות משתמשים (בפיתוח)", widget: "boolean", default: false }],
            },
          ],
        },
      ],
    },
  ],
};

export const GET: APIRoute = () => yamlResponse(config);

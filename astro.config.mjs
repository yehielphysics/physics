// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import siteData from "./src/data/site.json" with { type: "json" };

/*
 * כתובת האתר נקבעת אוטומטית:
 *  - אם הוגדר customDomain ב-src/data/site.json → https://<domain>/
 *  - אחרת, כשהאתר נבנה ב-GitHub → https://<user>.github.io/<repo>/
 *  - בבנייה מקומית → localhost
 */
function resolveUrls() {
  if (siteData.customDomain) {
    return { site: `https://${siteData.customDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`, base: "/" };
  }
  const repo = process.env.GITHUB_REPOSITORY; // "owner/name"
  if (repo) {
    const [owner, name] = repo.split("/");
    const userSite = name.toLowerCase() === `${owner.toLowerCase()}.github.io`;
    return { site: `https://${owner.toLowerCase()}.github.io`, base: userSite ? "/" : `/${name}` };
  }
  return { site: "http://localhost:4321", base: "/" };
}

const { site, base } = resolveUrls();

/* קישורים לקבצים שהועלו (/files/...) בתוך טקסט Markdown — מוסיף את נתיב הבסיס */
function rehypeBaseFiles() {
  const prefix = base.replace(/\/$/, "");
  const fix = (v) => (typeof v === "string" && v.startsWith("/files/") ? prefix + v : v);
  const walk = (node) => {
    if (node.properties) {
      if ("src" in node.properties) node.properties.src = fix(node.properties.src);
      if ("href" in node.properties) node.properties.href = fix(node.properties.href);
    }
    (node.children || []).forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.includes("/admin/") && !page.includes("/my/") })],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeBaseFiles],
  },
});

import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const sitemap = new URL(`${base}/sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nAllow: /\nDisallow: ${base}/admin/\nDisallow: ${base}/my/\n\nSitemap: ${sitemap}\n`);
};

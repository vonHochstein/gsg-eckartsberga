"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { sourceData } = require("./generate-calendar.js");
const ROOT = path.resolve(__dirname, "..");
const BASE_URL = "https://gsg-eckartsberga.de/";

function sitemapUrls(root = ROOT) {
  const files = JSON.parse(fs.readFileSync(path.join(root, ".github/public-files.json"), "utf8"));
  const pages = files.filter(file => /^[a-z][a-z0-9-]*\.html$/.test(file) && file !== "event.html");
  const { events, utils } = sourceData(root);
  const details = events.filter(event => event.developmentOnly !== true)
    .map(event => utils.createDetailUrl(event)).filter(Boolean);
  if (new Set(details).size !== details.length) throw new Error("Doppelte Veranstaltungs-URLs in der Sitemap.");
  return [...pages.map(file => file === "index.html" ? "" : file), ...details]
    .map(relative => new URL(relative, BASE_URL).href).sort();
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateSitemap(output = path.join(ROOT, "_site")) {
  // Only augment an existing website output; never copy local project material.
  if (!fs.statSync(path.join(output, "index.html")).isFile()) {
    throw new Error("Sitemap-Ausgabe benötigt eine zusammengestellte Website mit index.html.");
  }
  const urls = sitemapUrls();
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n") +
    "\n</urlset>\n";
  fs.writeFileSync(path.join(output, "sitemap.xml"), xml);
  fs.writeFileSync(path.join(output, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}sitemap.xml\n`);
  return urls;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== "--output" || !args[1])) {
    throw new Error("Aufruf: generate-sitemap.js [--output ORDNER]");
  }
  const urls = generateSitemap(args[1]);
  console.log(`Sitemap erzeugt: ${urls.length} öffentliche Seiten und Veranstaltungsdetails.`);
}

module.exports = { sitemapUrls, generateSitemap };

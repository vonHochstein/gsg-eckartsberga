"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const pageFiles = [
  "index.html",
  "event.html",
  "geschichte.html",
  "erfolge.html",
  "vorstand.html",
  "schiessbahnen.html",
  "gaestebuch.html",
  "service.html",
  "impressum.html",
  "datenschutz.html"
];

const officialTargets = [
  "https://www.vgem-finne.de/webNC/de/content/content.php?areaID=4&amp;menuID=3&amp;active_menu=3&amp;vhm=&amp;area=Gemeinden&amp;menu=Eckartsberga&amp;content=",
  "https://www.burgenlandkreis.de/de/gefahrenabwehr/rechts-und-ordnungsamt.html",
  "https://www.dsb.de/",
  "https://www.sv-st.de/",
  "https://www.sv-st.de/index.php/verband/kreisverbaende",
  "https://www.ksbburgenland.de/"
];

function readPage(fileName) {
  return fs.readFileSync(path.join(projectRoot, fileName), "utf8");
}

function navigation(html, className) {
  return html.match(
    new RegExp('<nav class="' + className + '"[^>]*>[\\s\\S]*?<\\/nav>')
  )?.[0] ?? "";
}

test("stellt die Serviceseite im gemeinsamen statischen Seitenrahmen bereit", () => {
  const html = readPage("service.html");

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/<h2\b/g) ?? []).length, 2);
  assert.match(html, /<body class="history-page service-page">/);
  assert.match(html, /class="history-hero"/);
  assert.match(html, /<p class="history-eyebrow">Orientierung<\/p>/);
  assert.match(html, /<h1>Service &amp; Links<\/h1>/);
  assert.match(html, /<h2 id="service-region-title">Region und Verwaltung<\/h2>/);
  assert.match(html, /<h2 id="service-sport-title">Verbände und Sport<\/h2>/);
  assert.match(html, /href="service\.css"/);
  assert.doesNotMatch(html, /Partner &amp; Unterstützer|partner\.html/);
});

test("verlinkt genau die sechs festgelegten offiziellen Anlaufstellen", () => {
  const html = readPage("service.html");
  const main = html.match(/<main id="main-content">([\s\S]*?)<\/main>/)?.[1] ?? "";

  assert.equal((main.match(/class="service-link"/g) ?? []).length, 6);
  assert.equal((main.match(/rel="external"/g) ?? []).length, 6);
  assert.doesNotMatch(main, /\btarget=/);
  officialTargets.forEach((target) => {
    assert.match(main, new RegExp('href="' + target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"'));
  });

  assert.match(main, /Untere Waffenbehörde des Burgenlandkreises/);
  assert.doesNotMatch(main, />Waffenbehörde Naumburg</);
  assert.match(main, /offiziellen Kreisverbandsverzeichnis des Landesverbandes/);
});

test("lädt beim Seitenaufruf ausschließlich lokale Ressourcen", () => {
  const html = readPage("service.html");
  const automaticTargets = [
    ...html.matchAll(/<(?:script|img)[^>]+\bsrc="([^"]+)"/gi),
    ...html.matchAll(/<source[^>]+\bsrcset="([^"]+)"/gi),
    ...html.matchAll(/<link[^>]+\bhref="([^"]+)"/gi)
  ].map((match) => match[1]);

  automaticTargets.forEach((target) => {
    assert.doesNotMatch(target, /^(?:https?:)?\/\//i);
    assert.equal(
      fs.existsSync(path.join(projectRoot, target)),
      true,
      "Lokale Ressource fehlt: " + target
    );
  });
});

test("führt Service in Hauptnavigation und Footer aller Seiten konsistent", () => {
  pageFiles.forEach((pageFile) => {
    const html = readPage(pageFile);
    const main = navigation(html, "main-nav");
    const footer = navigation(html, "footer-nav");

    assert.match(main, /href="service\.html"(?: aria-current="page")?>Service<\/a>/);
    assert.ok(
      main.indexOf('href="service.html"') > main.indexOf("#galerie"),
      pageFile + ": Service muss nach Galerie stehen"
    );
    assert.ok(
      main.indexOf('href="service.html"') < main.indexOf("#mitglied"),
      pageFile + ": Service muss vor Mitglied werden stehen"
    );

    assert.match(
      footer,
      /href="service\.html"(?: aria-current="page")?>Service &amp; Links<\/a>/
    );
    assert.ok(
      footer.indexOf('href="service.html"') > footer.indexOf("#mitglied"),
      pageFile + ": Service muss im Footer nach Mitglied werden stehen"
    );
    assert.ok(
      footer.indexOf('href="service.html"') < footer.indexOf("gaestebuch.html"),
      pageFile + ": Service muss im Footer vor dem Gästebuch stehen"
    );
  });

  const serviceHtml = readPage("service.html");
  assert.match(
    navigation(serviceHtml, "main-nav"),
    /href="service\.html" aria-current="page">Service<\/a>/
  );
  assert.match(
    navigation(serviceHtml, "footer-nav"),
    /href="service\.html" aria-current="page">Service &amp; Links<\/a>/
  );
});

test("ergänzt auf der Startseite weder Servicekarte noch Partnersichtbarkeit", () => {
  const html = readPage("index.html");

  assert.doesNotMatch(html, /<section[^>]+id="service"/);
  assert.doesNotMatch(html, /class="[^"]*(?:highlight|club)-card[^"]*"[^>]*href="service\.html"/);
  assert.doesNotMatch(html, /Partner &amp; Unterstützer|partner\.html/);
});

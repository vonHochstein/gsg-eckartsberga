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
  "partner.html",
  "kontakt.html",
  "impressum.html",
  "datenschutz.html"
];

function readPage(fileName) {
  return fs.readFileSync(path.join(projectRoot, fileName), "utf8");
}

function navigation(html, className) {
  return html.match(
    new RegExp('<nav class="' + className + '"[^>]*>[\\s\\S]*?<\\/nav>')
  )?.[0] ?? "";
}

test("stellt den Partnerentwurf im etablierten Unterseitenrahmen bereit", () => {
  const html = readPage("partner.html");

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<body class="history-page partner-page">/);
  assert.match(html, /class="history-hero"/);
  assert.match(html, /<p class="history-eyebrow">Gemeinsam stark<\/p>/);
  assert.match(html, /<h1>Partner &amp; Unterstützer<\/h1>/);
  assert.match(html, /href="partner\.css"/);
  assert.equal((html.match(/class="partner-card partner-card-placeholder"/g) ?? []).length, 4);
});

test("verwendet vier neutrale Bildflächen mit veröffentlichungsfähigem Text", () => {
  const html = readPage("partner.html");
  const main = html.match(/<main id="main-content">([\s\S]*?)<\/main>/)?.[1] ?? "";
  const grid = main.match(/<div class="partner-grid"[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? "";

  assert.equal((grid.match(/<article\b/g) ?? []).length, 4);
  assert.match(main, /Unsere Partner und Unterstützer begleiten die GSG Eckartsberga/);
  assert.match(grid, /<h3>Engagement vor Ort<\/h3>/);
  assert.match(grid, /<h3>Gemeinschaft fördern<\/h3>/);
  assert.match(grid, /<h3>Sport ermöglichen<\/h3>/);
  assert.match(grid, /<h3>Zukunft mitgestalten<\/h3>/);
  assert.doesNotMatch(main, /vorbereitet|nach Freigabe|wird ergänzt/);
  assert.doesNotMatch(grid, />Platzhalter</);
  assert.doesNotMatch(grid, /<a\b|https?:\/\//);
  assert.doesNotMatch(grid, /<img\b/);
});

test("führt Partner nur als sekundäres Ziel im Footer aller Seiten", () => {
  pageFiles.forEach((pageFile) => {
    const html = readPage(pageFile);
    const main = navigation(html, "main-nav");
    const footer = navigation(html, "footer-nav");

    assert.doesNotMatch(main, /partner\.html|>Partner</);
    assert.match(footer, /href="partner\.html"(?: aria-current="page")?>Partner<\/a>/);
    assert.ok(
      footer.indexOf('href="partner.html"') > footer.indexOf('href="service.html"'),
      pageFile + ": Partner muss nach Service stehen"
    );
    assert.ok(
      footer.indexOf('href="partner.html"') < footer.indexOf('href="impressum.html"'),
      pageFile + ": Partner muss vor dem Impressum stehen"
    );
  });

  assert.match(
    navigation(readPage("partner.html"), "footer-nav"),
    /href="partner\.html" aria-current="page">Partner<\/a>/
  );
});

test("verlinkt die Partnerseite dezent aus dem Mitgliedschaftsbereich", () => {
  const html = readPage("index.html");
  const membership = html.match(/<section id="mitglied"[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(membership, /class="partner-home-teaser"/);
  assert.match(membership, /<h3 id="partner-home-title">Gemeinsam für Verein und Region\.<\/h3>/);
  assert.match(membership, /href="partner\.html">[\s\S]*?Partner ansehen/);
  assert.match(
    membership,
    /<a class="btn btn-secondary" href="kontakt\.html">[\s\S]*?Kontakt aufnehmen[\s\S]*?<\/a>/
  );
  assert.equal((html.match(/href="partner\.html"/g) ?? []).length, 2);
});

test("lädt auf der Partnerseite ausschließlich vorhandene lokale Ressourcen", () => {
  const html = readPage("partner.html");
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

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const imprintPath = path.join(projectRoot, "impressum.html");
const pageFiles = [
  "index.html",
  "event.html",
  "geschichte.html",
  "erfolge.html",
  "vorstand.html",
  "schiessbahnen.html",
  "gaestebuch.html",
  "datenschutz.html",
  "impressum.html"
];

function readPage(fileName) {
  return fs.readFileSync(path.join(projectRoot, fileName), "utf8");
}

function navigation(html, className) {
  return html.match(
    new RegExp('<nav class="' + className + '"[^>]*>[\\s\\S]*?<\\/nav>')
  )?.[0] ?? "";
}

test("verwendet für das Impressum den bestehenden Detailseitenrahmen", () => {
  const html = readPage("impressum.html");

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<body class="history-page privacy-page">/);
  assert.match(html, /class="site-header history-site-header"/);
  assert.match(html, /class="history-hero"/);
  assert.match(html, /class="event-back-link" href="index\.html#start"/);
  assert.match(html, /<h1>Impressum<\/h1>/);
  assert.match(html, /class="privacy-document"/);
  assert.match(html, /href="datenschutz\.css"/);
  assert.match(html, /href="#main-content"/);
  assert.doesNotMatch(navigation(html, "main-nav"), /Impressum|impressum\.html/);
});

test("enthält ausschließlich die bestätigten Anbieterangaben", () => {
  const html = readPage("impressum.html");
  const board = html.match(
    /<section class="privacy-section" aria-labelledby="imprint-board-title">([\s\S]*?)<\/section>/
  )?.[1] ?? "";

  assert.match(html, /Großkaliber Schützengilde Eckartsberga e\. V\./);
  assert.match(html, /Tromsdorfer Straße 13/);
  assert.match(html, /06647 An der Poststraße OT Herrengosserstedt/);
  [
    "Roland Matthes",
    "Steffen Ackermann",
    "Gerfried Barth",
    "Theobald Schneider",
    "Tommy Seeber"
  ].forEach((name) => assert.match(board, new RegExp("<li>" + name + "</li>")));
  assert.doesNotMatch(board, /Theo Schneider/);
  assert.match(
    html,
    /Jeweils zwei Vorstandsmitglieder vertreten den Verein gemeinsam\./
  );
  assert.match(html, /Amtsgericht Stendal<br \/>VR 45185/);
  assert.equal(
    (html.match(/\[VEREINS-E-MAIL VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g) ?? []).length,
    1
  );
  assert.doesNotMatch(html, /WhatsApp|Telefon|USt-IdNr|Steuernummer/);
});

test("enthält keine historischen Disclaimer oder internen Rechtsprüfungen", () => {
  const html = readPage("impressum.html");
  const visibleText = html
    .replace(/\[VEREINS-E-MAIL VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  assert.doesNotMatch(
    visibleText,
    /Haftungsausschluss|Distanzierung|Rechtswirksamkeit|Online-Streitbeilegung|TMG|MStV|VSBG|Pre-Publish|vor Veröffentlichung|noch nicht/i
  );
  assert.doesNotMatch(html, /<form\b|formspree\.io\/f\//i);
});

test("verlinkt Impressum und Datenschutz in allen Footern", () => {
  pageFiles.forEach((pageFile) => {
    const html = readPage(pageFile);
    const footer = navigation(html, "footer-nav");
    const main = navigation(html, "main-nav");

    assert.match(footer, /href="impressum\.html"(?: aria-current="page")?>Impressum<\/a>/);
    assert.match(footer, /href="datenschutz\.html"(?: aria-current="page")?>Datenschutz<\/a>/);
    assert.ok(
      footer.indexOf('href="impressum.html"') < footer.indexOf('href="datenschutz.html"'),
      pageFile + ": Impressum muss vor Datenschutz stehen"
    );
    assert.doesNotMatch(main, /Impressum|impressum\.html/);
  });

  assert.match(
    readPage("impressum.html"),
    /href="impressum\.html" aria-current="page">Impressum<\/a>/
  );
  assert.match(
    readPage("datenschutz.html"),
    /href="datenschutz\.html" aria-current="page">Datenschutz<\/a>/
  );
});

test("lädt automatisch nur vorhandene lokale Ressourcen und verlinkt interne Ziele", () => {
  assert.equal(fs.existsSync(imprintPath), true);
  const html = readPage("impressum.html");
  const automaticTargets = [
    ...html.matchAll(/<(?:script|img)[^>]+\bsrc="([^"]+)"/gi),
    ...html.matchAll(/<source[^>]+\bsrcset="([^"]+)"/gi),
    ...html.matchAll(/<link[^>]+\bhref="([^"]+)"/gi)
  ].map((match) => match[1]);

  assert.ok(automaticTargets.length > 0);
  automaticTargets.forEach((target) => {
    assert.doesNotMatch(target, /^(?:https?:)?\/\//i);
    assert.equal(
      fs.existsSync(path.join(projectRoot, target)),
      true,
      "Lokale Ressource fehlt: " + target
    );
  });

  for (const [, target] of html.matchAll(/\bhref="([^"]+)"/g)) {
    if (/^(?:https?:)?\/\//i.test(target) || target.startsWith("#")) continue;
    assert.equal(
      fs.existsSync(path.join(projectRoot, target.split("#")[0])),
      true,
      "Lokales Linkziel fehlt: " + target
    );
  }
});

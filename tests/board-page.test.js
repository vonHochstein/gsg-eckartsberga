"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const boardPath = path.join(projectRoot, "vorstand.html");
const boardCssPath = path.join(projectRoot, "vorstand.css");
const indexPath = path.join(projectRoot, "index.html");

function readProjectFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function getNavigationMarkup(html, className) {
  const pattern = new RegExp(
    `<nav[^>]*class="[^"]*${className}[^"]*"[^>]*>[\\s\\S]*?<\\/nav>`,
    "i"
  );

  return html.match(pattern)?.[0] ?? "";
}

test("stellt die Vorstandsseite im etablierten statischen Unterseitenrahmen bereit", () => {
  assert.equal(fs.existsSync(boardPath), true);
  assert.equal(fs.existsSync(boardCssPath), true);

  const boardHtml = readProjectFile(boardPath);

  assert.equal(countMatches(boardHtml, /<h1\b/gi), 1);
  assert.match(boardHtml, /<h1 id="board-title">Vorstand und Ansprechpartner<\/h1>/);
  assert.match(boardHtml, /<body class="history-page board-page">/);
  assert.match(boardHtml, /<main id="main-content">/);
  assert.match(boardHtml, /class="event-back-link" href="index\.html#verein"/);
  assert.match(boardHtml, /class="site-header history-site-header"/);
  assert.match(boardHtml, /class="history-hero"/);
  assert.match(boardHtml, /class="board-overview"/);
  assert.equal(countMatches(boardHtml, /class="board-section"/g), 2);
  assert.doesNotMatch(boardHtml, /class="(?:event-detail|event-hero|event-content|event-section)"/);
  assert.match(boardHtml, /<link rel="stylesheet" href="style\.css" \/>/);
  assert.match(boardHtml, /<link rel="stylesheet" href="event\.css" \/>/);
  assert.match(boardHtml, /<link rel="stylesheet" href="geschichte\.css" \/>/);
  assert.match(boardHtml, /<link rel="stylesheet" href="vorstand\.css" \/>/);
});

test("trennt Vorstand und weitere Ansprechpartner fachlich", () => {
  const boardHtml = readProjectFile(boardPath);
  const people = [
    ["Vorstandsvorsitzender", "Roland Matthes"],
    ["Stellvertretender Vorsitzender", "Steffen Ackermann"],
    ["Kassenwart", "Theobald Schneider"],
    ["Sportwart", "Gerfried Barth"],
    ["Schriftführer", "Tommy Seeber"],
    ["Sachkundeprüfer", "Hubert Schorch"]
  ];

  assert.match(boardHtml, /<h2 id="board-members-title">Vorstand<\/h2>/);
  assert.match(
    boardHtml,
    /<h2 id="additional-contacts-title">Weitere Ansprechpartner<\/h2>/
  );
  assert.equal(countMatches(boardHtml, /class="board-member"/g), 6);

  people.forEach(([role, name]) => {
    assert.equal(countMatches(boardHtml, new RegExp(role, "g")), 1);
    assert.equal(countMatches(boardHtml, new RegExp(name, "g")), 1);
  });

  const boardSection = boardHtml.match(
    /<section class="board-section">[\s\S]*?<\/section>/
  )?.[0] ?? "";
  const contactsSection = boardHtml.match(
    /<section class="board-section" aria-labelledby="additional-contacts-title">[\s\S]*?<\/section>/
  )?.[0] ?? "";

  assert.match(boardSection, /Roland Matthes/);
  assert.match(boardSection, /Tommy Seeber/);
  assert.doesNotMatch(boardSection, /Hubert Schorch/);
  assert.match(contactsSection, /Hubert Schorch/);
});

test("veröffentlicht keine ungeprüften Kontakt-, Karten- oder Porträtinhalte", () => {
  const boardHtml = readProjectFile(boardPath);
  const mainMarkup = boardHtml.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "";

  assert.doesNotMatch(boardHtml, /(?:tel:|mailto:|<iframe\b)/i);
  assert.doesNotMatch(boardHtml, /So finden Sie uns|Burgstraße|Tromsdorfer Straße/i);
  assert.doesNotMatch(mainMarkup, /<img\b|<figure\b/i);
});

test("verlinkt die unveränderte Ansprechpartnerkarte ohne sichtbaren Zusatz", () => {
  const indexHtml = readProjectFile(indexPath);
  const cardMarkup = indexHtml.match(
    /<a class="highlight-card" href="vorstand\.html">[\s\S]*?<\/a>/
  )?.[0] ?? "";

  assert.notEqual(cardMarkup, "");
  assert.match(
    cardMarkup,
    /<div class="highlight-icon" aria-hidden="true">\s*<svg\b/
  );
  assert.match(cardMarkup, /<h3>Ansprechpartner<\/h3>/);
  assert.match(
    cardMarkup,
    /<p>Der persönliche Austausch und verlässliche Verantwortlichkeiten tragen unsere Gemeinschaft\.<\/p>/
  );
  assert.equal(countMatches(cardMarkup, /<(?:div|h3|p)\b/g), 3);
  assert.doesNotMatch(cardMarkup, /card-hover-link|ansehen|entdecken|→/i);
});

test("erweitert die globale Navigation nicht um die Vorstandsseite", () => {
  const boardHtml = readProjectFile(boardPath);

  ["main-nav", "footer-nav"].forEach((className) => {
    const navigationMarkup = getNavigationMarkup(boardHtml, className);

    assert.notEqual(navigationMarkup, "");
    assert.doesNotMatch(navigationMarkup, /vorstand\.html/i);
  });

  assert.match(boardHtml, /<script src="js\/navigation\.js" defer><\/script>/);
  assert.match(boardHtml, /<script src="js\/main\.js" defer><\/script>/);
  assert.doesNotMatch(boardHtml, /event-detail\.js|gallery-lightbox\.js/);
});

test("verweist ausschließlich auf vorhandene lokale Seiten und Assets", () => {
  const boardHtml = readProjectFile(boardPath);
  const references = [...boardHtml.matchAll(/\b(?:href|src|srcset)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:#|https?:|mailto:|tel:)/i.test(reference))
    .map((reference) => reference.split(/[?#]/, 1)[0]);

  references.forEach((reference) => {
    assert.equal(
      fs.existsSync(path.join(projectRoot, reference)),
      true,
      `Lokales Ziel fehlt: ${reference}`
    );
  });
});

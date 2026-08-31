"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const historyPath = path.join(projectRoot, "geschichte.html");
const historyCssPath = path.join(projectRoot, "geschichte.css");
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

test("stellt die statische Geschichtsseite mit genau einer H1 bereit", () => {
  assert.equal(fs.existsSync(historyPath), true);
  assert.equal(fs.existsSync(historyCssPath), true);

  const historyHtml = readProjectFile(historyPath);

  assert.equal(countMatches(historyHtml, /<h1\b/gi), 1);
  assert.match(historyHtml, /<link rel="stylesheet" href="geschichte\.css" \/>/);
  assert.match(historyHtml, /id="chronicle-title"/);
  assert.match(historyHtml, /id="sources-title"/);
});

test("bewahrt die verbindliche chronologische Reihenfolge", () => {
  const historyHtml = readProjectFile(historyPath);
  const stations = [
    "15. Jahrhundert",
    "datetime=\"1503\"",
    "datetime=\"1827\"",
    "datetime=\"1912\"",
    "datetime=\"1927-07-09\"",
    "datetime=\"1933\"",
    "datetime=\"1945\"",
    "datetime=\"1992-10\"",
    "1990er Jahre",
    "datetime=\"1996\"",
    "Gegenwart"
  ];

  let previousPosition = -1;

  stations.forEach((station) => {
    const position = historyHtml.indexOf(station);

    assert.notEqual(position, -1, `Chronikstation fehlt: ${station}`);
    assert.ok(
      position > previousPosition,
      `Chronikstation steht nicht in Reihenfolge: ${station}`
    );
    previousPosition = position;
  });

  assert.match(historyHtml, /datetime="1992-10-07"/);
  assert.match(historyHtml, /datetime="1992-10-23"/);
});

test("verlinkt ausschließlich die bestehende Geschichtskarte als Einstieg", () => {
  const indexHtml = readProjectFile(indexPath);
  const historyHtml = readProjectFile(historyPath);

  assert.match(
    indexHtml,
    /<a class="history-teaser-card" href="geschichte\.html">/
  );
  assert.match(indexHtml, /Geschichte entdecken/);

  [indexHtml, historyHtml].forEach((html) => {
    const headerNavigation = getNavigationMarkup(html, "main-nav");
    const footerNavigation = getNavigationMarkup(html, "footer-nav");

    assert.doesNotMatch(headerNavigation, /geschichte\.html/i);
    assert.doesNotMatch(footerNavigation, /geschichte\.html/i);
  });
});

test("enthält transparente Quellen ohne ungeklärte Medien zu veröffentlichen", () => {
  const historyHtml = readProjectFile(historyPath);

  assert.match(historyHtml, /Quellen und Einordnung/);
  assert.match(historyHtml, /Externe historische Quelle/);
  assert.match(historyHtml, /Historische Vereinsquellen/);
  assert.match(historyHtml, /Vereinsüberlieferung/);
  assert.doesNotMatch(historyHtml, /image\.jimcdn\.com/i);
  assert.doesNotMatch(historyHtml, /assets\/(?:img|documents)\/history\//i);
});

test("versieht alle öffentlichen Bilder der Geschichtsseite mit Abmessungen und Alt-Text", () => {
  const historyHtml = readProjectFile(historyPath);
  const imageTags = historyHtml.match(/<img\b[\s\S]*?>/gi) ?? [];

  assert.ok(imageTags.length > 0);
  imageTags.forEach((imageTag) => {
    assert.match(imageTag, /\balt="[^"]*"/i);
    assert.match(imageTag, /\bwidth="\d+"/i);
    assert.match(imageTag, /\bheight="\d+"/i);
  });
});

test("entfernt problematische Kontinuitätsbehauptungen von der Startseite", () => {
  const indexHtml = readProjectFile(indexPath);

  assert.doesNotMatch(indexHtml, /Seit über 500 Jahren/);
  assert.doesNotMatch(indexHtml, /über 500-jährigen Tradition/);
  assert.doesNotMatch(indexHtml, /Vom Mittelalter bis heute/);
  assert.doesNotMatch(indexHtml, /Tradition seit 1503/);
  assert.match(indexHtml, /Gründung des heutigen Vereins 1992/);
});

test("schließt das lokale Migrationsarchiv zuverlässig von Git aus", () => {
  const gitignore = readProjectFile(path.join(projectRoot, ".gitignore"));

  assert.match(gitignore, /^\.local-archive\/$/m);
});

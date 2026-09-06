"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "js/data/guestbook-entries.js");
const scriptPath = path.join(projectRoot, "js/guestbook.js");
const pagePath = path.join(projectRoot, "gaestebuch.html");

require(scriptPath);

const {
  normalizeGuestbookEntries,
  formatGuestbookDate
} = globalThis.GuestbookUtils;

function readProjectFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function loadPublishedEntries() {
  const context = vm.createContext({});
  vm.runInContext(readProjectFile(dataPath), context, {
    filename: "guestbook-entries.js"
  });
  vm.runInContext(
    "globalThis.guestbookSnapshot = publishedGuestbookEntries;",
    context
  );
  return context.guestbookSnapshot;
}

test("stellt einen bewusst leeren veröffentlichten Datenbestand bereit", () => {
  assert.deepEqual(Array.from(loadPublishedEntries()), []);
});

test("normalisiert Pflichtfelder und verändert die Eingabedaten nicht", () => {
  const entries = [
    {
      id: " guestbook-2026-001 ",
      displayName: " Gast ",
      date: "2026-09-06",
      text: " Vielen Dank für den schönen Tag. ",
      featuredOnHome: true
    }
  ];
  const originalEntries = structuredClone(entries);

  assert.deepEqual(normalizeGuestbookEntries(entries), [
    {
      id: "guestbook-2026-001",
      displayName: "Gast",
      date: "2026-09-06",
      text: "Vielen Dank für den schönen Tag.",
      featuredOnHome: true
    }
  ]);
  assert.deepEqual(entries, originalEntries);
});

test("verwirft ungültige und doppelte Einträge", () => {
  const validEntry = {
    id: "guestbook-2026-001",
    displayName: "Gast",
    date: "2026-09-06",
    text: "Ein gültiger Eintrag"
  };

  assert.deepEqual(
    normalizeGuestbookEntries([
      null,
      {},
      { ...validEntry, id: "" },
      { ...validEntry, displayName: " " },
      { ...validEntry, date: "2026-02-30" },
      { ...validEntry, text: "" },
      validEntry,
      { ...validEntry, text: "Dublette" }
    ]),
    [{ ...validEntry, featuredOnHome: false }]
  );
});

test("sortiert nach Datum absteigend und bei Gleichstand stabil", () => {
  const entries = [
    { id: "a", displayName: "A", date: "2025-01-01", text: "A" },
    { id: "b", displayName: "B", date: "2026-01-01", text: "B" },
    { id: "c", displayName: "C", date: "2026-01-01", text: "C" }
  ];

  assert.deepEqual(
    normalizeGuestbookEntries(entries).map((entry) => entry.id),
    ["b", "c", "a"]
  );
});

test("formatiert ausschließlich gültige Daten", () => {
  assert.equal(formatGuestbookDate("2026-09-06"), "6. September 2026");
  assert.equal(formatGuestbookDate("2026-02-30"), "");
});

test("stellt die Gästebuchseite ohne Formular oder Produktivinhalt bereit", () => {
  const html = readProjectFile(pagePath);

  assert.equal([...html.matchAll(/<h1\b/gi)].length, 1);
  assert.match(html, /<h1>Stimmen unserer Gäste<\/h1>/);
  assert.match(html, /id="guestbook-list"/);
  assert.match(html, /id="guestbook-empty" hidden/);
  assert.match(html, /Noch sind keine Gästebucheinträge veröffentlicht\./);
  assert.match(html, /js\/data\/guestbook-entries\.js/);
  assert.match(html, /js\/guestbook\.js/);
  assert.doesNotMatch(html, /<form\b|formspree|action=/i);
});

test("verwendet vorhandenen Seitenrahmen und erweitert die Hauptnavigation nicht", () => {
  const html = readProjectFile(pagePath);
  const mainNavigation = html.match(
    /<nav class="main-nav"[\s\S]*?<\/nav>/
  )?.[0] ?? "";

  assert.match(html, /<body class="history-page guestbook-page">/);
  assert.match(html, /class="site-header history-site-header"/);
  assert.match(html, /class="event-back-link" href="index\.html#start"/);
  assert.match(html, /style\.css/);
  assert.match(html, /event\.css/);
  assert.match(html, /geschichte\.css/);
  assert.match(html, /gaestebuch\.css/);
  assert.doesNotMatch(mainNavigation, /Gästebuch|gaestebuch\.html/);
});

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
const indexPath = path.join(projectRoot, "index.html");
const stylePath = path.join(projectRoot, "style.css");

require(scriptPath);

const {
  normalizeGuestbookEntries,
  getFeaturedGuestbookEntries,
  formatGuestbookDate,
  selectInitialGuestbookIndex
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
  return JSON.parse(JSON.stringify(context.guestbookSnapshot));
}

test("stellt die fünf freigegebenen Bestandseinträge unverändert bereit", () => {
  assert.deepEqual(loadPublishedEntries(), [
    {
      id: "guestbook-2025-001",
      displayName: "Schützenverein Benninghofen-Brücherhof-Loh 1658 e. V.",
      date: "2025-09-05",
      text:
        "Horrido aus dem schönen Dortmund, und viel Spaß bei eurem morgigen Fest.\n\nSehr schöne Webseite.",
      featuredOnHome: true
    },
    {
      id: "guestbook-2024-001",
      displayName: "Steve",
      date: "2024-01-29",
      text: "Sehr gute Schießanlage, bis zum nächsten Mal.",
      featuredOnHome: true
    },
    {
      id: "guestbook-2023-001",
      displayName: "Jörg",
      date: "2023-08-21",
      text: "Danke für das tolle Training, ich komm gern wieder.",
      featuredOnHome: true
    },
    {
      id: "guestbook-2022-002",
      displayName: "Schmidt Uwe",
      date: "2022-05-14",
      text:
        "Wir kommen wieder. das rund um die Uhr geschossen werden kann und zu jedem Tag ist super. weiter so GSG!",
      featuredOnHome: false
    },
    {
      id: "guestbook-2022-001",
      displayName: "Müller",
      date: "2022-05-01",
      text: "Tolle Raumschießanlage, hat spaß gemacht. Danke",
      featuredOnHome: true
    }
  ]);
});

test("normalisiert die Bestandseinträge in der verbindlichen Reihenfolge", () => {
  const entries = normalizeGuestbookEntries(loadPublishedEntries());

  assert.deepEqual(
    entries.map((entry) => entry.id),
    [
      "guestbook-2025-001",
      "guestbook-2024-001",
      "guestbook-2023-001",
      "guestbook-2022-002",
      "guestbook-2022-001"
    ]
  );
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 5);
});

test("markiert ausschließlich die vier freigegebenen Stimmen für die Startseite", () => {
  assert.deepEqual(
    getFeaturedGuestbookEntries(loadPublishedEntries()).map(
      (entry) => entry.displayName
    ),
    [
      "Schützenverein Benninghofen-Brücherhof-Loh 1658 e. V.",
      "Steve",
      "Jörg",
      "Müller"
    ]
  );
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

test("liefert ausschließlich redaktionell ausgewählte Startseitenstimmen", () => {
  const entries = [
    {
      id: "a",
      displayName: "A",
      date: "2026-01-01",
      text: "A"
    },
    {
      id: "b",
      displayName: "B",
      date: "2026-01-02",
      text: "B",
      featuredOnHome: true
    }
  ];

  assert.deepEqual(
    getFeaturedGuestbookEntries(entries).map((entry) => entry.id),
    ["b"]
  );
});

test("formatiert Daten und bestimmt den zufälligen Startindex deterministisch", () => {
  assert.equal(formatGuestbookDate("2026-09-06"), "6. September 2026");
  assert.equal(formatGuestbookDate("2026-02-30"), "");
  assert.equal(selectInitialGuestbookIndex(1, 0.75), 0);
  assert.equal(selectInitialGuestbookIndex(4, 0), 0);
  assert.equal(selectInitialGuestbookIndex(4, 0.74), 2);
  assert.equal(selectInitialGuestbookIndex(4, 1), 3);
  assert.equal(selectInitialGuestbookIndex(0, 0.5), -1);
});

test("stellt die Gästebuchseite ohne Formular bereit", () => {
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

test("ordnet den verborgenen Stimmenbereich zwischen Galerie und Mitgliedschaft ein", () => {
  const html = readProjectFile(indexPath);
  const galleryIndex = html.indexOf('<section id="galerie"');
  const voicesIndex = html.indexOf('id="stimmen"');
  const membershipIndex = html.indexOf('<section id="mitglied"');

  assert.ok(galleryIndex >= 0);
  assert.ok(voicesIndex > galleryIndex);
  assert.ok(membershipIndex > voicesIndex);
  assert.match(
    html,
    /id="stimmen"[\s\S]*?aria-labelledby="guestbook-voices-title"[\s\S]*?hidden/
  );
  assert.match(html, /data-guestbook-slides/);
  assert.match(html, /data-guestbook-previous/);
  assert.match(html, /data-guestbook-toggle/);
  assert.match(html, /data-guestbook-next/);
  assert.match(html, /href="gaestebuch\.html">Zum Gästebuch<\/a>/);
});

test("lädt Gästebuchdaten vor der gemeinsamen Gästebuchlogik", () => {
  for (const filePath of [indexPath, pagePath]) {
    const html = readProjectFile(filePath);
    const dataIndex = html.indexOf("js/data/guestbook-entries.js");
    const scriptIndex = html.indexOf("js/guestbook.js");

    assert.ok(dataIndex >= 0);
    assert.ok(scriptIndex > dataIndex);
  }
});

test("verwendet den festgelegten Wechsel- und Bedienvertrag", () => {
  const script = readProjectFile(scriptPath);

  assert.match(script, /const ROTATION_INTERVAL = 9000;/);
  assert.match(script, /const TRANSITION_DURATION = 350;/);
  assert.match(script, /controls\.hidden = slides\.length < 2;/);
  assert.match(script, /prefers-reduced-motion: reduce/);
  assert.match(script, /root\.addEventListener\("pointerenter", pauseAutoplay\)/);
  assert.match(script, /root\.addEventListener\("focusin", pauseAutoplay\)/);
  assert.match(script, /document\.addEventListener\("visibilitychange"/);
  assert.match(script, /autoplayEnabled \? "off" : "polite"/);
  assert.match(script, /textContent = entry\.text/);
});

test("hält alle Stimmen in derselben Rasterfläche und Bedienelemente groß genug", () => {
  const css = readProjectFile(stylePath);

  assert.match(css, /\.guestbook-voices-slides\s*{[^}]*display:\s*grid;/s);
  assert.match(css, /\.guestbook-voice\s*{[^}]*grid-area:\s*1 \/ 1;/s);
  assert.match(
    css,
    /\.guestbook-voices-button,[\s\S]*?\.guestbook-voices-toggle\s*{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.guestbook-voice,[\s\S]*?transform:\s*none;/
  );
  assert.match(
    css,
    /\.guestbook-entry blockquote p,[\s\S]*?\.guestbook-voice blockquote p\s*{[^}]*white-space:\s*pre-line;/
  );
});

test("verlinkt das Gästebuch in jedem Footer, aber in keiner Hauptnavigation", () => {
  const pageNames = [
    "index.html",
    "event.html",
    "geschichte.html",
    "vorstand.html",
    "erfolge.html",
    "schiessbahnen.html",
    "gaestebuch.html"
  ];

  pageNames.forEach((pageName) => {
    const html = readProjectFile(path.join(projectRoot, pageName));
    const footerNavigation = html.match(
      /<nav class="footer-nav"[\s\S]*?<\/nav>/
    )?.[0] ?? "";
    const mainNavigation = html.match(
      /<nav class="main-nav"[\s\S]*?<\/nav>/
    )?.[0] ?? "";

    assert.match(footerNavigation, /href="gaestebuch\.html"/);
    assert.doesNotMatch(mainNavigation, /Gästebuch|gaestebuch\.html/);
  });
});

test("verweist auf der Gästebuchseite ausschließlich auf vorhandene lokale Ziele", () => {
  const html = readProjectFile(pagePath);
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(
    (match) => match[1]
  );

  references.forEach((reference) => {
    if (/^(?:#|https?:|mailto:|tel:)/.test(reference)) return;

    const localPath = reference.split(/[?#]/, 1)[0];
    assert.ok(
      fs.existsSync(path.join(projectRoot, localPath)),
      `Lokales Ziel fehlt: ${reference}`
    );
  });
});

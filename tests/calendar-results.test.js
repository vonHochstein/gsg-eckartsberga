"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

require(path.resolve(__dirname, "../js/event-utils.js"));

const calendarSource = fs.readFileSync(
  path.resolve(__dirname, "../js/calendar.js"),
  "utf8"
);
const styleSource = fs.readFileSync(
  path.resolve(__dirname, "../style.css"),
  "utf8"
);

function renderCard(overrides = {}) {
  const context = vm.createContext({
    document: { getElementById: () => null },
    window: { EventUtils: globalThis.EventUtils }
  });

  vm.runInContext(calendarSource, context, { filename: "calendar.js" });

  return vm.runInContext("createEventMarkup", context)({
    id: 1,
    slug: "test-event",
    title: "Testveranstaltung",
    start: "2026-09-12T09:30:00",
    ...overrides
  });
}

function resultStatus(markup) {
  const match = markup.match(
    /<span class="timeline-chip ([^"]+)"><span aria-hidden="true">🏆<\/span>&nbsp;([^<]+)<\/span>/
  );

  return match?.slice(1);
}

function mediaStatus(markup) {
  const match = markup.match(
    /<span class="timeline-chip ([^"]+)"><span aria-hidden="true">📷<\/span>&nbsp;([^<]+)<\/span>/
  );

  return match?.slice(1);
}

test("zeigt das vorhandene KM-Ergebnisprotokoll in der Kalenderkarte an", () => {
  const eventSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/events.js"),
    "utf8"
  );
  const context = vm.createContext({});

  vm.runInContext(eventSource, context, { filename: "events.js" });
  const event = vm.runInContext(
    'productionEvents.find((entry) => entry.slug === "km-halbautomat-kk-gk-2026")',
    context
  );

  assert.ok(event);
  assert.deepEqual(resultStatus(renderCard(event)), [
    "available",
    "Ergebnisse verfügbar"
  ]);
});

test("kennzeichnet das KM-Trap-Ergebnisprotokoll auf der Kalenderkarte", () => {
  const eventSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/events.js"),
    "utf8"
  );
  const context = vm.createContext({});

  vm.runInContext(eventSource, context, { filename: "events.js" });
  const event = vm.runInContext(
    'productionEvents.find((entry) => entry.slug === "km-trap-2026")',
    context
  );

  assert.ok(event);
  assert.deepEqual(resultStatus(renderCard(event)), [
    "available",
    "Ergebnisse verfügbar"
  ]);
});

test("kennzeichnet beide KM-GK-Pistole/Revolver-Protokolle auf der Kalenderkarte", () => {
  const eventSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/events.js"),
    "utf8"
  );
  const context = vm.createContext({});

  vm.runInContext(eventSource, context, { filename: "events.js" });
  const event = vm.runInContext(
    'productionEvents.find((entry) => entry.slug === "km-gk-pistole-revolver-2026")',
    context
  );

  assert.ok(event);
  assert.deepEqual(resultStatus(renderCard(event)), [
    "available",
    "Ergebnisse verfügbar"
  ]);
});

test("zeigt das Eckartsburg-Pokal-Ergebnisprotokoll in der Kalenderkarte an", () => {
  const eventSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/events.js"),
    "utf8"
  );
  const context = vm.createContext({});

  vm.runInContext(eventSource, context, { filename: "events.js" });
  const event = vm.runInContext(
    'productionEvents.find((entry) => entry.slug === "eckartsburg-pokal-2026")',
    context
  );

  assert.ok(event);
  assert.deepEqual(resultStatus(renderCard(event)), [
    "available",
    "Ergebnisse verfügbar"
  ]);
});

test("erkennt Ergebnisdateien aus dem bisherigen results-Feld", () => {
  const markup = renderCard({
    results: [{
      label: "Ergebnisliste",
      url: "assets/results/ergebnis.pdf",
      kind: "file"
    }]
  });

  assert.deepEqual(resultStatus(markup), ["available", "Ergebnisse verfügbar"]);
});

test("erkennt externe Ergebnisquellen weiterhin", () => {
  const markup = renderCard({
    results: [{
      label: "Ergebnisse beim Veranstalter",
      url: "https://example.org/ergebnisse",
      kind: "external"
    }]
  });

  assert.deepEqual(resultStatus(markup), ["available", "Ergebnisse verfügbar"]);
});

test("meldet ohne gültige Ergebnisquelle weiterhin keine Ergebnisse", () => {
  for (const documents of [
    [],
    [{ label: "Ausschreibung", url: "assets/documents/ausschreibung.pdf", type: "announcement" }],
    [{ label: "Ergebnisliste", type: "result-list" }]
  ]) {
    assert.deepEqual(resultStatus(renderCard({ documents })), [
      "disabled",
      "Ergebnisse folgen"
    ]);
  }
});

test("weist Bilder und Videos auf Eventkarten getrennt und grammatisch korrekt aus", () => {
  const image = {
    src: "assets/img/events/test.jpg",
    alt: "Testbild"
  };
  const video = {
    src: "assets/video/events/test.mp4",
    title: "Testvideo"
  };

  assert.deepEqual(mediaStatus(renderCard({ gallery: [image] })), [
    "available",
    "1 Bild"
  ]);
  assert.deepEqual(mediaStatus(renderCard({ gallery: [image, image] })), [
    "available",
    "2 Bilder"
  ]);
  assert.deepEqual(mediaStatus(renderCard({ videos: [video] })), [
    "available",
    "1 Video"
  ]);
  assert.deepEqual(mediaStatus(renderCard({ videos: [video, video] })), [
    "available",
    "2 Videos"
  ]);
  assert.deepEqual(
    mediaStatus(renderCard({ gallery: [image], videos: [video] })),
    ["available", "1 Bild · 1 Video"]
  );
  assert.equal(mediaStatus(renderCard()), undefined);
  assert.doesNotMatch(renderCard(), /Galerie folgt/);
});

test("zeigt beim Tag der offenen Tür 2025 sieben Bilder und zwei Videos", () => {
  const eventSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/events.js"),
    "utf8"
  );
  const context = vm.createContext({});

  vm.runInContext(eventSource, context, { filename: "events.js" });
  const event = vm.runInContext(
    'productionEvents.find((entry) => entry.slug === "tag-der-offenen-tuer-2025")',
    context
  );

  assert.ok(event);
  assert.deepEqual(mediaStatus(renderCard(event)), [
    "available",
    "7 Bilder · 2 Videos"
  ]);
});

test("begrenzt Eventvorschauen auf drei Zeilen und mobil auf vier Zeilen", () => {
  const desktopRule = styleSource.match(
    /\.timeline-description\s*\{([^}]*)\}/
  )?.[1];
  const mobileSection = styleSource.slice(
    styleSource.indexOf("@media (max-width: 480px)"),
    styleSource.indexOf("@media (prefers-reduced-motion: reduce)")
  );
  const mobileRule = mobileSection.match(
    /\.timeline-description\s*\{([^}]*)\}/
  )?.[1];

  assert.ok(desktopRule);
  assert.match(desktopRule, /display:\s*-webkit-box;/);
  assert.match(desktopRule, /overflow:\s*hidden;/);
  assert.match(desktopRule, /-webkit-box-orient:\s*vertical;/);
  assert.match(desktopRule, /-webkit-line-clamp:\s*3;/);
  assert.match(desktopRule, /line-clamp:\s*3;/);
  assert.ok(mobileRule);
  assert.match(mobileRule, /-webkit-line-clamp:\s*4;/);
  assert.match(mobileRule, /line-clamp:\s*4;/);
});

test("behält kurze und lange Eventtexte vollständig im Vorschaumarkup", () => {
  const shortDescription = "Kurzer Veranstaltungstext.";
  const longDescription =
    "Dieser ausführliche Veranstaltungstext bleibt vollständig in den Daten und im HTML erhalten, obwohl seine sichtbare Darstellung in der Kalenderkarte ausschließlich über CSS auf wenige Zeilen begrenzt wird.";

  const shortMarkup = renderCard({ description: shortDescription });
  const longMarkup = renderCard({ description: longDescription });

  assert.equal(shortMarkup.includes(shortDescription), true);
  assert.equal(longMarkup.includes(longDescription), true);
  assert.match(longMarkup, /class="timeline-description"/);
});

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

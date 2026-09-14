"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

require(path.resolve(__dirname, "../js/event-utils.js"));

const eventSource = fs.readFileSync(
  path.resolve(__dirname, "../js/data/events.js"),
  "utf8"
);
const detailSource = fs.readFileSync(
  path.resolve(__dirname, "../js/event-detail.js"),
  "utf8"
);

function loadKmEvent() {
  const context = vm.createContext({});
  vm.runInContext(eventSource, context, { filename: "events.js" });
  return vm.runInContext(
    'productionEvents.find((event) => event.slug === "km-halbautomat-kk-gk-2026")',
    context
  );
}

function renderDetail(event) {
  const detailRoot = {
    innerHTML: "",
    querySelector: () => null,
    setAttribute() {}
  };
  const document = {
    head: { appendChild() {} },
    getElementById: () => detailRoot,
    querySelector: () => null,
    createElement: () => ({ setAttribute() {} })
  };
  const context = vm.createContext({
    URL,
    URLSearchParams,
    document,
    eventVenues: [],
    events: [event],
    window: {
      EventUtils: globalThis.EventUtils,
      location: {
        href: `file:///event.html?event=${event.slug}`,
        search: `?event=${event.slug}`
      }
    }
  });

  vm.runInContext(detailSource, context, { filename: "event-detail.js" });
  return detailRoot.innerHTML;
}

test("trennt Veranstalter und Ausrichter bei der KM Zentralfeuer Halbautomat", () => {
  const markup = renderDetail(loadKmEvent());
  const organizerIndex = markup.indexOf("Veranstalter</span>");
  const hostIndex = markup.indexOf("Ausrichter</span>");

  assert.ok(organizerIndex >= 0 && hostIndex > organizerIndex);
  assert.match(markup, /Schützenkreis &quot;SUED&quot;/);
  assert.match(markup, /Jägerverein Weißenfels e\.V\./);
  assert.match(markup, /logo-schuetzenkreis-sued\.png/);
});

test("lässt bei Events ohne Ausrichterangabe die Faktenliste unverändert", () => {
  const event = loadKmEvent();

  for (const host of [undefined, "", "  ", null]) {
    const markup = renderDetail({ ...event, host });
    assert.match(markup, /Veranstalter</);
    assert.doesNotMatch(markup, /Ausrichter</);
  }
});

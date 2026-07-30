"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

require(path.resolve(__dirname, "../js/event-utils.js"));

const {
  isSafeUrl,
  normalizeImage,
  normalizeGallery,
  normalizeDownloads,
  normalizeResults,
  normalizeExternalLinks,
  getEventTitle,
  getEventPhase,
  getEventEditorialStatus,
  isDetailCapable,
  createDetailUrl,
  resolveEventBySlug
} = globalThis.EventUtils;

function createCoreEvent(overrides = {}) {
  return {
    slug: "demo-termin",
    title: "Demo-Termin",
    shortTitle: "Demo",
    start: "2026-08-15T10:00:00",
    ...overrides
  };
}

function loadEventData(useDemoData) {
  const devDataSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/dev-events.js"),
    "utf8"
  );
  const productionDataPath = path.resolve(
    __dirname,
    "../js/data/events.js"
  );
  const originalProductionSource = fs.readFileSync(productionDataPath, "utf8");
  const configuredProductionSource = originalProductionSource.replace(
    "const USE_DEMO_DATA = true;",
    `const USE_DEMO_DATA = ${useDemoData};`
  );
  const context = vm.createContext({});

  assert.match(
    originalProductionSource,
    /const USE_DEMO_DATA = true;/
  );
  if (!useDemoData) {
    assert.notEqual(configuredProductionSource, originalProductionSource);
  }
  vm.runInContext(devDataSource, context, { filename: "dev-events.js" });
  vm.runInContext(configuredProductionSource, context, {
    filename: "events.js"
  });
  vm.runInContext(
    "globalThis.eventDataSnapshot = { events, productionEvents };",
    context
  );

  return context.eventDataSnapshot;
}

test("berechnet die zeitlichen Veranstaltungsphasen an allen Grenzen", () => {
  const event = createCoreEvent({
    start: "2026-08-15T10:00:00",
    end: "2026-08-15T12:00:00"
  });

  assert.equal(
    getEventPhase(event, new Date("2026-08-15T09:59:59")),
    "upcoming"
  );
  assert.equal(
    getEventPhase(event, new Date("2026-08-15T10:00:00")),
    "ongoing"
  );
  assert.equal(
    getEventPhase(event, new Date("2026-08-15T11:00:00")),
    "ongoing"
  );
  assert.equal(
    getEventPhase(event, new Date("2026-08-15T12:00:00")),
    "ongoing"
  );
  assert.equal(
    getEventPhase(event, new Date("2026-08-15T12:00:01")),
    "past"
  );
});

test("verwendet bei fehlendem oder ungeeignetem Ende den Start", () => {
  const referenceAtStart = new Date("2026-08-15T10:00:00");
  const referenceAfterStart = new Date("2026-08-15T10:00:01");
  const cases = [
    createCoreEvent(),
    createCoreEvent({ end: "kein-datum" }),
    createCoreEvent({ end: "2026-08-15T09:00:00" })
  ];

  cases.forEach((event) => {
    assert.equal(getEventPhase(event, referenceAtStart), "ongoing");
    assert.equal(getEventPhase(event, referenceAfterStart), "past");
  });
});

test("liefert ohne gültigen Start oder Referenzzeitpunkt keine Phase", () => {
  assert.equal(
    getEventPhase(
      createCoreEvent({ start: "kein-datum" }),
      new Date("2026-08-15T10:00:00")
    ),
    null
  );
  assert.equal(
    getEventPhase(createCoreEvent(), new Date("kein-datum")),
    null
  );
  assert.equal(getEventPhase(null, new Date()), null);
});

test("akzeptiert ausschließlich die vereinbarten redaktionellen Sonderzustände", () => {
  assert.equal(getEventEditorialStatus(createCoreEvent()), null);
  assert.equal(
    getEventEditorialStatus(
      createCoreEvent({ editorialStatus: " cancelled " })
    ),
    "cancelled"
  );
  assert.equal(
    getEventEditorialStatus(
      createCoreEvent({ editorialStatus: "postponed" })
    ),
    "postponed"
  );
  assert.equal(
    getEventEditorialStatus(
      createCoreEvent({ editorialStatus: "POSTPONED" })
    ),
    null
  );
  assert.equal(
    getEventEditorialStatus(
      createCoreEvent({ editorialStatus: "completed" })
    ),
    null
  );
  assert.equal(getEventEditorialStatus(null), null);
});

test("hält zeitliche Phase und redaktionellen Sonderzustand unabhängig", () => {
  const cancelledUpcomingEvent = createCoreEvent({
    start: "2026-08-15T10:00:00",
    editorialStatus: "cancelled"
  });
  const overduePostponedEvent = createCoreEvent({
    start: "2026-08-15T10:00:00",
    end: "2026-08-15T12:00:00",
    editorialStatus: "postponed"
  });

  assert.equal(
    getEventPhase(
      cancelledUpcomingEvent,
      new Date("2026-08-14T10:00:00")
    ),
    "upcoming"
  );
  assert.equal(
    getEventEditorialStatus(cancelledUpcomingEvent),
    "cancelled"
  );
  assert.equal(
    getEventPhase(
      overduePostponedEvent,
      new Date("2026-08-16T10:00:00")
    ),
    "past"
  );
  assert.equal(
    getEventEditorialStatus(overduePostponedEvent),
    "postponed"
  );
});

test("bleibt für bestehende Datensätze abwärtskompatibel und unverändernd", () => {
  const event = createCoreEvent({
    end: "2026-08-15T12:00:00"
  });
  const originalEvent = structuredClone(event);

  assert.equal(
    getEventPhase(event, new Date("2026-08-15T11:00:00")),
    "ongoing"
  );
  assert.equal(getEventEditorialStatus(event), null);
  assert.deepEqual(event, originalEvent);
});

test("erkennt detailfähige und nicht detailfähige Veranstaltungen", () => {
  assert.equal(isDetailCapable(createCoreEvent()), true);
  assert.equal(isDetailCapable(createCoreEvent({ slug: "  " })), false);
  assert.equal(
    isDetailCapable(createCoreEvent({ title: "", shortTitle: "" })),
    false
  );
  assert.equal(isDetailCapable(createCoreEvent({ start: "kein-datum" })), false);
  assert.equal(isDetailCapable(null), false);
});

test("verwendet shortTitle als Titel-Fallback", () => {
  const event = createCoreEvent({ title: "  ", shortTitle: " Kurzform " });

  assert.equal(getEventTitle(event), "Kurzform");
  assert.equal(isDetailCapable(event), true);
});

test("erzeugt nur für detailfähige Veranstaltungen eine kodierte Detail-URL", () => {
  const event = createCoreEvent({ slug: "demo/ä &?" });

  assert.equal(
    createDetailUrl(event),
    "event.html?event=demo%2F%C3%A4%20%26%3F"
  );
  assert.equal(createDetailUrl(createCoreEvent({ start: "" })), null);
});

test("unterscheidet keinen, genau einen und mehrere Slug-Treffer", () => {
  const first = createCoreEvent({ slug: "eindeutig", title: "Erster Termin" });
  const duplicate = createCoreEvent({
    slug: "doppelt",
    title: "Doppelter Termin A"
  });
  const duplicateAgain = createCoreEvent({
    slug: "doppelt",
    title: "Doppelter Termin B"
  });
  const eventList = [first, duplicate, duplicateAgain];

  assert.deepEqual(resolveEventBySlug(eventList, "fehlt"), {
    status: "not-found",
    event: null,
    matches: []
  });

  const uniqueResolution = resolveEventBySlug(eventList, " eindeutig ");
  assert.equal(uniqueResolution.status, "found");
  assert.equal(uniqueResolution.event, first);
  assert.deepEqual(uniqueResolution.matches, [first]);

  const duplicateResolution = resolveEventBySlug(eventList, "doppelt");
  assert.equal(duplicateResolution.status, "duplicate");
  assert.equal(duplicateResolution.event, null);
  assert.deepEqual(duplicateResolution.matches, [duplicate, duplicateAgain]);
});

test("normalisiert gültige Bilder und verwirft ungültige Bilder", () => {
  assert.deepEqual(
    normalizeImage({
      src: " assets/img/test.jpg ",
      alt: " Testbild ",
      width: 800,
      height: 600
    }),
    {
      src: "assets/img/test.jpg",
      alt: "Testbild",
      width: 800,
      height: 600
    }
  );

  assert.deepEqual(
    normalizeImage({
      src: "assets/img/test.jpg",
      alt: "Testbild",
      width: 0,
      height: "600"
    }),
    {
      src: "assets/img/test.jpg",
      alt: "Testbild"
    }
  );

  assert.equal(normalizeImage("assets/img/test.jpg"), null);
  assert.equal(normalizeImage({ src: "", alt: "Testbild" }), null);
  assert.equal(normalizeImage({ src: "assets/img/test.jpg", alt: "" }), null);
  assert.equal(
    normalizeImage({ src: "data:image/png;base64,abc", alt: "Testbild" }),
    null
  );
});

test("normalisiert Galerien und behält optionale Bildunterschriften", () => {
  const gallery = [
    {
      src: "assets/img/eins.jpg",
      alt: "Erstes Testbild",
      caption: " Optionale Bildunterschrift ",
      width: 640,
      height: 480
    },
    { src: "assets/img/zwei.jpg", alt: "Zweites Testbild" },
    { src: "javascript:alert(1)", alt: "Unsicheres Bild" },
    { src: "assets/img/ohne-alt.jpg" }
  ];

  assert.deepEqual(normalizeGallery(gallery), [
    {
      src: "assets/img/eins.jpg",
      alt: "Erstes Testbild",
      caption: "Optionale Bildunterschrift",
      width: 640,
      height: 480
    },
    { src: "assets/img/zwei.jpg", alt: "Zweites Testbild" }
  ]);
  assert.deepEqual(normalizeGallery(null), []);
});

test("normalisiert Downloads mit optionalen Dateimetadaten", () => {
  const downloads = [
    {
      label: " Ausschreibung ",
      url: " assets/dev/demo-ausschreibung.txt ",
      description: " Testdatei ",
      fileType: " TXT ",
      fileSize: " unter 1 KB "
    },
    { label: "", url: "assets/dev/ungueltig.txt" },
    { label: "Unsicher", url: "javascript:alert(1)" }
  ];

  assert.deepEqual(normalizeDownloads(downloads), [
    {
      label: "Ausschreibung",
      url: "assets/dev/demo-ausschreibung.txt",
      description: "Testdatei",
      fileType: "TXT",
      fileSize: "unter 1 KB"
    }
  ]);
});

test("normalisiert Datei- und externe Ergebnisse", () => {
  const results = [
    {
      label: "Lokales Ergebnis",
      url: "assets/dev/demo-ergebnis.txt",
      kind: "file",
      fileType: "TXT"
    },
    {
      label: "Externes Ergebnis",
      url: "https://example.org/results",
      kind: "external",
      description: "Beispielseite"
    }
  ];

  assert.deepEqual(normalizeResults(results), [
    {
      label: "Lokales Ergebnis",
      url: "assets/dev/demo-ergebnis.txt",
      kind: "file",
      fileType: "TXT"
    },
    {
      label: "Externes Ergebnis",
      url: "https://example.org/results",
      kind: "external",
      description: "Beispielseite"
    }
  ]);
});

test("verwirft unbekannte Ergebnisarten und ungeeignete externe Ziele", () => {
  assert.deepEqual(
    normalizeResults([
      {
        label: "Unbekannt",
        url: "assets/dev/demo-ergebnis.txt",
        kind: "ranking"
      },
      {
        label: "Nicht extern",
        url: "assets/dev/demo-ergebnis.txt",
        kind: "external"
      }
    ]),
    []
  );
});

test("normalisiert gültige externe Links und verwirft unsichere Ziele", () => {
  const links = [
    {
      label: " Beispielseite ",
      url: " HTTPS://example.org/demo ",
      description: " Externer Testlink "
    },
    {
      label: "Relatives Ziel ist kein externer Link",
      url: "assets/dev/demo.txt"
    },
    { label: "Unsicher", url: "vbscript:msgbox(1)" }
  ];

  assert.deepEqual(normalizeExternalLinks(links), [
    {
      label: "Beispielseite",
      url: "HTTPS://example.org/demo",
      description: "Externer Testlink"
    }
  ]);
});

test("akzeptiert lokale relative sowie HTTP(S)-URLs und sperrt aktive Protokolle", () => {
  [
    "assets/dev/demo.txt",
    "./assets/dev/demo.txt",
    "../assets/dev/demo.txt",
    "/assets/dev/demo.txt",
    "https://example.org/path",
    " HTTP://example.org/path "
  ].forEach((url) => assert.equal(isSafeUrl(url), true, url));

  [
    "javascript:alert(1)",
    " JaVaScRiPt:alert(1) ",
    "data:text/plain,Demo",
    "VBSCRIPT:msgbox(1)",
    "//example.org/demo",
    "\\\\example.org\\demo"
  ].forEach((url) => assert.equal(isSafeUrl(url), false, url));
});

test("Normalisierung verändert die übergebenen Daten nicht", () => {
  const image = {
    src: " assets/img/test.jpg ",
    alt: " Testbild ",
    width: -1
  };
  const gallery = [
    {
      src: " assets/img/test.jpg ",
      alt: " Testbild ",
      caption: " Text "
    }
  ];
  const downloads = [
    {
      label: " Datei ",
      url: " assets/dev/demo.txt ",
      description: " Hinweis "
    }
  ];
  const results = [
    {
      label: " Ergebnis ",
      url: " assets/dev/demo.txt ",
      kind: "file"
    }
  ];
  const links = [
    {
      label: " Extern ",
      url: " https://example.org/ "
    }
  ];
  const snapshots = JSON.parse(
    JSON.stringify({ image, gallery, downloads, results, links })
  );

  const normalizedImage = normalizeImage(image);
  const normalizedGallery = normalizeGallery(gallery);
  const normalizedDownloads = normalizeDownloads(downloads);
  const normalizedResults = normalizeResults(results);
  const normalizedLinks = normalizeExternalLinks(links);

  assert.deepEqual(
    { image, gallery, downloads, results, links },
    snapshots
  );
  assert.notEqual(normalizedImage, image);
  assert.notEqual(normalizedGallery[0], gallery[0]);
  assert.notEqual(normalizedDownloads[0], downloads[0]);
  assert.notEqual(normalizedResults[0], results[0]);
  assert.notEqual(normalizedLinks[0], links[0]);
});

test("Demo-Schalter true ergänzt klar markierte Entwicklungsdaten", () => {
  const { events, productionEvents } = loadEventData(true);

  assert.ok(events.length > productionEvents.length);
  assert.equal(
    events.filter((event) => event.developmentOnly === true).length,
    events.length - productionEvents.length
  );
});

test("Demo-Schalter false liefert ausschließlich produktive Termine", () => {
  const { events, productionEvents } = loadEventData(false);

  assert.equal(events.length, productionEvents.length);
  assert.equal(
    events.some((event) => event.developmentOnly === true),
    false
  );
});

test("Produktivtermine verwenden das neue Detailmodell ohne erfundene Inhalte", () => {
  const { productionEvents } = loadEventData(false);

  productionEvents.forEach((event) => {
    assert.equal(event.image, null);
    assert.equal(Array.isArray(event.gallery), true);
    assert.equal(Array.isArray(event.downloads), true);
    assert.equal(Array.isArray(event.results), true);
    assert.equal(Array.isArray(event.externalLinks), true);
    assert.equal("links" in event, false);
    assert.equal(event.gallery.length, 0);
    assert.equal(event.downloads.length, 0);
    assert.equal(event.results.length, 0);
    assert.equal(event.externalLinks.length, 0);
  });
});

test("Entwicklungsdaten decken alle vereinbarten Detailvarianten ab", () => {
  const { events } = loadEventData(true);
  const demoEvents = events.filter((event) => event.developmentOnly === true);
  const localAssetUrls = new Set();

  assert.ok(
    demoEvents.some(
      (event) =>
        !event.description &&
        event.image === null &&
        event.gallery.length === 0 &&
        event.downloads.length === 0 &&
        event.results.length === 0 &&
        event.externalLinks.length === 0
    )
  );
  assert.ok(demoEvents.some((event) => event.image !== null));
  assert.ok(demoEvents.some((event) => event.image === null));
  assert.ok(demoEvents.some((event) => event.gallery.length === 1));
  assert.ok(demoEvents.some((event) => event.gallery.length > 1));
  assert.ok(demoEvents.some((event) => event.gallery.length === 0));
  assert.ok(demoEvents.some((event) => event.downloads.length > 0));
  assert.ok(
    demoEvents.some((event) =>
      event.results.some((result) => result.kind === "file")
    )
  );
  assert.ok(
    demoEvents.some((event) =>
      event.results.some((result) => result.kind === "external")
    )
  );
  assert.ok(demoEvents.some((event) => event.externalLinks.length > 0));
  assert.ok(demoEvents.some((event) => event.registrationRequired === true));
  assert.ok(demoEvents.some((event) => event.title.length > 70));
  assert.ok(demoEvents.some((event) => event.description.length > 180));
  assert.ok(
    demoEvents.some((event) =>
      event.externalLinks.some((link) => link.label.length > 80)
    )
  );
  assert.ok(
    demoEvents.some((event) =>
      event.gallery.some((image) => Boolean(image.caption))
    )
  );
  assert.ok(
    demoEvents.some((event) =>
      [...event.downloads, ...event.results].some(
        (item) => item.description && item.fileType && item.fileSize
      )
    )
  );

  demoEvents.forEach((event) => {
    if (event.image?.src && !/^https?:/i.test(event.image.src)) {
      localAssetUrls.add(event.image.src);
    }

    event.gallery.forEach((image) => {
      if (!/^https?:/i.test(image.src)) localAssetUrls.add(image.src);
    });

    event.downloads.forEach((download) => {
      if (!/^https?:/i.test(download.url)) localAssetUrls.add(download.url);
    });

    event.results.forEach((result) => {
      if (result.kind === "file" && !/^https?:/i.test(result.url)) {
        localAssetUrls.add(result.url);
      }
    });
  });

  localAssetUrls.forEach((assetUrl) => {
    assert.equal(
      fs.existsSync(path.resolve(__dirname, "..", assetUrl)),
      true,
      `Lokale Entwicklungsressource fehlt: ${assetUrl}`
    );
  });
});

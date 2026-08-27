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
  normalizeDocuments,
  normalizeResults,
  normalizeEventDocuments,
  normalizeExternalLinks,
  getEventTitle,
  getEventOrganizerLogo,
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
  const demoSwitchPattern = /const USE_DEMO_DATA = (?:true|false);/;

  assert.equal(
    originalProductionSource.match(
      /const USE_DEMO_DATA = (?:true|false);/g
    )?.length,
    1
  );

  const configuredProductionSource = originalProductionSource.replace(
    demoSwitchPattern,
    `const USE_DEMO_DATA = ${useDemoData};`
  );
  const context = vm.createContext({});

  assert.match(
    configuredProductionSource,
    useDemoData
      ? /const USE_DEMO_DATA = true;/
      : /const USE_DEMO_DATA = false;/
  );
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

test("ordnet Herkunftslogos ausschließlich exakten Veranstaltern zu", () => {
  const cases = [
    {
      organizer: "Großkaliber Schützengilde 1503 Eckartsberga e.V.",
      expected: {
        src: "assets/img/logo-gsg-eckartsberga.png",
        alt: "Logo der GSG Eckartsberga",
        width: 360,
        height: 347
      }
    },
    {
      organizer: 'Schützenkreis "SUED"',
      expected: {
        src: "assets/img/logo-schuetzenkreis-sued.png",
        alt: "Logo des Schützenkreises SUED Sachsen-Anhalt e. V.",
        width: 191,
        height: 191
      }
    },
    {
      organizer:
        "Kreisschützenverband Burgenlandkreis-Weißenfels „Schützenkreis SUED“ Sachsen-Anhalt e.V.",
      expected: {
        src: "assets/img/logo-schuetzenkreis-sued.png",
        alt: "Logo des Schützenkreises SUED Sachsen-Anhalt e. V.",
        width: 191,
        height: 191
      }
    }
  ];

  cases.forEach(({ organizer, expected }) => {
    const logo = getEventOrganizerLogo(createCoreEvent({ organizer }));

    assert.deepEqual(logo, expected);
    assert.equal(
      fs.existsSync(path.resolve(__dirname, `../${logo.src}`)),
      true
    );
  });
});

test("rät Herkunftslogos nicht aus freien Texten oder unscharfen Veranstaltern", () => {
  const eventsWithoutLogo = [
    createCoreEvent({ organizer: "Kreisschützenverband" }),
    createCoreEvent({ organizer: "Nicht produktiv" }),
    createCoreEvent({ organizer: "Fremdverein" }),
    createCoreEvent({ organizer: 'schützenkreis "SUED"' }),
    createCoreEvent({
      organizer: "Schützenkreis SUED Sachsen-Anhalt e. V."
    }),
    createCoreEvent({ organizer: "" }),
    createCoreEvent({ organizer: null }),
    createCoreEvent({
      organizer: "Fremdverein",
      title: "GSG Eckartsberga Vereinsveranstaltung",
      category: "Schützenkreis SUED",
      description: "Eine Veranstaltung der GSG Eckartsberga"
    })
  ];

  eventsWithoutLogo.forEach((event) => {
    assert.equal(getEventOrganizerLogo(event), null);
  });
  assert.equal(getEventOrganizerLogo(null), null);
});

test("verändert bei der Herkunftslogo-Zuordnung weder Daten noch Registry", () => {
  const event = createCoreEvent({
    organizer: "Großkaliber Schützengilde 1503 Eckartsberga e.V."
  });
  const eventSnapshot = structuredClone(event);
  const firstLogo = getEventOrganizerLogo(event);

  firstLogo.src = "assets/img/veraendert.png";

  assert.deepEqual(event, eventSnapshot);
  assert.equal(
    getEventOrganizerLogo(event).src,
    "assets/img/logo-gsg-eckartsberga.png"
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

test("normalisiert alle vereinbarten Dokumenttypen und optionale Metadaten", () => {
  const types = [
    "announcement",
    "invitation",
    "start-list",
    "result-list",
    "form",
    "certificate",
    "other"
  ];
  const documents = types.map((type, index) => ({
    label: ` Dokument ${index + 1} `,
    url: ` assets/documents/dokument-${index + 1}.pdf `,
    type
  }));

  documents[0].description = " Ausschreibung zur Veranstaltung ";
  documents[0].fileType = " PDF ";
  documents[0].fileSize = " 240 KB ";

  assert.deepEqual(normalizeDocuments(documents), [
    {
      label: "Dokument 1",
      url: "assets/documents/dokument-1.pdf",
      type: "announcement",
      description: "Ausschreibung zur Veranstaltung",
      fileType: "PDF",
      fileSize: "240 KB"
    },
    ...types.slice(1).map((type, index) => ({
      label: `Dokument ${index + 2}`,
      url: `assets/documents/dokument-${index + 2}.pdf`,
      type
    }))
  ]);
});

test("verwendet bei fehlenden oder unbekannten Dokumenttypen other", () => {
  const documents = [
    {
      label: "Typ fehlt",
      url: "assets/documents/ohne-typ.pdf"
    },
    {
      label: "Typ unbekannt",
      url: "assets/documents/unbekannt.pdf",
      type: "ranking"
    },
    {
      label: "Falsche Großschreibung",
      url: "assets/documents/grossschreibung.pdf",
      type: "ANNOUNCEMENT"
    },
    {
      label: "Gültiger Typ mit Leerraum",
      url: "assets/documents/gueltig.pdf",
      type: " announcement "
    }
  ];

  assert.deepEqual(
    normalizeDocuments(documents).map((document) => document.type),
    ["other", "other", "other", "announcement"]
  );
});

test("akzeptiert für Dokumente relative und HTTPS-URLs", () => {
  const urls = [
    "assets/documents/a.pdf",
    "./assets/documents/b.pdf",
    "../documents/c.pdf",
    "/documents/d.pdf",
    "https://example.org/documents/e.pdf",
    "HTTPS://example.org/documents/f.pdf"
  ];

  assert.deepEqual(
    normalizeDocuments(
      urls.map((url, index) => ({
        label: `Dokument ${index + 1}`,
        url,
        type: "other"
      }))
    ).map((document) => document.url),
    urls
  );
});

test("verwirft für Dokumente HTTP und andere nicht freigegebene Protokolle", () => {
  const unsafeUrls = [
    "http://example.org/dokument.pdf",
    "javascript:alert(1)",
    "data:application/pdf;base64,abc",
    "vbscript:msgbox(1)",
    "file:///tmp/dokument.pdf",
    "ftp://example.org/dokument.pdf",
    "//example.org/dokument.pdf",
    "\\\\server\\dokument.pdf",
    "https:example.org/dokument.pdf"
  ];

  assert.deepEqual(
    normalizeDocuments(
      unsafeUrls.map((url, index) => ({
        label: `Unsicher ${index + 1}`,
        url,
        type: "other"
      }))
    ),
    []
  );
});

test("verwirft unvollständige Dokumente und ungeeignete Eingaben", () => {
  assert.deepEqual(
    normalizeDocuments([
      null,
      "assets/documents/dokument.pdf",
      { label: "", url: "assets/documents/ohne-label.pdf" },
      { label: "Ohne URL", url: "" }
    ]),
    []
  );
  assert.deepEqual(normalizeDocuments(null), []);
});

test("führt neue Dokumente und Legacy-Daten stabil und ohne Duplikate zusammen", () => {
  const event = {
    documents: [
      {
        label: "Kanonische Ausschreibung",
        url: " assets/documents/gemeinsam.pdf ",
        type: "announcement"
      },
      {
        label: "Kanonische Einladung",
        url: "https://example.org/einladung.pdf",
        type: "invitation"
      }
    ],
    results: [
      {
        label: "Doppelte Ergebnisdatei",
        url: "assets/documents/gemeinsam.pdf",
        kind: "file"
      },
      {
        label: "Eigenständige Ergebnisdatei",
        url: "assets/results/ergebnis.pdf",
        kind: "file",
        description: "Vollständige Ergebnisliste",
        fileType: "PDF"
      },
      {
        label: "Externes Ergebnis",
        url: "https://example.org/ergebnisse",
        kind: "external"
      },
      {
        label: "Unsichere Ergebnisdatei",
        url: "http://example.org/ergebnis.pdf",
        kind: "file"
      }
    ],
    downloads: [
      {
        label: "Doppelter Legacy-Download",
        url: "assets/results/ergebnis.pdf"
      },
      {
        label: "Eigenständiger Legacy-Download",
        url: "assets/documents/legacy.pdf",
        description: "Altdaten bleiben verwendbar",
        fileSize: "10 KB"
      },
      {
        label: "Unsicherer Legacy-Download",
        url: "http://example.org/download.pdf"
      }
    ]
  };
  const snapshot = structuredClone(event);

  assert.deepEqual(normalizeEventDocuments(event), [
    {
      label: "Kanonische Ausschreibung",
      url: "assets/documents/gemeinsam.pdf",
      type: "announcement"
    },
    {
      label: "Kanonische Einladung",
      url: "https://example.org/einladung.pdf",
      type: "invitation"
    },
    {
      label: "Eigenständige Ergebnisdatei",
      url: "assets/results/ergebnis.pdf",
      type: "result-list",
      description: "Vollständige Ergebnisliste",
      fileType: "PDF"
    },
    {
      label: "Eigenständiger Legacy-Download",
      url: "assets/documents/legacy.pdf",
      type: "other",
      description: "Altdaten bleiben verwendbar",
      fileSize: "10 KB"
    }
  ]);
  assert.deepEqual(event, snapshot);
  assert.deepEqual(normalizeEventDocuments(null), []);
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

test("Produktionsbetrieb ist der eingecheckte Standard", () => {
  const productionSource = fs.readFileSync(
    path.resolve(__dirname, "../js/data/events.js"),
    "utf8"
  );

  assert.match(productionSource, /const USE_DEMO_DATA = false;/);
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

test("Produktivtermine verwenden das neue Detailmodell ohne Demo-Inhalte", () => {
  const { productionEvents } = loadEventData(false);

  productionEvents.forEach((event) => {
    assert.equal(event.image, null);
    assert.equal(Array.isArray(event.gallery), true);
    assert.equal(Array.isArray(event.documents), true);
    assert.equal(Array.isArray(event.downloads), true);
    assert.equal(Array.isArray(event.results), true);
    assert.equal(Array.isArray(event.externalLinks), true);
    assert.equal("links" in event, false);
    assert.equal(event.developmentOnly, undefined);
    assert.equal(event.gallery.length, 0);
    assert.equal(event.downloads.length, 0);
    assert.equal(event.results.length, 0);
    assert.equal(event.externalLinks.length, 0);
  });
});

test("Schützenfest Langendorf 2025 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "schuetzenfest-langendorf-2025"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 17).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 17);
  assert.equal(event.title, "Schützenfest Langendorf 2025");
  assert.equal(event.shortTitle, "Schützenfest Langendorf");
  assert.equal(event.category, "Schützenfest");
  assert.equal(event.start, "2025-06-14T12:00:00");
  assert.equal("end" in event, false);
  assert.equal(
    event.location,
    "Schießstand des Schützenvereins 1874 Langendorf e.V., Langendorf"
  );
  assert.equal(event.organizer, "Schützenverein 1874 Langendorf e.V.");
  assert.equal(
    event.description,
    "Der Schützenverein 1874 Langendorf lädt am 14. Juni 2025 zum Schützenfest ein. Ab 12 Uhr wird Mittagessen angeboten; der offizielle Teil mit verschiedenen Schießstationen beginnt um 13 Uhr."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Einladung Schützenfest Langendorf 2025",
      url: "assets/documents/events/2025/2025_05_26 Einladung Schützenfest Langendorf 2025.pdf",
      type: "invitation"
    }
  ]);
  assert.equal(
    fs.existsSync(path.resolve(__dirname, `../${event.documents[0].url}`)),
    true
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  assert.equal(getEventOrganizerLogo(event), null);
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, false);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("Bürgermeisterpokal Apolda 2026 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "pokal-des-buergermeisters-apolda-2026"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 13).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 13);
  assert.equal(
    event.title,
    "35. offener Pokal des Bürgermeisters der Stadt Apolda"
  );
  assert.equal(event.shortTitle, "Pokal des Bürgermeisters Apolda");
  assert.equal(event.category, "Pokalwettkampf");
  assert.equal(event.start, "2026-05-16T09:00:00");
  assert.equal("end" in event, false);
  assert.equal(
    event.location,
    "Schießsportanlage der BSG 1775 Apolda e.V., Apolda Heusdorf – In der Borngebreite"
  );
  assert.equal(
    event.organizer,
    "Büchsenschützengesellschaft 1775 Apolda e.V."
  );
  assert.equal(
    event.description,
    "Die Büchsenschützengesellschaft 1775 Apolda lädt zum 35. offenen Pokal des Bürgermeisters der Stadt Apolda ein. Ausgetragen werden verschiedene Wettbewerbe mit KK-Sportgewehr, KK-Sportpistole und Luftgewehr. Alle Einzelheiten enthält die Ausschreibung."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label:
        "Ausschreibung 35. offener Pokal des Bürgermeisters der Stadt Apolda 2026",
      url: "assets/documents/events/2026/2026_05_04 Ausschreibung 35. offener Pokal des Bürgermeisters der Stadt Apolda 2026.pdf",
      type: "announcement"
    }
  ]);
  assert.equal(
    fs.existsSync(path.resolve(__dirname, `../${event.documents[0].url}`)),
    true
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  assert.equal(getEventOrganizerLogo(event), null);
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, true);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("Hans-Peter-Nolding-Pokal 2026 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "hans-peter-nolding-pokal-2026"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 12).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 12);
  assert.equal(event.title, "Hans-Peter-Nolding-Pokal 2026");
  assert.equal(event.shortTitle, "Hans-Peter-Nolding-Pokal");
  assert.equal(event.category, "Pokalwettkampf");
  assert.equal(event.start, "2026-06-06T09:00:00");
  assert.equal(event.end, "2026-06-06T13:00:00");
  assert.equal(
    event.location,
    "Schießstand Schützenverein 1990 Hohenmölsen, Am Werk 4, 06679 Hohenmölsen OT Rössuln"
  );
  assert.equal(
    event.organizer,
    "Schützenverein 1990 Hohenmölsen e.V. gegr. 1748"
  );
  assert.equal(
    event.description,
    "Der Schützenverein 1990 Hohenmölsen lädt am 6. Juni 2026 zum Hans-Peter-Nolding-Pokal ein. Geschossen wird mit KK-Pistole oder KK-Revolver in offener Klasse."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Ausschreibung Hans-Peter-Nolding-Pokal 2026",
      url: "assets/documents/events/2026/2026_05_20 Ausschreibung Hans-Peter-Nolding-Pokal 2026.pdf",
      type: "announcement"
    },
    {
      label: "Veranstaltungsflyer Hans-Peter-Nolding-Pokal 2026",
      url: "assets/documents/events/2026/2026_05_20 Veranstaltungsflyer Hans-Peter-Nolding-Pokal 2026.pdf",
      type: "other"
    }
  ]);
  event.documents.forEach((document) => {
    assert.equal(
      fs.existsSync(path.resolve(__dirname, `../${document.url}`)),
      true
    );
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  assert.equal(getEventOrganizerLogo(event), null);
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, true);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("Kreisschützentag 2026 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) =>
      entry.slug === "kreisschuetzentag-2026-schuetzenkreis-sued"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 14).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 14);
  assert.equal(event.title, "Kreisschützentag 2026 „Schützenkreis SUED“");
  assert.equal(event.shortTitle, "Kreisschützentag 2026");
  assert.equal(event.category, "Kreisschützentag");
  assert.equal(event.start, "2026-05-09T10:00:00");
  assert.equal(event.end, "2026-05-09T13:00:00");
  assert.equal(
    event.location,
    "Gasthof Jaucha, Pirkauer Str. 2, 06679 Hohenmölsen (Jaucha)"
  );
  assert.equal(
    event.organizer,
    "Kreisschützenverband Burgenlandkreis-Weißenfels „Schützenkreis SUED“ Sachsen-Anhalt e.V."
  );
  assert.equal(
    event.description,
    "Der Schützenkreis SUED lädt am 9. Mai 2026 zum Kreisschützentag nach Hohenmölsen-Jaucha ein. Auf der Tagesordnung stehen unter anderem die Berichte des Präsidiums, eine Satzungsänderung, Beschlussfassungen und Auszeichnungen."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Einladung Kreisschützentag 2026 Schützenkreis SUED",
      url: "assets/documents/events/2026/2026_04_30 Einladung Kreisschützentag 2026 Schützenkreis SUED.pdf",
      type: "invitation"
    }
  ]);
  assert.equal(
    fs.existsSync(path.resolve(__dirname, `../${event.documents[0].url}`)),
    true
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  assert.deepEqual(getEventOrganizerLogo(event), {
    src: "assets/img/logo-schuetzenkreis-sued.png",
    alt: "Logo des Schützenkreises SUED Sachsen-Anhalt e. V.",
    width: 191,
    height: 191
  });
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, false);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("2. Buttstädter Pokal 2025 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "buttstaedter-pokal-2025"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 16).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 16);
  assert.equal(event.title, "2. Buttstädter Pokal 2025");
  assert.equal(event.shortTitle, "2. Buttstädter Pokal");
  assert.equal(event.category, "Pokalwettkampf");
  assert.equal(event.start, "2025-11-01T09:00:00");
  assert.equal("end" in event, false);
  assert.equal(event.location, "Vor dem Lohe, 99628 Buttstädt");
  assert.equal(
    event.organizer,
    "Schützengesellschaft Buttstädt 1849 e.V."
  );
  assert.equal(
    event.description,
    "Die Schützengesellschaft Buttstädt lädt am 1. November 2025 zum 2. Buttstädter Pokal ein. Gewertet wird eine Kombination aus Lang- und Kurzwaffe auf 100 beziehungsweise 25 Meter."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Ausschreibung 2. Buttstädter Pokal 2025",
      url: "assets/documents/events/2025/2025_10_30 Ausschreibung 2. Buttstädter Pokal 2025.pdf",
      type: "announcement"
    }
  ]);
  assert.equal(
    fs.existsSync(path.resolve(__dirname, `../${event.documents[0].url}`)),
    true
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  assert.equal(getEventOrganizerLogo(event), null);
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, true);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("Abend der Vereine 2026 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "abend-der-vereine-2026"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 15).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 15);
  assert.equal(event.title, "Abend der Vereine 2026");
  assert.equal(event.shortTitle, "Abend der Vereine");
  assert.equal(event.category, "Vergleichswettkampf");
  assert.equal(event.start, "2026-03-13T17:00:00");
  assert.equal("end" in event, false);
  assert.equal(
    event.location,
    "Schützenhaus, Tromsdorfer Straße 13, 06647 An der Poststraße"
  );
  assert.equal(
    event.organizer,
    "Großkaliber Schützengilde 1503 Eckartsberga e.V."
  );
  assert.equal(
    event.description,
    "Die GSG Eckartsberga lädt Vereine am 13. März 2026 zu einem sportlichen und geselligen Vergleichswettkampf ins Schützenhaus ein. Geschossen wird mit Luftgewehr und Kleinkalibergewehr in Mannschafts- und Einzelwertungen."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Einladung Abend der Vereine 2026",
      url: "assets/documents/events/2026/2026_02_25 Einladung Abend der Vereine 2026.pdf",
      type: "invitation"
    }
  ]);
  assert.equal(
    fs.existsSync(path.resolve(__dirname, `../${event.documents[0].url}`)),
    true
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  assert.deepEqual(getEventOrganizerLogo(event), {
    src: "assets/img/logo-gsg-eckartsberga.png",
    alt: "Logo der GSG Eckartsberga",
    width: 360,
    height: 347
  });
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, true);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("Eckartsburg-Pokal 2026 ist quellengetreu und detailfähig hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "eckartsburg-pokal-2026"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 11);
  assert.equal(event.title, "Eckartsburg-Pokal 2026");
  assert.equal(event.shortTitle, "Eckartsburg-Pokal");
  assert.equal(event.category, "Pokalwettkampf");
  assert.equal(event.start, "2026-09-05T09:00:00");
  assert.equal("end" in event, false);
  assert.equal(event.location, "Schützenhaus Buttstädt");
  assert.equal(
    event.organizer,
    "Großkaliber Schützengilde 1503 Eckartsberga e.V."
  );
  assert.equal(
    event.description,
    "Beim Eckartsburg-Pokal treten die Schützen in vier verschiedenen Disziplinen zum traditionellen Pokalwettkampf an."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Ausschreibung Eckartsburg-Pokal 2026",
      url: "assets/documents/events/2026/2026_08_14 Ausschreibung Eckartsburg-Pokal 2026.pdf",
      type: "invitation"
    }
  ]);
  assert.equal(
    fs.existsSync(path.resolve(__dirname, `../${event.documents[0].url}`)),
    true
  );
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, false);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
});

test("KM Zentralfeuer Halbautomat 2026 ist quellengetreu hinterlegt", () => {
  const { productionEvents } = loadEventData(false);
  const matchingEvents = productionEvents.filter(
    (entry) => entry.slug === "km-halbautomat-kk-gk-2026"
  );
  const [event] = matchingEvents;

  assert.equal(matchingEvents.length, 1);
  assert.equal(
    productionEvents.filter((entry) => entry.id === 9).length,
    1
  );
  assert.ok(event);
  assert.equal(isDetailCapable(event), true);
  assert.equal(event.id, 9);
  assert.equal(event.slug, "km-halbautomat-kk-gk-2026");
  assert.equal(
    event.title,
    "Kreismeisterschaft Zentralfeuer Halbautomat 2026"
  );
  assert.equal(event.shortTitle, "KM Zentralfeuer Halbautomat");
  assert.doesNotMatch(event.title, /\bKK\b/);
  assert.doesNotMatch(event.shortTitle, /\bKK\b/);
  assert.equal(event.category, "Kreismeisterschaft");
  assert.equal(event.start, "2026-09-12T09:30:00");
  assert.equal(event.end, "2026-09-12T13:00:00");
  assert.equal(event.location, "Jägerschießstand Markröhlitz");
  assert.equal(event.organizer, 'Schützenkreis "SUED"');
  assert.equal(
    event.description,
    "Kreismeisterschaft im Zentralfeuer-Selbstladegewehr auf 100 Meter, liegend aufgelegt mit Zielfernrohr."
  );
  assert.deepEqual(JSON.parse(JSON.stringify(event.documents)), [
    {
      label: "Ausschreibung – KM Zentralfeuer Halbautomat 2026",
      url: "assets/documents/events/2026/2026_08_18 Ausschreibung KM Zentralfeuer Halbautomat 2026.pdf",
      type: "announcement"
    },
    {
      label: "Anmeldung – KM Zentralfeuer Halbautomat 2026",
      url: "assets/documents/events/2026/2026_08_18 Anmeldung KM Zentralfeuer Halbautomat 2026.ods",
      type: "form"
    }
  ]);
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeEventDocuments(event))),
    JSON.parse(JSON.stringify(event.documents))
  );
  event.documents.forEach((document) => {
    assert.equal(
      fs.existsSync(path.resolve(__dirname, `../${document.url}`)),
      true
    );
  });
  assert.equal(new Set(event.documents.map((document) => document.url)).size, 2);
  assert.equal(event.image, null);
  assert.deepEqual(Array.from(event.gallery), []);
  assert.deepEqual(Array.from(event.results), []);
  assert.deepEqual(Array.from(event.downloads), []);
  assert.deepEqual(Array.from(event.externalLinks), []);
  assert.equal(event.registrationRequired, true);
  assert.equal(event.archive, true);
  assert.equal(event.featured, false);
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
        event.documents.length === 0 &&
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
  assert.ok(demoEvents.some((event) => event.documents.length > 0));
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
      [...event.documents, ...event.downloads, ...event.results].some(
        (item) => item.description && item.fileType && item.fileSize
      )
    )
  );
  const documentDemoEvent = demoEvents.find(
    (event) => event.slug === "demo-mehrbild-galerie-2025"
  );
  const normalizedDemoDocuments =
    normalizeEventDocuments(documentDemoEvent);

  assert.equal(
    normalizedDemoDocuments.filter(
      (document) =>
        document.url === "assets/dev/demo-ausschreibung.txt"
    ).length,
    1
  );
  assert.ok(
    normalizedDemoDocuments.some(
      (document) => document.type === "announcement"
    )
  );
  assert.ok(
    normalizedDemoDocuments.some(
      (document) => document.type === "result-list"
    )
  );

  demoEvents.forEach((event) => {
    if (event.image?.src && !/^https?:/i.test(event.image.src)) {
      localAssetUrls.add(event.image.src);
    }

    event.gallery.forEach((image) => {
      if (!/^https?:/i.test(image.src)) localAssetUrls.add(image.src);
    });

    event.documents.forEach((document) => {
      if (!/^https?:/i.test(document.url)) {
        localAssetUrls.add(document.url);
      }
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

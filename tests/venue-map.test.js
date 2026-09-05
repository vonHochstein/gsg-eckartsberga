"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const eventHtml = fs.readFileSync(
  path.join(projectRoot, "event.html"),
  "utf8"
);
const eventDetailSource = fs.readFileSync(
  path.join(projectRoot, "js/event-detail.js"),
  "utf8"
);
const calendarSource = fs.readFileSync(
  path.join(projectRoot, "js/calendar.js"),
  "utf8"
);
const venueMapSource = fs.readFileSync(
  path.join(projectRoot, "js/venue-map.js"),
  "utf8"
);

const vendorHashes = {
  "leaflet.css": "a7837102824184820dfa198d1ebcd109ff6d0ff9a2672a074b9a1b4d147d04c6",
  "leaflet.js": "db49d009c841f5ca34a888c96511ae936fd9f5533e90d8b2c4d57596f4e5641a",
  "images/layers-2x.png": "066daca850d8ffbef007af00b06eac0015728dee279c51f3cb6c716df7c42edf",
  "images/layers.png": "1dbbe9d028e292f36fcba8f8b3a28d5e8932754fc2215b9ac69e4cdecf5107c6",
  "images/marker-icon-2x.png": "00179c4c1ee830d3a108412ae0d294f55776cfeb085c60129a39aa6fc4ae2528",
  "images/marker-icon.png": "574c3a5cca85f4114085b6841596d62f00d7c892c7b03f28cbfa301deb1dc437",
  "images/marker-shadow.png": "264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da",
  LICENSE: "53e8dc25862014e4324741ca18fbe3611e11d42ef69f59f86ea8c5389647d4cb"
};

function sha256(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function createVenueMapContext(reduceMotion = false) {
  const listeners = { document: {}, dialog: {} };
  const animationFrames = [];
  const calls = {
    circleMarker: 0,
    close: 0,
    focus: 0,
    invalidateSize: 0,
    map: 0,
    mapRemove: 0,
    showModal: 0,
    tileLayer: 0
  };
  const panel = { contains: () => false };
  const createElement = () => ({
    dataset: {},
    hidden: false,
    isConnected: true,
    textContent: "",
    addEventListener() {},
    focus() {
      calls.focus++;
    },
    replaceChildren() {},
    setAttribute() {}
  });
  const dialog = {
    querySelector: () => panel,
    addEventListener(type, listener) {
      listeners.dialog[type] = listener;
    },
    close() {
      calls.close++;
    },
    showModal() {
      calls.showModal++;
    }
  };
  const elements = {
    "venue-map-dialog": dialog,
    "venue-map-close": createElement(),
    "venue-map-name": createElement(),
    "venue-map-description": createElement(),
    "venue-map-canvas": createElement(),
    "venue-map-status": createElement(),
    "venue-map-external": createElement()
  };
  const map = {
    attributionControl: { setPrefix() {} },
    invalidateSize() {
      calls.invalidateSize++;
    },
    remove() {
      calls.mapRemove++;
    }
  };
  const leaflet = {
    map(_element, options) {
      calls.map++;
      calls.mapOptions = options;
      return map;
    },
    tileLayer() {
      calls.tileLayer++;
      return {
        addTo() {
          return this;
        },
        on() {
          return this;
        }
      };
    },
    circleMarker() {
      calls.circleMarker++;
      return { addTo() {} };
    }
  };
  const browserWindow = {
    L: leaflet,
    addEventListener() {},
    matchMedia() {
      return { matches: reduceMotion };
    },
    requestAnimationFrame(callback) {
      animationFrames.push(callback);
    }
  };
  const document = {
    addEventListener(type, listener) {
      listeners.document[type] = listener;
    },
    getElementById(id) {
      return elements[id] || null;
    }
  };
  const context = vm.createContext({
    console,
    document,
    encodeURIComponent,
    Number,
    Object,
    String,
    window: browserWindow
  });

  vm.runInContext(venueMapSource, context, { filename: "venue-map.js" });

  return {
    animationFrames,
    calls,
    elements,
    listeners,
    map,
    window: browserWindow
  };
}

test("bindet Leaflet ausschließlich lokal und in kontrollierter Reihenfolge ein", () => {
  const cssIndex = eventHtml.indexOf(
    'href="assets/vendor/leaflet/leaflet.css"'
  );
  const projectCssIndex = eventHtml.indexOf('href="event.css"');
  const leafletIndex = eventHtml.indexOf(
    'src="assets/vendor/leaflet/leaflet.js"'
  );
  const controllerIndex = eventHtml.indexOf('src="js/venue-map.js"');
  const detailIndex = eventHtml.indexOf('src="js/event-detail.js"');

  assert.ok(cssIndex >= 0 && cssIndex < projectCssIndex);
  assert.ok(leafletIndex >= 0 && leafletIndex < controllerIndex);
  assert.ok(controllerIndex < detailIndex);
  assert.doesNotMatch(eventHtml, /unpkg|cdnjs|jsdelivr/i);
});

test("liefert die unveränderten geprüften Leaflet-Laufzeitdateien aus", () => {
  Object.entries(vendorHashes).forEach(([relativePath, expectedHash]) => {
    const filePath = path.join(
      projectRoot,
      "assets/vendor/leaflet",
      relativePath
    );

    assert.equal(fs.existsSync(filePath), true, relativePath);
    assert.equal(sha256(filePath), expectedHash, relativePath);
  });

  assert.match(
    fs.readFileSync(
      path.join(projectRoot, "assets/vendor/leaflet/LICENSE"),
      "utf8"
    ),
    /BSD 2-Clause License/
  );
});

test("stellt genau einen zugänglich beschrifteten Karten-Dialog bereit", () => {
  assert.equal((eventHtml.match(/id="venue-map-dialog"/g) || []).length, 1);
  assert.match(
    eventHtml,
    /id="venue-map-dialog"[\s\S]*aria-labelledby="venue-map-title"[\s\S]*aria-describedby="venue-map-provider-notice"/
  );
  assert.match(eventHtml, /id="venue-map-close"[\s\S]*autofocus/);
  assert.match(eventHtml, /id="venue-map-canvas"[\s\S]*role="region"/);
  assert.match(eventHtml, /OpenStreetMap Foundation/);
  assert.match(eventHtml, /Standort direkt bei OpenStreetMap öffnen/);
});

test("erzeugt den Kartenbutton nur für aufgelöste Koordinaten", () => {
  assert.match(
    eventDetailSource,
    /typeof locationData\?\.latitude === "number"[\s\S]*typeof locationData\?\.longitude === "number"/
  );
  assert.match(eventDetailSource, /data-venue-map-trigger/);
  assert.match(eventDetailSource, /Karte anzeigen – lädt OpenStreetMap/);
  assert.match(eventDetailSource, /aria-haspopup="dialog"/);
  assert.doesNotMatch(calendarSource, /data-venue-map-trigger|venue-map-trigger/);
});

test("baut beim normalen Seitenstart keine Verbindung zum Tile-Dienst auf", () => {
  const fixture = createVenueMapContext();

  assert.equal(fixture.calls.tileLayer, 0);
  assert.equal(fixture.calls.map, 0);
  assert.equal(fixture.animationFrames.length, 0);
});

test("lädt die Karte erst nach bewusstem Öffnen und räumt sie beim Schließen auf", () => {
  const fixture = createVenueMapContext();
  const trigger = {
    isConnected: true,
    focus() {
      fixture.calls.focus++;
    }
  };
  const location = {
    name: "Test-Schießstand",
    description: "Testbeschreibung",
    latitude: 51,
    longitude: 11
  };

  assert.equal(fixture.window.VenueMap.open(trigger, location), true);
  assert.equal(fixture.calls.showModal, 1);
  assert.equal(fixture.calls.tileLayer, 0);
  assert.equal(fixture.animationFrames.length, 1);

  fixture.animationFrames.shift()();

  assert.equal(fixture.calls.map, 1);
  assert.equal(fixture.calls.tileLayer, 1);
  assert.equal(fixture.calls.circleMarker, 1);
  assert.match(
    fixture.elements["venue-map-external"].href,
    /^https:\/\/www\.openstreetmap\.org\/\?mlat=51&mlon=11#map=16\/51\/11$/
  );

  let escapePrevented = false;
  fixture.listeners.dialog.keydown({
    key: "Escape",
    preventDefault() {
      escapePrevented = true;
    }
  });
  assert.equal(escapePrevented, true);
  assert.equal(fixture.calls.close, 1);

  fixture.listeners.dialog.close();

  assert.equal(fixture.calls.mapRemove, 1);
  assert.equal(fixture.calls.focus, 2);
});

test("öffnet für ungültige oder unvollständige Kartenpositionen keinen Dialog", () => {
  const fixture = createVenueMapContext();
  const invalidLocations = [
    null,
    { name: "Ort" },
    { name: "Ort", latitude: "51", longitude: 11 },
    { name: "Ort", latitude: 91, longitude: 11 },
    { name: "Ort", latitude: 51, longitude: 181 }
  ];

  invalidLocations.forEach((location) => {
    assert.equal(fixture.window.VenueMap.open(null, location), false);
  });

  assert.equal(fixture.calls.showModal, 0);
  assert.equal(fixture.calls.tileLayer, 0);
});

test("deaktiviert Leaflet-Bewegung bei reduzierter Bewegung", () => {
  const fixture = createVenueMapContext(true);

  fixture.window.VenueMap.open(null, {
    name: "Testort",
    latitude: 51,
    longitude: 11
  });
  fixture.animationFrames.shift()();

  assert.equal(fixture.calls.mapOptions.fadeAnimation, false);
  assert.equal(fixture.calls.mapOptions.markerZoomAnimation, false);
  assert.equal(fixture.calls.mapOptions.zoomAnimation, false);
  assert.equal(fixture.calls.mapOptions.touchZoom, true);
});

test("verwendet weder Cookie- noch lokale Speichermechanismen", () => {
  assert.doesNotMatch(
    venueMapSource,
    /document\.cookie|localStorage|sessionStorage|indexedDB/
  );
  assert.match(
    venueMapSource,
    /https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/
  );
  assert.match(
    venueMapSource,
    /https:\/\/www\.openstreetmap\.org\/copyright/
  );
  assert.match(venueMapSource, /prefers-reduced-motion: reduce/);
  assert.match(venueMapSource, /touchZoom:\s*true/);
});

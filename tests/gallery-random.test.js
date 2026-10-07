"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  selectRandomGalleryIndex,
  getNextGalleryHistoryState
} = require("../js/gallery.js");

test("wählt das erste Galeriebild aus dem gesamten Bestand zufällig", () => {
  assert.equal(selectRandomGalleryIndex(5, -1, 0), 0);
  assert.equal(selectRandomGalleryIndex(5, -1, 0.4), 2);
  assert.equal(selectRandomGalleryIndex(5, -1, 0.999999), 4);
});

test("schließt beim Bildwechsel ausschließlich das aktuelle Bild aus", () => {
  assert.equal(selectRandomGalleryIndex(5, 2, 0), 0);
  assert.equal(selectRandomGalleryIndex(5, 2, 0.49), 1);
  assert.equal(selectRandomGalleryIndex(5, 2, 0.5), 3);
  assert.equal(selectRandomGalleryIndex(5, 2, 0.999999), 4);
});

test("behandelt leere und einzelne Galerien robust", () => {
  assert.equal(selectRandomGalleryIndex(0, -1, 0.5), -1);
  assert.equal(selectRandomGalleryIndex(1, -1, 0.5), 0);
  assert.equal(selectRandomGalleryIndex(1, 0, 0.5), 0);
});

test("bewahrt den tatsächlich gesehenen Verlauf für Vor und Zurück", () => {
  const firstAdvance = getNextGalleryHistoryState([2], 0, 5, 0);

  assert.deepEqual(firstAdvance, {
    history: [2, 0],
    position: 1,
    index: 0
  });

  const forwardAgain = getNextGalleryHistoryState(
    firstAdvance.history,
    0,
    5,
    0.75
  );

  assert.deepEqual(forwardAgain, {
    history: [2, 0],
    position: 1,
    index: 0
  });
});

test("stellt die Zufallsgalerie mit steuerbarem Wechsel bereit", () => {
  const projectRoot = path.join(__dirname, "..");
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(projectRoot, "style.css"), "utf8");
  const script = fs.readFileSync(
    path.join(projectRoot, "js", "gallery.js"),
    "utf8"
  );

  assert.match(html, /data-gallery-previous/);
  assert.match(html, /data-gallery-next/);
  assert.match(html, /data-gallery-toggle/);
  assert.match(html, /data-gallery-position/);
  assert.match(html, /class="gallery-preview-toggle-icon"/);
  assert.ok(
    html.indexOf("data-gallery-controls") <
      html.indexOf('<div class="gallery-preview-copy">')
  );
  assert.match(
    css,
    /\.gallery-preview-button,[\s\S]*?\.gallery-preview-toggle\s*{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/
  );
  assert.match(css, /\.gallery-preview-controls\s*{[^}]*grid-area:\s*image;/s);
  assert.match(css, /\.gallery-feature figcaption\s*{[^}]*bottom:\s*82px;/s);
  assert.match(script, /toggleButton\.dataset\.autoplayState/);
  assert.match(script, /galleryPreview\.addEventListener\("pointerenter", pauseAutoplay\)/);
  assert.match(script, /galleryPreview\.addEventListener\("focusin", pauseAutoplay\)/);
  assert.match(script, /document\.addEventListener\("visibilitychange"/);
});

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const detailSource = fs.readFileSync(
  path.join(projectRoot, "js/event-detail.js"),
  "utf8"
);
const eventCss = fs.readFileSync(path.join(projectRoot, "event.css"), "utf8");

test("rendert optionale lokale Videos mit dem nativen HTML5-Player", () => {
  assert.match(detailSource, /normalizeVideos\(event\.videos\)/);
  assert.match(detailSource, /if \(videos\.length === 0\) return "";/);
  assert.match(detailSource, /<video[\s\S]*?controls[\s\S]*?preload="metadata"[\s\S]*?playsinline/);
  assert.match(detailSource, /<source src="\$\{escapeHTML\(video\.src\)\}" type="video\/mp4"/);
  assert.doesNotMatch(detailSource, /<video[^>]*\bautoplay\b/);
  assert.doesNotMatch(detailSource, /youtube(?:-nocookie)?\.com|youtu\.be/i);
});

test("stellt mehrere Videos responsiv und ohne Eingriff in die Galerie dar", () => {
  assert.match(eventCss, /\.event-videos\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/s);
  assert.match(eventCss, /\.event-video\s*\{[^}]*width:\s*100%;[^}]*object-fit:\s*contain;/s);
  assert.match(
    eventCss,
    /@media \(max-width: 600px\)[\s\S]*?\.event-gallery,[\s\S]*?\.event-videos\s*\{\s*grid-template-columns:\s*1fr;/
  );
  assert.match(detailSource, /createVideosSection\(videos\)[\s\S]*createGallerySection\(gallery\)/);
});

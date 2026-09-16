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
const lightboxSource = fs.readFileSync(
  path.join(projectRoot, "js/gallery-lightbox.js"),
  "utf8"
);
const eventHtml = fs.readFileSync(path.join(projectRoot, "event.html"), "utf8");
const eventCss = fs.readFileSync(path.join(projectRoot, "event.css"), "utf8");

test("führt Bilder und lokale Videos erst für die Darstellung zusammen", () => {
  assert.match(detailSource, /normalizeVideos\(event\.videos\)/);
  assert.match(detailSource, /createGallerySection\(gallery, videos\)/);
  assert.match(
    detailSource,
    /\.\.\.gallery\.map\(\(image\) => \(\{ kind: "image", \.\.\.image \}\)\)[\s\S]*?\.\.\.videos\.map\(\(video\) => \(\{ kind: "video", \.\.\.video \}\)\)/
  );
  assert.match(detailSource, /if \(media\.length === 0\) return "";/);
  assert.match(detailSource, /videos\.length > 0 \? "Medien" : "Bilder"/);
  assert.match(detailSource, /`Weniger \$\{mediaLabel\} anzeigen`/);
  assert.doesNotMatch(detailSource, /createVideosSection|event-videos-title/);
});

test("kennzeichnet Videokacheln mit lokalem Poster und Play-Symbol", () => {
  assert.match(detailSource, /data-gallery-kind="video"/);
  assert.match(detailSource, /data-gallery-src="\$\{escapeHTML\(item\.src\)\}"/);
  assert.match(detailSource, /data-gallery-poster="\$\{escapeHTML\(item\.poster\)\}"/);
  assert.match(detailSource, /class="event-gallery-play" aria-hidden="true"/);
  assert.match(detailSource, /\$\{escapeHTML\(item\.title\)\} abspielen/);
  assert.match(eventCss, /\.event-gallery-play\s*\{/);
  assert.match(eventCss, /\.event-gallery-play::before\s*\{/);
  assert.doesNotMatch(detailSource, /youtube(?:-nocookie)?\.com|youtu\.be/i);
});

test("verwendet im gemeinsamen Dialog weiterhin den nativen lokalen Videoplayer", () => {
  assert.equal((eventHtml.match(/id="event-lightbox-video"/g) || []).length, 1);
  assert.match(
    eventHtml,
    /<video[\s\S]*?id="event-lightbox-video"[\s\S]*?controls[\s\S]*?preload="metadata"[\s\S]*?playsinline[\s\S]*?hidden/
  );
  assert.doesNotMatch(eventHtml, /<video[^>]*\bautoplay\b/);
  assert.match(lightboxSource, /trigger\.dataset\.galleryKind === "video"/);
  assert.match(lightboxSource, /lightboxVideo\.setAttribute\("src", video\.src\)/);
  assert.match(lightboxSource, /lightboxVideo\.load\(\)/);
});

test("beendet Videos beim Wechsel und Schließen und setzt die Position zurück", () => {
  assert.match(lightboxSource, /function pauseAndResetVideo\(\)/);
  assert.match(lightboxSource, /lightboxVideo\.pause\(\)/);
  assert.match(lightboxSource, /lightboxVideo\.currentTime = 0/);
  assert.match(
    lightboxSource,
    /function showGalleryMedia\(index\)[\s\S]*?pauseAndResetVideo\(\);[\s\S]*?showVideo\(item\)/
  );
  assert.match(
    lightboxSource,
    /function closeLightbox\(\)[\s\S]*?pauseAndResetVideo\(\);[\s\S]*?dialog\.close\(\)/
  );
  assert.match(lightboxSource, /event\.key === "ArrowLeft" && !videoHasFocus/);
  assert.match(lightboxSource, /event\.key === "ArrowRight" && !videoHasFocus/);
});

test("bewahrt reine Bildergalerien und leere Medienzustände", () => {
  assert.match(detailSource, /data-gallery-kind="image"/);
  assert.match(lightboxSource, /kind: "image"/);
  assert.match(
    lightboxSource,
    /galleryHasVideos \? "Medium" : "Bild"/
  );
  assert.match(eventCss, /\.event-gallery\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s);
  assert.doesNotMatch(eventCss, /\.event-videos\s*\{/);
});

test("reserviert Beschreibung und Navigation unabhängig vom Medienformat", () => {
  assert.match(
    eventCss,
    /\.event-lightbox-panel\s*\{[^}]*grid-template-rows:\s*auto minmax\(0, 1fr\) auto;[^}]*height:\s*calc\(100svh - clamp\(24px, 6vw, 64px\)\);[^}]*overflow:\s*hidden;/s
  );
  assert.match(
    eventCss,
    /\.event-lightbox-media\s*\{[^}]*grid-template-rows:\s*minmax\(0, 1fr\) auto;/s
  );
  assert.match(
    eventCss,
    /\.event-lightbox-media img,\s*\.event-lightbox-media video:not\(\[hidden\]\)\s*\{[^}]*max-height:\s*100%;[^}]*border-radius:\s*12px;[^}]*clip-path:\s*inset\(0 round 12px\);[^}]*object-fit:\s*contain;/s
  );
  assert.match(
    eventCss,
    /\.event-lightbox-media video:not\(\[hidden\]\)\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;/s
  );
  assert.doesNotMatch(
    eventCss,
    /\.event-lightbox-media (?:img|video:not\(\[hidden\]\))\s*\{[^}]*100svh/s
  );
});

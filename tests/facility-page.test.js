"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const facilityPath = path.join(projectRoot, "schiessbahnen.html");
const facilityCssPath = path.join(projectRoot, "schiessbahnen.css");
const indexPath = path.join(projectRoot, "index.html");

const facilityMedia = [
  {
    filename: "undatiert 25-Meter-Bahn Raumschießanlage GSG Eckartsberga.jpg",
    alt: "Blick auf die 25-Meter-Bahn mit den beiden Duellscheiben",
    caption: "Die 25-Meter-Bahn mit den beiden Duellscheiben.",
    width: 1280,
    height: 960,
    hash: "889d1a675b48b717b5c9764f1e03a64c65bf41406a7922863d0cb9ea8f696aef"
  },
  {
    filename: "undatiert Luftgewehrbahn Übersicht GSG Eckartsberga.jpg",
    alt: "Übersicht über die Luftgewehrbahn",
    caption: "Die Luftgewehrbahn.",
    width: 1280,
    height: 960,
    hash: "e29df06e8fe1419ab5440aba5d944b4d616225399165c7d6f469563f4b62b505"
  },
  {
    filename: "undatiert Luftgewehrbahn GSG Eckartsberga.jpg",
    alt: "Blick auf die Luftgewehrbahn",
    caption: "Schießen auf der Luftgewehrbahn.",
    width: 3000,
    height: 4000,
    hash: "1e831a6e94319b682eb018ab97c58fc1bba1cd32ce835d444b446ec13140d003"
  },
  {
    filename: "undatiert Sitzungsraum Vereinshaus GSG Eckartsberga.jpg",
    alt: "Blick in den Sitzungsraum des Vereinshauses",
    caption: "Der Sitzungsraum im Vereinshaus.",
    width: 1280,
    height: 960,
    hash: "25156465de5b9712c5f22bfa5af5086cca5c88f4e98e965ce283ebb5bcc62577"
  }
];

function readProjectFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function createSha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getNavigationMarkup(html, className) {
  const pattern = new RegExp(
    `<nav[^>]*class="[^"]*${className}[^"]*"[^>]*>[\\s\\S]*?<\\/nav>`,
    "i"
  );

  return html.match(pattern)?.[0] ?? "";
}

test("stellt die Anlagen-Unterseite im Rahmen der Geschichtsseite bereit", () => {
  assert.equal(fs.existsSync(facilityPath), true);
  assert.equal(fs.existsSync(facilityCssPath), true);

  const html = readProjectFile(facilityPath);

  assert.equal(countMatches(html, /<h1\b/gi), 1);
  assert.match(html, /<body class="history-page facilities-page">/);
  assert.match(html, /class="site-header history-site-header"/);
  assert.match(html, /class="event-back-link" href="index\.html#verein"/);
  assert.match(html, /<p class="history-eyebrow">Vereinsanlage<\/p>/);
  assert.match(html, /<h1>Schießbahnen &amp; Vereinshaus<\/h1>/);
  assert.match(html, /<link rel="stylesheet" href="geschichte\.css" \/>/);
  assert.match(html, /<link rel="stylesheet" href="schiessbahnen\.css" \/>/);
});

test("veröffentlicht ausschließlich die bestätigten Nutzungsangaben", () => {
  const html = readProjectFile(facilityPath);

  assert.match(html, /Seit März 2014 kann unsere 25-Meter-Raumschießanlage nach\s+Voranmeldung genutzt werden\./);
  assert.match(html, /<dt>Nutzung<\/dt>\s*<dd>Nach Voranmeldung<\/dd>/);
  assert.match(html, /<dt>Standgebühr<\/dt>\s*<dd>10 Euro je Schütze<\/dd>/);
  assert.match(html, /<dt>Leihwaffen und Munition<\/dt>\s*<dd>Bei Bedarf zusätzlich<\/dd>/);
  assert.doesNotMatch(html, /(?:mailto:|tel:|Kontakt aufnehmen|Jetzt anfragen|Öffnungszeiten|Trainingszeiten|Burgstraße)/i);
});

test("bindet vier unveränderte Anlagenbilder mit festen Metadaten ein", () => {
  const html = readProjectFile(facilityPath);

  assert.equal(countMatches(html, /data-gallery-index="\d+"/g), 4);
  assert.equal(countMatches(html, /<figcaption>/g), 4);

  facilityMedia.forEach(({ filename, alt, caption, width, height, hash }, index) => {
    const mediaPath = path.join(projectRoot, "assets", "img", "facilities", filename);
    const imagePattern = new RegExp(
      `<img[\\s\\S]*?src="assets/img/facilities/${escapePattern(filename)}"[\\s\\S]*?alt="${escapePattern(alt)}"[\\s\\S]*?width="${width}"[\\s\\S]*?height="${height}"[\\s\\S]*?loading="lazy"[\\s\\S]*?decoding="async"[\\s\\S]*?\\/>`
    );

    assert.equal(fs.existsSync(mediaPath), true, `Medium fehlt: ${filename}`);
    assert.equal(createSha256(mediaPath), hash, `Prüfsumme weicht ab: ${filename}`);
    assert.match(html, new RegExp(`data-gallery-index="${index}"`));
    assert.match(html, imagePattern);
    assert.match(html, new RegExp(`<figcaption>${escapePattern(caption)}<\\/figcaption>`));
  });
});

test("verwendet die gemeinsame Lightbox genau einmal", () => {
  const html = readProjectFile(facilityPath);

  assert.equal(countMatches(html, /data-gallery-lightbox/g), 1);
  assert.equal(countMatches(html, /<dialog\b/g), 1);
  assert.equal(countMatches(html, /id="event-lightbox"/g), 1);
  assert.match(html, /<h2 id="event-lightbox-title">Bilder der Vereinsanlage<\/h2>/);
  assert.match(html, /js\/gallery-lightbox\.js/);
  assert.doesNotMatch(html, /event-detail\.js|gallery\.js|venue-map\.js/);
});

test("stellt die Medien vollständig und responsiv dar", () => {
  const css = readProjectFile(facilityCssPath);

  assert.match(
    css,
    /\.facility-media-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/s
  );
  assert.match(css, /\.facility-media-grid img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;/s);
  assert.doesNotMatch(css, /object-fit:\s*cover|aspect-ratio:/);
  assert.match(
    css,
    /@media \(max-width: 680px\)[\s\S]*?\.facility-facts,\s*\.facility-media-grid\s*\{[^}]*grid-template-columns:\s*1fr;/
  );
});

test("verlinkt die sichtbar unveränderte Anlagenkarte", () => {
  const indexHtml = readProjectFile(indexPath);
  const cardMarkup = indexHtml.match(
    /<a class="highlight-card" href="schiessbahnen\.html">[\s\S]*?<\/a>/
  )?.[0] ?? "";

  assert.notEqual(cardMarkup, "");
  assert.match(
    cardMarkup,
    /<div class="highlight-icon" aria-hidden="true">\s*<svg\b/
  );
  assert.match(cardMarkup, /<h3>Schießbahnen & Vereinshaus<\/h3>/);
  assert.match(
    cardMarkup,
    /<p>Vereinsleben und sportliche Begegnungen finden bei uns einen gemeinsamen Ort\.<\/p>/
  );
  assert.equal(countMatches(cardMarkup, /<(?:div|h3|p)\b/g), 3);
  assert.doesNotMatch(cardMarkup, /ansehen|entdecken|→|card-hover-link/i);
});

test("erweitert die globale Navigation nicht um die Anlagen-Unterseite", () => {
  const html = readProjectFile(facilityPath);

  ["main-nav", "footer-nav"].forEach((className) => {
    const navigationMarkup = getNavigationMarkup(html, className);

    assert.notEqual(navigationMarkup, "");
    assert.doesNotMatch(navigationMarkup, /schiessbahnen\.html/i);
  });
});

test("verweist ausschließlich auf vorhandene lokale Seiten und Assets", () => {
  const html = readProjectFile(facilityPath);
  const references = [...html.matchAll(/\b(?:href|src|srcset)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:#|https?:|mailto:|tel:)/i.test(reference))
    .map((reference) => reference.split(/[?#]/, 1)[0]);

  references.forEach((reference) => {
    assert.equal(
      fs.existsSync(path.join(projectRoot, reference)),
      true,
      `Lokales Ziel fehlt: ${reference}`
    );
  });
});

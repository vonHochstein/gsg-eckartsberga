"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const achievementsPath = path.join(projectRoot, "erfolge.html");
const achievementsCssPath = path.join(projectRoot, "erfolge.css");
const indexPath = path.join(projectRoot, "index.html");
const stylePath = path.join(projectRoot, "style.css");

const achievements = [
  {
    year: 2026,
    role: "Schützenkönig",
    name: "Steffen Ackermann",
    filename: "2026 Schützenkönig Steffen Ackermann.jpg",
    width: 2084,
    height: 3217,
    position: "50% 30%",
    hash: "882983fbb239db08855d87416f825e8204b3b3b3473eb4208378786ef7ffafb6"
  },
  {
    year: 2025,
    role: "Schützenkönig",
    name: "Steffen Ackermann",
    filename: "2025 Schützenkönig Steffen Ackermann.jpg",
    width: 428,
    height: 1142,
    position: "50% 24%",
    hash: "1f7eec5f51356493d2d769ad49a4766e8ed5cb59bc873e844e7b28467d2fa64f"
  },
  {
    year: 2024,
    role: "Schützenkönig",
    name: "David Neuhäuser",
    filename: "2024 Schützenkönig David Neuhäuser.jpg",
    width: 3000,
    height: 4000,
    position: "50% 30%",
    hash: "a4e83afe98ee04364bb0eb2685cff25f53779a07be83c7cfd648b9f25b4a2008"
  },
  {
    year: 2023,
    role: "Schützenkönigin",
    name: "Lisa Matthes",
    filename: "2023 Schützenkönigin Lisa Matthes.jpg",
    width: 1609,
    height: 2389,
    position: "50% 30%",
    hash: "e8b1de673ec0fd014fcd6a8de374f6ffd9e69560891ef11799b925a4da6eaed7"
  },
  {
    year: 2022,
    role: "Schützenkönig",
    name: "Hubert Schorch",
    filename: "2022 Schützenkönig Hubert Schorch.jpg",
    width: 1200,
    height: 1600,
    position: "50% 46%",
    hash: "50dea947e68e64195304ff4d5a29ba471ebeff6a2032e78e134b74a9a9915a2f"
  },
  {
    year: 2021,
    role: "Schützenkönig",
    name: "Steffen Ackermann",
    filename: "2021 Schützenkönig Steffen Ackermann.jpg",
    width: 1200,
    height: 1600,
    position: "50% 30%",
    hash: "cdaf84d8884cc45e1140d8a3b5277eee577531d55adec13318e49eefcde4e7bc"
  },
  {
    year: 2020,
    role: "Schützenkönig",
    name: "Dietmar Müller",
    filename: "2020 Schützenkönig Dietmar Müller.jpg",
    width: 1000,
    height: 750,
    position: "50% 50%",
    hash: "f52ee80a5d0789ef6d692deff74980231729de69685dd55adfa7b8d380dde30f"
  },
  {
    year: 2019,
    role: "Schützenkönig",
    name: "Dominice Wiegand",
    filename: "2019 Schützenkönig Dominice Wiegand.png",
    width: 616,
    height: 821,
    position: "50% 34%",
    hash: "20ca1baf72ddc2e444adbbe36f9e40bf56edc842e7d761ea910ad700d9ca6ce8"
  },
  {
    year: 2017,
    role: "Schützenkönig",
    name: "Reiner König",
    filename: "2017 Schützenkönig Reiner König.jpg",
    width: 720,
    height: 1280,
    position: "50% 34%",
    hash: "2c0f74bc8afe2b6212eba666aec8498d1538cd8565bf8a16bf582df3be9eaf37"
  },
  {
    year: 2016,
    role: "Schützenkönig",
    name: "Steffen Löhnert",
    filename: "2016 Schützenkönig Steffen Löhnert.jpg",
    width: 1600,
    height: 1200,
    position: "50% 50%",
    hash: "5dbec58e28c8cb61fd305c7b799a2cb1d248192c07a43d0d733d84c89b2ac3c3"
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

function getNavigationMarkup(html, className) {
  const pattern = new RegExp(
    `<nav[^>]*class="[^"]*${className}[^"]*"[^>]*>[\\s\\S]*?<\\/nav>`,
    "i"
  );

  return html.match(pattern)?.[0] ?? "";
}

test("stellt die statische Erfolgsseite im bestehenden Detailseitenrahmen bereit", () => {
  assert.equal(fs.existsSync(achievementsPath), true);
  assert.equal(fs.existsSync(achievementsCssPath), true);

  const html = readProjectFile(achievementsPath);

  assert.equal(countMatches(html, /<h1\b/gi), 1);
  assert.match(html, /<h1 id="achievements-title">Erfolge<\/h1>/);
  assert.match(html, /<h2 id="royal-title">Schützenkönige<\/h2>/);
  assert.equal(countMatches(html, /class="event-section"/g), 1);
  assert.match(html, /<body class="event-detail-page">/);
  assert.match(html, /class="event-back-link" href="index\.html#verein"/);
  assert.match(html, /<link rel="stylesheet" href="style\.css" \/>/);
  assert.match(html, /<link rel="stylesheet" href="event\.css" \/>/);
  assert.match(html, /<link rel="stylesheet" href="erfolge\.css" \/>/);
  assert.doesNotMatch(html, /Besondere Erfolge|Wettkampferfolge/);
});

test("führt zehn überlieferte Schützenkönige in absteigender Reihenfolge", () => {
  const html = readProjectFile(achievementsPath);
  let previousPosition = -1;

  assert.equal(countMatches(html, /class="achievement-card"/g), 10);
  assert.equal(countMatches(html, /data-gallery-index="\d+"/g), 10);

  achievements.forEach(({ year, role, name }, index) => {
    const id = `schuetzenkoenig-${year}`;
    const position = html.indexOf(`id="${id}"`);

    assert.ok(position > previousPosition, `${id} steht nicht in Reihenfolge`);
    assert.equal(countMatches(html, new RegExp(`id="${id}"`, "g")), 1);
    assert.match(html, new RegExp(`${role} ${year}`));
    assert.match(html, new RegExp(name));
    assert.match(html, new RegExp(`data-gallery-index="${index}"`));
    previousPosition = position;
  });

  assert.doesNotMatch(html, /schuetzenkoenig-2018|Schützenkönig 2018/);
  assert.equal(
    countMatches(
      html,
      /<strong class="achievement-name">Dominice Wiegand<\/strong>/g
    ),
    1
  );
});

test("verwendet unveränderte öffentliche Medien mit festen Abmessungen", () => {
  const html = readProjectFile(achievementsPath);

  achievements.forEach(({ filename, width, height, hash }) => {
    const mediaPath = path.join(projectRoot, "assets", "img", "achievements", filename);
    const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const imagePattern = new RegExp(
      `<img[\\s\\S]*?src="assets/img/achievements/${escapedFilename}"[\\s\\S]*?width="${width}"[\\s\\S]*?height="${height}"[\\s\\S]*?loading="lazy"[\\s\\S]*?decoding="async"[\\s\\S]*?\\/>`
    );

    assert.equal(fs.existsSync(mediaPath), true, `Medium fehlt: ${filename}`);
    assert.equal(createSha256(mediaPath), hash, `Prüfsumme weicht ab: ${filename}`);
    assert.match(html, imagePattern);
  });
});

test("verwendet die gemeinsame Lightbox genau einmal", () => {
  const html = readProjectFile(achievementsPath);

  assert.equal(countMatches(html, /data-gallery-lightbox/g), 1);
  assert.equal(countMatches(html, /<dialog\b/g), 1);
  assert.equal(countMatches(html, /id="event-lightbox"/g), 1);
  assert.match(html, /js\/gallery-lightbox\.js/);
  assert.doesNotMatch(html, /event-detail\.js|gallery\.js/);
});

test("stellt die Porträts vollständig und responsiv im Kartenraster dar", () => {
  const css = readProjectFile(achievementsCssPath);

  assert.match(
    css,
    /\.achievements-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/s
  );
  assert.match(css, /\.achievement-card-open img\s*\{[^}]*object-fit:\s*contain;/s);
  assert.match(
    css,
    /@media \(max-width: 1024px\)[\s\S]*?\.achievements-grid\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/
  );
  assert.match(
    css,
    /@media \(max-width: 600px\)[\s\S]*?\.achievements-grid\s*\{[^}]*grid-template-columns:\s*1fr;/
  );
});

test("verlinkt die sichtbar unveränderte Erfolgskarte", () => {
  const indexHtml = readProjectFile(indexPath);
  const cardMarkup = indexHtml.match(
    /<a class="highlight-card" href="erfolge\.html">[\s\S]*?<\/a>/
  )?.[0] ?? "";

  assert.notEqual(cardMarkup, "");
  assert.match(cardMarkup, /<div class="highlight-icon" aria-hidden="true">🏆<\/div>/);
  assert.match(cardMarkup, /<h3>Erfolge<\/h3>/);
  assert.match(
    cardMarkup,
    /<p>Schützenkönige, Wettkampferfolge und besondere Leistungen gehören zu unserer Geschichte\.<\/p>/
  );
  assert.equal(countMatches(cardMarkup, /<(?:div|h3|p)\b/g), 3);
});

test("ergänzt zehn Schützenkönig-Motive in der statischen Startseitengalerie", () => {
  const indexHtml = readProjectFile(indexPath);
  const galleryMarkup = indexHtml.match(
    /<div class="gallery-preview"[^>]*>[\s\S]*?<div class="gallery-preview-copy">/
  )?.[0] ?? "";
  let previousPosition = galleryMarkup.indexOf("assets/img/hero-eckartsburg.jpg");

  assert.notEqual(galleryMarkup, "");
  assert.equal(
    countMatches(galleryMarkup, /<figure\b[^>]*class="gallery-feature(?: [^"]*)?"/g),
    14
  );
  assert.equal(countMatches(galleryMarkup, /gallery-feature-achievement/g), 10);

  achievements.forEach(({ year, role, name, filename, position }) => {
    const slidePosition = galleryMarkup.indexOf(`href="erfolge.html#schuetzenkoenig-${year}"`);

    assert.ok(slidePosition > previousPosition, `Galerieslide ${year} steht nicht in Reihenfolge`);
    assert.match(galleryMarkup, new RegExp(`assets/img/achievements/${filename}`));
    assert.match(galleryMarkup, new RegExp(`${role} ${year} · ${name}`));
    assert.match(galleryMarkup, new RegExp(`--gallery-object-position: ${position.replace("%", "%")};`));
    previousPosition = slidePosition;
  });

  const styleCss = readProjectFile(stylePath);
  assert.match(
    styleCss,
    /\.gallery-feature-achievement img\s*\{[^}]*object-position:\s*var\(--gallery-object-position, 50% 50%\);/s
  );
});

test("erweitert die globale Navigation nicht um die Erfolgsseite", () => {
  const html = readProjectFile(achievementsPath);

  ["main-nav", "footer-nav"].forEach((className) => {
    const navigationMarkup = getNavigationMarkup(html, className);

    assert.notEqual(navigationMarkup, "");
    assert.doesNotMatch(navigationMarkup, /erfolge\.html/i);
  });
});

test("verweist ausschließlich auf vorhandene lokale Seiten und Assets", () => {
  const html = readProjectFile(achievementsPath);
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

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const historyPath = path.join(projectRoot, "geschichte.html");
const historyCssPath = path.join(projectRoot, "geschichte.css");
const stylePath = path.join(projectRoot, "style.css");
const indexPath = path.join(projectRoot, "index.html");
const eventPath = path.join(projectRoot, "event.html");
const lightboxScriptPath = path.join(projectRoot, "js", "gallery-lightbox.js");

const historicalMedia = [
  {
    filename: "1902 Eckartsbergaer Schützengesellschaft zum 75-jährigen Jubiläum.jpg",
    width: 1279,
    height: 905,
    hash: "2b909d0dd6061e6c3c01669178f16d2c0e62bee4bb2e16d1e426376a6eea6e3c"
  },
  {
    filename: "1912 Schützenfest Eckartsberga.jpg",
    width: 1206,
    height: 891,
    hash: "d011c15664910e762b722d974f2ae45aeec064ca78ff00e29f3f910ebb3da36f"
  },
  {
    filename: "1922 Schützenfest und 5. Thüringer Verbandsschießen Eckartsberga.jpg",
    width: 1279,
    height: 905,
    hash: "5a0bce6c54aab624bd6cbe54838bef90f3c2aa322838d52d88b6589b00bfa8bf"
  },
  {
    filename: "1927 Heimatblatt Hundertjahrfeier Schützengilde Eckartsberga.jpg",
    width: 852,
    height: 1376,
    hash: "99b878cfd06d6065b79cbfdf2e340c5a67ab0d9dc734d7be90c0cb26eecf0f59"
  },
  {
    filename: "1996 Fahnenweihe und 4. Schützenfest GSG Eckartsberga Zeitungsausschnitt.jpg",
    width: 1279,
    height: 670,
    hash: "997a1ff4e35c57f85ecde4555630cd6acd5ceec3adbc43e635d920faeda7822a"
  }
];

function readProjectFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function normalizeHtmlText(value) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function createSha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function getChronicleStation(html, id) {
  const pattern = new RegExp(
    `<li[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/li>`,
    "i"
  );

  return html.match(pattern)?.[0] ?? "";
}

function getNavigationMarkup(html, className) {
  const pattern = new RegExp(
    `<nav[^>]*class="[^"]*${className}[^"]*"[^>]*>[\\s\\S]*?<\\/nav>`,
    "i"
  );

  return html.match(pattern)?.[0] ?? "";
}

test("stellt die statische Geschichtsseite mit genau einer H1 bereit", () => {
  assert.equal(fs.existsSync(historyPath), true);
  assert.equal(fs.existsSync(historyCssPath), true);

  const historyHtml = readProjectFile(historyPath);

  assert.equal(countMatches(historyHtml, /<h1\b/gi), 1);
  assert.match(historyHtml, /<link rel="stylesheet" href="geschichte\.css" \/>/);
  assert.match(historyHtml, /id="chronicle-title"/);
  assert.match(historyHtml, /id="sources-title"/);
});

test("bewahrt die verbindliche chronologische Reihenfolge", () => {
  const historyHtml = readProjectFile(historyPath);
  const stations = [
    "15. Jahrhundert",
    "datetime=\"1503\"",
    "datetime=\"1618\"",
    "datetime=\"1648\"",
    "datetime=\"1827\"",
    "datetime=\"1902\"",
    "datetime=\"1912\"",
    "datetime=\"1927-07-09\"",
    "datetime=\"1933\"",
    "datetime=\"1945\"",
    "datetime=\"1992-10\"",
    "1990er Jahre",
    "datetime=\"1996\"",
    "Gegenwart"
  ];

  let previousPosition = -1;

  stations.forEach((station) => {
    const position = historyHtml.indexOf(station);

    assert.notEqual(position, -1, `Chronikstation fehlt: ${station}`);
    assert.ok(
      position > previousPosition,
      `Chronikstation steht nicht in Reihenfolge: ${station}`
    );
    previousPosition = position;
  });

  assert.match(historyHtml, /datetime="1992-10-07"/);
  assert.match(historyHtml, /datetime="1992-10-23"/);
  assert.match(historyHtml, /<h3>Der Dreißigjährige Krieg<\/h3>/);
});

test("enthält die festgelegten Chronikstationen für 1902 und 1996", () => {
  const historyHtml = readProjectFile(historyPath);
  const historyText = normalizeHtmlText(historyHtml);

  assert.equal(countMatches(historyHtml, /datetime="1902"/g), 1);
  assert.equal(countMatches(historyHtml, /datetime="1996"/g), 1);
  assert.match(historyHtml, /<h3>75 Jahre Eckartsbergaer Schützengilde<\/h3>/);
  assert.match(historyHtml, /<h3>Fahnenweihe und 4\. Schützenfest<\/h3>/);
  assert.match(
    historyText,
    /75 Jahre nach ihrer Erneuerung von 1827 beging die Eckartsbergaer Schützengilde im Jahr 1902 ihr Jubiläum\. Eine historische Gruppenaufnahme zeigt die Schützengesellschaft aus diesem Anlass und gehört zu den ältesten erhaltenen Bildzeugnissen des Eckartsbergaer Schützenwesens\./
  );
  assert.match(
    historyText,
    /Im Jahr 1996 feierte die GSG Eckartsberga im Rahmen ihres 4\. Schützenfestes die Weihe ihrer neuen Vereinsfahne\. Gemeinsam mit der Fahne des Umpferstedter Schützenvereins wurde sie durch den Wetzlarer Kreisschützenmeister Walter Knorz geweiht\. Vereinsvorsitzender Roland Matthes war zugleich Schützenkönig; Bürgermeister Dr\. Weber übernahm die Schirmherrschaft des Festes\./
  );
});

test("verlinkt ausschließlich die bestehende Geschichtskarte als Einstieg", () => {
  const indexHtml = readProjectFile(indexPath);
  const historyHtml = readProjectFile(historyPath);

  assert.match(
    indexHtml,
    /<a class="history-teaser-card" href="geschichte\.html">/
  );
  assert.match(indexHtml, /Geschichte entdecken/);

  [indexHtml, historyHtml].forEach((html) => {
    const headerNavigation = getNavigationMarkup(html, "main-nav");
    const footerNavigation = getNavigationMarkup(html, "footer-nav");

    assert.doesNotMatch(headerNavigation, /geschichte\.html/i);
    assert.doesNotMatch(footerNavigation, /geschichte\.html/i);
  });
});

test("führt die historischen Quellen öffentlich verständlich auf", () => {
  const historyHtml = readProjectFile(historyPath);

  assert.match(historyHtml, /Historische Quellen und weiterführende Informationen/);
  assert.match(historyHtml, /Sächsische Biografie – Wilhelm III\. von Sachsen/);
  assert.match(historyHtml, /Heimatblatt vom 9\. Juli 1927/);
  assert.match(historyHtml, /Historische Bildaufnahmen von 1912 und 1922/);
  assert.match(historyHtml, /Zeitungsausschnitt zur Fahnenweihe/);
  assert.match(
    historyHtml,
    /Deutscher Schützenbund und Landschaftsverband Westfalen-Lippe/
  );
  assert.match(historyHtml, /Gesetzblatt der DDR/);
  assert.doesNotMatch(historyHtml, /schuetzenverein-eckartsberga\.de\/geschichte/i);
  assert.doesNotMatch(historyHtml, /Vereinsüberlieferung/);
  assert.doesNotMatch(historyHtml, /Prüfsummen/);
  assert.doesNotMatch(historyHtml, /Nutzungslage/);
  assert.doesNotMatch(historyHtml, /\.local-archive/i);
  assert.doesNotMatch(historyHtml, /image\.jimcdn\.com/i);
});

test("erzählt die Chronik ohne öffentliche Arbeits- und Belegstandskommentare", () => {
  const historyHtml = readProjectFile(historyPath);

  assert.doesNotMatch(historyHtml, /Diese Chronik trennt belegte Zusammenhänge/);
  assert.doesNotMatch(historyHtml, /bisherige Vereinschronik/);
  assert.doesNotMatch(historyHtml, /belastbarer Beleg/);
  assert.doesNotMatch(historyHtml, /bislang nicht/);
  assert.doesNotMatch(historyHtml, /offene lokale Fragen/);
});

test("versieht alle öffentlichen Bilder der Geschichtsseite mit Abmessungen und Alt-Text", () => {
  const historyHtml = readProjectFile(historyPath);
  const imageTags = (historyHtml.match(/<img\b[\s\S]*?>/gi) ?? []).filter(
    (imageTag) => !/id="event-lightbox-image"/i.test(imageTag)
  );

  assert.ok(imageTags.length > 0);
  imageTags.forEach((imageTag) => {
    assert.match(imageTag, /\balt="[^"]*"/i);
    assert.match(imageTag, /\bwidth="\d+"/i);
    assert.match(imageTag, /\bheight="\d+"/i);
  });
});

test("ordnet fünf freigegebene historische Medien den richtigen Chronikstationen zu", () => {
  const historyHtml = readProjectFile(historyPath);
  const station1902 = getChronicleStation(historyHtml, "chronik-1902");
  const station1912 = getChronicleStation(historyHtml, "chronik-1912-1922");

  assert.notEqual(station1902, "");
  assert.notEqual(station1912, "");
  assert.equal(countMatches(historyHtml, /data-gallery-index="[0-4]"/g), 5);
  assert.equal(countMatches(station1902, /assets\/img\/history\//g), 1);
  assert.equal(countMatches(station1912, /assets\/img\/history\//g), 2);

  assert.match(
    normalizeHtmlText(station1902),
    /Eckartsbergaer Schützengesellschaft zum 75-jährigen Jubiläum, 1902\./
  );
  assert.match(
    normalizeHtmlText(station1912),
    /Schützenfest in Eckartsberga, 1912\./
  );
  assert.match(
    normalizeHtmlText(station1912),
    /5\. Thüringer Verbandsschießen in Eckartsberga, Schützenfest 1922\./
  );
  assert.match(
    normalizeHtmlText(historyHtml),
    /Heimatblatt zur Hundertjahrfeier der Eckartsbergaer Schützengilde, Juni 1927\./
  );
  assert.match(
    normalizeHtmlText(historyHtml),
    /Zeitungsausschnitt zur Fahnenweihe und zum 4\. Schützenfest der GSG Eckartsberga, 1996\./
  );
});

test("liefert die historischen Medien mit den geprüften Maßen und Hashes aus", () => {
  const historyHtml = readProjectFile(historyPath);

  historicalMedia.forEach(({ filename, width, height, hash }) => {
    const assetPath = path.join(projectRoot, "assets", "img", "history", filename);

    assert.equal(fs.existsSync(assetPath), true, `Historisches Medium fehlt: ${filename}`);
    assert.equal(createSha256(assetPath), hash, `Prüfsumme weicht ab: ${filename}`);
    assert.match(historyHtml, new RegExp(`src="assets/img/history/${filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(
      historyHtml,
      new RegExp(`width="${width}"[\\s\\S]*?height="${height}"`)
    );
  });
});

test("ergänzt genau drei historische Fotografien in der Startseitengalerie", () => {
  const indexHtml = readProjectFile(indexPath);
  const galleryMarkup = indexHtml.match(
    /<section id="galerie"[\s\S]*?<\/section>/i
  )?.[0] ?? "";

  assert.notEqual(galleryMarkup, "");
  assert.equal(countMatches(galleryMarkup, /gallery-feature-history/g), 3);
  assert.match(galleryMarkup, /geschichte\.html#chronik-1902/);
  assert.equal(
    countMatches(galleryMarkup, /geschichte\.html#chronik-1912-1922/g),
    2
  );
  assert.doesNotMatch(galleryMarkup, /1927 Heimatblatt/);
  assert.doesNotMatch(galleryMarkup, /1996 Fahnenweihe/);
});

test("verwendet für historische Startseitenbilder das bestehende Galerieverhalten", () => {
  const styleCss = readProjectFile(stylePath);

  assert.match(
    styleCss,
    /\.gallery-feature img\s*\{[^}]*object-fit:\s*cover;[^}]*transform:\s*scale\(1\.03\);[^}]*\}/
  );
  assert.match(
    styleCss,
    /\.gallery-feature\.is-active img\s*\{[^}]*animation:\s*galleryImageZoom 6\.5s ease-in-out forwards;[^}]*\}/
  );
  assert.doesNotMatch(styleCss, /\.gallery-feature-history/);
  assert.match(
    styleCss,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.gallery-feature\.is-active img\s*\{[^}]*animation:\s*none;[^}]*transform:\s*scale\(1\.03\);[^}]*\}/
  );
});

test("verwendet auf Event- und Geschichtsseite dieselbe Lightbox-Steuerung", () => {
  const historyHtml = readProjectFile(historyPath);
  const eventHtml = readProjectFile(eventPath);
  const lightboxScript = readProjectFile(lightboxScriptPath);

  assert.equal(countMatches(historyHtml, /<dialog\b/gi), 1);
  assert.equal(countMatches(eventHtml, /id="event-lightbox"/gi), 1);
  [historyHtml, eventHtml].forEach((html) => {
    assert.match(html, /js\/gallery-lightbox\.js/);
  });

  assert.match(historyHtml, /data-gallery-lightbox/);
  assert.match(lightboxScript, /\[data-gallery-lightbox\]/);
  assert.match(lightboxScript, /ArrowLeft/);
  assert.match(lightboxScript, /ArrowRight/);
  assert.match(lightboxScript, /pointerStartedOnBackdrop/);
  assert.match(lightboxScript, /focus\(\{ preventScroll: true \}\)/);
});

test("entfernt problematische Kontinuitätsbehauptungen von der Startseite", () => {
  const indexHtml = readProjectFile(indexPath);

  assert.doesNotMatch(indexHtml, /Seit über 500 Jahren/);
  assert.doesNotMatch(indexHtml, /über 500-jährigen Tradition/);
  assert.doesNotMatch(indexHtml, /Vom Mittelalter bis heute/);
  assert.doesNotMatch(indexHtml, /Tradition seit 1503/);
  assert.match(indexHtml, /Gründung des heutigen Vereins 1992/);
});

test("schließt das lokale Migrationsarchiv zuverlässig von Git aus", () => {
  const gitignore = readProjectFile(path.join(projectRoot, ".gitignore"));

  assert.match(gitignore, /^\.local-archive\/$/m);
});

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const privacyPath = path.join(projectRoot, "datenschutz.html");
const privacyCssPath = path.join(projectRoot, "datenschutz.css");
const pageFiles = [
  "index.html",
  "event.html",
  "geschichte.html",
  "erfolge.html",
  "vorstand.html",
  "schiessbahnen.html",
  "gaestebuch.html",
  "service.html",
  "impressum.html",
  "datenschutz.html"
];

function readProjectFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function getNavigationMarkup(html, className) {
  const pattern = new RegExp(
    `<nav[^>]*class="[^"]*${className}[^"]*"[^>]*>[\\s\\S]*?<\\/nav>`,
    "i"
  );

  return html.match(pattern)?.[0] ?? "";
}

test("stellt die Datenschutzseite im vorhandenen Detailseitenrahmen bereit", () => {
  assert.equal(fs.existsSync(privacyPath), true);
  assert.equal(fs.existsSync(privacyCssPath), true);

  const html = readProjectFile(privacyPath);

  assert.equal(countMatches(html, /<h1\b/gi), 1);
  assert.match(html, /<body class="history-page privacy-page">/);
  assert.match(html, /class="site-header history-site-header"/);
  assert.match(html, /class="history-hero"/);
  assert.match(html, /class="event-back-link" href="index\.html#start"/);
  assert.match(html, /<link rel="stylesheet" href="datenschutz\.css" \/>/);
  assert.match(html, /<script src="js\/navigation\.js" defer><\/script>/);
  assert.match(html, /<script src="js\/main\.js" defer><\/script>/);

  const mainNavigation = getNavigationMarkup(html, "main-nav");
  assert.doesNotMatch(mainNavigation, /Datenschutz|datenschutz\.html/);
});

test("nennt die verbindlichen Verantwortlichen- und Registerangaben", () => {
  const html = readProjectFile(privacyPath);

  assert.match(html, /Großkaliber Schützengilde Eckartsberga e\. V\./);
  assert.match(html, /Tromsdorfer Straße 13/);
  assert.match(html, /06647 An der Poststraße OT Herrengosserstedt/);
  assert.match(html, /Amtsgericht Stendal, VR 45185/);
  assert.match(
    html,
    /Jeweils zwei Vorstandsmitglieder vertreten den Verein gemeinsam\./
  );
  assert.equal(
    countMatches(html, /\[VEREINS-E-MAIL VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g),
    1
  );
  assert.doesNotMatch(html, /WhatsApp/i);
});

test("trennt GitHub-Pages-Hosting und STRATO-Domainverwaltung", () => {
  const html = readProjectFile(privacyPath);

  assert.match(html, /Die Website wird über GitHub Pages ausgeliefert\./);
  assert.match(html, /IP-Adresse von Besuchern zu Sicherheitszwecken/);
  assert.match(html, /Art\. 6 Abs\. 1\s+Buchst\. f DSGVO/);
  assert.match(html, /STRATO verwaltet die Domain und die zugehörigen DNS-Einstellungen/);
  assert.match(html, /nicht von einem\s+STRATO-Webspace ausgeliefert/);
  assert.doesNotMatch(html, /keine personenbezogenen Daten gespeichert/i);
});

test("beschreibt Formspree und counter.dev für den Veröffentlichungszustand", () => {
  const html = readProjectFile(privacyPath);

  assert.match(html, /Kontaktformular und die Gästebuchübermittlung nutzt diese\s+Website Formspree/);
  assert.match(html, /führt niemals automatisch zu einer\s+Veröffentlichung/);
  assert.match(html, /manuelle\s+Aufnahme in den öffentlichen Gästebuchbestand/);
  assert.match(html, /setzt diese Website counter\.dev ein/);
  assert.match(html, /keine\s+Cookies und kein\s+IP-Adress-Fingerprinting/);
  assert.match(html, /<code>sessionStorage<\/code>/);
  assert.match(html, /Browser-Cache und\s+den Referrer/);
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /formspree\.io\/f\//i);
});

test("beschreibt die Herkunft veröffentlichter Gästebuch-Altbestände zurückhaltend", () => {
  const html = readProjectFile(privacyPath);
  const guestbookSection = html.match(
    /<section class="privacy-section" aria-labelledby="privacy-guestbook-title">([\s\S]*?)<\/section>/
  )?.[1] ?? "";

  assert.match(guestbookSection, /Anzeigename, Eintragsdatum und Text öffentlich/);
  assert.match(guestbookSection, /aus dem bisherigen\s+öffentlichen Vereinsgästebuch/);
  assert.match(guestbookSection, /waren dort bereits\s+öffentlich sichtbar/);
  assert.doesNotMatch(guestbookSection, /Einwilligung|Art\. 6/i);
});

test("enthält keine öffentlichen Entwicklungs- und Prüfvermerke", () => {
  const html = readProjectFile(privacyPath);
  const visibleText = html
    .replace(/\[VEREINS-E-MAIL VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g, "")
    .replace(/\[STAND VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  assert.doesNotMatch(
    visibleText,
    /\bgeplant\b|noch nicht|Produktionszustand|vor Aktivierung|vor Veröffentlichung|nach der tatsächlichen Einbindung/i
  );
  assert.doesNotMatch(html, /class="privacy-status-note"/);
});

test("sichert E-Mail und Stand als eindeutige Pre-Publish-Platzhalter ab", () => {
  const html = readProjectFile(privacyPath);

  assert.equal(
    countMatches(html, /\[VEREINS-E-MAIL VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g),
    1
  );
  assert.equal(
    countMatches(html, /\[STAND VOR VERÖFFENTLICHUNG ERGÄNZEN\]/g),
    1
  );
  assert.doesNotMatch(html, /9\. September 2026/);
});

test("bildet den tatsächlich implementierten OSM-Ablauf ab", () => {
  const html = readProjectFile(privacyPath);

  assert.match(html, /Leaflet 1\.9\.4 wird vollständig von dieser\s+Website ausgeliefert/);
  assert.match(html, /Beim normalen Seitenaufruf entsteht dadurch\s+keine Verbindung zu OpenStreetMap/);
  assert.match(html, /Karte anzeigen – lädt\s+OpenStreetMap/);
  assert.match(html, /https:\/\/tile\.openstreetmap\.org\//);
  assert.match(html, /IP-Adresse, Zeitpunkt, Browser- und\s+Geräteinformationen/);
  assert.match(html, /keine eigenen\s+Cookies und verwendet keinen eigenen Browser-Speicher/);
  assert.match(html, /OpenStreetMap-Attribution/);
});

test("nennt Betroffenenrechte mit ihren gesetzlichen Voraussetzungen", () => {
  const html = readProjectFile(privacyPath);

  [
    "Auskunft",
    "Berichtigung",
    "Löschung",
    "Einschränkung der Verarbeitung",
    "Widerspruch",
    "Datenübertragbarkeit",
    "Art. 77 DSGVO"
  ].forEach((right) => assert.match(html, new RegExp(right)));

  assert.match(html, /Soweit die jeweiligen gesetzlichen Voraussetzungen erfüllt sind/);
  assert.match(
    html,
    /href="https:\/\/datenschutz\.sachsen-anhalt\.de\/service\/online-formulare\/beschwerde"/
  );
});

test("erzeugt auf der Datenschutzseite keine automatischen Drittanfragen", () => {
  const html = readProjectFile(privacyPath);
  const automaticTargets = [
    ...html.matchAll(/<(?:script|img)[^>]+\bsrc="([^"]+)"/gi),
    ...html.matchAll(/<source[^>]+\bsrcset="([^"]+)"/gi),
    ...html.matchAll(/<link[^>]+\bhref="([^"]+)"/gi)
  ].map((match) => match[1]);

  assert.ok(automaticTargets.length > 0);
  automaticTargets.forEach((target) => {
    assert.doesNotMatch(target, /^(?:https?:)?\/\//i);
  });

  assert.doesNotMatch(
    html,
    /Google Analytics|Google Tag Manager|Google reCAPTCHA|Jimdo Creator Statistics|Google Fonts/i
  );
});

test("verlinkt die Datenschutzseite in allen Footern und nur dort", () => {
  pageFiles.forEach((pageFile) => {
    const html = readProjectFile(path.join(projectRoot, pageFile));
    const footerNavigation = getNavigationMarkup(html, "footer-nav");
    const mainNavigation = getNavigationMarkup(html, "main-nav");

    assert.match(
      footerNavigation,
      /href="datenschutz\.html"(?: aria-current="page")?>Datenschutz<\/a>/,
      `${pageFile}: Datenschutzlink fehlt im Footer`
    );
    assert.doesNotMatch(
      mainNavigation,
      /Datenschutz|datenschutz\.html/,
      `${pageFile}: Datenschutz wurde der Hauptnavigation hinzugefügt`
    );
  });

  assert.match(
    readProjectFile(privacyPath),
    /href="datenschutz\.html" aria-current="page">Datenschutz<\/a>/
  );
});

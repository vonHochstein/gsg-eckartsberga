"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const core = require("../js/calendar-core.js");
const ROOT = path.resolve(__dirname, "..");
const SOURCES = ["js/data/events.js", "js/data/venues.js", "js/calendar-core.js",
  "scripts/generate-calendar.js", ".github/workflows/pages.yml"];
const MARKER = "gsg-eckartsberga-calendar-v1\n";
const SEQUENCE_BASE = 61;

function sourceData(root) {
  const context = vm.createContext({ URL });
  for (const file of ["js/data/venues.js", "js/data/events.js", "js/event-utils.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  }
  return { events: vm.runInContext("productionEvents", context),
    venues: vm.runInContext("eventVenues", context), utils: context.EventUtils };
}
function gitMetadata(root) {
  const git = args => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  return {
    updatedAt: new Date(Number(git(["log", "-1", "--format=%ct", "--", ...SOURCES])) * 1000).toISOString(),
    sequence: SEQUENCE_BASE + Number(git(["rev-list", "--count", "HEAD", "--", ...SOURCES]))
  };
}
function generateCalendar(options = {}) {
  const root = options.root || ROOT;
  const output = path.resolve(options.output || path.join(root, "calendar"));
  if (output === root || output === path.dirname(root) || path.basename(output) !== "calendar") {
    throw new Error("Kalenderausgabe muss ein eigener Ordner namens calendar sein.");
  }
  if (fs.existsSync(output) && (!fs.existsSync(path.join(output, ".generated-calendar")) ||
      fs.readFileSync(path.join(output, ".generated-calendar"), "utf8") !== MARKER)) {
    throw new Error("Vorhandener Ordner ist keine eigene generierte Kalenderausgabe.");
  }
  const base = new URL(options.baseUrl || "https://vonhochstein.github.io/gsg-eckartsberga/");
  if (!/^https?:$/.test(base.protocol) || base.search || base.hash || !base.pathname.endsWith("/")) {
    throw new Error("Kalender-Basisadresse muss eine HTTP(S)-Adresse mit abschließendem / sein.");
  }
  const now = options.now ? new Date(options.now) : new Date();
  const metadata = options.metadata || gitMetadata(root);
  if (!Number.isInteger(metadata.sequence) || metadata.sequence < 0 || metadata.sequence > 2147483647 ||
      !Number.isFinite(new Date(metadata.updatedAt).getTime())) throw new Error("Ungültige Kalender-Versionsdaten.");
  const data = options.data || sourceData(root);
  const normalized = data.events.map(event => core.normalize(event, data.venues, data.utils, base)).filter(Boolean);
  if (new Set(normalized.map(e => e.slug)).size !== normalized.length ||
      new Set(normalized.map(e => e.id)).size !== normalized.length) throw new Error("Doppelte Kalender-IDs/Slugs.");
  const active = normalized.filter(event => core.availability(event, now).enabled)
    .sort((a, b) => a.start.localeCompare(b.start) || a.id - b.id);
  const feedUrl = new URL("calendar/veranstaltungen.ics", base).href;
  const manifest = { version: 1, generatedAt: now.toISOString(),
    subscription: { path: "calendar/veranstaltungen.ics", urls: core.subscriptionLinks(feedUrl) }, events: {} };
  for (const event of normalized) {
    const eligible = core.availability(event, now).enabled;
    const file = `calendar/events/${event.slug}.ics`;
    manifest.events[event.slug] = { title: event.title, lastDay: event.lastDay, status: event.status,
      path: eligible ? file : null,
      urls: eligible ? core.providerLinks(event, new URL(file, base).href) : null };
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const stage = fs.mkdtempSync(path.join(path.dirname(output), ".gsg-calendar-tmp-"));
  try {
    fs.mkdirSync(path.join(stage, "events"));
    fs.writeFileSync(path.join(stage, ".generated-calendar"), MARKER);
    fs.writeFileSync(path.join(stage, "veranstaltungen.ics"), core.createIcs(active, metadata));
    fs.writeFileSync(path.join(stage, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    for (const event of active) fs.writeFileSync(path.join(stage, "events", `${event.slug}.ics`), core.createIcs([event], metadata));
    // Swap only an identified generated directory; keep the previous output recoverable.
    const previous = stage + "-previous";
    if (fs.existsSync(output)) fs.renameSync(output, previous);
    try { fs.renameSync(stage, output); }
    catch (error) {
      if (fs.existsSync(previous)) fs.renameSync(previous, output);
      throw error;
    }
    if (fs.existsSync(previous)) fs.rmSync(previous, { recursive: true });
  } finally {
    if (fs.existsSync(stage)) fs.rmSync(stage, { recursive: true });
  }
  return { manifest, count: active.length };
}
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = { "--output": "output", "--base-url": "baseUrl", "--now": "now" }[args[i]];
    if (!key || !args[i + 1]) throw new Error("Unbekanntes/unvollständiges Generatorargument.");
    options[key] = args[i + 1];
  }
  const result = generateCalendar(options);
  console.log(`Kalender erzeugt: ${result.count} heutige/laufende/künftige Termine.`);
}
module.exports = { generateCalendar, sourceData, gitMetadata };

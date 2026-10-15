"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = ".github/public-files.json";
const CONTROL_FILES = new Set([
  ".gitignore", MANIFEST, ".github/workflows/pages.yml",
  "scripts/generate-calendar.js", "scripts/check-public-files.js"
]);

function isPublicPath(file) {
  if (typeof file !== "string" || /[\\\x00-\x1f\x7f]/.test(file) ||
      file.split("/").some(part => !part || part === "." || part === "..")) return false;
  if (CONTROL_FILES.has(file)) return true;
  if (/^[a-z][a-z0-9-]*\.(?:html|css)$/.test(file)) return true;
  if (/^js\/[a-z][a-z0-9-]*\.js$/.test(file)) return true;
  if (/^js\/data\/(?:events|venues|guestbook-entries)\.js$/.test(file)) return true;
  if (/^assets\/(?:img|video|documents)\/.+\.(?:png|jpe?g|webp|ico|mp4|pdf|ods)$/i.test(file)) return true;
  return /^assets\/vendor\/leaflet\/(?:LICENSE|leaflet\.(?:css|js)|images\/[a-z0-9-]+\.png)$/.test(file);
}

function checkFileSet(manifest, entries) {
  if (!Array.isArray(manifest) || new Set(manifest).size !== manifest.length ||
      !manifest.length || manifest.some(file => !isPublicPath(file))) {
    throw new Error("Ungültige Freigabeliste für öffentliche Dateien.");
  }
  const approved = new Set(manifest);
  const found = new Set();
  for (const { file, mode, stage = "0" } of entries) {
    if (!approved.has(file) || !isPublicPath(file)) throw new Error("Nicht öffentlich freigegeben: " + file);
    if (!["100644", "100755"].includes(mode) || stage !== "0") {
      throw new Error("Keine reguläre, konfliktfreie Datei: " + file);
    }
    found.add(file);
  }
  for (const file of approved) {
    if (!found.has(file)) throw new Error("Freigegebene Datei fehlt: " + file);
  }
}

function checkRepository(args = [], root = ROOT) {
  const git = values => execFileSync("git", values, { cwd: root, encoding: "utf8" });
  const [option = "--staged", ref] = args;
  if (args.length > 2 || !["--staged", "--tree", "--history"].includes(option) ||
      (option !== "--staged" && !ref) || (option === "--staged" && ref)) {
    throw new Error("Aufruf: check-public-files.js --staged | --tree REV | --history REV");
  }
  const revisions = option === "--history"
    ? git(["rev-list", git(["rev-parse", "--verify", ref + "^{commit}"]).trim()]).trim().split("\n")
    : [option === "--staged" ? null : git(["rev-parse", "--verify", ref + "^{commit}"]).trim()];
  for (const revision of revisions) {
    const manifest = JSON.parse(git(["show", revision ? revision + ":" + MANIFEST : ":" + MANIFEST]));
    const entries = git(revision ? ["ls-tree", "-r", "-z", revision] : ["ls-files", "--stage", "-z"])
      .split("\0").filter(Boolean).map(record => {
        const [info, file] = record.split("\t");
        const fields = info.split(" ");
        return { file, mode: fields[0], stage: revision ? "0" : fields[2] };
      });
    checkFileSet(manifest, entries);
  }
  return revisions.length;
}

if (require.main === module) {
  try {
    const count = checkRepository(process.argv.slice(2));
    console.log(`Öffentliche Dateiauswahl geprüft (${count} Stand/Versionen).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { isPublicPath, checkFileSet, checkRepository };

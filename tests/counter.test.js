"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("bindet den bestätigten counter.dev-Code einmal und nicht blockierend auf allen Seiten ein", () => {
  const root = path.resolve(__dirname, "..");
  const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
  assert.equal(pages.length, 12);
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    const scripts = [...html.matchAll(/<script\b[^>]*src="https:\/\/cdn\.counter\.dev\/script\.js"[^>]*><\/script>/g)];
    assert.equal(scripts.length, 1, page);
    assert.match(scripts[0][0], /data-id="33748b93-9a1c-423e-9dba-7e4c8ef61057"/);
    assert.match(scripts[0][0], /data-utcoffset="2"/);
    assert.match(scripts[0][0], /\sasync\b/);
    assert.ok(html.indexOf(scripts[0][0]) < html.indexOf("</head>"), page);
  }
});

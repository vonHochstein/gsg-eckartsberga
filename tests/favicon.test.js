"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

test("bindet lokale ICO-, PNG- und Apple-Icons einheitlich unter dem Projektpfad ein", () => {
  for (const file of fs.readdirSync(root).filter(name => name.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    for (const [rel, sizes, asset] of [
      ["icon", "16x16 32x32 48x48", "favicon-gsg.ico"],
      ["icon", "32x32", "favicon-gsg-32.png"],
      ["apple-touch-icon", "180x180", "apple-touch-icon-gsg.png"]
    ]) {
      const link = `<link rel="${rel}"[^>]*sizes="${sizes}"[^>]*href="assets/img/icons/${asset}"`;
      assert.match(html, new RegExp(link), file);
      assert.ok(fs.existsSync(path.join(root, "assets/img/icons", asset)), asset);
    }
  }
});

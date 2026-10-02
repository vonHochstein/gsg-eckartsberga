const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const projectRoot = path.resolve(__dirname, "..");
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

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function sha256(relativePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(projectRoot, relativePath)))
    .digest("hex");
}

function getFooter(html) {
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
  assert.ok(footer, "Footer fehlt");
  return footer[0];
}

test("liefert die freigegebenen Verbandslogo-Assets unverändert aus", () => {
  assert.equal(
    sha256("assets/img/logo-deutscher-schuetzenbund.png"),
    "f6dc6940d13ed57478c7af0cdb54474a7c2c5aae664bc1a6cf8681fd839239be"
  );
  assert.equal(
    sha256("assets/img/logo-landesschuetzenverband-sachsen-anhalt.png"),
    "c9dadabaaabeded322ccbe3382281fcce17cf7832e324254b4956b0777ee629f"
  );
});

test("ordnet DSB, GSG und Landesverband in jedem Footer konsistent an", () => {
  pageFiles.forEach((pageFile) => {
    const footer = getFooter(readProjectFile(pageFile));
    const dsbIndex = footer.indexOf("logo-deutscher-schuetzenbund.png");
    const gsgIndex = footer.indexOf("logo-eckig_v1.png");
    const stateIndex = footer.indexOf(
      "logo-landesschuetzenverband-sachsen-anhalt.png"
    );

    assert.ok(dsbIndex >= 0, `${pageFile}: DSB-Logo fehlt`);
    assert.ok(gsgIndex > dsbIndex, `${pageFile}: GSG-Logo steht nicht mittig`);
    assert.ok(
      stateIndex > gsgIndex,
      `${pageFile}: Landesverbandslogo steht nicht rechts`
    );
    assert.equal(
      [...footer.matchAll(/logo-deutscher-schuetzenbund\.png/g)].length,
      1,
      `${pageFile}: DSB-Logo ist nicht eindeutig`
    );
    assert.equal(
      [
        ...footer.matchAll(
          /logo-landesschuetzenverband-sachsen-anhalt\.png/g
        )
      ].length,
      1,
      `${pageFile}: Landesverbandslogo ist nicht eindeutig`
    );
  });
});

test("verwendet die verbindlichen externen Linkziele und zugängliche Bilddaten", () => {
  pageFiles.forEach((pageFile) => {
    const footer = getFooter(readProjectFile(pageFile));

    assert.match(
      footer,
      /href="https:\/\/www\.dsb\.de\/"[\s\S]*?rel="external"[\s\S]*?aria-label="Offizielle Website des Deutschen Schützenbundes"[\s\S]*?<img[\s\S]*?alt="Logo des Deutschen Schützenbundes"[\s\S]*?width="1013"[\s\S]*?height="720"/
    );
    assert.match(
      footer,
      /href="https:\/\/www\.sv-st\.de\/"[\s\S]*?rel="external"[\s\S]*?aria-label="Offizielle Website des Landesschützenverbandes Sachsen-Anhalt"[\s\S]*?<img[\s\S]*?alt="Wappen des Landesschützenverbandes Sachsen-Anhalt"[\s\S]*?width="550"[\s\S]*?height="600"/
    );
    assert.match(footer, /srcset="assets\/img\/logo-eckig_v1\.webp"/);
    assert.match(footer, /src="assets\/img\/logo-eckig_v1\.png"/);
  });
});

test("hält die drei Footerlogos responsiv in einer gemeinsamen Zeile", () => {
  const css = readProjectFile("style.css");

  assert.match(
    css,
    /\.footer-signature\s*{[^}]*display:\s*grid;[^}]*grid-template-columns:[^}]*clamp\(82px, 9vw, 132px\)[^}]*clamp\(124px, 14vw, 200px\)[^}]*clamp\(60px, 7vw, 104px\);/s
  );
  assert.match(
    css,
    /\.footer-association-link\s*{[^}]*min-width:\s*44px;[^}]*min-height:\s*70px;/s
  );
  assert.match(
    css,
    /\.footer-association-link-dsb img\s*{[^}]*max-width:\s*132px;/s
  );
  assert.match(
    css,
    /\.footer-association-link-state img\s*{[^}]*height:\s*clamp\(70px, 7\.65vw, 110px\);/s
  );
  assert.match(
    css,
    /\.footer-brand-illustration\s*{[^}]*width:\s*100%;[^}]*margin:\s*0;/s
  );
});

test("ordnet Logozeile, Navigation und Schlusszeile in jedem Footer verbindlich an", () => {
  pageFiles.forEach((pageFile) => {
    const footer = getFooter(readProjectFile(pageFile));
    const logoRowIndex = footer.indexOf('class="footer-signature"');
    const navigationIndex = footer.indexOf('class="footer-nav"');
    const legalIndex = footer.indexOf('class="footer-legal"');

    assert.ok(logoRowIndex >= 0, `${pageFile}: Logozeile fehlt`);
    assert.ok(
      navigationIndex > logoRowIndex,
      `${pageFile}: Navigation steht nicht nach der Logozeile`
    );
    assert.ok(
      legalIndex > navigationIndex,
      `${pageFile}: Schlusszeile steht nicht nach der Navigation`
    );
    assert.doesNotMatch(footer, /class="footer-(?:identity|brand|copy)"/);
    assert.match(
      footer,
      /©\s*<span id="current-year">2026<\/span>\s*Großkaliber Schützengilde Eckartsberga e\. V\. - Tradition\. Sport\. Gemeinschaft\./
    );
  });
});

test("trennt die Footerlinks ohne eingetippte oder isolierte Separatoren", () => {
  const css = readProjectFile("style.css");

  assert.match(
    css,
    /\.footer-nav\s*{[^}]*grid-template-columns:\s*repeat\(9, max-content\);/s
  );
  assert.match(
    css,
    /\.footer-nav a \+ a\s*{[^}]*border-left:\s*1px solid rgba\(214, 168, 79, 0\.3\);/s
  );
  assert.match(
    css,
    /@media \(max-width: 820px\)[\s\S]*?\.footer-nav\s*{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/s
  );
  assert.match(
    css,
    /\.footer-nav a:nth-child\(even\)\s*{[^}]*border-left:\s*1px solid rgba\(214, 168, 79, 0\.3\);/s
  );
  assert.match(
    css,
    /\.footer-nav a:last-child:nth-child\(odd\)\s*{[^}]*grid-column:\s*1 \/ -1;[^}]*border-left:\s*0;/s
  );

  pageFiles.forEach((pageFile) => {
    const footer = getFooter(readProjectFile(pageFile));
    assert.doesNotMatch(footer, /<\/a>\s*\|\s*<a/);
    assert.match(footer, /href="datenschutz\.html"/);
  });
});

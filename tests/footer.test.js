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
  "gaestebuch.html"
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

test("liefert die beiden Verbandslogos unverändert aus", () => {
  assert.equal(
    sha256("assets/img/logo-deutscher-schuetzenbund.png"),
    "28a3d0cf9ea2afaf98b8bc21b2f1e40ef14683f8fec3bc94d8e81fce4069de16"
  );
  assert.equal(
    sha256("assets/img/logo-landesschuetzenverband-sachsen-anhalt.png"),
    "fadecb8a6a807cd195143fedc5984488daa25b8b6296664bd5f027cb31d9616f"
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
      /href="https:\/\/www\.dsb\.de\/"[\s\S]*?rel="external"[\s\S]*?aria-label="Offizielle Website des Deutschen Schützenbundes"[\s\S]*?<img[\s\S]*?alt="Logo des Deutschen Schützenbundes"[\s\S]*?width="240"[\s\S]*?height="150"/
    );
    assert.match(
      footer,
      /href="https:\/\/www\.sv-st\.de\/"[\s\S]*?rel="external"[\s\S]*?aria-label="Offizielle Website des Landesschützenverbandes Sachsen-Anhalt"[\s\S]*?<img[\s\S]*?alt="Wappen des Landesschützenverbandes Sachsen-Anhalt"[\s\S]*?width="2500"[\s\S]*?height="4648"/
    );
    assert.match(footer, /srcset="assets\/img\/logo-eckig_v1\.webp"/);
    assert.match(footer, /src="assets\/img\/logo-eckig_v1\.png"/);
  });
});

test("hält die drei Footerlogos responsiv in einer gemeinsamen Zeile", () => {
  const css = readProjectFile("style.css");

  assert.match(
    css,
    /\.footer-signature\s*{[^}]*display:\s*grid;[^}]*grid-template-columns:[^}]*clamp\(60px, 7vw, 104px\)[^}]*clamp\(124px, 14vw, 200px\)[^}]*clamp\(60px, 7vw, 104px\);/s
  );
  assert.match(
    css,
    /\.footer-association-link\s*{[^}]*min-width:\s*44px;[^}]*min-height:\s*70px;/s
  );
  assert.match(
    css,
    /\.footer-association-link-dsb img\s*{[^}]*max-width:\s*104px;/s
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

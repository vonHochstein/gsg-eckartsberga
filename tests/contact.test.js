"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js/contact.js"), "utf8");

function fixture(fetch) {
  function field(value = "") {
    return {
      value, checked: false, required: false, validityMessage: "",
      listeners: {}, attrs: {}, hidden: true, textContent: "", dataset: {},
      addEventListener(name, handler) { this.listeners[name] = handler; },
      setCustomValidity(text) { this.validityMessage = text; },
      setAttribute(name, value) { this.attrs[name] = value; },
      focus() { this.focused = true; }
    };
  }
  const fields = {
    name: field(" Test "),
    email: field("test@example.com"),
    phone: field(),
    message: field(" Nachricht "),
    whatsapp_reply: field(),
    _gotcha: field(),
    _language: field("de")
  };
  const button = field();
  button.textContent = "Nachricht senden";
  const phoneError = field();
  const status = field();
  const form = {
    action: "https://formspree.io/f/test-endpoint",
    attrs: {}, listeners: {}, resets: 0,
    elements: { namedItem: (name) => fields[name] },
    querySelector: (selector) => selector.includes("button") ? button : phoneError,
    addEventListener(name, handler) { this.listeners[name] = handler; },
    setAttribute(name, value) { this.attrs[name] = value; },
    reportValidity() {
      return Object.values(fields).every(f => !f.validityMessage && (!f.required || f.value));
    },
    reset() {
      this.resets++;
      Object.values(fields).forEach(f => { f.value = ""; f.checked = false; });
    }
  };
  class TestFormData extends Map {
    constructor() {
      super(Object.entries(fields).map(([name, field]) => [name, field.value]));
    }
  }
  const context = vm.createContext({ fetch, FormData: TestFormData, AbortController, setTimeout, clearTimeout });
  vm.runInContext(source, context);
  context.initContactForm(form, status);
  return { fields, form, button, status, phoneError, submit: () => form.listeners.submit({ preventDefault() {} }) };
}

test("bietet den lokalen Kontaktaufbau mit einem einzigen Formspree-Endpoint an", () => {
  const html = fs.readFileSync(path.join(root, "kontakt.html"), "utf8");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1>Kontakt<\/h1>/);
  assert.equal((html.match(/https:\/\/formspree.io\/f\/xrpeelwr/g) || []).length, 1);
  assert.match(html, /method="post"/);
  assert.match(html, /name="email"[^>]*required/);
  assert.match(html, /name="message"[^>]*required/);
  assert.match(html, /name="phone"\s+type="tel"/);
  assert.doesNotMatch(html.match(/<input[^>]+name="phone"[\s\S]*?\/>/)[0], /required/);
  assert.doesNotMatch(html.match(/<input[^>]+name="whatsapp_reply"[^>]+>/)[0], /checked/);
  assert.match(html, /name="_gotcha" tabindex="-1"/);
  assert.match(html, /role="status"[\s\S]*?aria-live="polite"/);
  for (const match of html.matchAll(/<(?:script|img)[^>]+src="([^"]+)"/g)) {
    assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
    assert.doesNotMatch(match[1], /^https?:/);
  }
});

test("verhindert WhatsApp-Versand ohne Nummer und lässt die Nummer sonst freiwillig", async () => {
  let calls = 0;
  const f = fixture(async () => { calls++; return { ok: true, json: async () => ({ ok: true }) }; });
  assert.equal(f.fields.phone.required, false);
  f.fields.whatsapp_reply.checked = true;
  f.fields.whatsapp_reply.listeners.change();
  assert.equal(f.fields.phone.required, true);
  assert.equal(f.phoneError.hidden, false);
  await f.submit();
  assert.equal(calls, 0);
  f.fields.whatsapp_reply.checked = false;
  f.fields.whatsapp_reply.listeners.change();
  assert.equal(f.fields.phone.required, false);
  assert.equal(f.phoneError.hidden, true);
  await f.submit();
  assert.equal(calls, 1);
});

test("lehnt eine ausschließlich leere Nachricht ohne externe Anfrage ab", async () => {
  let calls = 0;
  const f = fixture(async () => { calls++; });
  f.fields.message.value = "  ";
  await f.submit();
  assert.equal(calls, 0);
  assert.match(f.fields.message.validityMessage, /Nachricht/);
});

test("sendet Nummer und Antwortwunsch einmalig und leert erst nach bestätigtem Erfolg", async () => {
  let finish;
  const calls = [];
  const f = fixture((url, options) => {
    calls.push({ url, options });
    return new Promise(resolve => { finish = resolve; });
  });
  f.fields.phone.value = " 0000000000 ";
  f.fields.whatsapp_reply.checked = true;
  const pending = f.submit();
  assert.equal(f.button.disabled, true);
  assert.equal(f.form.resets, 0);
  await f.submit();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, f.form.action);
  assert.equal(calls[0].options.body.get("phone"), "0000000000");
  assert.equal(calls[0].options.body.get("whatsapp_reply"), "Ja");
  assert.equal(calls[0].options.body.get("name"), "Test");
  assert.equal(calls[0].options.credentials, "omit");
  assert.equal(calls[0].options.redirect, "error");
  finish({ ok: true, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(f.form.resets, 1);
  assert.equal(f.status.dataset.state, "success");
  assert.equal(f.status.focused, true);
  assert.equal(f.fields.phone.required, false);
  assert.equal(f.button.disabled, false);
});

test("bewahrt Eingaben bei Dienstfehlern, Netzwerkfehlern und unbestätigten Antworten", async () => {
  for (const fetch of [
    async () => ({ ok: false }),
    async () => { throw new TypeError("offline"); },
    async () => ({ ok: true, json: async () => ({}) }),
    async () => ({ ok: true, json: async () => { throw new SyntaxError("HTML"); } })
  ]) {
    const f = fixture(fetch);
    await f.submit();
    assert.equal(f.form.resets, 0);
    assert.equal(f.fields.message.value, " Nachricht ");
    assert.equal(f.status.dataset.state, "error");
    assert.equal(f.status.focused, true);
    assert.equal(f.button.disabled, false);
  }
});

test("verlinkt Kontakt nur über Startseitenbutton und die zehn Footerziele", () => {
  const pages = fs.readdirSync(root).filter(name => name.endsWith(".html"));
  pages.forEach(name => {
    const html = fs.readFileSync(path.join(root, name), "utf8");
    const nav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    const footer = html.match(/<nav class="footer-nav"[\s\S]*?<\/nav>/)[0];
    assert.doesNotMatch(nav, /kontakt\.html/);
    assert.equal((footer.match(/<a\b/g) || []).length, 10, name);
    assert.ok(footer.indexOf("kontakt.html") > footer.indexOf("partner.html"));
    assert.ok(footer.indexOf("kontakt.html") < footer.indexOf("impressum.html"));
  });
  assert.match(fs.readFileSync(path.join(root, "index.html"), "utf8"), /href="kontakt\.html">\s+Kontakt aufnehmen/);
});

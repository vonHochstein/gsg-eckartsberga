(function initializeCalendarActions() {
  "use strict";
  const core = window.CalendarCore;
  const actions = [...document.querySelectorAll("[data-calendar-action]")];
  if (!core || !actions.length) return;
  const base = new URL(".", window.location.href);
  const providers = [
    ["apple", "Apple / Kalender-App"], ["google", "Google Kalender"],
    ["outlook", "Outlook / Hotmail"], ["microsoft365", "Microsoft 365"]
  ];
  const ua = navigator.userAgent || "";
  const appleMobile = /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const platform = { apple: appleMobile, mobile: appleMobile || /Android|Mobile/i.test(ua) };
  let manifest = null;
  let failed = false;
  let loading = true;
  let trigger = null;
  let opening = false;
  const dialog = document.createElement("dialog");
  dialog.className = "calendar-choice";
  dialog.setAttribute("aria-labelledby", "calendar-choice-title");
  dialog.innerHTML = `
    <div class="calendar-choice-header">
      <h2 id="calendar-choice-title">Kalender wählen</h2>
      <button type="button" class="calendar-choice-close" aria-label="Kalenderauswahl schließen">×</button>
    </div>
    <p class="calendar-choice-subtitle"></p>
    <div class="calendar-choice-options"></div>`;
  document.body.append(dialog);
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (trigger?.isConnected) trigger.focus();
    trigger = null;
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  function state(button) {
    const subscription = button.dataset.calendarAction === "subscribe";
    const entry = subscription ? manifest?.subscription : manifest?.events?.[button.dataset.calendarEvent];
    if (loading) return { enabled: false, message: "" };
    if (failed || !entry) return { enabled: false, message: "Kalender derzeit nicht verfügbar." };
    if (!subscription) {
      const eligibility = core.availability(entry);
      if (!eligibility.enabled) return eligibility;
    }
    if (!entry.path || !entry.urls) return { enabled: false, message: "Kalender derzeit nicht verfügbar." };
    return { enabled: true, message: "", entry, subscription };
  }
  function refresh() {
    for (const button of actions) {
      const current = state(button);
      button.disabled = !current.enabled || (opening && button === trigger);
      const hint = button.closest(".calendar-action").querySelector(".calendar-action-hint");
      hint.textContent = current.message;
      hint.hidden = !current.message;
    }
    if (dialog.open && trigger && !state(trigger).enabled) dialog.close();
  }
  function validLinks(urls, subscription) {
    if (!urls || typeof urls !== "object") return false;
    return providers.every(([key]) => {
      try {
        const url = new URL(urls[key]);
        if (key === "apple") return subscription ? url.protocol === "webcal:" : /^https?:$/.test(url.protocol);
        const host = { google: "calendar.google.com", outlook: "outlook.live.com", microsoft365: "outlook.office.com" }[key];
        return url.protocol === "https:" && url.hostname === host;
      } catch { return false; }
    });
  }
  async function assetExists(file) {
    const url = new URL(file, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-cache", signal: controller.signal });
      return response.ok;
    } catch { return false; }
    finally { clearTimeout(timeout); }
  }
  async function open(button) {
    if (opening) return;
    const current = state(button);
    if (!current.enabled) { refresh(); return; }
    opening = true;
    trigger = button;
    button.setAttribute("aria-busy", "true");
    refresh();
    const exists = await assetExists(current.entry.path);
    opening = false;
    button.removeAttribute("aria-busy");
    if (!exists) {
      current.entry.path = null;
      refresh();
      trigger = null;
      return;
    }
    if (!state(button).enabled) { refresh(); trigger = null; return; }
    const container = dialog.querySelector(".calendar-choice-options");
    container.replaceChildren();
    dialog.querySelector(".calendar-choice-subtitle").textContent = current.subscription
      ? "GSG Eckartsberga – Veranstaltungen" : current.entry.title;
    for (const [key, label] of providers) {
      const supported = core.providerSupported(key, current.subscription, platform);
      const row = document.createElement("div");
      row.className = "calendar-choice-option";
      const control = document.createElement(supported ? "a" : "button");
      control.className = "btn calendar-provider";
      control.textContent = label;
      if (supported) {
        control.href = current.entry.urls[key];
        if (!current.subscription && key === "apple") {
          control.download = `${button.dataset.calendarEvent}.ics`;
        } else control.rel = "external";
        control.addEventListener("click", event => {
          if (!state(button).enabled) { event.preventDefault(); refresh(); }
          dialog.close();
        });
      } else {
        control.type = "button";
        control.disabled = true;
        const hint = document.createElement("p");
        hint.id = `calendar-provider-${key}-hint`;
        hint.textContent = "Auf diesem Gerät nicht verfügbar.";
        control.setAttribute("aria-describedby", hint.id);
        row.append(hint);
      }
      row.prepend(control);
      container.append(row);
    }
    refresh();
    button.focus();
    dialog.showModal();
  }
  for (const button of actions) button.addEventListener("click", () => open(button));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
  let interval = setInterval(refresh, 60000);
  window.addEventListener("pagehide", () => { clearInterval(interval); interval = null; });
  window.addEventListener("pageshow", () => {
    if (interval === null) interval = setInterval(refresh, 60000);
    refresh();
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  fetch(new URL("calendar/manifest.json", base), { cache: "no-cache", signal: controller.signal })
    .then(response => {
      if (!response.ok) throw new Error("Kalendermanifest fehlt.");
      return response.json();
    })
    .then(data => {
      if (data.version !== 1 || data.subscription?.path !== "calendar/veranstaltungen.ics" ||
          !validLinks(data.subscription?.urls, true) || !data.events || typeof data.events !== "object") {
        throw new Error("Kalendermanifest ungültig.");
      }
      for (const [slug, entry] of Object.entries(data.events)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastDay) || typeof entry.title !== "string" ||
            (entry.path !== null && (entry.path !== `calendar/events/${slug}.ics` || !validLinks(entry.urls, false)))) {
          throw new Error("Kalendereintrag ungültig.");
        }
      }
      manifest = data;
    })
    .catch(() => { failed = true; })
    .finally(() => { clearTimeout(timeout); loading = false; refresh(); });
})();

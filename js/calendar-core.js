// DOM-free calendar rules, shared by the browser and the publishing generator.
(function exposeCalendarCore(scope) {
  "use strict";
  const ZONE = "Europe/Berlin";
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  });
  const text = value => typeof value === "string" ? value.trim() : "";
  function parts(date) {
    return Object.fromEntries(formatter.formatToParts(date)
      .filter(part => part.type !== "literal").map(part => [part.type, part.value]));
  }
  function berlinDay(date = new Date()) {
    const p = parts(new Date(date));
    return `${p.year}-${p.month}-${p.day}`;
  }
  function nextDay(day) {
    const date = new Date(`${day}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  }
  function wallKey(p) {
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
  }
  function berlinInstant(wall) {
    const nominal = new Date(`${wall}Z`).getTime();
    const offsets = new Set([-43200000, 0, 43200000].map(delta => {
      const instant = new Date(nominal + delta);
      return new Date(`${wallKey(parts(instant))}Z`).getTime() - instant.getTime();
    }));
    const matches = [...offsets].map(offset => nominal - offset)
      .filter(time => wallKey(parts(new Date(time))) === wall).sort((a, b) => a - b);
    if (!matches.length) throw new Error(`Ungültige ${ZONE}-Uhrzeit: ${wall}`);
    // An ambiguous autumn wall time consistently uses the first occurrence.
    return new Date(matches[0]);
  }
  function parseDate(value) {
    const raw = text(value);
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})?)?$/);
    if (!match) throw new Error(`Ungültiges Kalenderdatum: ${raw}`);
    const day = match[1];
    const check = new Date(`${day}T12:00:00Z`);
    if (!Number.isFinite(check.getTime()) || check.toISOString().slice(0, 10) !== day) {
      throw new Error(`Ungültiger Kalendertag: ${day}`);
    }
    if (!match[2]) return { day, dateOnly: true, instant: null };
    const wall = `${day}T${match[2]}:${match[3] || "00"}`;
    if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(wall)) {
      throw new Error(`Ungültige Kalenderuhrzeit: ${raw}`);
    }
    const instant = match[4] ? new Date(wall + match[4]) : berlinInstant(wall);
    if (!Number.isFinite(instant.getTime())) throw new Error(`Ungültige Kalenderuhrzeit: ${raw}`);
    return { day: berlinDay(instant), dateOnly: false, instant };
  }
  function availability(event, now = new Date()) {
    if (!event) return { enabled: false, message: "Kalender derzeit nicht verfügbar." };
    if (event.status === "cancelled") return { enabled: false, message: "Termin abgesagt." };
    if (event.status === "postponed") return { enabled: false, message: "Termin verschoben." };
    if (event.lastDay < berlinDay(now)) {
      return { enabled: false, message: "Termin liegt in der Vergangenheit." };
    }
    return { enabled: true, message: "" };
  }
  function normalize(event, venues, eventUtils, baseUrl) {
    if (event.developmentOnly === true) return null;
    const slug = text(event.slug);
    const title = text(event.title);
    if (!Number.isSafeInteger(event.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title) {
      throw new Error("Kalender: Event-ID, Slug oder Titel fehlt/ist ungültig.");
    }
    const start = parseDate(event.start);
    const end = text(event.end) ? parseDate(event.end) : null;
    let calendarEnd;
    if (start.dateOnly) {
      if (end && end.day < start.day) throw new Error(`Kalenderende vor Beginn: ${slug}`);
      calendarEnd = nextDay(end?.day || start.day);
    } else {
      const endInstant = end?.dateOnly
        ? berlinInstant(`${nextDay(end.day)}T00:00:00`)
        : end?.instant || new Date(start.instant.getTime() + 3600000);
      if (endInstant <= start.instant) throw new Error(`Kalenderende nicht nach Beginn: ${slug}`);
      calendarEnd = endInstant.toISOString();
    }
    const venue = eventUtils.resolveEventLocation(event, venues);
    const location = [venue?.name, venue?.description].filter(Boolean).join(", ");
    return {
      id: event.id, slug, title,
      uid: `gsg-eckartsberga-event-${event.id}@schuetzenverein-eckartsberga.de`,
      status: eventUtils.getEventEditorialStatus(event),
      lastDay: end?.day || start.day,
      allDay: start.dateOnly,
      start: start.dateOnly ? start.day : start.instant.toISOString(),
      end: calendarEnd,
      location, description: text(event.description),
      url: new URL(`event.html?event=${encodeURIComponent(slug)}`, baseUrl).href
    };
  }
  function stamp(iso) { return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function escapeIcs(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n")
      .replace(/;/g, "\\;").replace(/,/g, "\\,");
  }
  function fold(line) {
    const encoder = new TextEncoder();
    let result = "", length = 0;
    for (const character of line) {
      const bytes = encoder.encode(character).length;
      if (length + bytes > 75) { result += "\r\n "; length = 1; }
      result += character;
      length += bytes;
    }
    return result;
  }
  function createIcs(events, metadata) {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GSG Eckartsberga//Veranstaltungen//DE",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:GSG Eckartsberga – Veranstaltungen"];
    for (const event of events) {
      lines.push("BEGIN:VEVENT", `UID:${event.uid}`, `DTSTAMP:${stamp(metadata.updatedAt)}`,
        `LAST-MODIFIED:${stamp(metadata.updatedAt)}`, `SEQUENCE:${metadata.sequence}`,
        `SUMMARY:${escapeIcs(event.title)}`,
        `${event.allDay ? "DTSTART;VALUE=DATE" : "DTSTART"}:${stamp(event.start)}`,
        `${event.allDay ? "DTEND;VALUE=DATE" : "DTEND"}:${stamp(event.end)}`,
        `LOCATION:${escapeIcs(event.location)}`,
        `DESCRIPTION:${escapeIcs([event.description, event.url].filter(Boolean).join("\n\n"))}`,
        `URL:${event.url}`, "END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    return lines.map(fold).join("\r\n") + "\r\n";
  }
  function providerLinks(event, icsUrl) {
    const details = [event.description, event.url].filter(Boolean).join("\n\n");
    const google = new URL("https://calendar.google.com/calendar/render");
    google.search = new URLSearchParams({ action: "TEMPLATE", text: event.title,
      dates: `${stamp(event.start)}/${stamp(event.end)}`, details, location: event.location, ctz: ZONE });
    const outlook = host => {
      const url = new URL(`/calendar/0/deeplink/compose`, host);
      url.search = new URLSearchParams({ path: "/calendar/action/compose", rru: "addevent",
        subject: event.title, startdt: event.start, enddt: event.end,
        body: details, location: event.location, allday: String(event.allDay) });
      return url.href;
    };
    return { apple: icsUrl, google: google.href,
      outlook: outlook("https://outlook.live.com"), microsoft365: outlook("https://outlook.office.com") };
  }
  function subscriptionLinks(feedUrl) {
    const feed = new URL(feedUrl);
    const apple = new URL(feed.href.replace(/^https?:/, "webcal:"));
    const google = new URL("https://calendar.google.com/calendar/render");
    google.search = new URLSearchParams({ cid: feed.href });
    const outlook = host => {
      const url = new URL("/calendar/0/addfromweb", host);
      url.search = new URLSearchParams({ url: feed.href, name: "GSG Eckartsberga – Veranstaltungen" });
      return url.href;
    };
    return { apple: apple.href, google: google.href,
      outlook: outlook("https://outlook.live.com"), microsoft365: outlook("https://outlook.office.com") };
  }
  function providerSupported(provider, subscription, platform) {
    if (!subscription || !platform.mobile) return true;
    return provider === "apple" && platform.apple;
  }
  const api = Object.freeze({ ZONE, berlinDay, nextDay, parseDate, availability, normalize,
    createIcs, escapeIcs, fold, providerLinks, subscriptionLinks, providerSupported });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else scope.CalendarCore = api;
})(typeof window !== "undefined" ? window : globalThis);

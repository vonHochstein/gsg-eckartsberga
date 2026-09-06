// ==========================================
// Gästebuch und Startseiten-Stimmen
// ==========================================

(function exposeGuestbookUtils(globalScope) {
  "use strict";

  const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function normalizedString(value) {
    if (typeof value !== "string") return null;

    const normalizedValue = value.trim();
    return normalizedValue ? normalizedValue : null;
  }

  function isValidIsoDate(value) {
    const match = normalizedString(value)?.match(ISO_DATE_PATTERN);
    if (!match) return false;

    const [, year, month, day] = match;
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.getUTCFullYear() === Number(year) &&
      date.getUTCMonth() + 1 === Number(month) &&
      date.getUTCDate() === Number(day)
    );
  }

  function normalizeGuestbookEntries(entries) {
    if (!Array.isArray(entries)) return [];

    const knownIds = new Set();

    return entries
      .reduce((normalizedEntries, entry, sourceIndex) => {
        if (!isRecord(entry)) return normalizedEntries;

        const id = normalizedString(entry.id);
        const displayName = normalizedString(entry.displayName);
        const date = normalizedString(entry.date);
        const text = normalizedString(entry.text);

        if (
          !id ||
          knownIds.has(id) ||
          !displayName ||
          !date ||
          !isValidIsoDate(date) ||
          !text
        ) {
          return normalizedEntries;
        }

        knownIds.add(id);
        normalizedEntries.push({
          id,
          displayName,
          date,
          text,
          featuredOnHome: entry.featuredOnHome === true,
          sourceIndex
        });

        return normalizedEntries;
      }, [])
      .sort((firstEntry, secondEntry) => {
        const dateComparison = secondEntry.date.localeCompare(firstEntry.date);
        return dateComparison || firstEntry.sourceIndex - secondEntry.sourceIndex;
      })
      .map(({ sourceIndex, ...entry }) => entry);
  }

  function formatGuestbookDate(value) {
    if (!isValidIsoDate(value)) return "";

    return new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
  }

  function createGuestbookEntry(entry, className) {
    const article = document.createElement("article");
    article.className = className;

    const quote = document.createElement("blockquote");
    const quoteText = document.createElement("p");
    quoteText.textContent = entry.text;
    quote.append(quoteText);

    const footer = document.createElement("footer");
    const displayName = document.createElement("strong");
    displayName.textContent = entry.displayName;

    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = formatGuestbookDate(entry.date);

    footer.append(displayName, date);
    article.append(quote, footer);

    return article;
  }

  function renderGuestbookPage(entries) {
    const list = document.getElementById("guestbook-list");
    const emptyState = document.getElementById("guestbook-empty");

    if (!list || !emptyState) return;

    if (entries.length === 0) {
      emptyState.removeAttribute("hidden");
      return;
    }

    entries.forEach((entry) => {
      list.append(createGuestbookEntry(entry, "guestbook-entry"));
    });
  }

  const GuestbookUtils = Object.freeze({
    normalizeGuestbookEntries,
    formatGuestbookDate
  });

  globalScope.GuestbookUtils = GuestbookUtils;

  if (typeof document !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
      const sourceEntries =
        typeof publishedGuestbookEntries !== "undefined"
          ? publishedGuestbookEntries
          : [];
      const normalizedEntries = normalizeGuestbookEntries(sourceEntries);

      renderGuestbookPage(normalizedEntries);
    });
  }
})(typeof window !== "undefined" ? window : globalThis);

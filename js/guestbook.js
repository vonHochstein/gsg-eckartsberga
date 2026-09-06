// ==========================================
// Gästebuch und Startseiten-Stimmen
// ==========================================

(function exposeGuestbookUtils(globalScope) {
  "use strict";

  const ROTATION_INTERVAL = 9000;
  const TRANSITION_DURATION = 350;
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

  function getFeaturedGuestbookEntries(entries) {
    return normalizeGuestbookEntries(entries).filter(
      (entry) => entry.featuredOnHome
    );
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

  function selectInitialGuestbookIndex(length, randomValue = Math.random()) {
    if (!Number.isInteger(length) || length <= 0) return -1;

    const safeRandomValue = Number.isFinite(randomValue)
      ? Math.min(Math.max(randomValue, 0), 0.9999999999999999)
      : 0;

    return Math.floor(safeRandomValue * length);
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

  function renderGuestbookVoices(entries) {
    const section = document.getElementById("stimmen");
    const root = section?.querySelector("[data-guestbook-voices]");
    const slidesContainer = root?.querySelector("[data-guestbook-slides]");
    const controls = root?.querySelector("[data-guestbook-controls]");
    const previousButton = root?.querySelector("[data-guestbook-previous]");
    const toggleButton = root?.querySelector("[data-guestbook-toggle]");
    const nextButton = root?.querySelector("[data-guestbook-next]");
    const position = root?.querySelector("[data-guestbook-position]");

    if (
      !section ||
      !root ||
      !slidesContainer ||
      !controls ||
      !previousButton ||
      !toggleButton ||
      !nextButton ||
      !position ||
      entries.length === 0
    ) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const slides = entries.map((entry, index) => {
      const slide = createGuestbookEntry(entry, "guestbook-voice");
      slide.dataset.guestbookIndex = String(index);
      slide.setAttribute("aria-hidden", "true");
      slidesContainer.append(slide);
      return slide;
    });
    let currentIndex = selectInitialGuestbookIndex(slides.length);
    let rotationTimer = null;
    let autoplayEnabled = slides.length > 1 && !reducedMotion.matches;
    let transitionTimer = null;

    function updateAutoplayControl() {
      const canAutoplay = slides.length > 1 && !reducedMotion.matches;
      toggleButton.hidden = !canAutoplay;
      toggleButton.textContent = autoplayEnabled
        ? "Automatischen Wechsel pausieren"
        : "Automatischen Wechsel fortsetzen";
      toggleButton.setAttribute("aria-pressed", String(!autoplayEnabled));
      slidesContainer.setAttribute(
        "aria-live",
        autoplayEnabled ? "off" : "polite"
      );
    }

    function stopRotationTimer() {
      if (rotationTimer === null) return;

      window.clearInterval(rotationTimer);
      rotationTimer = null;
    }

    function startRotationTimer() {
      stopRotationTimer();

      if (!autoplayEnabled || reducedMotion.matches || slides.length < 2) {
        return;
      }

      rotationTimer = window.setInterval(() => {
        showSlide((currentIndex + 1) % slides.length);
      }, ROTATION_INTERVAL);
    }

    function pauseAutoplay() {
      if (!autoplayEnabled) return;

      autoplayEnabled = false;
      stopRotationTimer();
      updateAutoplayControl();
    }

    function showSlide(nextIndex) {
      if (nextIndex === currentIndex || !slides[nextIndex]) return;

      const previousSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];

      window.clearTimeout(transitionTimer);
      slides.forEach((slide) => slide.classList.remove("is-leaving"));
      previousSlide.classList.remove("is-active");
      previousSlide.classList.add("is-leaving");
      previousSlide.setAttribute("aria-hidden", "true");

      nextSlide.classList.remove("is-leaving");
      nextSlide.classList.add("is-active");
      nextSlide.setAttribute("aria-hidden", "false");
      currentIndex = nextIndex;
      position.textContent = `${currentIndex + 1} von ${slides.length}`;

      transitionTimer = window.setTimeout(() => {
        previousSlide.classList.remove("is-leaving");
      }, reducedMotion.matches ? 0 : TRANSITION_DURATION);
    }

    slides[currentIndex].classList.add("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "false");
    position.textContent = `${currentIndex + 1} von ${slides.length}`;
    controls.hidden = slides.length < 2;
    section.removeAttribute("hidden");
    updateAutoplayControl();
    startRotationTimer();

    previousButton.addEventListener("click", () => {
      pauseAutoplay();
      showSlide((currentIndex - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener("click", () => {
      pauseAutoplay();
      showSlide((currentIndex + 1) % slides.length);
    });

    toggleButton.addEventListener("click", () => {
      autoplayEnabled = !autoplayEnabled;
      updateAutoplayControl();
      startRotationTimer();
    });

    root.addEventListener("pointerenter", pauseAutoplay);
    root.addEventListener("focusin", pauseAutoplay);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopRotationTimer();
      } else {
        startRotationTimer();
      }
    });

    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) {
        autoplayEnabled = false;
        stopRotationTimer();
      }

      updateAutoplayControl();
    });
  }

  const GuestbookUtils = Object.freeze({
    normalizeGuestbookEntries,
    getFeaturedGuestbookEntries,
    formatGuestbookDate,
    selectInitialGuestbookIndex
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
      renderGuestbookVoices(
        normalizedEntries.filter((entry) => entry.featuredOnHome)
      );
    });
  }
})(typeof window !== "undefined" ? window : globalThis);

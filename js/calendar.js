// ==========================================
// Veranstaltungschronik
// ==========================================

const timelineContainer = document.getElementById("event-timeline");

if (timelineContainer && typeof events !== "undefined") {
  renderTimeline(events);
}

function renderTimeline(eventList) {
  timelineContainer.innerHTML = "";

  const validEvents = Array.isArray(eventList) ? eventList : [];
  const now = new Date();
  const recentThreshold = new Date(now);
  recentThreshold.setDate(recentThreshold.getDate() - 30);

  const upcomingEvents = validEvents
    .filter((event) => new Date(event.end || event.start) >= now)
    .sort(compareEventsAscending);

  const recentPastEvents = validEvents
    .filter((event) => {
      const eventEnd = new Date(event.end || event.start);
      return eventEnd < now && eventEnd >= recentThreshold;
    })
    .sort(compareEventsDescending);

  const archiveEvents = validEvents
    .filter((event) => new Date(event.end || event.start) < recentThreshold)
    .sort(compareEventsDescending);

  renderEventSection(
    "upcoming",
    "Kommende Termine",
    upcomingEvents,
    "Aktuell sind keine kommenden Veranstaltungen eingetragen."
  );

  renderEventSection(
    "recent",
    "Aktuelles der letzten 30 Tage",
    recentPastEvents,
    "In den letzten 30 Tagen gab es keine neuen Einträge."
  );

  renderArchiveSection(archiveEvents);
}

function renderEventSection(id, title, eventGroup, emptyMessage) {
  const section = createTimelineSection(id, title);
  const content = section.querySelector(".timeline-group-content");

  if (eventGroup.length === 0) {
    content.insertAdjacentHTML(
      "beforeend",
      `<p class="timeline-empty">${escapeHTML(emptyMessage)}</p>`
    );
    return;
  }

  renderEventGroup(eventGroup, content);
}

function renderArchiveSection(archiveEvents) {
  const section = createTimelineSection("archive", "Archiv");
  const content = section.querySelector(".timeline-group-content");

  if (archiveEvents.length === 0) {
    content.insertAdjacentHTML(
      "beforeend",
      '<p class="timeline-empty">Das Veranstaltungsarchiv enthält noch keine Einträge.</p>'
    );
    return;
  }

  content.insertAdjacentHTML(
    "beforeend",
    '<div class="timeline-archive-list" id="timeline-archive-list"></div>'
  );
  renderArchive(archiveEvents);
}

function createTimelineSection(id, title) {
  const headingId = `timeline-${id}-title`;

  timelineContainer.insertAdjacentHTML(
    "beforeend",
    `<section class="timeline-group" aria-labelledby="${headingId}">
      <h3 class="timeline-section-title" id="${headingId}">${escapeHTML(title)}</h3>
      <div class="timeline-group-content"></div>
    </section>`
  );

  return timelineContainer.lastElementChild;
}

function renderEventGroup(eventGroup, container) {
  let currentMonth = "";

  eventGroup.forEach((event) => {
    const eventMonth = formatMonth(event.start);

    if (eventMonth !== currentMonth) {
      currentMonth = eventMonth;
      container.insertAdjacentHTML("beforeend", createMonthMarkup(eventMonth));
    }

    container.insertAdjacentHTML("beforeend", createEventMarkup(event));
  });
}

function renderArchive(pastEvents) {
  const archiveList = document.getElementById("timeline-archive-list");
  if (!archiveList) return;

  const eventsByYear = pastEvents.reduce((groups, event) => {
    const year = new Date(event.start).getFullYear();

    if (!groups[year]) {
      groups[year] = [];
    }

    groups[year].push(event);
    return groups;
  }, {});

  const years = Object.keys(eventsByYear)
    .sort((a, b) => Number(b) - Number(a));

  let focusIndex = 0;
  let activeIndex = null;
  const mobileViewport = window.matchMedia("(max-width: 820px)");

  archiveList.innerHTML = `
    <div class="timeline-year-carousel" aria-label="Archivjahr auswählen">
      <button class="timeline-year-arrow prev" type="button" aria-label="Vorheriges Jahr">‹</button>
      <div class="timeline-year-track"></div>
      <button class="timeline-year-arrow next" type="button" aria-label="Nächstes Jahr">›</button>
    </div>
    <div
      class="timeline-archive-panel"
      id="timeline-archive-panel"
      aria-live="polite"
      aria-label="Veranstaltungen des ausgewählten Archivjahres"
    ></div>
  `;

  const track = archiveList.querySelector(".timeline-year-track");
  const panel = archiveList.querySelector(".timeline-archive-panel");
  const prevButton = archiveList.querySelector(".timeline-year-arrow.prev");
  const nextButton = archiveList.querySelector(".timeline-year-arrow.next");

  function visibleCount() {
    return mobileViewport.matches ? 3 : 5;
  }

  function renderYearSelector() {
    track.innerHTML = "";

    const count = Math.min(visibleCount(), years.length);
    const maxStart = Math.max(years.length - count, 0);
    const start = Math.min(
      Math.max(focusIndex - Math.floor(count / 2), 0),
      maxStart
    );
    const center = Math.floor(count / 2);

    for (let position = 0; position < count; position++) {
      const index = start + position;
      const year = years[index];
      const offset = position - center;
      const isActive = activeIndex === index;
      const entryCount = eventsByYear[year].length;

      track.insertAdjacentHTML(
        "beforeend",
        `<button
          class="timeline-year${isActive ? " is-active" : ""}"
          type="button"
          data-index="${index}"
          data-offset="${offset}"
          aria-pressed="${isActive}"
          aria-controls="timeline-archive-panel"
          aria-label="${year}, ${entryCount} ${entryCount === 1 ? "Eintrag" : "Einträge"}"
        >
          <span>${year}</span>
          <small>${entryCount} ${entryCount === 1 ? "Eintrag" : "Einträge"}</small>
        </button>`
      );
    }

    prevButton.disabled = focusIndex === 0;
    nextButton.disabled = focusIndex === years.length - 1;
  }

  function renderYearEvents() {
    panel.innerHTML = "";
    if (activeIndex === null) return;

    renderEventGroup(eventsByYear[years[activeIndex]], panel);
  }

  archiveList.addEventListener("click", (event) => {
    const yearButton = event.target.closest(".timeline-year");

    if (yearButton) {
      const index = Number(yearButton.dataset.index);
      focusIndex = index;
      activeIndex = activeIndex === index ? null : index;
      renderYearSelector();
      renderYearEvents();
      return;
    }

    if (event.target.closest(".timeline-year-arrow.prev") && focusIndex > 0) {
      focusIndex--;
      activeIndex = focusIndex;
      renderYearSelector();
      renderYearEvents();
      return;
    }

    if (event.target.closest(".timeline-year-arrow.next") && focusIndex < years.length - 1) {
      focusIndex++;
      activeIndex = focusIndex;
      renderYearSelector();
      renderYearEvents();
    }
  });

  mobileViewport.addEventListener?.("change", renderYearSelector);
  renderYearSelector();
}

function createMonthMarkup(month) {
  return `<p class="timeline-month">${escapeHTML(month)}</p>`;
}

function createEventMarkup(event) {
  const eventUtils = window.EventUtils;
  const documents = eventUtils?.normalizeEventDocuments(event) || [];
  const results = (eventUtils?.normalizeResults(event.results) || []).filter(
    (result) => result.kind === "external"
  );
  const gallery = eventUtils?.normalizeGallery(event.gallery) || [];
  const hasDocuments = documents.length > 0;
  const hasResults = results.length > 0;
  const hasGallery = gallery.length > 0;
  const galleryLabel =
    gallery.length === 1 ? "1 Bild" : `${gallery.length} Bilder`;
  const title = eventUtils?.getEventTitle(event) || "Veranstaltung";
  const category = event.category || "Veranstaltung";
  const locationData = eventUtils?.resolveEventLocation(
    event,
    typeof eventVenues !== "undefined" ? eventVenues : []
  );
  const location = locationData?.name || "Ort folgt";
  const image = eventUtils?.normalizeImage(event.image) || null;
  const detailUrl = eventUtils?.createDetailUrl(event) || null;
  const imageMarkup = image
    ? `<figure class="timeline-media">
        <img
          src="${escapeHTML(image.src)}"
          alt="${escapeHTML(image.alt)}"
          ${image.width ? `width="${image.width}"` : ""}
          ${image.height ? `height="${image.height}"` : ""}
          loading="lazy"
          decoding="async"
        />
      </figure>`
    : "";

  const cardContent = `
      <time
        class="timeline-date"
        datetime="${escapeHTML(event.start)}"
        aria-label="${escapeHTML(formatFullDate(event.start))}"
      >
        <span class="timeline-day">${formatDay(event.start)}</span>
        <span class="timeline-month-short">${formatShortMonth(event.start)}</span>
      </time>

      <div class="timeline-content">

        <span class="timeline-badge">${escapeHTML(category)}</span>

        <h4>${escapeHTML(title)}</h4>

        <p class="timeline-location"><span aria-hidden="true">📍</span> ${escapeHTML(location)}</p>

        ${event.description ? `<p class="timeline-description">${escapeHTML(event.description)}</p>` : ""}

        ${imageMarkup}

        <div class="timeline-chips" aria-label="Verfügbare Inhalte">
          <span class="timeline-chip ${hasDocuments ? "available" : "disabled"}"><span aria-hidden="true">📄</span>&nbsp;${hasDocuments ? "Dokumente verfügbar" : "Dokumente folgen"}</span>
          <span class="timeline-chip ${hasResults ? "available" : "disabled"}"><span aria-hidden="true">🏆</span>&nbsp;${hasResults ? "Ergebnisse verfügbar" : "Ergebnisse folgen"}</span>
          <span class="timeline-chip ${hasGallery ? "available" : "disabled"}"><span aria-hidden="true">📷</span>&nbsp;${hasGallery ? galleryLabel : "Galerie folgt"}</span>
        </div>

      </div>
  `;

  const cardInner = detailUrl
    ? `<a
        class="timeline-card-inner timeline-card-link"
        href="${escapeHTML(detailUrl)}"
        aria-label="Details zu ${escapeHTML(title)}"
      >${cardContent}</a>`
    : `<div class="timeline-card-inner">${cardContent}</div>`;

  return `
    <article class="timeline-card" data-slug="${escapeHTML(event.slug || "")}">
      ${cardInner}
    </article>
  `;
}

function compareEventsAscending(a, b) {
  const timeDifference = new Date(a.start) - new Date(b.start);
  return timeDifference || String(a.id).localeCompare(String(b.id), "de", { numeric: true });
}

function compareEventsDescending(a, b) {
  const timeDifference = new Date(b.start) - new Date(a.start);
  return timeDifference || String(a.id).localeCompare(String(b.id), "de", { numeric: true });
}

function formatMonth(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric"
  });
}

function formatDay(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit"
  });
}

function formatShortMonth(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    month: "short"
  }).replace(".", "");
}

function formatFullDate(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]
  );
}

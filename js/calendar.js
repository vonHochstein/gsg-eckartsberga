// ==========================================
// Veranstaltungschronik
// ==========================================

const timelineContainer = document.getElementById("event-timeline");

if (timelineContainer && typeof events !== "undefined") {
  renderTimeline(events);
}

function renderTimeline(eventList) {
  timelineContainer.innerHTML = "";

  const now = new Date();
  const recentThreshold = new Date(now);
  recentThreshold.setDate(recentThreshold.getDate() - 30);

  const upcomingEvents = [...eventList]
    .filter((event) => new Date(event.end || event.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const recentPastEvents = [...eventList]
    .filter((event) => {
      const eventEnd = new Date(event.end || event.start);
      return eventEnd < now && eventEnd >= recentThreshold;
    })
    .sort((a, b) => new Date(b.start) - new Date(a.start));

  const archiveEvents = [...eventList]
    .filter((event) => new Date(event.end || event.start) < recentThreshold)
    .sort((a, b) => new Date(b.start) - new Date(a.start));

  if (upcomingEvents.length > 0) {
    timelineContainer.insertAdjacentHTML("beforeend", createSectionHeadline("Kommende Termine"));
    renderEventGroup(upcomingEvents);
  }

  if (recentPastEvents.length > 0) {
    timelineContainer.insertAdjacentHTML("beforeend", createSectionHeadline("Aktuelles"));
    renderEventGroup(recentPastEvents);
  }

  if (archiveEvents.length > 0) {
    timelineContainer.insertAdjacentHTML("beforeend", createSectionHeadline("Archiv"));
    timelineContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="timeline-archive-list" id="timeline-archive-list"></div>`
    );
    renderArchive(archiveEvents);
  }
}

function renderEventGroup(eventGroup) {
  let currentMonth = "";

  eventGroup.forEach((event) => {
    const eventMonth = formatMonth(event.start);

    if (eventMonth !== currentMonth) {
      currentMonth = eventMonth;
      timelineContainer.insertAdjacentHTML("beforeend", createMonthMarkup(eventMonth));
    }

    timelineContainer.insertAdjacentHTML("beforeend", createEventMarkup(event));
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

  archiveList.innerHTML = `
    <div class="timeline-year-carousel">
      <button class="timeline-year-arrow prev" type="button" aria-label="Vorheriges Jahr">‹</button>
      <div class="timeline-year-track"></div>
      <button class="timeline-year-arrow next" type="button" aria-label="Nächstes Jahr">›</button>
    </div>
    <div class="timeline-archive-panel"></div>
  `;

  const track = archiveList.querySelector(".timeline-year-track");
  const panel = archiveList.querySelector(".timeline-archive-panel");

  const prevButton = archiveList.querySelector(".timeline-year-arrow.prev");
  const nextButton = archiveList.querySelector(".timeline-year-arrow.next");

  function visibleCount() {
    return window.matchMedia("(max-width: 820px)").matches ? 3 : 5;
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

      track.insertAdjacentHTML(
        "beforeend",
        `<button class="timeline-year${activeIndex === index ? " is-active" : ""}" type="button" data-index="${index}" data-offset="${offset}">
          <span>${year}</span>
          <small>${eventsByYear[year].length} ${eventsByYear[year].length === 1 ? "Eintrag" : "Einträge"}</small>
        </button>`
      );
    }

    prevButton.disabled = focusIndex === 0;
    nextButton.disabled = focusIndex === years.length - 1;
  }

  function renderYearEvents() {
    panel.innerHTML = "";
    if (activeIndex === null) {
      return;
    }

    let currentMonth = "";

    eventsByYear[years[activeIndex]].forEach((event) => {
      const eventMonth = formatMonth(event.start);

      if (eventMonth !== currentMonth) {
        currentMonth = eventMonth;
        panel.insertAdjacentHTML("beforeend", createMonthMarkup(eventMonth));
      }

      panel.insertAdjacentHTML("beforeend", createEventMarkup(event));
    });
  }

  archiveList.addEventListener("click", (event) => {
    const button = event.target.closest(".timeline-year");

    if (button) {
      const index = Number(button.dataset.index);
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

  renderYearSelector();
}

function createSectionHeadline(title) {
  return `
    <div class="timeline-section-title">
      ${title}
    </div>
  `;
}

function createMonthMarkup(month) {
  return `
    <div class="timeline-month">
      ${month}
    </div>
  `;
}

function createEventMarkup(event) {
  const hasDownloads = Array.isArray(event.downloads) && event.downloads.length > 0;
  const hasResults = Array.isArray(event.results) && event.results.length > 0;
  const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;

  return `
    <article class="timeline-card" data-slug="${event.slug}">

      <div class="timeline-date">
        <span class="timeline-day">${formatDay(event.start)}</span>
        <span class="timeline-month-short">${formatShortMonth(event.start)}</span>
      </div>

      <div class="timeline-content">

        <span class="timeline-badge">${event.category}</span>

        <h3>${event.title}</h3>

        <p class="timeline-location">📍 ${event.location || "Ort folgt"}</p>

        ${event.description ? `<p class="timeline-description">${event.description}</p>` : ""}

        <div class="timeline-chips">
          <span class="timeline-chip ${hasDownloads ? "available" : "disabled"}">📄 ${hasDownloads ? "Ausschreibung verfügbar" : "Ausschreibung folgt"}</span>
          <span class="timeline-chip ${hasResults ? "available" : "disabled"}">🏆 ${hasResults ? "Ergebnisse verfügbar" : "Ergebnisse folgen"}</span>
          <span class="timeline-chip ${hasGallery ? "available" : "disabled"}">📷 ${hasGallery ? `${event.gallery.length} Bilder` : "Galerie folgt"}</span>
        </div>

        <span class="timeline-link">Zur Veranstaltungsseite →</span>

      </div>

    </article>
  `;
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
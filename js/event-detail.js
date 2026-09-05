// ==========================================
// Universelle Veranstaltungsdetailseite
// ==========================================

(function renderEventDetailPage() {
  "use strict";

  const detailRoot = document.getElementById("event-detail");
  const eventUtils = window.EventUtils;
  const overviewUrl = "index.html#veranstaltungen";
  const siteName = "GSG Eckartsberga";
  const galleryPreviewLimit = 6;
  const documentTypeLabels = {
    announcement: "Ausschreibung",
    invitation: "Einladung",
    "start-list": "Startliste",
    "result-list": "Ergebnisliste",
    form: "Formular",
    certificate: "Urkunde",
    other: "Sonstiges"
  };
  const defaultDescription =
    "Veranstaltungsdetails der Großkaliber Schützengilde 1503 Eckartsberga e. V.";

  if (!detailRoot) return;

  const searchParams = new URLSearchParams(window.location.search);
  const requestedSlug = searchParams.get("event");

  if (!searchParams.has("event") || !requestedSlug?.trim()) {
    renderErrorState(
      "Keine Veranstaltung ausgewählt",
      "Bitte wählen Sie eine Veranstaltung in der Veranstaltungsübersicht aus."
    );
    return;
  }

  if (!eventUtils || typeof events === "undefined" || !Array.isArray(events)) {
    console.error("Die Veranstaltungsdaten oder EventUtils konnten nicht geladen werden.");
    renderErrorState(
      "Veranstaltungsdaten unvollständig",
      "Die Veranstaltung kann aufgrund unvollständiger Kerndaten nicht dargestellt werden."
    );
    return;
  }

  const resolution = eventUtils.resolveEventBySlug(events, requestedSlug);

  if (resolution.status === "not-found") {
    renderErrorState(
      "Veranstaltung nicht gefunden",
      "Unter diesem Link ist keine Veranstaltung hinterlegt."
    );
    return;
  }

  if (resolution.status === "duplicate") {
    console.error(
      "Mehrere Veranstaltungen verwenden denselben Slug:",
      requestedSlug.trim()
    );
    renderErrorState(
      "Veranstaltung derzeit nicht verfügbar",
      "Die Veranstaltungsdaten sind nicht eindeutig. Bitte kehren Sie zur Übersicht zurück."
    );
    return;
  }

  const selectedEvent = resolution.event;

  if (!eventUtils.isDetailCapable(selectedEvent)) {
    renderErrorState(
      "Veranstaltungsdaten unvollständig",
      "Die Veranstaltung kann aufgrund unvollständiger Kerndaten nicht dargestellt werden."
    );
    return;
  }

  renderEvent(selectedEvent);

  function renderEvent(event) {
    const title = eventUtils.getEventTitle(event);
    const start = new Date(event.start);
    const end = getValidEndDate(event.end, start);
    const image = eventUtils.normalizeImage(event.image);
    const gallery = eventUtils.normalizeGallery(event.gallery);
    const documents = eventUtils.normalizeEventDocuments(event);
    const results = eventUtils
      .normalizeResults(event.results)
      .filter((result) => result.kind === "external");
    const externalLinks = eventUtils.normalizeExternalLinks(event.externalLinks);
    const category = getOptionalText(event.category);
    const locationData = eventUtils.resolveEventLocation(
      event,
      typeof eventVenues !== "undefined" ? eventVenues : []
    );
    const location = locationData?.name || "";
    const organizer = getOptionalText(event.organizer);
    const organizerLogo = eventUtils.getEventOrganizerLogo(event);
    const description = getOptionalText(event.description);
    const organizerLogoMarkup = createOrganizerLogoMarkup(organizerLogo);
    const labelsMarkup = createLabelsMarkup(
      category,
      event.developmentOnly === true
    );
    const imageMarkup = image ? createHeroImageMarkup(image) : "";
    const factItems = [
      createFactMarkup(
        "Beginn",
        createDateTimeMarkup(event.start.trim(), start)
      ),
      end
        ? createFactMarkup(
            "Ende",
            createDateTimeMarkup(event.end.trim(), end)
          )
        : "",
      location ? createFactMarkup("Ort", escapeHTML(location)) : "",
      organizer
        ? createFactMarkup("Veranstalter", escapeHTML(organizer))
        : "",
      event.registrationRequired === true
        ? createFactMarkup("Anmeldung erforderlich", "Ja")
        : ""
    ].join("");

    detailRoot.innerHTML = `
      <a class="event-back-link" href="${overviewUrl}">
        <span aria-hidden="true">←&nbsp;</span>
        Zur Veranstaltungsübersicht
      </a>

      <article aria-labelledby="event-title">
        <header class="event-hero">
          <div class="event-hero-layout${image ? " has-image" : ""}">
            <div class="event-hero-copy">
              ${organizerLogoMarkup}
              ${labelsMarkup}
              <h1 id="event-title">${escapeHTML(title)}</h1>
              ${createDateSummaryMarkup(event.start.trim(), start, event.end, end)}
              ${
                location
                  ? `<p class="event-hero-location">${escapeHTML(location)}</p>`
                  : ""
              }
            </div>
            ${imageMarkup}
          </div>
        </header>

        <div class="event-content">
          ${
            description
              ? `<section
                  class="event-section event-section-description"
                  aria-labelledby="event-description-title"
                >
                  <h2 id="event-description-title">Beschreibung</h2>
                  <p>${escapeHTML(description)}</p>
                </section>`
              : ""
          }

          <section class="event-section" aria-labelledby="event-facts-title">
            <h2 id="event-facts-title">Veranstaltungsinformationen</h2>
            <ul class="event-facts">
              ${factItems}
            </ul>
          </section>

          ${createDocumentsSection(documents)}
          ${createResultsSection(results)}
          ${createExternalLinksSection(externalLinks)}
          ${createGallerySection(gallery)}
        </div>
      </article>
    `;

    initializeGalleryToggle();
    detailRoot.setAttribute("aria-busy", "false");
    updateEventMetadata({
      slug: event.slug.trim(),
      title,
      description,
      start,
      location,
      image
    });
  }

  function renderErrorState(title, message) {
    detailRoot.innerHTML = `
      <section class="event-state" aria-labelledby="event-state-title">
        <p class="event-state-kicker">Veranstaltungsdetails</p>
        <h1 id="event-state-title">${escapeHTML(title)}</h1>
        <p>${escapeHTML(message)}</p>
        <a class="btn btn-primary" href="${overviewUrl}">
          Zur Veranstaltungsübersicht
        </a>
      </section>
    `;

    detailRoot.setAttribute("aria-busy", "false");
    updateErrorMetadata(title);
  }

  function createLabelsMarkup(category, isDevelopmentOnly) {
    const labels = [];

    if (category) {
      labels.push(`<span class="event-label">${escapeHTML(category)}</span>`);
    }

    if (isDevelopmentOnly) {
      labels.push(
        '<span class="event-label event-label-demo">Demo · nicht produktiv</span>'
      );
    }

    return labels.length
      ? `<div class="event-labels">${labels.join("")}</div>`
      : "";
  }

  function createOrganizerLogoMarkup(logo) {
    if (!logo) return "";

    return `
      <div class="event-organizer-mark">
        <img
          class="event-organizer-logo"
          src="${escapeHTML(logo.src)}"
          alt="${escapeHTML(logo.alt)}"
          ${createDimensionAttributes(logo)}
          loading="eager"
          decoding="async"
        />
      </div>
    `;
  }

  function createHeroImageMarkup(image) {
    return `
      <figure class="event-hero-media">
        <img
          src="${escapeHTML(image.src)}"
          alt="${escapeHTML(image.alt)}"
          ${createDimensionAttributes(image)}
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </figure>
    `;
  }

  function createDateSummaryMarkup(startValue, start, endValue, end) {
    if (!end) {
      return `
        <p class="event-date-summary">
          <strong>
            <time datetime="${escapeHTML(startValue)}">${escapeHTML(formatDate(start))}</time>
          </strong>
          <span>
            <time datetime="${escapeHTML(startValue)}">${escapeHTML(formatTime(start))}</time> Uhr
          </span>
        </p>
      `;
    }

    const normalizedEndValue = endValue.trim();

    if (isSameDay(start, end)) {
      return `
        <p class="event-date-summary">
          <strong>
            <time datetime="${escapeHTML(startValue)}">${escapeHTML(formatDate(start))}</time>
          </strong>
          <span>
            <time datetime="${escapeHTML(startValue)}">${escapeHTML(formatTime(start))}</time>
            bis
            <time datetime="${escapeHTML(normalizedEndValue)}">${escapeHTML(formatTime(end))}</time>
            Uhr
          </span>
        </p>
      `;
    }

    return `
      <p class="event-date-summary">
        <strong>
          <time datetime="${escapeHTML(startValue)}">${escapeHTML(formatDate(start))}</time>
          bis
          <time datetime="${escapeHTML(normalizedEndValue)}">${escapeHTML(formatDate(end))}</time>
        </strong>
        <span>
          Beginn
          <time datetime="${escapeHTML(startValue)}">${escapeHTML(formatTime(start))}</time>
          Uhr · Ende
          <time datetime="${escapeHTML(normalizedEndValue)}">${escapeHTML(formatTime(end))}</time>
          Uhr
        </span>
      </p>
    `;
  }

  function createDateTimeMarkup(dateTimeValue, date) {
    return `
      <time datetime="${escapeHTML(dateTimeValue)}">
        ${escapeHTML(formatDateTime(date))}
      </time>
    `;
  }

  function createFactMarkup(label, valueMarkup) {
    return `
      <li class="event-fact">
        <span class="event-fact-label">${escapeHTML(label)}</span>
        <span class="event-fact-value">${valueMarkup}</span>
      </li>
    `;
  }

  function createDocumentsSection(documents) {
    if (documents.length === 0) return "";

    const items = documents
      .map((document) =>
        createResourceMarkup(document, {
          kindLabel:
            documentTypeLabels[document.type] || documentTypeLabels.other,
          isExternal: isAbsoluteHttpUrl(document.url)
        })
      )
      .join("");

    return createResourceSection("event-documents-title", "Dokumente", items);
  }

  function createResultsSection(results) {
    if (results.length === 0) return "";

    const items = results
      .map((result) =>
        createResourceMarkup(result, {
          kindLabel: "Externes Ergebnis",
          isExternal: true
        })
      )
      .join("");

    return createResourceSection(
      "event-results-title",
      "Ergebnisse",
      items
    );
  }

  function createExternalLinksSection(externalLinks) {
    if (externalLinks.length === 0) return "";

    const items = externalLinks
      .map((link) =>
        createResourceMarkup(link, {
          kindLabel: "Externer Link ↗",
          isExternal: true
        })
      )
      .join("");

    return createResourceSection(
      "event-external-links-title",
      "Externe Links",
      items
    );
  }

  function createResourceSection(headingId, heading, items) {
    return `
      <section class="event-section" aria-labelledby="${headingId}">
        <h2 id="${headingId}">${escapeHTML(heading)}</h2>
        <ul class="event-resource-list">
          ${items}
        </ul>
      </section>
    `;
  }

  function createResourceMarkup(resource, options) {
    const description = getOptionalText(resource.description);
    const metadata = [resource.fileType, resource.fileSize]
      .map(getOptionalText)
      .filter(Boolean);

    return `
      <li>
        <a
          class="event-resource-link${options.isExternal ? " is-external" : ""}"
          href="${escapeHTML(resource.url)}"
          ${options.isExternal ? 'rel="external"' : ""}
        >
          <span class="event-resource-heading">
            <span class="event-resource-label">${escapeHTML(resource.label)}</span>
            <span class="event-resource-kind">${escapeHTML(options.kindLabel)}</span>
          </span>
          ${
            description
              ? `<span class="event-resource-description">${escapeHTML(description)}</span>`
              : ""
          }
          ${
            metadata.length
              ? `<span class="event-resource-meta">${escapeHTML(metadata.join(" · "))}</span>`
              : ""
          }
        </a>
      </li>
    `;
  }

  function createGallerySection(gallery) {
    if (gallery.length === 0) return "";

    const figures = gallery
      .map(
        (image, index) => `
          <figure
            class="event-gallery-item"
            ${index >= galleryPreviewLimit ? "hidden" : ""}
          >
            <button
              class="event-gallery-open"
              type="button"
              data-gallery-index="${index}"
              aria-haspopup="dialog"
            >
              <img
                src="${escapeHTML(image.src)}"
                alt="${escapeHTML(image.alt)}"
                ${createDimensionAttributes(image)}
                loading="lazy"
                decoding="async"
              />
              <span class="event-gallery-open-label">vergrößern</span>
            </button>
            ${
              image.caption
                ? `<figcaption>${escapeHTML(image.caption)}</figcaption>`
                : ""
            }
          </figure>
        `
      )
      .join("");
    const hiddenImageCount = Math.max(
      gallery.length - galleryPreviewLimit,
      0
    );
    const toggleMarkup =
      hiddenImageCount > 0
        ? `
          <button
            class="btn btn-primary event-gallery-toggle"
            type="button"
            aria-controls="event-gallery-items"
            aria-expanded="false"
            data-hidden-image-count="${hiddenImageCount}"
          >
            Weitere ${hiddenImageCount} Bilder anzeigen
          </button>
        `
        : "";

    return `
      <section class="event-section" aria-labelledby="event-gallery-title">
        <h2 id="event-gallery-title">Galerie</h2>
        <div
          class="event-gallery"
          id="event-gallery-items"
          data-gallery-lightbox
        >
          ${figures}
        </div>
        ${toggleMarkup}
      </section>
    `;
  }

  function initializeGalleryToggle() {
    const toggle = detailRoot.querySelector(".event-gallery-toggle");

    if (!toggle) return;

    const galleryItems = Array.from(
      detailRoot.querySelectorAll(".event-gallery-item")
    );
    const hiddenImageCount = Number(toggle.dataset.hiddenImageCount);

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      const buttonTopBeforeCollapse = isExpanded
        ? toggle.getBoundingClientRect().top
        : null;

      galleryItems.forEach((item, index) => {
        item.hidden = isExpanded && index >= galleryPreviewLimit;
      });

      toggle.setAttribute("aria-expanded", String(!isExpanded));
      toggle.textContent = isExpanded
        ? `Weitere ${hiddenImageCount} Bilder anzeigen`
        : "Weniger Bilder anzeigen";

      if (buttonTopBeforeCollapse === null) return;

      const scrollCorrection =
        toggle.getBoundingClientRect().top - buttonTopBeforeCollapse;

      if (scrollCorrection !== 0) {
        window.scrollBy({
          top: scrollCorrection,
          left: 0,
          behavior: "instant"
        });
      }
    });
  }

  function createDimensionAttributes(media) {
    return [
      media.width ? `width="${media.width}"` : "",
      media.height ? `height="${media.height}"` : ""
    ]
      .filter(Boolean)
      .join(" ");
  }

  function getValidEndDate(endValue, start) {
    if (typeof endValue !== "string" || !endValue.trim()) return null;

    const end = new Date(endValue);

    if (!Number.isFinite(end.getTime()) || end.getTime() < start.getTime()) {
      return null;
    }

    return end;
  }

  function getOptionalText(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function isSameDay(firstDate, secondDate) {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function formatDateTime(date) {
    return `${formatDate(date)}, ${formatTime(date)} Uhr`;
  }

  function updateEventMetadata({
    slug,
    title,
    description,
    start,
    location,
    image
  }) {
    const metaDescription = truncateDescription(
      description || createFallbackDescription(title, start, location)
    );

    document.title = `${title} · ${siteName}`;
    setMetaContent("name", "description", metaDescription);
    setMetaContent("property", "og:title", document.title);
    setMetaContent("property", "og:description", metaDescription);
    setMetaContent("property", "og:type", "article");

    const currentUrl = new URL(window.location.href);

    if (isPublicHttpUrl(currentUrl)) {
      currentUrl.search = "";
      currentUrl.hash = "";
      currentUrl.searchParams.set("event", slug);
      setMetaContent("property", "og:url", currentUrl.href);
    } else {
      removeMeta("property", "og:url");
    }

    if (image && isAbsoluteHttpUrl(image.src)) {
      setMetaContent("property", "og:image", image.src);
    } else {
      removeMeta("property", "og:image");
    }
  }

  function updateErrorMetadata(title) {
    document.title = `${title} · ${siteName}`;
    setMetaContent("name", "description", defaultDescription);
    setMetaContent("property", "og:title", document.title);
    setMetaContent("property", "og:description", defaultDescription);
    setMetaContent("property", "og:type", "website");
    removeMeta("property", "og:url");
    removeMeta("property", "og:image");
  }

  function createFallbackDescription(title, start, location) {
    return `${title} am ${formatDate(start)}${
      location ? ` in ${location}` : ""
    }.`;
  }

  function truncateDescription(description) {
    const normalizedDescription = description.replace(/\s+/g, " ").trim();

    if (normalizedDescription.length <= 160) {
      return normalizedDescription;
    }

    return `${normalizedDescription.slice(0, 159).trimEnd()}…`;
  }

  function setMetaContent(attribute, key, content) {
    let meta = document.querySelector(`meta[${attribute}="${key}"]`);

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, key);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  function removeMeta(attribute, key) {
    document.querySelector(`meta[${attribute}="${key}"]`)?.remove();
  }

  function isAbsoluteHttpUrl(value) {
    if (!eventUtils.isSafeUrl(value)) return false;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function isPublicHttpUrl(url) {
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".local") ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) {
      return false;
    }

    return Boolean(hostname);
  }

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        })[character]
    );
  }
})();

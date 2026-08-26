// ==========================================
// Gemeinsame Veranstaltungs-Hilfsfunktionen
// ==========================================

(function exposeEventUtils(globalScope) {
  "use strict";

  const DETAIL_PAGE = "event.html";
  const EVENT_PHASES = Object.freeze({
    UPCOMING: "upcoming",
    ONGOING: "ongoing",
    PAST: "past"
  });
  const EVENT_EDITORIAL_STATUSES = new Set(["cancelled", "postponed"]);
  const RESULT_KINDS = new Set(["file", "external"]);
  const DOCUMENT_TYPES = new Set([
    "announcement",
    "invitation",
    "start-list",
    "result-list",
    "form",
    "certificate",
    "other"
  ]);
  const SCHUETZENKREIS_SUED_LOGO = Object.freeze({
    src: "assets/img/logo-schuetzenkreis-sued.png",
    alt: "Logo des Schützenkreises SUED Sachsen-Anhalt e. V.",
    width: 191,
    height: 191
  });
  const EVENT_ORGANIZER_LOGOS = Object.freeze({
    "Großkaliber Schützengilde 1503 Eckartsberga e.V.": Object.freeze({
      src: "assets/img/logo-gsg-eckartsberga.png",
      alt: "Logo der GSG Eckartsberga",
      width: 360,
      height: 347
    }),
    'Schützenkreis "SUED"': SCHUETZENKREIS_SUED_LOGO,
    "Kreisschützenverband Burgenlandkreis-Weißenfels „Schützenkreis SUED“ Sachsen-Anhalt e.V.":
      SCHUETZENKREIS_SUED_LOGO
  });

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function normalizedString(value) {
    if (typeof value !== "string") return null;

    const normalizedValue = value.trim();
    return normalizedValue ? normalizedValue : null;
  }

  function normalizedOptionalString(value) {
    return normalizedString(value);
  }

  function normalizedDimension(value) {
    return typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
      ? value
      : null;
  }

  function isSafeUrl(value) {
    const normalizedUrl = normalizedString(value);

    if (!normalizedUrl || /[\u0000-\u001F\u007F]/.test(normalizedUrl)) {
      return false;
    }

    if (normalizedUrl.startsWith("//") || normalizedUrl.startsWith("\\\\")) {
      return false;
    }

    const protocolMatch = normalizedUrl.match(/^([a-z][a-z\d+.-]*):/i);

    if (!protocolMatch) {
      return true;
    }

    const protocol = protocolMatch[1].toLowerCase();

    if (protocol !== "http" && protocol !== "https") {
      return false;
    }

    try {
      const parsedUrl = new URL(normalizedUrl);
      return parsedUrl.protocol === `${protocol}:` && Boolean(parsedUrl.hostname);
    } catch {
      return false;
    }
  }

  function isHttpUrl(value) {
    const normalizedUrl = normalizedString(value);

    if (!normalizedUrl || !isSafeUrl(normalizedUrl)) {
      return false;
    }

    try {
      const parsedUrl = new URL(normalizedUrl);
      return (
        (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") &&
        Boolean(parsedUrl.hostname)
      );
    } catch {
      return false;
    }
  }

  function isSafeDocumentUrl(value) {
    const normalizedUrl = normalizedString(value);

    if (!normalizedUrl || !isSafeUrl(normalizedUrl)) {
      return false;
    }

    const protocolMatch = normalizedUrl.match(/^([a-z][a-z\d+.-]*):/i);

    if (!protocolMatch) {
      return true;
    }

    return (
      protocolMatch[1].toLowerCase() === "https" &&
      /^https:\/\//i.test(normalizedUrl)
    );
  }

  function normalizeMediaEntry(value, includeCaption) {
    if (!isRecord(value)) return null;

    const src = normalizedString(value.src);
    const alt = normalizedString(value.alt);

    if (!src || !alt || !isSafeUrl(src)) {
      return null;
    }

    const normalizedEntry = { src, alt };
    const width = normalizedDimension(value.width);
    const height = normalizedDimension(value.height);

    if (includeCaption) {
      const caption = normalizedOptionalString(value.caption);
      if (caption) normalizedEntry.caption = caption;
    }

    if (width !== null) normalizedEntry.width = width;
    if (height !== null) normalizedEntry.height = height;

    return normalizedEntry;
  }

  function normalizeImage(image) {
    return normalizeMediaEntry(image, false);
  }

  function normalizeGallery(gallery) {
    if (!Array.isArray(gallery)) return [];

    return gallery
      .map((item) => normalizeMediaEntry(item, true))
      .filter(Boolean);
  }

  function appendOptionalFileMetadata(target, source) {
    ["description", "fileType", "fileSize"].forEach((property) => {
      const value = normalizedOptionalString(source[property]);
      if (value) target[property] = value;
    });
  }

  function normalizeDownloads(downloads) {
    if (!Array.isArray(downloads)) return [];

    return downloads.reduce((normalizedDownloads, download) => {
      if (!isRecord(download)) return normalizedDownloads;

      const label = normalizedString(download.label);
      const url = normalizedString(download.url);

      if (!label || !url || !isSafeUrl(url)) {
        return normalizedDownloads;
      }

      const normalizedDownload = { label, url };
      appendOptionalFileMetadata(normalizedDownload, download);
      normalizedDownloads.push(normalizedDownload);

      return normalizedDownloads;
    }, []);
  }

  function normalizeDocuments(documents) {
    if (!Array.isArray(documents)) return [];

    return documents.reduce((normalizedDocuments, document) => {
      if (!isRecord(document)) return normalizedDocuments;

      const label = normalizedString(document.label);
      const url = normalizedString(document.url);
      const type = normalizedString(document.type);

      if (!label || !url || !isSafeDocumentUrl(url)) {
        return normalizedDocuments;
      }

      const normalizedDocument = {
        label,
        url,
        type: type && DOCUMENT_TYPES.has(type) ? type : "other"
      };
      appendOptionalFileMetadata(normalizedDocument, document);
      normalizedDocuments.push(normalizedDocument);

      return normalizedDocuments;
    }, []);
  }

  function normalizeResults(results) {
    if (!Array.isArray(results)) return [];

    return results.reduce((normalizedResults, result) => {
      if (!isRecord(result)) return normalizedResults;

      const label = normalizedString(result.label);
      const url = normalizedString(result.url);
      const kind = normalizedString(result.kind);
      const hasSuitableUrl =
        kind === "external" ? isHttpUrl(url) : isSafeUrl(url);

      if (
        !label ||
        !url ||
        !kind ||
        !RESULT_KINDS.has(kind) ||
        !hasSuitableUrl
      ) {
        return normalizedResults;
      }

      const normalizedResult = { label, url, kind };
      appendOptionalFileMetadata(normalizedResult, result);
      normalizedResults.push(normalizedResult);

      return normalizedResults;
    }, []);
  }

  function normalizeEventDocuments(event) {
    if (!isRecord(event)) return [];

    const documents = normalizeDocuments(event.documents);
    const legacyResultDocuments = normalizeDocuments(
      normalizeResults(event.results)
        .filter((result) => result.kind === "file")
        .map((result) => ({
          ...result,
          type: "result-list"
        }))
    );
    const legacyDownloadDocuments = normalizeDocuments(
      normalizeDownloads(event.downloads).map((download) => ({
        ...download,
        type: "other"
      }))
    );
    const seenUrls = new Set();

    return [
      ...documents,
      ...legacyResultDocuments,
      ...legacyDownloadDocuments
    ].filter((document) => {
      if (seenUrls.has(document.url)) return false;

      seenUrls.add(document.url);
      return true;
    });
  }

  function normalizeExternalLinks(externalLinks) {
    if (!Array.isArray(externalLinks)) return [];

    return externalLinks.reduce((normalizedLinks, link) => {
      if (!isRecord(link)) return normalizedLinks;

      const label = normalizedString(link.label);
      const url = normalizedString(link.url);

      if (!label || !url || !isHttpUrl(url)) {
        return normalizedLinks;
      }

      const normalizedLink = { label, url };
      const description = normalizedOptionalString(link.description);

      if (description) normalizedLink.description = description;

      normalizedLinks.push(normalizedLink);
      return normalizedLinks;
    }, []);
  }

  function getEventTitle(event) {
    if (!isRecord(event)) return null;

    return normalizedString(event.title) || normalizedString(event.shortTitle);
  }

  function getEventOrganizerLogo(event) {
    if (!isRecord(event)) return null;

    const organizer = normalizedString(event.organizer);

    if (
      !organizer ||
      !Object.prototype.hasOwnProperty.call(EVENT_ORGANIZER_LOGOS, organizer)
    ) {
      return null;
    }

    return { ...EVENT_ORGANIZER_LOGOS[organizer] };
  }

  function getEventPhase(event, referenceTime = new Date()) {
    if (!isRecord(event)) return null;

    const startValue = normalizedString(event.start);
    const startTime = startValue
      ? new Date(startValue).getTime()
      : Number.NaN;
    const referenceTimestamp = new Date(referenceTime).getTime();

    if (
      !Number.isFinite(startTime) ||
      !Number.isFinite(referenceTimestamp)
    ) {
      return null;
    }

    const endValue = normalizedString(event.end);
    const parsedEndTime = endValue
      ? new Date(endValue).getTime()
      : Number.NaN;
    const effectiveEndTime =
      Number.isFinite(parsedEndTime) && parsedEndTime >= startTime
        ? parsedEndTime
        : startTime;

    if (referenceTimestamp < startTime) {
      return EVENT_PHASES.UPCOMING;
    }

    if (referenceTimestamp <= effectiveEndTime) {
      return EVENT_PHASES.ONGOING;
    }

    return EVENT_PHASES.PAST;
  }

  function getEventEditorialStatus(event) {
    if (!isRecord(event)) return null;

    const editorialStatus = normalizedString(event.editorialStatus);

    if (
      !editorialStatus ||
      !EVENT_EDITORIAL_STATUSES.has(editorialStatus)
    ) {
      return null;
    }

    return editorialStatus;
  }

  function isDetailCapable(event) {
    if (!isRecord(event)) return false;

    const slug = normalizedString(event.slug);
    const title = getEventTitle(event);
    const start = normalizedString(event.start);
    const startTime = start ? new Date(start).getTime() : Number.NaN;

    return Boolean(slug && title && Number.isFinite(startTime));
  }

  function createDetailUrl(event) {
    if (!isDetailCapable(event)) return null;

    return `${DETAIL_PAGE}?event=${encodeURIComponent(event.slug.trim())}`;
  }

  function resolveEventBySlug(eventList, slug) {
    const normalizedSlug = normalizedString(slug);

    if (!Array.isArray(eventList) || !normalizedSlug) {
      return { status: "not-found", event: null, matches: [] };
    }

    const matches = eventList.filter(
      (event) =>
        isRecord(event) &&
        normalizedString(event.slug) === normalizedSlug
    );

    if (matches.length === 0) {
      return { status: "not-found", event: null, matches: [] };
    }

    if (matches.length > 1) {
      return { status: "duplicate", event: null, matches: [...matches] };
    }

    return { status: "found", event: matches[0], matches: [...matches] };
  }

  globalScope.EventUtils = Object.freeze({
    isSafeUrl,
    normalizeImage,
    normalizeGallery,
    normalizeDownloads,
    normalizeDocuments,
    normalizeResults,
    normalizeEventDocuments,
    normalizeExternalLinks,
    getEventTitle,
    getEventOrganizerLogo,
    getEventPhase,
    getEventEditorialStatus,
    isDetailCapable,
    createDetailUrl,
    resolveEventBySlug
  });
})(typeof window !== "undefined" ? window : globalThis);

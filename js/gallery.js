// ==========================================
// Galerie-Vorschau
// ==========================================

function getGalleryRandomValue() {
  const cryptoApi =
    typeof globalThis !== "undefined" ? globalThis.crypto : undefined;

  if (cryptoApi?.getRandomValues) {
    const randomValues = new Uint32Array(1);
    cryptoApi.getRandomValues(randomValues);
    return randomValues[0] / 4294967296;
  }

  return Math.random();
}

function selectRandomGalleryIndex(itemCount, currentIndex = -1, randomValue) {
  if (!Number.isInteger(itemCount) || itemCount < 1) return -1;
  if (itemCount === 1) return 0;

  const excludedIndex =
    Number.isInteger(currentIndex) &&
    currentIndex >= 0 &&
    currentIndex < itemCount
      ? currentIndex
      : -1;
  const availableCount = itemCount - (excludedIndex >= 0 ? 1 : 0);
  const suppliedRandomValue = Number.isFinite(randomValue)
    ? randomValue
    : getGalleryRandomValue();
  const normalizedRandomValue = Math.min(
    Math.max(suppliedRandomValue, 0),
    0.9999999999999999
  );
  let selectedIndex = Math.floor(normalizedRandomValue * availableCount);

  if (excludedIndex >= 0 && selectedIndex >= excludedIndex) {
    selectedIndex += 1;
  }

  return selectedIndex;
}

function getNextGalleryHistoryState(
  history,
  historyPosition,
  itemCount,
  randomValue
) {
  const safeHistory = Array.isArray(history) ? history.slice() : [];
  const safePosition = Number.isInteger(historyPosition)
    ? Math.min(Math.max(historyPosition, 0), Math.max(safeHistory.length - 1, 0))
    : 0;

  if (safePosition < safeHistory.length - 1) {
    const nextPosition = safePosition + 1;

    return {
      history: safeHistory,
      position: nextPosition,
      index: safeHistory[nextPosition]
    };
  }

  const currentIndex = safeHistory[safePosition] ?? -1;
  const nextIndex = selectRandomGalleryIndex(
    itemCount,
    currentIndex,
    randomValue
  );
  const nextHistory = safeHistory.slice(0, safePosition + 1);

  nextHistory.push(nextIndex);

  if (nextHistory.length > 100) {
    nextHistory.shift();
  }

  return {
    history: nextHistory,
    position: nextHistory.length - 1,
    index: nextIndex
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    appendEventGalleryImages();

    const galleryPreview = document.querySelector(".gallery-preview");
    const galleryFeatures = Array.from(
      galleryPreview?.querySelectorAll(".gallery-feature") ?? []
    );
    const controls = galleryPreview?.querySelector("[data-gallery-controls]");
    const previousButton = galleryPreview?.querySelector(
      "[data-gallery-previous]"
    );
    const nextButton = galleryPreview?.querySelector("[data-gallery-next]");
    const toggleButton = galleryPreview?.querySelector("[data-gallery-toggle]");
    const position = galleryPreview?.querySelector("[data-gallery-position]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
      galleryFeatures.length === 0 ||
      !galleryPreview ||
      !controls ||
      !previousButton ||
      !nextButton ||
      !toggleButton ||
      !position
    ) {
      return;
    }

    let currentIndex = selectRandomGalleryIndex(galleryFeatures.length);
    let history = [currentIndex];
    let historyPosition = 0;
    let rotationTimer = null;
    let autoplayEnabled = galleryFeatures.length > 1 && !reducedMotion.matches;

    function renderCurrentImage() {
      galleryFeatures.forEach((feature, index) => {
        const isActive = index === currentIndex;
        const featureLink = feature.querySelector("a");

        feature.classList.toggle("is-active", isActive);
        feature.setAttribute("aria-hidden", String(!isActive));

        if (featureLink) {
          featureLink.tabIndex = isActive ? 0 : -1;
        }
      });

      position.textContent = `Bild ${currentIndex + 1} von ${galleryFeatures.length}`;
      previousButton.disabled = historyPosition === 0;
    }

    function stopRotationTimer() {
      if (rotationTimer === null) return;

      window.clearInterval(rotationTimer);
      rotationTimer = null;
    }

    function updateAutoplayControl() {
      const canAutoplay = galleryFeatures.length > 1 && !reducedMotion.matches;
      const controlLabel = autoplayEnabled
        ? "Automatischen Wechsel pausieren"
        : "Automatischen Wechsel fortsetzen";

      toggleButton.hidden = !canAutoplay;
      toggleButton.dataset.autoplayState = autoplayEnabled
        ? "running"
        : "paused";
      toggleButton.setAttribute("aria-label", controlLabel);
      toggleButton.title = controlLabel;
      toggleButton.setAttribute("aria-pressed", String(!autoplayEnabled));
    }

    function showNextImage() {
      const nextState = getNextGalleryHistoryState(
        history,
        historyPosition,
        galleryFeatures.length
      );

      history = nextState.history;
      historyPosition = nextState.position;
      currentIndex = nextState.index;
      renderCurrentImage();
    }

    function startRotationTimer() {
      stopRotationTimer();

      if (
        !autoplayEnabled ||
        reducedMotion.matches ||
        galleryFeatures.length < 2
      ) {
        return;
      }

      rotationTimer = window.setInterval(showNextImage, 6500);
    }

    function pauseAutoplay() {
      if (!autoplayEnabled) return;

      autoplayEnabled = false;
      stopRotationTimer();
      updateAutoplayControl();
    }

    renderCurrentImage();
    controls.hidden = galleryFeatures.length < 2;
    updateAutoplayControl();
    startRotationTimer();

    previousButton.addEventListener("click", () => {
      pauseAutoplay();

      if (historyPosition === 0) return;

      historyPosition -= 1;
      currentIndex = history[historyPosition];
      renderCurrentImage();
    });

    nextButton.addEventListener("click", () => {
      pauseAutoplay();
      showNextImage();
    });

    toggleButton.addEventListener("click", () => {
      autoplayEnabled = !autoplayEnabled;
      updateAutoplayControl();
      startRotationTimer();
    });

    galleryPreview.addEventListener("pointerenter", pauseAutoplay);
    galleryPreview.addEventListener("focusin", pauseAutoplay);

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
  });
}

function appendEventGalleryImages() {
  const galleryPreview = document.querySelector(".gallery-preview");
  const galleryCopy = galleryPreview?.querySelector(".gallery-preview-copy");
  const eventList = typeof events !== "undefined" && Array.isArray(events) ? events : [];
  const eventUtils = window.EventUtils;

  if (!galleryPreview || !galleryCopy || !eventUtils) return;

  const eventGalleryImages = eventList.flatMap((event) => {
    const detailUrl = eventUtils.createDetailUrl(event);
    const eventTitle = eventUtils.getEventTitle(event) || "Veranstaltung";

    return eventUtils.normalizeGallery(event.gallery).map((image) => ({
      detailUrl,
      eventTitle,
      image
    }));
  });

  if (eventGalleryImages.length === 0) return;

  galleryPreview
    .querySelectorAll(".gallery-feature")
    .forEach((feature) => feature.remove());

  eventGalleryImages.forEach(({ detailUrl, eventTitle, image }) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-feature";
    let contentContainer = figure;

    if (detailUrl) {
      const link = document.createElement("a");
      link.className = "gallery-feature-link";
      link.href = detailUrl;
      link.setAttribute(
        "aria-label",
        `Veranstaltungsdetails: ${eventTitle}`
      );
      figure.append(link);
      contentContainer = link;
    }

    const imageElement = document.createElement("img");
    imageElement.src = image.src;
    imageElement.alt = image.alt;
    imageElement.loading = "lazy";
    imageElement.decoding = "async";

    if (Number.isFinite(image.width)) {
      imageElement.width = image.width;
    }

    if (Number.isFinite(image.height)) {
      imageElement.height = image.height;
    }

    contentContainer.append(imageElement);

    if (image.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = image.caption;
      contentContainer.append(caption);
    }

    galleryPreview.insertBefore(figure, galleryCopy);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    selectRandomGalleryIndex,
    getNextGalleryHistoryState
  };
}

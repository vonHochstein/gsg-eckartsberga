// ==========================================
// Galerie-Vorschau
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
  appendEventGalleryImages();

  const galleryFeatures = document.querySelectorAll(".gallery-feature");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (galleryFeatures.length === 0) {
    return;
  }

  galleryFeatures.forEach((feature, index) => {
    feature.classList.toggle("is-active", index === 0);
  });

  if (galleryFeatures.length < 2 || reducedMotion.matches) {
    return;
  }

  let currentIndex = 0;

  setInterval(() => {
    galleryFeatures[currentIndex].classList.remove("is-active");

    currentIndex = (currentIndex + 1) % galleryFeatures.length;

    galleryFeatures[currentIndex].classList.add("is-active");
  }, 6500);
});

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

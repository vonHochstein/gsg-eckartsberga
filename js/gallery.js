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

  if (!galleryPreview || !galleryCopy) return;

  const eventGalleryImages = eventList.flatMap((event) =>
    Array.isArray(event.gallery)
      ? event.gallery.filter(
          (image) => image && typeof image === "object" && image.src
        )
      : []
  );

  if (eventGalleryImages.length === 0) return;

  galleryPreview
    .querySelectorAll(".gallery-feature")
    .forEach((feature) => feature.remove());

  eventGalleryImages.forEach((image) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-feature";

    const imageElement = document.createElement("img");
    imageElement.src = image.src;
    imageElement.alt = image.alt || "";
    imageElement.loading = "lazy";
    imageElement.decoding = "async";

    if (Number.isFinite(image.width)) {
      imageElement.width = image.width;
    }

    if (Number.isFinite(image.height)) {
      imageElement.height = image.height;
    }

    figure.append(imageElement);

    if (image.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = image.caption;
      figure.append(caption);
    }

    galleryPreview.insertBefore(figure, galleryCopy);
  });
}

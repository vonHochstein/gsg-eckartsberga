// ==========================================
// Gemeinsame Galerie-Lightbox
// ==========================================

(function initializeGalleryLightbox() {
  "use strict";

  function initialize() {
    const galleryRoot = document.querySelector("[data-gallery-lightbox]");
    const dialog = document.getElementById("event-lightbox");
    const closeButton = document.getElementById("event-lightbox-close");
    const previousButton = document.getElementById("event-lightbox-previous");
    const nextButton = document.getElementById("event-lightbox-next");
    const lightboxImage = document.getElementById("event-lightbox-image");
    const lightboxCaption = document.getElementById("event-lightbox-caption");
    const lightboxPosition = document.getElementById("event-lightbox-position");

    if (
      !galleryRoot ||
      !dialog ||
      typeof dialog.showModal !== "function" ||
      !closeButton ||
      !previousButton ||
      !nextButton ||
      !lightboxImage ||
      !lightboxCaption ||
      !lightboxPosition
    ) {
      return;
    }

    const galleryTriggers = Array.from(
      galleryRoot.querySelectorAll("[data-gallery-index]")
    );
    const gallery = galleryTriggers
      .map((trigger) => {
        const image = trigger.querySelector("img");
        const caption = trigger.closest("figure")?.querySelector("figcaption");

        if (!image?.getAttribute("src") || !image.getAttribute("alt")) {
          return null;
        }

        return {
          src: image.getAttribute("src"),
          alt: image.getAttribute("alt"),
          width: Number(image.getAttribute("width")) || null,
          height: Number(image.getAttribute("height")) || null,
          caption: caption?.textContent.trim() || ""
        };
      })
      .filter(Boolean);

    if (gallery.length === 0 || gallery.length !== galleryTriggers.length) {
      return;
    }

    let currentIndex = 0;
    let invokingButton = null;
    let pointerStartedOnBackdrop = false;

    galleryRoot.addEventListener("click", (event) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("[data-gallery-index]")
          : null;

      if (!target || !galleryRoot.contains(target)) return;

      const requestedIndex = galleryTriggers.indexOf(target);

      if (requestedIndex < 0) return;

      invokingButton = target;
      showGalleryImage(requestedIndex);
      dialog.showModal();
      closeButton.focus({ preventScroll: true });
    });

    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => {
      navigateGallery(-1);
    });
    nextButton.addEventListener("click", () => {
      navigateGallery(1);
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateGallery(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateGallery(1);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
    });

    dialog.addEventListener("pointerdown", (event) => {
      pointerStartedOnBackdrop = event.target === dialog;
    });

    dialog.addEventListener("pointercancel", () => {
      pointerStartedOnBackdrop = false;
    });

    dialog.addEventListener("click", (event) => {
      const shouldClose =
        pointerStartedOnBackdrop && event.target === dialog;

      pointerStartedOnBackdrop = false;

      if (shouldClose) {
        closeLightbox();
      }
    });

    dialog.addEventListener("close", () => {
      const focusTarget = invokingButton;
      invokingButton = null;
      pointerStartedOnBackdrop = false;

      if (focusTarget?.isConnected) {
        focusTarget.focus({ preventScroll: true });
      }
    });

    function showGalleryImage(index) {
      if (index < 0 || index >= gallery.length) return;

      const image = gallery[index];
      const hasMultipleImages = gallery.length > 1;

      currentIndex = index;
      lightboxImage.setAttribute("src", image.src);
      lightboxImage.setAttribute("alt", image.alt);
      lightboxImage.removeAttribute("width");
      lightboxImage.removeAttribute("height");

      if (image.width) {
        lightboxImage.setAttribute("width", String(image.width));
      }

      if (image.height) {
        lightboxImage.setAttribute("height", String(image.height));
      }

      lightboxCaption.textContent = image.caption;
      lightboxCaption.hidden = !image.caption;
      lightboxPosition.textContent = `Bild ${index + 1} von ${gallery.length}`;

      previousButton.hidden = !hasMultipleImages;
      nextButton.hidden = !hasMultipleImages;
      previousButton.setAttribute("aria-disabled", String(index === 0));
      nextButton.setAttribute(
        "aria-disabled",
        String(index === gallery.length - 1)
      );
    }

    function navigateGallery(direction) {
      const targetIndex = currentIndex + direction;

      if (targetIndex < 0 || targetIndex >= gallery.length) return;

      showGalleryImage(targetIndex);
    }

    function closeLightbox() {
      if (dialog.open) {
        dialog.close();
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

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
    const lightboxVideo = document.getElementById("event-lightbox-video");
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
        if (trigger.dataset.galleryKind === "video") {
          const src = trigger.dataset.gallerySrc?.trim();
          const title = trigger.dataset.galleryTitle?.trim();

          if (!lightboxVideo || !src || !title) return null;

          return {
            kind: "video",
            src,
            title,
            poster: trigger.dataset.galleryPoster?.trim() || "",
            width: Number(trigger.dataset.galleryWidth) || null,
            height: Number(trigger.dataset.galleryHeight) || null,
            caption:
              trigger.closest("figure")?.querySelector("figcaption")?.textContent.trim() || ""
          };
        }

        const image = trigger.querySelector("img");
        const caption = trigger.closest("figure")?.querySelector("figcaption");

        if (!image?.getAttribute("src") || !image.getAttribute("alt")) {
          return null;
        }

        return {
          kind: "image",
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
    const galleryHasVideos = gallery.some((item) => item.kind === "video");

    galleryRoot.addEventListener("click", (event) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("[data-gallery-index]")
          : null;

      if (!target || !galleryRoot.contains(target)) return;

      const requestedIndex = galleryTriggers.indexOf(target);

      if (requestedIndex < 0) return;

      invokingButton = target;
      showGalleryMedia(requestedIndex);
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

      const videoHasFocus =
        lightboxVideo &&
        event.target instanceof Element &&
        (event.target === lightboxVideo || event.target.closest("video"));

      if (event.key === "ArrowLeft" && !videoHasFocus) {
        event.preventDefault();
        navigateGallery(-1);
      }

      if (event.key === "ArrowRight" && !videoHasFocus) {
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
      pauseAndResetVideo();
      const focusTarget = invokingButton;
      invokingButton = null;
      pointerStartedOnBackdrop = false;

      if (focusTarget?.isConnected) {
        focusTarget.focus({ preventScroll: true });
      }
    });

    function showGalleryMedia(index) {
      if (index < 0 || index >= gallery.length) return;

      const item = gallery[index];
      const hasMultipleMedia = gallery.length > 1;

      currentIndex = index;
      pauseAndResetVideo();

      if (item.kind === "video") {
        showVideo(item);
      } else {
        showImage(item);
      }

      lightboxCaption.textContent = item.caption;
      lightboxCaption.hidden = !item.caption;
      lightboxPosition.textContent = `${galleryHasVideos ? "Medium" : "Bild"} ${index + 1} von ${gallery.length}`;

      previousButton.hidden = !hasMultipleMedia;
      nextButton.hidden = !hasMultipleMedia;
      previousButton.setAttribute(
        "aria-label",
        galleryHasVideos ? "Vorheriges Medium" : "Vorheriges Bild"
      );
      nextButton.setAttribute(
        "aria-label",
        galleryHasVideos ? "Nächstes Medium" : "Nächstes Bild"
      );
      previousButton.setAttribute("aria-disabled", String(index === 0));
      nextButton.setAttribute(
        "aria-disabled",
        String(index === gallery.length - 1)
      );
    }

    function showImage(image) {
      lightboxImage.hidden = false;
      lightboxImage.setAttribute("src", image.src);
      lightboxImage.setAttribute("alt", image.alt);
      setMediaDimensions(lightboxImage, image);

      if (lightboxVideo) {
        lightboxVideo.hidden = true;
      }
    }

    function showVideo(video) {
      if (!lightboxVideo) return;

      lightboxImage.hidden = true;
      lightboxVideo.hidden = false;
      lightboxVideo.setAttribute("src", video.src);
      lightboxVideo.setAttribute("aria-label", video.title);
      setMediaDimensions(lightboxVideo, video);

      if (video.poster) {
        lightboxVideo.setAttribute("poster", video.poster);
      } else {
        lightboxVideo.removeAttribute("poster");
      }

      lightboxVideo.load();
    }

    function setMediaDimensions(element, media) {
      element.removeAttribute("width");
      element.removeAttribute("height");

      if (media.width) {
        element.setAttribute("width", String(media.width));
      }

      if (media.height) {
        element.setAttribute("height", String(media.height));
      }
    }

    function pauseAndResetVideo() {
      if (!lightboxVideo) return;

      lightboxVideo.pause();

      try {
        lightboxVideo.currentTime = 0;
      } catch (_error) {
        // Ein noch nicht geladener lokaler Stream besitzt keine suchbare Position.
      }

      lightboxVideo.removeAttribute("src");
      lightboxVideo.removeAttribute("poster");
      lightboxVideo.removeAttribute("aria-label");
      lightboxVideo.removeAttribute("width");
      lightboxVideo.removeAttribute("height");
      lightboxVideo.load();
      lightboxVideo.hidden = true;
    }

    function navigateGallery(direction) {
      const targetIndex = currentIndex + direction;

      if (targetIndex < 0 || targetIndex >= gallery.length) return;

      showGalleryMedia(targetIndex);
    }

    function closeLightbox() {
      if (dialog.open) {
        pauseAndResetVideo();
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

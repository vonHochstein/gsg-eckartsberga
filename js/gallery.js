// ==========================================
// Galerie-Vorschau
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
  const galleryFeatures = document.querySelectorAll(".gallery-feature");

  if (galleryFeatures.length < 2) {
    return;
  }

  let currentIndex = 0;

  setInterval(() => {
    galleryFeatures[currentIndex].classList.remove("is-active");

    currentIndex = (currentIndex + 1) % galleryFeatures.length;

    galleryFeatures[currentIndex].classList.add("is-active");
  }, 5000);
});
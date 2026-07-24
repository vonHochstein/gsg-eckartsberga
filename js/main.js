const currentYear = document.getElementById("current-year");
const developmentDataBanner = document.getElementById("development-data-banner");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (
  developmentDataBanner &&
  document.documentElement.dataset.developmentData === "active"
) {
  developmentDataBanner.removeAttribute("hidden");
}

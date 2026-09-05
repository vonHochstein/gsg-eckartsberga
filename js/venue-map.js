// ==========================================
// Kartenansicht für Veranstaltungsorte
// ==========================================

(function initializeVenueMap(globalScope) {
  "use strict";

  const TILE_CONFIG = Object.freeze({
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>',
    maxZoom: 19
  });
  const initialZoom = 16;
  const dialog = document.getElementById("venue-map-dialog");
  const panel = dialog?.querySelector(".venue-map-panel");
  const closeButton = document.getElementById("venue-map-close");
  const venueName = document.getElementById("venue-map-name");
  const venueDescription = document.getElementById("venue-map-description");
  const mapCanvas = document.getElementById("venue-map-canvas");
  const mapStatus = document.getElementById("venue-map-status");
  const externalLink = document.getElementById("venue-map-external");
  let activeTrigger = null;
  let currentLocation = null;
  let map = null;
  let backdropPointerDown = false;
  let reportedTileError = false;

  function normalizeMapLocation(location) {
    if (!location || typeof location !== "object") return null;

    const name =
      typeof location.name === "string" ? location.name.trim() : "";
    const description =
      typeof location.description === "string"
        ? location.description.trim()
        : "";
    const latitude = location.latitude;
    const longitude = location.longitude;

    if (
      !name ||
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return {
      name,
      ...(description ? { description } : {}),
      latitude,
      longitude
    };
  }

  function createOpenStreetMapUrl(location) {
    const latitude = encodeURIComponent(String(location.latitude));
    const longitude = encodeURIComponent(String(location.longitude));

    return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${initialZoom}/${latitude}/${longitude}`;
  }

  function reportMapError() {
    if (!mapStatus || reportedTileError) return;

    reportedTileError = true;
    mapStatus.hidden = false;
    mapStatus.textContent =
      "Die Kartendarstellung konnte nicht vollständig geladen werden. Der Standort bleibt über den OpenStreetMap-Link erreichbar.";
  }

  function destroyMap() {
    if (map) {
      map.remove();
      map = null;
    }

    mapCanvas?.replaceChildren();
    reportedTileError = false;

    if (mapStatus) {
      mapStatus.hidden = true;
      mapStatus.textContent = "";
    }
  }

  function renderMap() {
    if (!currentLocation || !mapCanvas) return;

    if (!globalScope.L || typeof globalScope.L.map !== "function") {
      reportMapError();
      return;
    }

    destroyMap();

    const reduceMotion = globalScope.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches === true;

    map = globalScope.L.map(mapCanvas, {
      center: [currentLocation.latitude, currentLocation.longitude],
      zoom: initialZoom,
      fadeAnimation: !reduceMotion,
      keyboard: true,
      markerZoomAnimation: !reduceMotion,
      scrollWheelZoom: true,
      touchZoom: true,
      zoomAnimation: !reduceMotion
    });
    map.attributionControl.setPrefix(false);

    globalScope.L
      .tileLayer(TILE_CONFIG.url, {
        attribution: TILE_CONFIG.attribution,
        maxZoom: TILE_CONFIG.maxZoom,
        crossOrigin: true
      })
      .on("tileerror", reportMapError)
      .addTo(map);

    globalScope.L
      .circleMarker(
        [currentLocation.latitude, currentLocation.longitude],
        {
          radius: 9,
          color: "#ffffff",
          weight: 3,
          fillColor: "#9b1c1c",
          fillOpacity: 1
        }
      )
      .addTo(map);

    globalScope.requestAnimationFrame(() => map?.invalidateSize());
  }

  function open(trigger, location) {
    const normalizedLocation = normalizeMapLocation(location);

    if (!dialog || !normalizedLocation) return false;

    destroyMap();
    activeTrigger =
      trigger && typeof trigger.focus === "function" ? trigger : null;
    currentLocation = normalizedLocation;

    if (venueName) venueName.textContent = currentLocation.name;

    if (venueDescription) {
      venueDescription.textContent = currentLocation.description || "";
      venueDescription.hidden = !currentLocation.description;
    }

    if (mapCanvas) {
      mapCanvas.setAttribute(
        "aria-label",
        `OpenStreetMap-Karte für ${currentLocation.name}`
      );
    }

    if (externalLink) {
      externalLink.href = createOpenStreetMapUrl(currentLocation);
    }

    dialog.showModal();
    closeButton?.focus();
    globalScope.requestAnimationFrame(renderMap);
    return true;
  }

  function locationFromTrigger(trigger) {
    return {
      name: trigger.dataset.venueName,
      description: trigger.dataset.venueDescription,
      latitude: Number(trigger.dataset.venueLatitude),
      longitude: Number(trigger.dataset.venueLongitude)
    };
  }

  if (dialog) {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest?.("[data-venue-map-trigger]");

      if (!trigger) return;
      open(trigger, locationFromTrigger(trigger));
    });

    closeButton?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      dialog.close();
    });

    dialog.addEventListener("pointerdown", (event) => {
      backdropPointerDown = event.target === dialog;
    });

    dialog.addEventListener("pointercancel", () => {
      backdropPointerDown = false;
    });

    dialog.addEventListener("click", (event) => {
      const isBackdropClick =
        event.target === dialog &&
        backdropPointerDown &&
        !panel?.contains(event.target);

      backdropPointerDown = false;
      if (isBackdropClick) dialog.close();
    });

    dialog.addEventListener("close", () => {
      destroyMap();
      currentLocation = null;

      if (activeTrigger?.isConnected) {
        activeTrigger.focus();
      }

      activeTrigger = null;
    });

    globalScope.addEventListener("resize", () => map?.invalidateSize());
  }

  globalScope.VenueMap = Object.freeze({ open });
})(window);

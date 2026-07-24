// ==========================================
// GSG Eckartsberga
// Zentrale Terminverwaltung
// ==========================================
//
// Alle Termine werden ausschließlich hier gepflegt.
// Countdown, Veranstaltungskalender, Archiv und weitere Bereiche
// greifen später auf dieselben Daten zu.
//
// Hinweis zur Pflege:
// - start und end immer im Format JJJJ-MM-TTTHH:MM:SS eintragen.
// - category steuert die sichtbare Einordnung des Termins.
// - featured kann später genutzt werden, um Termine besonders hervorzuheben.
// - results und gallery werden später für Ergebnislisten und Bildergalerien genutzt.
//

// ENTWICKLUNGSSCHALTER:
// true  = produktive Termine plus klar markierte Entwicklungs-Testdaten
// false = ausschließlich produktive Termine
// Vor jeder Veröffentlichung muss dieser Wert auf false gesetzt werden.
const USE_DEMO_DATA = true;

const productionEvents = [
  {
    id: 1,
    slug: "km-wurfscheibe-2026",
    title: "KM Wurfscheibe",
    shortTitle: "Wurfscheibe",
    category: "Kreismeisterschaft",
    start: "2026-03-07T09:00:00",
    end: "2026-03-07T17:00:00",
    location: "Lossa",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 2,
    slug: "km-gk-kurzwaffe-2026",
    title: "KM GK Kurzwaffe",
    shortTitle: "GK Kurzwaffe",
    category: "Kreismeisterschaft",
    start: "2026-03-20T09:00:00",
    end: "2026-03-21T17:00:00",
    location: "Hohenmölsen",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 3,
    slug: "km-kk-kurzwaffe-2026",
    title: "KM KK Kurzwaffe",
    shortTitle: "KK Kurzwaffe",
    category: "Kreismeisterschaft",
    start: "2026-04-24T09:00:00",
    end: "2026-04-25T17:00:00",
    location: "Hohenmölsen",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 4,
    slug: "km-olympisches-schnellfeuer-2026",
    title: "KM Olympisches Schnellfeuer",
    shortTitle: "Olympisches Schnellfeuer",
    category: "Kreismeisterschaft",
    start: "2026-04-26T09:00:00",
    end: "2026-04-26T17:00:00",
    location: "Hohenmölsen",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 5,
    slug: "km-kk-zielfernrohr-2026",
    title: "KM KK Zielfernrohr",
    shortTitle: "KK Zielfernrohr",
    category: "Kreismeisterschaft",
    start: "2026-05-15T09:00:00",
    end: "2026-05-15T17:00:00",
    location: "Lützen",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 6,
    slug: "km-kk-gewehr-2026",
    title: "KM KK Gewehr",
    shortTitle: "KK Gewehr",
    category: "Kreismeisterschaft",
    start: "2026-05-23T09:00:00",
    end: "2026-05-23T17:00:00",
    location: "Weißenfels",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 7,
    slug: "km-vorderlader-2026",
    title: "KM Vorderlader",
    shortTitle: "Vorderlader",
    category: "Kreismeisterschaft",
    start: "2026-05-30T09:00:00",
    end: "2026-05-30T17:00:00",
    location: "Prittitz",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 8,
    slug: "km-ordonnanz-100m-gk-gewehr-2026",
    title: "KM Ordonnanz- / 100 m GK Gewehr",
    shortTitle: "Ordonnanz / 100 m GK Gewehr",
    category: "Kreismeisterschaft",
    start: "2026-07-04T09:00:00",
    end: "2026-07-04T17:00:00",
    location: "Markröhlitz",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 9,
    slug: "km-halbautomat-kk-gk-2026",
    title: "KM Halbautomat KK / GK",
    shortTitle: "Halbautomat KK / GK",
    category: "Kreismeisterschaft",
    start: "2026-09-12T09:00:00",
    end: "2026-09-12T17:00:00",
    location: "Markröhlitz",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 10,
    slug: "km-luftgewehr-luftpistole-2026",
    title: "KM Luftgewehr & Luftpistole",
    shortTitle: "Luftgewehr & Luftpistole",
    category: "Kreismeisterschaft",
    start: "2026-11-06T09:00:00",
    end: "2026-11-07T17:00:00",
    location: "",
    organizer: "Kreisschützenverband",
    description: "",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false
  }
];

const events =
  USE_DEMO_DATA &&
  typeof developmentEvents !== "undefined" &&
  Array.isArray(developmentEvents)
    ? [...productionEvents, ...developmentEvents]
    : [...productionEvents];

if (
  USE_DEMO_DATA &&
  events.length > productionEvents.length &&
  typeof document !== "undefined"
) {
  document.documentElement.dataset.developmentData = "active";
}

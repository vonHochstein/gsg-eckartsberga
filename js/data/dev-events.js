// ============================================================
// ENTWICKLUNGS-TESTDATEN – NICHT PRODUKTIV VERÖFFENTLICHEN
// ============================================================
//
// Diese Einträge sind erfunden und dienen ausschließlich dazu,
// Archiv und Galerie während der Entwicklung zu prüfen.
//
// Aktivierung:
// Den Schalter USE_DEMO_DATA am Anfang von events.js setzen.
// Vor jeder Veröffentlichung muss USE_DEMO_DATA auf false stehen.

const developmentEvents = [
  {
    id: 92023,
    slug: "demo-archivprobe-2023",
    title: "[DEMO] Archivprobe 2023",
    shortTitle: "[DEMO] 2023",
    category: "Entwicklungs-Testdaten",
    start: "2023-05-13T10:00:00",
    end: "2023-05-13T15:00:00",
    location: "Testort – keine echten Vereinsdaten",
    organizer: "Nicht produktiv",
    description: "Kurzer Testeintrag für ein älteres Archivjahr.",
    image: "",
    downloads: [],
    results: [],
    gallery: [
      {
        src: "assets/img/history-eckartsberga.jpg",
        alt: "Historische Vereinsaufnahme als nicht produktives Testbild",
        caption: "[DEMO] Einzelbild zur Archivprobe 2023",
        width: 359,
        height: 259
      }
    ],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false,
    developmentOnly: true
  },
  {
    id: 92024,
    slug: "demo-bild-ohne-galerie-2024",
    title: "[DEMO] Bild ohne Galerie",
    shortTitle: "[DEMO] Bildtest",
    category: "Entwicklungs-Testdaten",
    start: "2024-08-24T09:30:00",
    end: "2024-08-24T13:00:00",
    location: "Testort – keine echten Vereinsdaten",
    organizer: "Nicht produktiv",
    description:
      "Dieser erfundene Eintrag prüft eine Veranstaltung mit Titelbild, aber ohne Galerie.",
    image: "assets/img/hero-eckartsburg.jpg",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false,
    developmentOnly: true
  },
  {
    id: 92051,
    slug: "demo-mehrbild-galerie-2025",
    title: "[DEMO] Mehrbild-Galerie 2025",
    shortTitle: "[DEMO] Galerie",
    category: "Entwicklungs-Testdaten",
    start: "2025-04-12T09:00:00",
    end: "2025-04-12T18:00:00",
    location: "Testort – keine echten Vereinsdaten",
    organizer: "Nicht produktiv",
    description:
      "Nicht produktiver Prüfeintrag mit mehreren vorhandenen lokalen Bildern für den Wechsel der Galerievorschau.",
    image: "assets/img/history-eckartsberga.jpg",
    downloads: [],
    results: [],
    gallery: [
      {
        src: "assets/img/history-eckartsberga.jpg",
        alt: "Historische Vereinsaufnahme als nicht produktives Testbild",
        caption: "[DEMO] Mehrbild-Galerie 2025 · Aufnahme 1",
        width: 359,
        height: 259
      },
      {
        src: "assets/img/hero-eckartsburg.jpg",
        alt: "Eckartsburg als nicht produktives Testbild",
        caption: "[DEMO] Mehrbild-Galerie 2025 · Aufnahme 2",
        width: 1673,
        height: 940
      }
    ],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false,
    developmentOnly: true
  },
  {
    id: 92052,
    slug: "demo-langer-titel-und-text-2025",
    title:
      "[DEMO] Veranstaltung mit bewusst langem Titel zur Prüfung schmaler Kartenansichten",
    shortTitle: "[DEMO] Langtext",
    category: "Entwicklungs-Testdaten",
    start: "2025-10-18T11:00:00",
    end: "2025-10-18T16:30:00",
    location: "Längerer Testort – weiterhin keine echten Vereinsdaten",
    organizer: "Nicht produktiv",
    description:
      "Dieser vollständig erfundene Beschreibungstext ist absichtlich länger. Er prüft Zeilenumbrüche, Kartenhöhen und die Lesbarkeit im Jahresarchiv, ohne dabei eine reale Veranstaltung oder Aussage des Vereins darzustellen.",
    image: "",
    downloads: [],
    results: [],
    gallery: [],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false,
    developmentOnly: true
  },
  {
    id: 92026,
    slug: "demo-archiv-und-galerie-2026",
    title: "[DEMO] Archiv- und Galerieprobe 2026",
    shortTitle: "[DEMO] 2026",
    category: "Entwicklungs-Testdaten",
    start: "2026-01-17T10:00:00",
    end: "2026-01-17T14:00:00",
    location: "Testort – keine echten Vereinsdaten",
    organizer: "Nicht produktiv",
    description:
      "Entwicklungswerkzeug für das aktuelle Archivjahr; keine echte Vereinsveranstaltung.",
    image: "assets/img/hero-eckartsburg.jpg",
    downloads: [],
    results: [],
    gallery: [
      {
        src: "assets/img/hero-eckartsburg.jpg",
        alt: "Eckartsburg als nicht produktives Testbild",
        caption: "[DEMO] Galerieprobe für das Archivjahr 2026",
        width: 1673,
        height: 940
      }
    ],
    links: [],
    registrationRequired: false,
    archive: true,
    featured: false,
    developmentOnly: true
  }
];

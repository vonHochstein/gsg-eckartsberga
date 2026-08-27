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
// - optionale Detailinhalte bleiben leer, solange keine echten Inhalte vorliegen.
//

// ENTWICKLUNGSSCHALTER:
// true  = produktive Termine plus klar markierte Entwicklungs-Testdaten
// false = ausschließlich produktive Termine
// Vor jeder Veröffentlichung muss dieser Wert auf false gesetzt werden.
const USE_DEMO_DATA = false;

const productionEvents = [
  {
    id: 18,
    slug: "hans-peter-nolding-pokal-2025",
    title: "Hans-Peter-Nolding-Pokal 2025",
    shortTitle: "Hans-Peter-Nolding-Pokal",
    category: "Pokalwettkampf",
    start: "2025-06-14T09:00:00",
    end: "2025-06-14T13:00:00",
    location:
      "Schießstand SV Hohenmölsen, Am Werk 4, 06679 Hohenmölsen OT Rössuln",
    organizer: "Schützenverein 1990 Hohenmölsen e.V. gegr. 1748",
    description:
      "Der Schützenverein 1990 Hohenmölsen lädt am 14. Juni 2025 zum Hans-Peter-Nolding-Pokal ein. Geschossen werden 20 Schuss mit der KK-Pistole in offener Klasse.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Hans-Peter-Nolding-Pokal 2025",
        url: "assets/documents/events/2025/2025_05_14 Ausschreibung Hans-Peter-Nolding-Pokal 2025.pdf",
        type: "announcement"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
    archive: true,
    featured: false
  },
  {
    id: 17,
    slug: "schuetzenfest-langendorf-2025",
    title: "Schützenfest Langendorf 2025",
    shortTitle: "Schützenfest Langendorf",
    category: "Schützenfest",
    start: "2025-06-14T12:00:00",
    location:
      "Schießstand des Schützenvereins 1874 Langendorf e.V., Langendorf",
    organizer: "Schützenverein 1874 Langendorf e.V.",
    description:
      "Der Schützenverein 1874 Langendorf lädt am 14. Juni 2025 zum Schützenfest ein. Ab 12 Uhr wird Mittagessen angeboten; der offizielle Teil mit verschiedenen Schießstationen beginnt um 13 Uhr.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Einladung Schützenfest Langendorf 2025",
        url: "assets/documents/events/2025/2025_05_26 Einladung Schützenfest Langendorf 2025.pdf",
        type: "invitation"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 16,
    slug: "buttstaedter-pokal-2025",
    title: "2. Buttstädter Pokal 2025",
    shortTitle: "2. Buttstädter Pokal",
    category: "Pokalwettkampf",
    start: "2025-11-01T09:00:00",
    location: "Vor dem Lohe, 99628 Buttstädt",
    organizer: "Schützengesellschaft Buttstädt 1849 e.V.",
    description:
      "Die Schützengesellschaft Buttstädt lädt am 1. November 2025 zum 2. Buttstädter Pokal ein. Gewertet wird eine Kombination aus Lang- und Kurzwaffe auf 100 beziehungsweise 25 Meter.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung 2. Buttstädter Pokal 2025",
        url: "assets/documents/events/2025/2025_10_30 Ausschreibung 2. Buttstädter Pokal 2025.pdf",
        type: "announcement"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
    archive: true,
    featured: false
  },
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 15,
    slug: "abend-der-vereine-2026",
    title: "Abend der Vereine 2026",
    shortTitle: "Abend der Vereine",
    category: "Vergleichswettkampf",
    start: "2026-03-13T17:00:00",
    location:
      "Schützenhaus, Tromsdorfer Straße 13, 06647 An der Poststraße",
    organizer: "Großkaliber Schützengilde 1503 Eckartsberga e.V.",
    description:
      "Die GSG Eckartsberga lädt Vereine am 13. März 2026 zu einem sportlichen und geselligen Vergleichswettkampf ins Schützenhaus ein. Geschossen wird mit Luftgewehr und Kleinkalibergewehr in Mannschafts- und Einzelwertungen.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Einladung Abend der Vereine 2026",
        url: "assets/documents/events/2026/2026_02_25 Einladung Abend der Vereine 2026.pdf",
        type: "invitation"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 14,
    slug: "kreisschuetzentag-2026-schuetzenkreis-sued",
    title: "Kreisschützentag 2026 „Schützenkreis SUED“",
    shortTitle: "Kreisschützentag 2026",
    category: "Kreisschützentag",
    start: "2026-05-09T10:00:00",
    end: "2026-05-09T13:00:00",
    location: "Gasthof Jaucha, Pirkauer Str. 2, 06679 Hohenmölsen (Jaucha)",
    organizer:
      "Kreisschützenverband Burgenlandkreis-Weißenfels „Schützenkreis SUED“ Sachsen-Anhalt e.V.",
    description:
      "Der Schützenkreis SUED lädt am 9. Mai 2026 zum Kreisschützentag nach Hohenmölsen-Jaucha ein. Auf der Tagesordnung stehen unter anderem die Berichte des Präsidiums, eine Satzungsänderung, Beschlussfassungen und Auszeichnungen.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Einladung Kreisschützentag 2026 Schützenkreis SUED",
        url: "assets/documents/events/2026/2026_04_30 Einladung Kreisschützentag 2026 Schützenkreis SUED.pdf",
        type: "invitation"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 13,
    slug: "pokal-des-buergermeisters-apolda-2026",
    title: "35. offener Pokal des Bürgermeisters der Stadt Apolda",
    shortTitle: "Pokal des Bürgermeisters Apolda",
    category: "Pokalwettkampf",
    start: "2026-05-16T09:00:00",
    location:
      "Schießsportanlage der BSG 1775 Apolda e.V., Apolda Heusdorf – In der Borngebreite",
    organizer: "Büchsenschützengesellschaft 1775 Apolda e.V.",
    description:
      "Die Büchsenschützengesellschaft 1775 Apolda lädt zum 35. offenen Pokal des Bürgermeisters der Stadt Apolda ein. Ausgetragen werden verschiedene Wettbewerbe mit KK-Sportgewehr, KK-Sportpistole und Luftgewehr. Alle Einzelheiten enthält die Ausschreibung.",
    image: null,
    gallery: [],
    documents: [
      {
        label:
          "Ausschreibung 35. offener Pokal des Bürgermeisters der Stadt Apolda 2026",
        url: "assets/documents/events/2026/2026_05_04 Ausschreibung 35. offener Pokal des Bürgermeisters der Stadt Apolda 2026.pdf",
        type: "announcement"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 12,
    slug: "hans-peter-nolding-pokal-2026",
    title: "Hans-Peter-Nolding-Pokal 2026",
    shortTitle: "Hans-Peter-Nolding-Pokal",
    category: "Pokalwettkampf",
    start: "2026-06-06T09:00:00",
    end: "2026-06-06T13:00:00",
    location:
      "Schießstand Schützenverein 1990 Hohenmölsen, Am Werk 4, 06679 Hohenmölsen OT Rössuln",
    organizer: "Schützenverein 1990 Hohenmölsen e.V. gegr. 1748",
    description:
      "Der Schützenverein 1990 Hohenmölsen lädt am 6. Juni 2026 zum Hans-Peter-Nolding-Pokal ein. Geschossen wird mit KK-Pistole oder KK-Revolver in offener Klasse.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Hans-Peter-Nolding-Pokal 2026",
        url: "assets/documents/events/2026/2026_05_20 Ausschreibung Hans-Peter-Nolding-Pokal 2026.pdf",
        type: "announcement"
      },
      {
        label: "Veranstaltungsflyer Hans-Peter-Nolding-Pokal 2026",
        url: "assets/documents/events/2026/2026_05_20 Veranstaltungsflyer Hans-Peter-Nolding-Pokal 2026.pdf",
        type: "other"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 11,
    slug: "eckartsburg-pokal-2026",
    title: "Eckartsburg-Pokal 2026",
    shortTitle: "Eckartsburg-Pokal",
    category: "Pokalwettkampf",
    start: "2026-09-05T09:00:00",
    location: "Schützenhaus Buttstädt",
    organizer: "Großkaliber Schützengilde 1503 Eckartsberga e.V.",
    description:
      "Beim Eckartsburg-Pokal treten die Schützen in vier verschiedenen Disziplinen zum traditionellen Pokalwettkampf an.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Eckartsburg-Pokal 2026",
        url: "assets/documents/events/2026/2026_08_14 Ausschreibung Eckartsburg-Pokal 2026.pdf",
        type: "invitation"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: false,
    archive: true,
    featured: false
  },
  {
    id: 9,
    slug: "km-halbautomat-kk-gk-2026",
    title: "Kreismeisterschaft Zentralfeuer Halbautomat 2026",
    shortTitle: "KM Zentralfeuer Halbautomat",
    category: "Kreismeisterschaft",
    start: "2026-09-12T09:30:00",
    end: "2026-09-12T13:00:00",
    location: "Jägerschießstand Markröhlitz",
    organizer: "Schützenkreis \"SUED\"",
    description:
      "Kreismeisterschaft im Zentralfeuer-Selbstladegewehr auf 100 Meter, liegend aufgelegt mit Zielfernrohr.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung – KM Zentralfeuer Halbautomat 2026",
        url: "assets/documents/events/2026/2026_08_18 Ausschreibung KM Zentralfeuer Halbautomat 2026.pdf",
        type: "announcement"
      },
      {
        label: "Anmeldung – KM Zentralfeuer Halbautomat 2026",
        url: "assets/documents/events/2026/2026_08_18 Anmeldung KM Zentralfeuer Halbautomat 2026.ods",
        type: "form"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
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
    image: null,
    gallery: [],
    documents: [],
    downloads: [],
    results: [],
    externalLinks: [],
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

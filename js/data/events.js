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
// - start und end im Format JJJJ-MM-TT oder JJJJ-MM-TTTHH:MM:SS eintragen.
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
    id: 23,
    slug: "schuetzenfest-naumburg-2024",
    title: "Schützenfest Naumburg 2024",
    shortTitle: "Schützenfest Naumburg",
    category: "Schützenfest",
    start: "2024-08-24T09:00:00",
    location: "Schießplatz Henne, Naumburg",
    organizer: "Privilegiertes Bürgerschützencorps Naumburg e.V.",
    description:
      "Das Privilegierte Bürgerschützencorps Naumburg lädt am 24. August 2024 zum Schützenfest auf den Schießplatz Henne ein. Zum Programm gehören das vereinsinterne Königsschießen, weitere Schießwettbewerbe, Musik und gemeinsames Beisammensein.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Einladung Schützenfest Naumburg 2024",
        url: "assets/documents/events/2024/2024_07_24 Einladung Schützenfest Naumburg 2024.pdf",
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
    id: 22,
    slug: "pokal-halbautomat-2024",
    title: "Pokal Halbautomat 2024",
    shortTitle: "Pokal Halbautomat",
    category: "Pokalwettkampf",
    start: "2024-09-07T09:00:00",
    end: "2024-09-07T16:00:00",
    venueId: "jaegerschiessstand-markroehlitz",
    location: "Schießstand der Jägerschaft Markröhlitz",
    organizer: "Jagdverein Weißenfels e.V.",
    description:
      "Der Jagdverein Weißenfels lädt am 7. September 2024 zum Pokal Halbautomat auf den Schießstand der Jägerschaft Markröhlitz ein. Geschossen werden Wettbewerbe mit KK- und GK-Selbstladegewehren.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Pokal Halbautomat 2024",
        url: "assets/documents/events/2024/2024_08_02 Ausschreibung Pokal Halbautomat 2024.pdf",
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
    id: 21,
    slug: "elchschiessen-2025",
    title: "Elchschießen 2025",
    shortTitle: "Elchschießen",
    category: "Schießwettkampf",
    start: "2025-02-01T09:00:00",
    location:
      "Großkaliberschießstandanlage am Pfaffenrainweg, Bottendorf",
    organizer: "Großkaliberschützenverein Bottendorf 1991 e.V.",
    description:
      "Der Großkaliberschützenverein Bottendorf lädt am 1. Februar 2025 zum Elchschießen ein. Auf Elch-Silhouetten werden verschiedene Lang- und Kurzwaffendisziplinen auf 25, 50 und 100 Metern ausgetragen.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Elchschießen 2025",
        url: "assets/documents/events/2025/2025_01_09 Ausschreibung Elchschießen 2025.pdf",
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
    id: 20,
    slug: "km-kk-gewehr-zielfernrohr-2025",
    title: "Kreismeisterschaft KK-Gewehr mit Zielfernrohr 2025",
    shortTitle: "KM KK-Gewehr mit Zielfernrohr",
    category: "Kreismeisterschaft",
    start: "2025-05-10T09:00:00",
    end: "2025-05-10T16:00:00",
    location: "Schießstand Lützen",
    organizer: 'Schützenkreis "SUED"',
    description:
      "Der Schützenkreis SUED lädt am 10. Mai 2025 zur Kreismeisterschaft im KK-Gewehr mit Zielfernrohr auf den Schießstand Lützen ein. Ausgerichtet wird der Wettkampf von der Privilegierten Schützengilde 1608 Lützen.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung KM KK-Gewehr mit Zielfernrohr 2025",
        url: "assets/documents/events/2025/2025_03_30 Ausschreibung KM KK-Gewehr mit Zielfernrohr 2025.pdf",
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
    id: 19,
    slug: "naumburger-uta-pokal-2025",
    title: "6. Naumburger UTA-Pokal 2025",
    shortTitle: "6. Naumburger UTA-Pokal",
    category: "Pokalwettkampf",
    start: "2025-09-06T09:00:00",
    end: "2025-09-06T13:00:00",
    location: "Wurfscheibenstand Naumburg „Henne“",
    organizer: "Privilegiertes Bürgerschützencorps Naumburg e.V.",
    description:
      "Das Privilegierte Bürgerschützencorps Naumburg lädt am 6. September 2025 zum 6. Naumburger UTA-Pokal ein. Beim Trap werden zwei Serien zu je 25 Scheiben mit einer Schrotladung bis 24 Gramm geschossen.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung 6. Naumburger UTA-Pokal 2025",
        url: "assets/documents/events/2025/2025_05_12 Ausschreibung 6. Naumburger UTA-Pokal 2025.pdf",
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
    id: 28,
    slug: "tag-der-offenen-tuer-2025",
    title: "Tag der offenen Tür 2025",
    shortTitle: "Tag der offenen Tür",
    category: "Schützenfest",
    start: "2025-09-06",
    location: "Schützenhaus, Burgstraße 5, 06648 Eckartsberga",
    organizer: "Großkaliber Schützengilde 1503 Eckartsberga e.V.",
    description:
      `Am 6. September 2025 öffnete die GSG Eckartsberga ihre Türen und lud zum gemeinsamen Schützenfest ein. Schützenfreunde aus befreundeten Vereinen, Gäste und Mitglieder kamen zusammen, um einen schönen Tag in geselliger Runde zu verbringen.

Im Mittelpunkt standen dabei nicht nur der Schießsport, sondern vor allem das gemeinsame Vereinsleben und die Begegnung miteinander. Bei guter Stimmung wurde gefeiert, erzählt und natürlich auch die eine oder andere Runde auf dem Schießstand verbracht.

Einen besonderen Anlass zum Feiern gab es ebenfalls: Beim vorausgegangenen Königsschießen hatte sich Steffen Ackermann durchgesetzt und wurde Schützenkönig 2025. Dazu gratuliert die GSG Eckartsberga noch einmal herzlich.

Unser Dank gilt allen Gästen und befreundeten Schützenvereinen, die diesen Tag gemeinsam mit uns verbracht haben, sowie allen Mitgliedern und Helfern, die zum Gelingen des Festes beigetragen haben.

Wir freuen uns auf ein Wiedersehen in Eckartsberga.`,
    image: null,
    gallery: [
      {
        src: "assets/img/events/2025/2025_08_29 Königsschießen 2025 Schützenadler vor dem Schießen.jpeg",
        alt: "Bemalter Schützenadler vor dem Königsschießen 2025.",
        caption: "Der Schützenadler vor dem Königsschießen 2025.",
        width: 2048,
        height: 2048
      },
      {
        src: "assets/img/events/2025/2025_08_29 Königsschießen 2025 Schützenadler auf dem Schießstand.jpeg",
        alt: "Bemalter Schützenadler auf dem Schießstand.",
        caption: "Der Schützenadler auf dem Schießstand.",
        width: 2048,
        height: 2048
      },
      {
        src: "assets/img/events/2025/2025_08_29 Königsschießen 2025 Trefferbild am Schützenadler.jpeg",
        alt: "Nahaufnahme des getroffenen Schützenadlers.",
        caption: "Treffer am Schützenadler während des Königsschießens 2025.",
        width: 2048,
        height: 2048
      },
      {
        src: "assets/img/events/2025/2025_08_29 Königsschießen 2025 Teilnehmer mit Schützenadler.jpg",
        alt: "Ein Teilnehmer hält den bemalten Schützenadler.",
        caption: "Ein Teilnehmer mit dem Schützenadler nach dem Königsschießen 2025.",
        width: 2048,
        height: 2048
      },
      {
        src: "assets/img/events/2025/2025_09_06 Tag der offenen Tür 2025 Schützenkönigsscheibe.jpg",
        alt: "Drei Personen präsentieren die Schützenkönigsscheibe 2025.",
        caption: "Präsentation der Schützenkönigsscheibe 2025.",
        width: 923,
        height: 2048
      },
      {
        src: "assets/img/events/2025/2025_09_06 Tag der offenen Tür 2025 Vereinsrunde.jpg",
        alt: "Mitglieder und Gäste sitzen beim Tag der offenen Tür unter einem Pavillon zusammen.",
        caption: "Mitglieder und Gäste in geselliger Runde.",
        width: 1536,
        height: 2048
      },
      {
        src: "assets/img/events/2025/2025_09_06 Tag der offenen Tür 2025 ausgestellte Schusswaffen.jpg",
        alt: "Historische Lang- und Kurzwaffen liegen auf einem Ausstellungstisch.",
        caption: "Ausgestellte historische Schusswaffen beim Tag der offenen Tür 2025.",
        width: 2040,
        height: 1530
      }
    ],
    videos: [
      {
        src: "assets/video/events/2025/2013 Vereinsvideo GSG Eckartsberga.mp4",
        title: "Kanonensalut beim Tag der offenen Tür 2025.",
        poster: "assets/video/events/2025/2013 Vereinsvideo GSG Eckartsberga Poster.jpg",
        width: 1920,
        height: 1080
      },
      {
        src: "assets/video/events/2025/2024_09_07 Vereinsvideo GSG Eckartsberga.mp4",
        title: "Böllerschießen mit Handböllern beim Tag der offenen Tür 2025.",
        poster: "assets/video/events/2025/2024_09_07 Vereinsvideo GSG Eckartsberga Poster.jpg",
        width: 1080,
        height: 1920
      }
    ],
    documents: [],
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
    id: 27,
    slug: "km-trap-2026",
    title: "Kreismeisterschaft Schützenkreis SUED Trap 2026",
    shortTitle: "KM Trap 2026",
    category: "Kreismeisterschaft",
    start: "2026-03-07T09:00:00",
    end: "2026-03-07T16:00:00",
    venueId: "schiessstand-lossa",
    location: "Schießstand Lossa, Kammerforststraße",
    organizer: 'Schützenkreis "SUED"',
    host: "Schützenverein Eckartsberga",
    description:
      "Am 7. März 2026 findet auf dem Schießstand Lossa die Kreismeisterschaft Trap des Schützenkreises SUED statt. Geschossen werden drei oder fünf Serien zu je 25 Wurfscheiben.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Kreismeisterschaft Trap 2026",
        url: "assets/documents/events/2026/2026_02_08 Ausschreibung Kreismeisterschaft Trap 2026.pdf",
        type: "announcement"
      },
      {
        label: "Ergebnisprotokoll Kreismeisterschaft Trap 2026",
        url: "assets/documents/events/2026/2026_03_08 Ergebnisprotokoll Kreismeisterschaft Trap 2026.pdf",
        type: "result-list"
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
    id: 15,
    slug: "abend-der-vereine-2026",
    title: "Abend der Vereine 2026",
    shortTitle: "Abend der Vereine",
    category: "Vergleichswettkampf",
    start: "2026-03-13T17:00:00",
    location:
      "Schützenhaus, Burgstraße 5, 06648 Eckartsberga",
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
    id: 26,
    slug: "km-gk-pistole-revolver-2026",
    title: 'Kreismeisterschaft SK "SUED" GK-Pistole/Revolver 2026',
    shortTitle: "KM GK-Pistole/Revolver 2026",
    category: "Kreismeisterschaft",
    start: "2026-03-20T12:00:00",
    end: "2026-03-21T17:00:00",
    venueId: "schiessstand-sv-1990-hohenmoelsen-koepsen",
    location:
      "Schießstand SV 1990 HHM, Am Werk 4, 06679 Hohenmölsen OT Köpsen",
    organizer: 'Schützenkreis "SUED"',
    host: "Schützenverein 1990 Hohenmölsen e.V. gegr. 1748",
    description:
      "Der Schützenkreis SUED veranstaltet am 20. und 21. März 2026 die Kreismeisterschaft GK-Pistole/Revolver in Hohenmölsen. Geschossen wird am Freitag von 12 bis 18 Uhr und am Samstag von 9 bis 17 Uhr.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Kreismeisterschaft GK-Pistole/Revolver 2026",
        url: "assets/documents/events/2026/2026_02_08 Ausschreibung KM GK-Pistole-Revolver 2026.pdf",
        type: "announcement"
      },
      {
        label: "Ergebnisprotokoll KM GK-Pistole/Revolver 2026 – Freihand",
        url: "assets/documents/events/2026/2026_04_15 Ergebnisprotokoll KM GK-Pistole-Revolver 2026 Freihand.pdf",
        type: "result-list"
      },
      {
        label: "Ergebnisprotokoll KM GK-Pistole/Revolver 2026 – Auflage",
        url: "assets/documents/events/2026/2026_04_15 Ergebnisprotokoll KM GK-Pistole-Revolver 2026 Auflage.pdf",
        type: "result-list"
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
      "Die Büchsenschützengesellschaft 1775 Apolda lädt zum 35. offenen Pokal des Bürgermeisters der Stadt Apolda ein. Ausgetragen werden verschiedene Wettbewerbe mit KK-Sportgewehr, KK-Sportpistole und Luftgewehr.",
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
    id: 24,
    slug: "apoldaer-knicker-grand-prix-2026",
    title: "14. Apoldaer Knicker-Grand-Prix 2026",
    shortTitle: "14. Apoldaer Knicker-Grand-Prix",
    category: "Pokalwettkampf",
    start: "2026-06-20T09:00:00",
    location:
      "Schießsportanlage der BSG 1775 Apolda e.V., Apolda-Heusdorf (400 m vom Bahnhof in Richtung Kleingartenanlage)",
    organizer: "Büchsenschützengesellschaft 1775 Apolda e.V.",
    description:
      "Die Büchsenschützengesellschaft 1775 Apolda lädt am 20. Juni 2026 zum 14. Apoldaer Knicker-Grand-Prix ein. Geschossen werden fünf Luftgewehrdisziplinen mit Knick- und Mehrladern von Haenel.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung 14. Apoldaer Knicker-Grand-Prix 2026",
        url: "assets/documents/events/2026/2026_06_10 Ausschreibung 14. Apoldaer Knicker-Grand-Prix 2026.jpg",
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
    id: 25,
    slug: "sommerpokal-wurfscheibenschiessen-lossa-2026",
    title: "Sommerpokal Wurfscheibenschießen 2026",
    shortTitle: "Sommerpokal Wurfscheibenschießen",
    category: "Pokalwettkampf",
    start: "2026-07-11T13:00:00",
    end: "2026-07-12T13:00:00",
    location:
      "Schießplatz Lossa (Ortsausgang Lossa Richtung Wiehe, links in den Wald; der Beschilderung folgen)",
    organizer: "Großkaliberschützenverein Lossa 1995 e.V.",
    description:
      "Der Großkaliberschützenverein Lossa lädt am 11. und 12. Juli 2026 zum Sommerpokal im Wurfscheibenschießen ein. Gewertet werden die beiden besten Serien zu je 25 Tauben in einer Einzelwertung.",
    image: null,
    gallery: [],
    documents: [
      {
        label: "Ausschreibung Sommerpokal Wurfscheibenschießen 2026",
        url: "assets/documents/events/2026/2026_07_09 Ausschreibung Sommerpokal Wurfscheibenschießen 2026.jpg",
        type: "announcement"
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
    id: 11,
    slug: "eckartsburg-pokal-2026",
    title: "Eckartsburg-Pokal 2026",
    shortTitle: "Eckartsburg-Pokal",
    category: "Pokalwettkampf",
    start: "2026-09-05T09:00:00",
    venueId: "schuetzenhaus-buttstaedt",
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
      },
      {
        label: "Ergebnisprotokoll Eckartsburg-Pokal 2026",
        url: "assets/documents/events/2026/2026_09_05 Ergebnisprotokoll Eckartsburg-Pokal 2026.pdf",
        type: "result-list"
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
    venueId: "jaegerschiessstand-markroehlitz",
    location: "Jägerschießstand Markröhlitz",
    organizer: "Schützenkreis \"SUED\"",
    host: "Jägerverein Weißenfels e.V.",
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
      },
      {
        label: "Ergebnisprotokoll – KM Zentralfeuer Halbautomat 2026",
        url: "assets/documents/events/2026/2026_09_12 Ergebnisprotokoll KM Zentralfeuer Halbautomat 2026.pdf",
        type: "result-list"
      }
    ],
    downloads: [],
    results: [],
    externalLinks: [],
    registrationRequired: true,
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

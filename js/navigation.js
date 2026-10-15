const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const mobileNavigation = window.matchMedia("(max-width: 820px)");

if (menuToggle && mainNav) {
  function closeMenu() {
    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menü öffnen");
    siteHeader?.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");

    siteHeader?.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle && mainNav.classList.contains("is-open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  mobileNavigation.addEventListener?.("change", (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });

  function updateHeaderOnScroll() {
    if (!siteHeader) return;

    const isScrolled = window.scrollY > 40;
    siteHeader.classList.toggle("scrolled", isScrolled);
  }

  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
}

if (mainNav && siteHeader && brandLink) {
  const localNavigationLinks = [
    brandLink,
    ...mainNav.querySelectorAll('a[href^="#"]'),
  ];

  const scrollspyItems = localNavigationLinks
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#") || href.length < 2) {
        return null;
      }

      const sectionId = decodeURIComponent(href.slice(1));
      const section = document.getElementById(sectionId);

      return section ? { link, section, sectionId } : null;
    })
    .filter(Boolean);

  if (scrollspyItems.length > 0) {
    let activeSectionId = "";
    let sectionObserver;
    let resizeFrame;

    function setActiveSection(sectionId) {
      if (!sectionId || sectionId === activeSectionId) return;

      activeSectionId = sectionId;

      scrollspyItems.forEach((item) => {
        const isActive = item.sectionId === sectionId;

        item.link.classList.toggle("is-active", isActive);

        if (isActive) {
          item.link.setAttribute("aria-current", "location");
        } else {
          item.link.removeAttribute("aria-current");
        }
      });
    }

    function getProbePosition() {
      const headerHeight = siteHeader.getBoundingClientRect().height;
      const availableHeight = Math.max(0, window.innerHeight - headerHeight);

      return Math.round(
        headerHeight + Math.min(availableHeight * 0.28, 260),
      );
    }

    function getSectionAtProbe() {
      const probePosition = getProbePosition();
      const measuredItems = scrollspyItems.map((item) => ({
        ...item,
        rect: item.section.getBoundingClientRect(),
      }));

      const intersectingItems = measuredItems
        .filter(
          (item) =>
            item.rect.top <= probePosition &&
            item.rect.bottom > probePosition,
        )
        .sort(
          (firstItem, secondItem) =>
            secondItem.rect.top - firstItem.rect.top,
        );

      if (intersectingItems.length > 0) {
        return intersectingItems[0].sectionId;
      }

      const precedingItems = measuredItems
        .filter((item) => item.rect.top <= probePosition)
        .sort(
          (firstItem, secondItem) =>
            secondItem.rect.top - firstItem.rect.top,
        );

      return precedingItems[0]?.sectionId ?? measuredItems[0]?.sectionId;
    }

    function syncActiveSection() {
      const firstItem = scrollspyItems[0];
      const lastItem = scrollspyItems[scrollspyItems.length - 1];
      const documentElement = document.documentElement;
      const isAtPageStart = window.scrollY <= 2;
      const isAtPageEnd =
        Math.ceil(window.scrollY + window.innerHeight) >=
        documentElement.scrollHeight - 2;

      if (isAtPageStart) {
        setActiveSection(firstItem.sectionId);
        return;
      }

      if (isAtPageEnd) {
        setActiveSection(lastItem.sectionId);
        return;
      }

      setActiveSection(getSectionAtProbe());
    }

    function handleSectionIntersections(entries) {
      const probePosition = getProbePosition();
      const enteringEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((firstEntry, secondEntry) => {
          const firstDistance = Math.min(
            Math.abs(firstEntry.boundingClientRect.top - probePosition),
            Math.abs(firstEntry.boundingClientRect.bottom - probePosition),
          );
          const secondDistance = Math.min(
            Math.abs(secondEntry.boundingClientRect.top - probePosition),
            Math.abs(secondEntry.boundingClientRect.bottom - probePosition),
          );

          return firstDistance - secondDistance;
        });

      if (enteringEntries.length === 0) {
        syncActiveSection();
        return;
      }

      const enteringSection = enteringEntries[0].target;
      const enteringItem = scrollspyItems.find(
        (item) => item.section === enteringSection,
      );

      if (enteringItem) {
        setActiveSection(enteringItem.sectionId);
      } else {
        syncActiveSection();
      }
    }

    function createSectionObserver() {
      sectionObserver?.disconnect();

      const probePosition = getProbePosition();
      const bottomMargin = Math.max(
        0,
        window.innerHeight - probePosition - 1,
      );

      sectionObserver = new IntersectionObserver(
        handleSectionIntersections,
        {
          rootMargin: `-${probePosition}px 0px -${bottomMargin}px 0px`,
          threshold: 0,
        },
      );

      scrollspyItems.forEach((item) => {
        sectionObserver.observe(item.section);
      });

      window.requestAnimationFrame(syncActiveSection);
    }

    function scheduleObserverRefresh() {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(createSectionObserver);
    }

    function alignInitialHashTarget() {
      if (!window.location.hash || window.location.hash.length < 2) return;

      const hashSectionId = decodeURIComponent(window.location.hash.slice(1));
      const hashItem = scrollspyItems.find(
        (item) => item.sectionId === hashSectionId,
      );

      if (!hashItem) return;

      hashItem.section.scrollIntoView({
        behavior: "instant",
        block: "start",
      });

      window.requestAnimationFrame(syncActiveSection);
    }

    function handlePageLoad() {
      scheduleObserverRefresh();
      window.requestAnimationFrame(alignInitialHashTarget);
    }

    createSectionObserver();

    window.addEventListener("load", handlePageLoad, { once: true });
    window.addEventListener("resize", scheduleObserverRefresh, {
      passive: true,
    });
    window.addEventListener("scrollend", syncActiveSection, {
      passive: true,
    });
    window.addEventListener("hashchange", () => {
      window.requestAnimationFrame(syncActiveSection);
    });
  }
}

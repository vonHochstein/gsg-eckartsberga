
function getNextEvent() {
  const now = new Date();
  const eventList = typeof events !== "undefined" && Array.isArray(events) ? events : [];

  return eventList
    .filter((event) => new Date(event.start) > now)
    .sort((a, b) => {
      const timeDifference = new Date(a.start) - new Date(b.start);
      return timeDifference || String(a.id).localeCompare(String(b.id), "de", { numeric: true });
    })[0] ?? null;
}

function formatEventDate(dateString) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateString));
}

const nextEvent = getNextEvent();

const eventCardTitle = document.querySelector(".event-card h2");
const eventCategory = document.querySelector(".event-category");
const eventDate = document.querySelector(".event-date");
const countdownElement = document.querySelector(".countdown");
const daysElement = document.querySelector("#countdown-days");
const hoursElement = document.querySelector("#countdown-hours");
const minutesElement = document.querySelector("#countdown-minutes");

if (eventCardTitle && eventDate) {
  if (!nextEvent) {
    eventCardTitle.textContent = "Aktuell keine Termine";
    eventDate.textContent = "Neue Veranstaltungen werden hier angekündigt.";
    eventCategory?.setAttribute("hidden", "");
    countdownElement?.setAttribute("hidden", "");
  } else {
    if (eventCategory) {
      eventCategory.textContent = nextEvent.category;
      eventCategory.removeAttribute("hidden");
    }

    eventCardTitle.textContent = nextEvent.title;
    eventDate.textContent = formatEventDate(nextEvent.start);
    countdownElement?.removeAttribute("hidden");
  }
}

function updateCountdown() {
  if (!daysElement || !hoursElement || !minutesElement) return;
  if (!nextEvent) return;

  const targetTime = new Date(nextEvent.start).getTime();
  const currentTime = Date.now();
  const difference = targetTime - currentTime;

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
}

updateCountdown();

if (nextEvent) {
  setInterval(updateCountdown, 60 * 1000);
}

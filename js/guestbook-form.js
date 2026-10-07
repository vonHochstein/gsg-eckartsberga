// Einsendungen bleiben privat; keine Verbindung zur öffentlichen Eintragsliste.
function initGuestbookForm(form, status) {
  if (!form || !status || typeof fetch !== "function") return;
  const name = form.elements.namedItem("displayName");
  const message = form.elements.namedItem("message");
  if (!name || !message) return;
  for (const field of [name, message]) {
    field.addEventListener("input", () => field.setCustomValidity(""));
  }
  initFormspreeForm(form, status, {
    validate() {
      name.setCustomValidity(name.value.trim() ? "" : "Bitte geben Sie einen Anzeigenamen an.");
      message.setCustomValidity(message.value.trim() ? "" : "Bitte schreiben Sie einen Eintrag.");
    },
    prepare(data) {
      for (const key of ["displayName", "email", "message"]) {
        data.set(key, String(data.get(key) || "").trim());
      }
      if (!data.get("email")) data.delete("email");
    },
    sending: "Ihr Eintrag wird gesendet …",
    success: "Vielen Dank! Ihr Eintrag wurde übermittelt und wird vor der Veröffentlichung geprüft."
  });
}
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initGuestbookForm(document.getElementById("guestbook-form"), document.getElementById("guestbook-status"));
  });
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { initGuestbookForm };
}

// Lokaler Kontaktversand; die einzige Formularadresse steht im HTML-action.
function initContactForm(form, status) {
  if (!form || !status || typeof fetch !== "function") return;

  const phone = form.elements.namedItem("phone");
  const whatsapp = form.elements.namedItem("whatsapp_reply");
  const message = form.elements.namedItem("message");
  const phoneError = form.querySelector("#contact-phone-error");
  const button = form.querySelector('button[type="submit"]');
  if (!phone || !whatsapp || !message || !phoneError || !button) return;

  function updatePhoneRequirement() {
    const missingPhone = whatsapp.checked && !phone.value.trim();
    phone.required = whatsapp.checked;
    phone.setCustomValidity(
      missingPhone ? "Bitte geben Sie für eine Antwort per WhatsApp eine Telefonnummer an." : ""
    );
    phone.setAttribute("aria-invalid", String(missingPhone));
    phoneError.hidden = !missingPhone;
    phoneError.textContent = missingPhone
      ? "Bitte geben Sie für eine Antwort per WhatsApp eine Telefonnummer an."
      : "";
  }

  phone.addEventListener("input", updatePhoneRequirement);
  whatsapp.addEventListener("change", updatePhoneRequirement);
  message.addEventListener("input", () => message.setCustomValidity(""));
  updatePhoneRequirement();

  initFormspreeForm(form, status, {
    validate() {
      updatePhoneRequirement();
      message.setCustomValidity(message.value.trim() ? "" : "Bitte schreiben Sie eine Nachricht.");
    },
    prepare(data) {
      for (const name of ["name", "email", "phone", "message"]) {
        data.set(name, String(data.get(name) || "").trim());
      }
      data.set("whatsapp_reply", whatsapp.checked ? "Ja" : "Nein");
    },
    afterReset: updatePhoneRequirement,
    sending: "Ihre Nachricht wird gesendet …",
    success: "Vielen Dank! Ihre Nachricht wurde erfolgreich übermittelt."
  });
}
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initContactForm(
      document.getElementById("contact-form"),
      document.getElementById("contact-status")
    );
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { initContactForm };
}

// Lokaler Kontaktversand; die einzige Formularadresse steht im HTML-action.
function initContactForm(form, status) {
  if (!form || !status || typeof fetch !== "function") return;

  const phone = form.elements.namedItem("phone");
  const whatsapp = form.elements.namedItem("whatsapp_reply");
  const message = form.elements.namedItem("message");
  const phoneError = form.querySelector("#contact-phone-error");
  const button = form.querySelector('button[type="submit"]');
  if (!phone || !whatsapp || !message || !phoneError || !button) return;

  let submitting = false;
  const buttonLabel = button.textContent;

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

  function setStatus(text, state) {
    status.textContent = text;
    status.dataset.state = state;
  }

  phone.addEventListener("input", updatePhoneRequirement);
  whatsapp.addEventListener("change", updatePhoneRequirement);
  message.addEventListener("input", () => message.setCustomValidity(""));
  updatePhoneRequirement();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    updatePhoneRequirement();
    message.setCustomValidity(
      message.value.trim() ? "" : "Bitte schreiben Sie eine Nachricht."
    );
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    for (const name of ["name", "email", "phone", "message"]) {
      data.set(name, String(data.get(name) || "").trim());
    }
    data.set("whatsapp_reply", whatsapp.checked ? "Ja" : "Nein");

    submitting = true;
    button.disabled = true;
    button.textContent = "Wird gesendet …";
    form.setAttribute("aria-busy", "true");
    setStatus("Ihre Nachricht wird gesendet …", "sending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        credentials: "omit",
        redirect: "error",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("send-failed");

      // Eine HTML-Captcha-/Weiterleitungsseite ist keine Versandbestätigung.
      const result = await response.json();
      if (result.ok !== true) throw new Error("unconfirmed");

      form.reset();
      updatePhoneRequirement();
      setStatus("Vielen Dank! Ihre Nachricht wurde erfolgreich übermittelt.", "success");
      status.focus();
    } catch {
      setStatus(
        "Die Übermittlung konnte nicht bestätigt werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es später erneut.",
        "error"
      );
      status.focus();
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.textContent = buttonLabel;
      form.setAttribute("aria-busy", "false");
    }
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

// Gemeinsamer lokaler Versand; jeder Endpoint bleibt ausschließlich im HTML-action.
function initFormspreeForm(form, status, options) {
  if (!form || !status || typeof fetch !== "function") return;
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  let submitting = false;
  const buttonLabel = button.textContent;
  function setStatus(text, state) {
    status.textContent = text;
    status.dataset.state = state;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    options.validate();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    options.prepare(data);

    submitting = true;
    button.disabled = true;
    button.textContent = "Wird gesendet …";
    form.setAttribute("aria-busy", "true");
    setStatus(options.sending, "sending");
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
      options.afterReset?.();
      setStatus(options.success, "success");
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

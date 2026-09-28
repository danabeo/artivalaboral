document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileMenu.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll("[data-real-contact-form]").forEach((form) => {
  const fields = form.querySelector("[data-form-fields]");
  const success = form.querySelector("[data-form-success]");
  const feedback = form.querySelector("[data-form-feedback]");
  const submitButton = form.querySelector('button[type="submit"]');
  const resetButton = form.querySelector("[data-form-reset]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const replyTo = form.querySelector('input[name="_replyto"]');
    const email = form.querySelector('input[name="email"]');
    if (replyTo && email) replyTo.value = email.value;

    const originalLabel = submitButton?.dataset.submitLabel || submitButton?.textContent || "";
    form.setAttribute("aria-busy", "true");
    if (feedback) feedback.hidden = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = form.dataset.sending || originalLabel;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.dataset.endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === "false") throw new Error("Form submission failed");

      form.reset();
      if (fields) fields.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch (_error) {
      if (feedback) {
        feedback.textContent = `${form.dataset.error || "The form could not be sent."} `;
        const emailLink = document.createElement("a");
        emailLink.href = "mailto:info@artivalaboral.com";
        emailLink.textContent = "info@artivalaboral.com";
        feedback.append(emailLink);
        feedback.hidden = false;
        feedback.focus();
      }
    } finally {
      window.clearTimeout(timeout);
      form.removeAttribute("aria-busy");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });

  resetButton?.addEventListener("click", () => {
    if (success) success.hidden = true;
    if (fields) fields.hidden = false;
    if (feedback) feedback.hidden = true;
    form.querySelector('input[name="name"]')?.focus();
  });
});

const cookieNotice = document.querySelector("[data-cookie-notice]");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const hasCookieNotice = document.cookie.split(";").some((value) => value.trim().startsWith("artiva_cookie_notice="));

if (cookieNotice && !hasCookieNotice) cookieNotice.hidden = false;
if (cookieNotice && cookieAccept) {
  cookieAccept.addEventListener("click", () => {
    const maxAge = 60 * 60 * 24 * 183;
    document.cookie = `artiva_cookie_notice=acknowledged; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
    cookieNotice.hidden = true;
  });
}

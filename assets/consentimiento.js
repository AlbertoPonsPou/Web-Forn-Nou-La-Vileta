(function () {
  "use strict";

  const STORAGE_KEY = "fornNouCookieConsent";
  const ACCEPTED = "accepted";
  const REJECTED = "rejected";

  function addStyles() {
    if (document.getElementById("cookie-consent-styles")) return;

    const style = document.createElement("style");
    style.id = "cookie-consent-styles";
    style.textContent = `
      .cookie-banner{position:fixed;z-index:9999;right:18px;bottom:18px;width:min(520px,calc(100% - 36px));padding:22px;background:#17130f;color:#fff;border:1px solid #4c4035;border-radius:16px;box-shadow:0 18px 55px rgba(0,0,0,.35);font-family:Poppins,Arial,sans-serif}
      .cookie-banner[hidden]{display:none}
      .cookie-banner h2{margin:0 0 8px;color:#ffbc58;font-size:1.2rem}
      .cookie-banner p{margin:0 0 16px;line-height:1.55;font-size:.92rem}
      .cookie-banner a{color:#ffd79b;text-underline-offset:3px}
      .cookie-actions{display:flex;flex-wrap:wrap;gap:10px}
      .cookie-actions button,.cookie-map-placeholder button{min-height:44px;padding:10px 16px;border:2px solid #f39c12;border-radius:8px;font:500 .9rem Poppins,Arial,sans-serif;cursor:pointer}
      .cookie-accept{background:#f39c12;color:#17130f}
      .cookie-reject{background:transparent;color:#fff}
      .cookie-settings{padding:0;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
      .cookie-map-placeholder{width:min(1180px,100%);min-height:300px;margin:28px auto 0;padding:35px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:1px solid #ded1c4;border-radius:4px;background:#f5efe8;color:#2f251d;position:relative;z-index:2}
      .cookie-map-placeholder[hidden],[data-cookie-src][hidden]{display:none!important}
      .cookie-map-placeholder p{max-width:620px;line-height:1.6}
      .cookie-map-placeholder h3{margin:0 0 8px;font:700 clamp(1.55rem,3vw,2.15rem)/1.15 "Source Serif 4",Georgia,serif}
      .cookie-map-placeholder button{margin:8px;background:#f39c12;color:#17130f;border-radius:999px}
      .cookie-map-placeholder a{color:#74400c;text-underline-offset:3px}
      .footer-legal{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px 18px;margin-top:0}
      .footer-legal a,.footer-legal .cookie-settings{color:#b9a99d;font-size:.82rem}
      .footer-legal a:hover,.footer-legal .cookie-settings:hover{color:#ffc266}
      @media(max-width:600px){.cookie-banner{right:10px;bottom:10px;width:calc(100% - 20px);padding:18px}.cookie-actions{flex-direction:column}.cookie-actions button{width:100%}.cookie-map-placeholder{width:100%;min-height:260px;margin-top:24px;padding:24px 18px}.footer-legal{justify-content:flex-start}}
    `;
    document.head.appendChild(style);
  }

  function activateOptionalContent() {
    document.querySelectorAll("[data-cookie-src]").forEach((element) => {
      if (!element.getAttribute("src")) {
        element.setAttribute("src", element.dataset.cookieSrc);
      }
      element.hidden = false;
    });
    document.querySelectorAll("[data-cookie-placeholder]").forEach((element) => {
      element.hidden = true;
    });
  }

  function deactivateOptionalContent() {
    document.querySelectorAll("[data-cookie-src]").forEach((element) => {
      element.removeAttribute("src");
      element.hidden = true;
    });
    document.querySelectorAll("[data-cookie-placeholder]").forEach((element) => {
      element.hidden = false;
    });
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // La elección sigue aplicándose durante la visita aunque el navegador
      // impida guardar preferencias de forma persistente.
    }
    if (value === ACCEPTED) activateOptionalContent();
    else deactivateOptionalContent();
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.hidden = true;
  }

  function createBanner() {
    if (document.getElementById("cookie-banner")) return;

    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "cookie-title");
    banner.innerHTML = `
      <h2 id="cookie-title">Tu privacidad</h2>
      <p>Usamos almacenamiento necesario para recordar tu elección. Google Maps solo se cargará si aceptas el contenido externo. Consulta nuestra <a href="/cookies.html">política de cookies</a>.</p>
      <div class="cookie-actions">
        <button type="button" class="cookie-accept" data-cookie-accept>Aceptar contenido externo</button>
        <button type="button" class="cookie-reject" data-cookie-reject>Rechazar opcionales</button>
      </div>
    `;
    document.body.appendChild(banner);
  }

  function ensureLegalLinks() {
    const footerCopy = document.querySelector(".footer-copy");
    if (!footerCopy || footerCopy.querySelector(".footer-legal")) return;

    const legalLinks = document.createElement("div");
    legalLinks.className = "footer-legal";
    legalLinks.setAttribute("aria-label", "Información legal");
    legalLinks.innerHTML = `
      <a href="/aviso-legal.html">Aviso legal</a>
      <a href="/privacidad.html">Privacidad</a>
      <a href="/cookies.html">Cookies</a>
      <button type="button" class="cookie-settings" data-cookie-settings>Configurar cookies</button>
    `;
    footerCopy.appendChild(legalLinks);
  }

  function openSettings() {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.hidden = false;
      banner.querySelector("button")?.focus();
    }
  }

  function init() {
    addStyles();
    ensureLegalLinks();
    createBanner();

    let choice = null;
    try {
      choice = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      choice = null;
    }
    if (choice === ACCEPTED) {
      activateOptionalContent();
      document.getElementById("cookie-banner").hidden = true;
    } else if (choice === REJECTED) {
      deactivateOptionalContent();
      document.getElementById("cookie-banner").hidden = true;
    } else {
      deactivateOptionalContent();
    }

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-cookie-accept]")) saveChoice(ACCEPTED);
      if (event.target.closest("[data-cookie-reject]")) saveChoice(REJECTED);
      if (event.target.closest("[data-cookie-settings]")) openSettings();
    });
  }

  window.FornNouCookies = { openSettings, accept: () => saveChoice(ACCEPTED), reject: () => saveChoice(REJECTED) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

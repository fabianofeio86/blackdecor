(function () {
  "use strict";

  var TRACKING_CONSENT_KEY = "black-decor-tracking-consent";
  var GOOGLE_ADS_ID = "AW-17298263390";
  var GOOGLE_ANALYTICS_ID = "G-QCW6BT3YCY";
  var GOOGLE_ADS_CONVERSION = "AW-17298263390/INqGCk7xwpOcEN6aurhA";

  var deniedConsent = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  };

  var grantedConsent = {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted"
  };

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    return window.gtag;
  }

  function loadGoogleTags() {
    var gtag = ensureGtag();

    if (document.getElementById("black-decor-google-tag")) {
      gtag("consent", "update", grantedConsent);
      return;
    }

    gtag("consent", "default", deniedConsent);
    gtag("consent", "update", grantedConsent);
    gtag("js", new Date());
    gtag("config", GOOGLE_ADS_ID);
    gtag("config", GOOGLE_ANALYTICS_ID);

    var script = document.createElement("script");
    script.id = "black-decor-google-tag";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GOOGLE_ADS_ID;
    document.head.appendChild(script);
  }

  function denyGoogleTags() {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", deniedConsent);
    }
  }

  function saveTrackingChoice(choice) {
    try {
      window.localStorage.setItem(TRACKING_CONSENT_KEY, choice);
    } catch (error) {
      // A escolha continua válida durante esta visita quando o armazenamento local está bloqueado.
    }
  }

  function readTrackingChoice() {
    try {
      var choice = window.localStorage.getItem(TRACKING_CONSENT_KEY);
      return choice === "accepted" || choice === "rejected" ? choice : null;
    } catch (error) {
      return null;
    }
  }

  function trackWhatsApp(location) {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION
    });
    window.gtag("event", "whatsapp_click", {
      button_location: location || "unknown",
      page_path: window.location.pathname
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var cookiePanel = document.getElementById("cookie-consent");
    var acceptCookies = document.getElementById("accept-cookies");
    var rejectCookies = document.getElementById("reject-cookies");
    var privacySettings = document.getElementById("privacy-settings");
    var contactPanel = document.getElementById("contact-consent-panel");
    var contactConsent = document.getElementById("contact-consent");
    var contactError = document.getElementById("contact-consent-error");
    var storedChoice = readTrackingChoice();

    if (storedChoice === "accepted") {
      loadGoogleTags();
    } else if (!storedChoice && cookiePanel) {
      cookiePanel.hidden = false;
    }

    if (acceptCookies) {
      acceptCookies.addEventListener("click", function () {
        saveTrackingChoice("accepted");
        loadGoogleTags();
        cookiePanel.hidden = true;
      });
    }

    if (rejectCookies) {
      rejectCookies.addEventListener("click", function () {
        saveTrackingChoice("rejected");
        denyGoogleTags();
        cookiePanel.hidden = true;
      });
    }

    if (privacySettings) {
      privacySettings.addEventListener("click", function () {
        cookiePanel.hidden = false;
      });
    }

    if (contactConsent) {
      contactConsent.addEventListener("change", function () {
        if (contactConsent.checked) {
          contactPanel.classList.remove("has-error");
          contactError.hidden = true;
        }
      });
    }

    document.querySelectorAll("a[data-whatsapp]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (!contactConsent || !contactConsent.checked) {
          event.preventDefault();
          contactPanel.classList.add("has-error");
          contactError.hidden = false;
          contactPanel.scrollIntoView({ behavior: "smooth", block: "center" });
          contactConsent.focus({ preventScroll: true });
          return;
        }

        trackWhatsApp(link.getAttribute("data-button-location"));
      });
    });
  });
})();

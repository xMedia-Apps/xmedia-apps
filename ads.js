(function () {
  var CLIENT = "ca-pub-9890054230851218";
  // Nach Freigabe in AdSense Anzeigeneinheiten anlegen und Slot-IDs hier eintragen:
  var SLOTS = {
    home: "", // Startseiten-Banner
    content: "", // kleine Anzeige auf Unterseiten
  };
  var STORAGE_KEY = "xmedia-consent-ads";
  var DISMISS_KEY = "xmedia-ad-home-dismissed";

  function hasConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setConsent(accepted) {
    try {
      localStorage.setItem(STORAGE_KEY, accepted ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
  }

  function homeDismissed() {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function dismissHome() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch (e) {
      /* ignore */
    }
    var banner = document.querySelector(".ad-home-banner");
    if (banner) banner.hidden = true;
    document.body.classList.remove("has-home-ad");
  }

  function ensureScript() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    var s = document.createElement("script");
    s.async = true;
    s.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      CLIENT;
    s.crossOrigin = "anonymous";
    s.dataset.adsense = "1";
    document.head.appendChild(s);
  }

  function fillUnit(el, slot) {
    if (!el || !slot) return;
    if (el.dataset.filled === "1") return;
    el.innerHTML = "";
    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", CLIENT);
    ins.setAttribute("data-ad-slot", slot);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    el.appendChild(ins);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      /* ignore */
    }
    el.dataset.filled = "1";
  }

  function showAds() {
    ensureScript();
    document.body.classList.add("ads-allowed");

    var homeHost = document.querySelector(".ad-home-banner .ad-frame");
    var homeWrap = document.querySelector(".ad-home-banner");
    if (homeWrap && SLOTS.home && !homeDismissed()) {
      homeWrap.hidden = false;
      document.body.classList.add("has-home-ad");
      fillUnit(homeHost, SLOTS.home);
    }

    document.querySelectorAll(".ad-content .ad-frame").forEach(function (frame) {
      var wrap = frame.closest(".ad-content");
      if (wrap) wrap.hidden = false;
      fillUnit(frame, SLOTS.content);
    });
  }

  function hideAdUnits() {
    document.body.classList.remove("ads-allowed", "has-home-ad");
    document.querySelectorAll(".ad-home-banner, .ad-content").forEach(function (el) {
      el.hidden = true;
    });
  }

  function renderConsent() {
    if (document.getElementById("consent-banner")) return;
    var bar = document.createElement("div");
    bar.id = "consent-banner";
    bar.className = "consent-banner";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie-Hinweis");
    bar.innerHTML =
      '<div class="consent-inner">' +
      "<p>Wir nutzen Google AdSense für Werbung. Dafür brauchen wir deine Einwilligung. " +
      'Details: <a href="/privacy.html#adsense">Datenschutz</a>.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn" data-consent="0">Ablehnen</button>' +
      '<button type="button" class="btn solid" data-consent="1">Akzeptieren</button>' +
      "</div></div>";
    document.body.appendChild(bar);

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var ok = btn.getAttribute("data-consent") === "1";
      setConsent(ok);
      bar.remove();
      if (ok) showAds();
      else hideAdUnits();
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-ad-close]")) {
      e.preventDefault();
      dismissHome();
    }
  });

  function init() {
    var stored;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null;
    }

    if (stored === "1") {
      showAds();
      return;
    }
    if (stored === "0") {
      hideAdUnits();
      return;
    }
    hideAdUnits();
    renderConsent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

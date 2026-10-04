(function () {
  var CLIENT = "ca-pub-9890054230851218";
  var SLOTS = {
    home: "1087337998", // Startseite Banner
    content: "1087337998", // Kontakt / Rechtliches
    vertical: "4432435060", // Projekte / Studio
  };
  var STORAGE_KEY = "xmedia-consent-ads";
  var DISMISS_KEY = "xmedia-ad-home-dismissed";

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
    if (banner) {
      banner.hidden = true;
      banner.setAttribute("hidden", "");
    }
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
    document.head.appendChild(s);
  }

  function watchAdStatus(ins, onFilled, onEmpty) {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      var status = ins.getAttribute("data-ad-status");
      if (status === "filled") {
        clearInterval(timer);
        onFilled();
        return;
      }
      if (status === "unfilled" || tries >= 48) {
        clearInterval(timer);
        onEmpty();
      }
    }, 250);
  }

  function fillUnit(el, slot, onFilled, onEmpty) {
    if (!el || !slot) {
      if (onEmpty) onEmpty();
      return null;
    }
    if (el.dataset.filled === "1") return el.querySelector("ins.adsbygoogle");
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
      if (onEmpty) onEmpty();
      return null;
    }
    el.dataset.filled = "1";
    if (onFilled || onEmpty) {
      watchAdStatus(
        ins,
        onFilled || function () {},
        onEmpty || function () {}
      );
    }
    return ins;
  }

  function bindHomeClose(banner) {
    var btn = banner && banner.querySelector(".ad-close");
    if (!btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        dismissHome();
      },
      true
    );
  }

  function showAds() {
    ensureScript();
    document.body.classList.add("ads-allowed");

    var homeWrap = document.querySelector(".ad-home-banner");
    var homeHost = document.querySelector(".ad-home-banner .ad-frame");
    if (homeWrap && SLOTS.home && !homeDismissed()) {
      // Erst einblenden, wenn Google wirklich eine Anzeige liefert
      homeWrap.hidden = true;
      document.body.classList.remove("has-home-ad");
      bindHomeClose(homeWrap);
      fillUnit(
        homeHost,
        SLOTS.home,
        function () {
          if (homeDismissed()) return;
          homeWrap.hidden = false;
          homeWrap.removeAttribute("hidden");
          document.body.classList.add("has-home-ad");
        },
        function () {
          homeWrap.hidden = true;
          homeWrap.setAttribute("hidden", "");
          document.body.classList.remove("has-home-ad");
        }
      );
    }

    document.querySelectorAll(".ad-content .ad-frame").forEach(function (frame) {
      var wrap = frame.closest(".ad-content");
      if (!wrap) return;
      var key = wrap.getAttribute("data-ad") || "content";
      var slot = SLOTS[key] || SLOTS.content;
      wrap.hidden = true;
      fillUnit(
        frame,
        slot,
        function () {
          wrap.hidden = false;
          wrap.removeAttribute("hidden");
        },
        function () {
          wrap.hidden = true;
          wrap.setAttribute("hidden", "");
        }
      );
    });
  }

  function hideAdUnits() {
    document.body.classList.remove("ads-allowed", "has-home-ad");
    document.querySelectorAll(".ad-home-banner, .ad-content").forEach(function (el) {
      el.hidden = true;
      el.setAttribute("hidden", "");
    });
  }

  function removeConsent() {
    var bar = document.getElementById("consent-banner");
    if (bar) bar.remove();
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
      "<p>Wir nutzen Google AdSense fuer Werbung. Dafuer brauchen wir deine Einwilligung. " +
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
      removeConsent();
      if (ok) showAds();
      else hideAdUnits();
    });
  }

  function init() {
    var homeWrap = document.querySelector(".ad-home-banner");
    if (homeWrap) bindHomeClose(homeWrap);

    var stored;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null;
    }

    if (stored === "1") {
      removeConsent();
      showAds();
      return;
    }
    if (stored === "0") {
      removeConsent();
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

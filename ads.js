(function () {
  var CLIENT = "ca-pub-9890054230851218";
  var SLOTS = {
    home: "1087337998", // Startseite Banner
    content: "1087337998", // Kontakt / Rechtliches
    vertical: "4432435060", // Projekte / Studio
  };
  var DISMISS_KEY = "xmedia-ad-home-dismissed";

  // Alte eigene Consent-Auswahl entfernen (jetzt Google CMP)
  try {
    localStorage.removeItem("xmedia-consent-ads");
  } catch (e) {
    /* ignore */
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
      if (status === "unfilled" || tries >= 60) {
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
    ins.style.width = "100%";
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
    watchAdStatus(
      ins,
      onFilled || function () {},
      onEmpty || function () {}
    );
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
    document.body.classList.add("ads-allowed");

    var homeWrap = document.querySelector(".ad-home-banner");
    var homeHost = document.querySelector(".ad-home-banner .ad-frame");
    if (homeWrap && SLOTS.home && !homeDismissed()) {
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

  function init() {
    var old = document.getElementById("consent-banner");
    if (old) old.remove();

    var homeWrap = document.querySelector(".ad-home-banner");
    if (homeWrap) bindHomeClose(homeWrap);

    // Google CMP (Privacy & Messaging) steuert die Einwilligung.
    // Anzeigen-Slots immer anfordern — ohne Freigabe/Consent bleiben sie unfilled.
    showAds();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

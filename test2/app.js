(function () {
  const RATE = 0.25;
  const slider = document.getElementById("liters");
  const litersOut = document.getElementById("litersOut");
  const periodEarn = document.getElementById("periodEarn");
  const yearEarn = document.getElementById("yearEarn");
  const periodLabel = document.getElementById("periodLabel");
  const formulaLiters = document.getElementById("formulaLiters");
  const formulaResult = document.getElementById("formulaResult");
  const orb = document.getElementById("orb");
  const tabs = document.querySelectorAll(".tab");

  let period = "week";

  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const num = new Intl.NumberFormat("de-DE");

  function update() {
    const liters = Number(slider.value) || 0;
    const periodMoney = liters * RATE;
    const yearMoney = period === "week" ? periodMoney * 52 : periodMoney * 12;
    const pct = (liters / 1000) * 100;

    slider.style.setProperty("--fill", pct + "%");
    slider.setAttribute("aria-valuenow", String(liters));
    litersOut.textContent = num.format(liters) + " L";
    periodLabel.textContent =
      period === "week" ? "Möglicher Erlös / Woche" : "Möglicher Erlös / Monat";
    periodEarn.textContent = euro.format(periodMoney);
    yearEarn.textContent = euro.format(yearMoney);
    if (formulaLiters) formulaLiters.textContent = num.format(liters);
    if (formulaResult) formulaResult.textContent = euro.format(periodMoney);
    if (orb) orb.style.setProperty("--level", pct + "%");
  }

  slider.addEventListener("input", update);

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      period = btn.getAttribute("data-period") || "week";
      tabs.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      update();
    });
  });

  update();

  /* —— Before / After compare (Vorher links, Nachher rechts) —— */
  const compareFrame = document.getElementById("compareFrame");
  const compareBeforeImg = document.getElementById("compareBeforeImg");
  let comparePos = 50;
  let compareDragging = false;

  function syncCompareFrameWidth() {
    if (!compareFrame || !compareBeforeImg) return;
    compareBeforeImg.style.setProperty(
      "--frame-w",
      compareFrame.clientWidth + "px"
    );
  }

  function setCompare(pos) {
    comparePos = Math.max(0, Math.min(100, Number(pos) || 0));
    if (!compareFrame) return;
    compareFrame.style.setProperty("--pos", comparePos + "%");
    compareFrame.setAttribute("aria-valuenow", String(Math.round(comparePos)));
    compareFrame.setAttribute(
      "aria-valuetext",
      Math.round(comparePos) + " Prozent Vorher links"
    );
  }

  function posFromEvent(e) {
    const rect = compareFrame.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  if (compareFrame) {
    syncCompareFrameWidth();
    setCompare(50);
    window.addEventListener("resize", syncCompareFrameWidth);

    compareFrame.addEventListener("pointerdown", function (e) {
      compareDragging = true;
      compareFrame.setPointerCapture(e.pointerId);
      setCompare(posFromEvent(e));
    });

    compareFrame.addEventListener("pointermove", function (e) {
      if (!compareDragging) return;
      setCompare(posFromEvent(e));
    });

    function endDrag(e) {
      compareDragging = false;
      try {
        compareFrame.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    compareFrame.addEventListener("pointerup", endDrag);
    compareFrame.addEventListener("pointercancel", endDrag);

    compareFrame.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCompare(comparePos - 3);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCompare(comparePos + 3);
      } else if (e.key === "Home") {
        e.preventDefault();
        setCompare(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCompare(100);
      }
    });
  }
})();

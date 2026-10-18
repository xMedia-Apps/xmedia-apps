(function () {
  const RATE = 0.25;
  const slider = document.getElementById("liters");
  const litersOut = document.getElementById("litersOut");
  const periodEarn = document.getElementById("periodEarn");
  const yearEarn = document.getElementById("yearEarn");
  const periodLabel = document.getElementById("periodLabel");
  const tankFill = document.getElementById("tankFill");
  const periodBtns = document.querySelectorAll(".period-btn");

  let period = "week";

  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  function formatLiters(n) {
    return new Intl.NumberFormat("de-DE").format(n) + "\u00a0L";
  }

  function update() {
    const liters = Number(slider.value) || 0;
    const periodMoney = liters * RATE;
    const yearMoney =
      period === "week" ? periodMoney * 52 : periodMoney * 12;

    slider.style.setProperty("--fill", (liters / 1000) * 100 + "%");
    slider.setAttribute("aria-valuenow", String(liters));
    litersOut.textContent = formatLiters(liters);
    periodLabel.textContent =
      period === "week"
        ? "Ersparnis / Erlös pro Woche"
        : "Ersparnis / Erlös pro Monat";
    periodEarn.textContent = euro.format(periodMoney);
    yearEarn.textContent = euro.format(yearMoney);
    tankFill.style.height = (liters / 1000) * 100 + "%";
  }

  slider.addEventListener("input", update);

  periodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      period = btn.getAttribute("data-period") || "week";
      periodBtns.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      update();
    });
  });

  update();
})();

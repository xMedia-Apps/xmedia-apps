(function () {
  const RATE = 0.25;
  const slider = document.getElementById("liters");
  const litersOut = document.getElementById("litersOut");
  const periodEarn = document.getElementById("periodEarn");
  const yearEarn = document.getElementById("yearEarn");
  const periodLabel = document.getElementById("periodLabel");
  const bar = document.getElementById("bar");
  const periodBtns = document.querySelectorAll(".segment-btn");

  let period = "week";

  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  function formatLiters(n) {
    return new Intl.NumberFormat("de-DE").format(n) + " L";
  }

  function update() {
    const liters = Number(slider.value) || 0;
    const periodMoney = liters * RATE;
    const yearMoney = period === "week" ? periodMoney * 52 : periodMoney * 12;
    const pct = (liters / 1000) * 100;

    slider.style.setProperty("--fill", pct + "%");
    slider.setAttribute("aria-valuenow", String(liters));
    litersOut.textContent = formatLiters(liters);
    periodLabel.textContent =
      period === "week"
        ? "Erlös / Ersparnis je Woche"
        : "Erlös / Ersparnis je Monat";
    periodEarn.textContent = euro.format(periodMoney);
    yearEarn.textContent = euro.format(yearMoney);
    bar.style.width = pct + "%";
  }

  slider.addEventListener("input", update);

  periodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      period = btn.getAttribute("data-period") || "week";
      periodBtns.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      update();
    });
  });

  update();
})();

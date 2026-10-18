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
})();

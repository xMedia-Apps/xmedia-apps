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

  /* 0→150 L = 0→80 %, 150→1000 L = 80→100 % */
  function visualFillPercent(liters) {
    const L = Math.max(0, Math.min(1000, Number(liters) || 0));
    if (L <= 150) return (L / 150) * 80;
    return 80 + ((L - 150) / 850) * 20;
  }

  function update() {
    const liters = Number(slider.value) || 0;
    const periodMoney = liters * RATE;
    const yearMoney =
      period === "week" ? periodMoney * 52 : periodMoney * 12;
    const visual = visualFillPercent(liters);

    slider.style.setProperty("--fill", (liters / 1000) * 100 + "%");
    slider.setAttribute("aria-valuenow", String(liters));
    litersOut.textContent = formatLiters(liters);
    periodLabel.textContent =
      period === "week"
        ? "Ersparnis / Erlös pro Woche"
        : "Ersparnis / Erlös pro Monat";
    periodEarn.textContent = euro.format(periodMoney);
    yearEarn.textContent = euro.format(yearMoney);
    if (tankFill) tankFill.style.setProperty("--level", visual + "%");
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

  /* —— Geruchs-Skala —— */
  const smellRange = document.getElementById("smellRange");
  const smellPanel = document.querySelector(".smell-panel");
  const smellFx = document.getElementById("smellFx");
  const smellEmoji = document.getElementById("smellEmoji");
  const smellTitle = document.getElementById("smellTitle");
  const smellCopy = document.getElementById("smellCopy");
  const smellClick = document.getElementById("smellClick");

  const smellStages = {
    1: {
      emoji: "🦨",
      title: "Offene Eimer / lockere Deckel",
      copy: "Sommer-Hinterhof: Nachbarn beschweren sich, Ungeziefer-Alarm.",
      label: "Stufe 1: Offene Eimer",
    },
    2: {
      emoji: "😐",
      title: "Alte Fässer",
      copy: "Klebriger Rand, Deckel schließt nicht mehr richtig dicht.",
      label: "Stufe 2: Alte Fässer",
    },
    3: {
      emoji: "🌿",
      title: "Unsere Gummidichtungs-Fässer und Rolltonnen",
      copy: "100 % geruchsdicht verriegelt – selbst bei 30 °C im Hochsommer.",
      label: "Stufe 3: Gummidichtungs-Fässer und Rolltonnen",
    },
  };

  function renderSmellFx(stage) {
    if (!smellFx) return;
    smellFx.innerHTML = "";

    if (stage === 1 || stage === 2) {
      ["c1", "c2", "c3"].forEach(function (c) {
        const cloud = document.createElement("span");
        cloud.className = "smell-cloud " + c;
        smellFx.appendChild(cloud);
      });
    }

    if (stage === 1) {
      ["f1", "f2"].forEach(function (f) {
        const fly = document.createElement("span");
        fly.className = "smell-fly " + f;
        fly.textContent = "🪰";
        smellFx.appendChild(fly);
      });
    }

    if (stage === 2) {
      const barrel = document.createElement("div");
      barrel.className = "smell-barrel";
      barrel.innerHTML =
        '<span class="smell-barrel-body"></span>' +
        '<span class="smell-barrel-lid"></span>' +
        '<span class="smell-barrel-drip d1"></span>' +
        '<span class="smell-barrel-drip d2"></span>' +
        '<span class="smell-barrel-drip d3"></span>' +
        '<span class="smell-barrel-gap"></span>';
      smellFx.appendChild(barrel);
    }

    if (stage === 3) {
      const lock = document.createElement("span");
      lock.className = "smell-lock";
      lock.textContent = "🔒";
      smellFx.appendChild(lock);

      const check = document.createElement("span");
      check.className = "smell-check";
      check.textContent = "✓";
      smellFx.appendChild(check);
    }
  }

  function setSmellStage(stage) {
    const s = Math.max(1, Math.min(3, Number(stage) || 1));
    const data = smellStages[s];
    if (!data || !smellPanel) return;

    smellPanel.setAttribute("data-stage", String(s));
    smellEmoji.textContent = data.emoji;
    smellTitle.textContent = data.title;
    smellCopy.textContent = data.copy;
    smellRange.setAttribute("aria-valuenow", String(s));
    smellRange.setAttribute("aria-valuetext", data.label);
    renderSmellFx(s);

    if (smellClick) {
      smellClick.hidden = s !== 3;
      smellClick.classList.remove("is-on");
      if (s === 3) {
        void smellClick.offsetWidth;
        smellClick.classList.add("is-on");
      }
    }
  }

  if (smellRange) {
    smellRange.addEventListener("input", function () {
      setSmellStage(smellRange.value);
    });
    setSmellStage(smellRange.value);
  }
})();

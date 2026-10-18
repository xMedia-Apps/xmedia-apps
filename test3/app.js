(function () {
  const RATE = 0.25;
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slider = document.getElementById("liters");
  const litersOut = document.getElementById("litersOut");
  const vatLiters = document.getElementById("vatLiters");
  const periodEarn = document.getElementById("periodEarn");
  const yearEarn = document.getElementById("yearEarn");
  const periodLabel = document.getElementById("periodLabel");
  const liquid = document.getElementById("liquid");
  const earnBar = document.getElementById("earnBar");
  const energy = document.getElementById("energy");
  const reactor = document.getElementById("reactor");
  const sparks = document.getElementById("sparks");
  const bubbles = document.getElementById("bubbles");
  const boomBtn = document.getElementById("boomBtn");
  const toast = document.getElementById("toast");
  const cursorGlow = document.getElementById("cursorGlow");
  const canvas = document.getElementById("fx");
  const periodBtns = document.querySelectorAll(".pbtn");

  let period = "week";
  let displayLiters = 0;
  let targetLiters = 0;
  let displayEarn = 0;
  let targetEarn = 0;
  let displayYear = 0;
  let targetYear = 0;

  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  const num = new Intl.NumberFormat("de-DE");

  /* —— Particles canvas —— */
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let particles = [];
  let mouse = { x: 0.5, y: 0.4 };
  let burst = 0;

  function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function spawnParticles(count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: Math.random() * 0.45 + 0.1,
        a: Math.random() * 0.45 + 0.15,
        hue: Math.random() > 0.55 ? 85 : 38,
      });
    }
  }

  function addBurst(cx, cy, n) {
    burst = 1;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = Math.random() * 4 + 1.5;
      particles.push({
        x: cx,
        y: cy,
        r: Math.random() * 3 + 1,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        a: 1,
        hue: Math.random() > 0.5 ? 85 : 45,
        life: 1,
      });
    }
  }

  function tickFx() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // soft grid
    ctx.save();
    ctx.strokeStyle = "rgba(141,193,83,0.05)";
    ctx.lineWidth = 1;
    const gap = 48;
    const ox = (mouse.x * 20) % gap;
    const oy = (mouse.y * 20) % gap;
    for (let x = -gap + ox; x < window.innerWidth; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }
    for (let y = -gap + oy; y < window.innerHeight; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }
    ctx.restore();

    if (burst > 0) {
      ctx.fillStyle = "rgba(184,255,74," + burst * 0.08 + ")";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      burst *= 0.9;
      if (burst < 0.02) burst = 0;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.life != null) {
        p.life -= 0.02;
        p.a = Math.max(0, p.life);
        p.vx *= 0.98;
        p.vy *= 0.98;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
      } else {
        if (p.y > window.innerHeight + 10) {
          p.y = -10;
          p.x = Math.random() * window.innerWidth;
        }
      }
      ctx.beginPath();
      ctx.fillStyle = "hsla(" + p.hue + ",90%,60%," + p.a + ")";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReduced) requestAnimationFrame(tickFx);
  }

  /* —— Number tween —— */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tickNumbers() {
    displayLiters = lerp(displayLiters, targetLiters, 0.18);
    displayEarn = lerp(displayEarn, targetEarn, 0.16);
    displayYear = lerp(displayYear, targetYear, 0.14);

    const lit = Math.round(displayLiters);
    litersOut.textContent = num.format(lit) + " L";
    vatLiters.textContent = num.format(lit);
    periodEarn.textContent = euro.format(displayEarn);
    yearEarn.textContent = euro.format(displayYear);

    if (
      Math.abs(displayLiters - targetLiters) > 0.2 ||
      Math.abs(displayEarn - targetEarn) > 0.01
    ) {
      requestAnimationFrame(tickNumbers);
    } else {
      litersOut.textContent = num.format(targetLiters) + " L";
      vatLiters.textContent = num.format(targetLiters);
      periodEarn.textContent = euro.format(targetEarn);
      yearEarn.textContent = euro.format(targetYear);
    }
  }

  function spawnBubbles(level) {
    bubbles.innerHTML = "";
    const count = Math.min(14, Math.floor(level / 70) + 2);
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = 12 + Math.random() * 76 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      s.style.width = 5 + Math.random() * 7 + "px";
      s.style.height = s.style.width;
      bubbles.appendChild(s);
    }
  }

  function sparkAt() {
    if (!sparks || prefersReduced) return;
    const rect = reactor.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("span");
      const dx = (Math.random() - 0.5) * 120;
      const dy = -40 - Math.random() * 100;
      s.style.left = 40 + Math.random() * 20 + "%";
      s.style.top = 55 + Math.random() * 20 + "%";
      s.style.setProperty("--dx", dx + "px");
      s.style.setProperty("--dy", dy + "px");
      s.style.background = Math.random() > 0.5 ? "#b8ff4a" : "#f0a020";
      sparks.appendChild(s);
      setTimeout(function () {
        s.remove();
      }, 700);
    }
    void rect;
  }

  function update() {
    const liters = Number(slider.value) || 0;
    const periodMoney = liters * RATE;
    const yearMoney = period === "week" ? periodMoney * 52 : periodMoney * 12;
    const pct = (liters / 1000) * 100;

    slider.style.setProperty("--fill", pct + "%");
    if (energy) energy.style.setProperty("--fill", pct + "%");
    slider.setAttribute("aria-valuenow", String(liters));
    periodLabel.textContent =
      period === "week" ? "Erlös / Woche" : "Erlös / Monat";

    liquid.style.height = Math.max(6, pct) * 0.92 + "%";
    earnBar.style.width = pct + "%";

    targetLiters = liters;
    targetEarn = periodMoney;
    targetYear = yearMoney;
    requestAnimationFrame(tickNumbers);

    spawnBubbles(liters);
    if (liters > 0 && liters % 50 === 0) sparkAt();
  }

  slider.addEventListener("input", function () {
    update();
    sparkAt();
  });

  periodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      period = btn.getAttribute("data-period") || "week";
      periodBtns.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      update();
      addBurst(window.innerWidth * 0.7, window.innerHeight * 0.45, 28);
    });
  });

  /* —— Tilt —— */
  if (reactor && !prefersReduced) {
    reactor.addEventListener("pointermove", function (e) {
      const r = reactor.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      reactor.style.transform =
        "rotateY(" + x * 10 + "deg) rotateX(" + -y * 10 + "deg)";
    });
    reactor.addEventListener("pointerleave", function () {
      reactor.style.transform = "";
    });
  }

  /* —— Cursor glow —— */
  if (
    cursorGlow &&
    !prefersReduced &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    document.body.classList.add("has-glow");
    window.addEventListener("pointermove", function (e) {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    });
    window.addEventListener("pointerleave", function () {
      cursorGlow.style.opacity = "0";
    });
  }

  /* —— Boost —— */
  boomBtn.addEventListener("click", function () {
    boomBtn.classList.remove("fire");
    void boomBtn.offsetWidth;
    boomBtn.classList.add("fire");
    document.body.classList.add("is-boost");
    addBurst(window.innerWidth / 2, window.innerHeight * 0.4, 60);
    sparkAt();
    toast.hidden = false;
    toast.classList.add("show");
    setTimeout(function () {
      document.body.classList.remove("is-boost");
      toast.classList.remove("show");
    }, 900);
  });

  if (!prefersReduced) {
    resize();
    spawnParticles(70);
    window.addEventListener("resize", function () {
      resize();
    });
    requestAnimationFrame(tickFx);
  }

  update();
})();

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
  const oilRain = document.getElementById("oilRain");
  const pourEl = document.querySelector(".pour");
  const splash = document.getElementById("splash");
  const ripples = document.getElementById("ripples");
  const periodBtns = document.querySelectorAll(".pbtn");

  let period = "week";
  let displayLiters = 0;
  let targetLiters = 0;
  let displayEarn = 0;
  let targetEarn = 0;
  let displayYear = 0;
  let targetYear = 0;
  let pourTimer = null;
  let lastLiters = -1;

  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  const num = new Intl.NumberFormat("de-DE");

  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: 0.5, y: 0.4 };
  let burst = 0;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function spawnOilDrops(count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        r: Math.random() * 5 + 3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: Math.random() * 1.4 + 0.7,
        a: Math.random() * 0.4 + 0.35,
        rot: Math.random() * Math.PI,
        type: "drop",
      });
    }
  }

  function addBurst(cx, cy, n) {
    burst = 1;
    for (let i = 0; i < n; i++) {
      const ang = (Math.random() * Math.PI) / 1.2 - Math.PI / 2.4;
      const sp = Math.random() * 5 + 2;
      particles.push({
        x: cx,
        y: cy,
        r: Math.random() * 6 + 3,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp + 1,
        a: 1,
        rot: ang,
        type: "drop",
        life: 1,
      });
    }
  }

  function drawDrop(p) {
    const w = p.r * 0.85;
    const h = p.r * 1.35;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * 0.15);
    const g = ctx.createRadialGradient(-w * 0.25, -h * 0.25, 0, 0, 0, h);
    g.addColorStop(0, "rgba(255,236,180," + p.a + ")");
    g.addColorStop(0.45, "rgba(232,166,58," + p.a + ")");
    g.addColorStop(1, "rgba(110,60,10," + p.a * 0.9 + ")");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w, -h * 0.3, w, h * 0.35, 0, h);
    ctx.bezierCurveTo(-w, h * 0.35, -w, -h * 0.3, 0, -h);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255," + p.a * 0.35 + ")";
    ctx.beginPath();
    ctx.ellipse(-w * 0.25, -h * 0.35, w * 0.22, h * 0.18, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tickFx() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.save();
    ctx.strokeStyle = "rgba(232,166,58,0.045)";
    ctx.lineWidth = 1;
    const gap = 52;
    const ox = (mouse.x * 24) % gap;
    const oy = (mouse.y * 24) % gap;
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
      ctx.fillStyle = "rgba(232,166,58," + burst * 0.07 + ")";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      burst *= 0.9;
      if (burst < 0.02) burst = 0;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += 0.02;
      if (p.life != null) {
        p.life -= 0.018;
        p.a = Math.max(0, p.life);
        p.vx *= 0.985;
        p.vy += 0.08;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
      } else if (p.y > window.innerHeight + 30) {
        p.y = -20;
        p.x = Math.random() * window.innerWidth;
      }
      drawDrop(p);
    }

    if (!prefersReduced) requestAnimationFrame(tickFx);
  }

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
    if (!bubbles) return;
    bubbles.innerHTML = "";
    const count = Math.min(16, Math.floor(level / 60) + 3);
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = 12 + Math.random() * 76 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      s.style.width = 5 + Math.random() * 8 + "px";
      s.style.height = s.style.width;
      bubbles.appendChild(s);
    }
  }

  function sparkAt() {
    if (!sparks || prefersReduced) return;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      const dx = (Math.random() - 0.5) * 140;
      const dy = -30 - Math.random() * 110;
      s.style.left = 42 + Math.random() * 16 + "%";
      s.style.top = 48 + Math.random() * 22 + "%";
      s.style.setProperty("--dx", dx + "px");
      s.style.setProperty("--dy", dy + "px");
      s.style.background = Math.random() > 0.35 ? "#e8a63a" : "#ffe7a0";
      sparks.appendChild(s);
      setTimeout(function () {
        s.remove();
      }, 700);
    }
  }

  function triggerSplash() {
    if (!splash || prefersReduced) return;
    splash.classList.remove("is-on");
    void splash.offsetWidth;
    splash.classList.add("is-on");
  }

  function triggerRipple() {
    if (!ripples || prefersReduced) return;
    const i = document.createElement("i");
    ripples.appendChild(i);
    setTimeout(function () {
      i.remove();
    }, 1200);
  }

  function setPouring(on) {
    if (!pourEl) return;
    pourEl.classList.toggle("is-pouring", on);
  }

  function pulsePour() {
    setPouring(true);
    triggerSplash();
    triggerRipple();
    clearTimeout(pourTimer);
    pourTimer = setTimeout(function () {
      setPouring(false);
    }, 420);
  }

  function spawnRain(amount) {
    if (!oilRain || prefersReduced) return;
    for (let i = 0; i < amount; i++) {
      const d = document.createElement("span");
      d.className = "drop";
      const size = 10 + Math.random() * 12;
      d.style.left = Math.random() * 100 + "%";
      d.style.width = size + "px";
      d.style.height = size * 1.4 + "px";
      d.style.animationDuration = 2.2 + Math.random() * 2.8 + "s";
      d.style.animationDelay = Math.random() * 0.4 + "s";
      oilRain.appendChild(d);
      setTimeout(function () {
        d.remove();
      }, 5200);
    }
  }

  function startAmbientRain() {
    if (prefersReduced) return;
    spawnRain(4);
    setInterval(function () {
      spawnRain(2 + Math.floor(Math.random() * 3));
    }, 1800);
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
      period === "week" ? "Möglicher Erlös / Woche" : "Möglicher Erlös / Monat";

    liquid.style.height = Math.max(8, pct) * 0.92 + "%";
    earnBar.style.width = pct + "%";

    targetLiters = liters;
    targetEarn = periodMoney;
    targetYear = yearMoney;
    requestAnimationFrame(tickNumbers);

    spawnBubbles(liters);

    if (lastLiters >= 0 && liters !== lastLiters) {
      pulsePour();
      if (Math.abs(liters - lastLiters) > 8) sparkAt();
    }
    lastLiters = liters;
  }

  slider.addEventListener("input", function () {
    update();
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
      addBurst(window.innerWidth * 0.35, window.innerHeight * 0.42, 36);
      spawnRain(10);
    });
  });

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

  boomBtn.addEventListener("click", function () {
    boomBtn.classList.remove("fire");
    void boomBtn.offsetWidth;
    boomBtn.classList.add("fire");
    document.body.classList.add("is-boost");
    setPouring(true);
    spawnRain(28);
    addBurst(window.innerWidth * 0.35, window.innerHeight * 0.38, 70);
    sparkAt();
    triggerSplash();
    triggerRipple();
    toast.hidden = false;
    toast.classList.add("show");
    setTimeout(function () {
      document.body.classList.remove("is-boost");
      setPouring(false);
      toast.classList.remove("show");
    }, 1200);
  });

  if (!prefersReduced) {
    resize();
    spawnOilDrops(55);
    window.addEventListener("resize", resize);
    requestAnimationFrame(tickFx);
    startAmbientRain();
  }

  update();
})();

(function () {
  var year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var starsRoot = document.getElementById("stars");
  if (starsRoot) {
    var count = window.innerWidth < 700 ? 48 : 90;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var star = document.createElement("span");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      var size = Math.random() > 0.82 ? 2 : 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      frag.appendChild(star);
    }
    starsRoot.appendChild(frag);
  }

  if (typeof anime === "undefined" || reduce) {
    document
      .querySelectorAll(
        ".letter, .stage-eyebrow, .stage-line, .stage-tag, .stage-actions, .scroll-hint, .reveal, .star"
      )
      .forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    return;
  }

  anime({
    targets: ".star",
    opacity: [
      { value: 0.15, duration: 0 },
      { value: function () { return 0.25 + Math.random() * 0.75; }, duration: function () { return 800 + Math.random() * 1800; } },
      { value: 0.12, duration: function () { return 800 + Math.random() * 1800; } },
    ],
    easing: "linear",
    loop: true,
    delay: anime.stagger(18, { start: 0 }),
  });

  anime
    .timeline({ easing: "easeOutExpo" })
    .add({
      targets: ".stage-eyebrow",
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 700,
    })
    .add(
      {
        targets: ".stage-title .letter",
        opacity: [0, 1],
        translateY: [60, 0],
        rotateX: [35, 0],
        duration: 1000,
        delay: anime.stagger(55),
      },
      "-=400"
    )
    .add(
      {
        targets: ".stage-line",
        opacity: [0, 1],
        scaleX: [0, 1],
        duration: 700,
      },
      "-=650"
    )
    .add(
      {
        targets: ".stage-tag",
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 700,
      },
      "-=500"
    )
    .add(
      {
        targets: ".stage-actions",
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 700,
      },
      "-=480"
    )
    .add(
      {
        targets: ".scroll-hint",
        opacity: [0, 0.7],
        duration: 600,
      },
      "-=300"
    );

  anime({
    targets: ".scroll-hint",
    translateY: [0, 6, 0],
    duration: 1800,
    easing: "easeInOutSine",
    loop: true,
    delay: 2200,
  });

  var reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if (!("IntersectionObserver" in window)) {
    anime({
      targets: ".reveal",
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger(80),
      duration: 800,
      easing: "easeOutCubic",
    });
    return;
  }

  var seen = new WeakSet();
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 850,
          easing: "easeOutCubic",
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  var year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof anime === "undefined" || reduce) {
    document
      .querySelectorAll(
        ".letter, .stage-eyebrow, .stage-line, .stage-tag, .stage-actions, .scroll-hint, .reveal"
      )
      .forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    return;
  }

  var letters = document.querySelectorAll(".stage-title .letter");
  var tl = anime.timeline({
    easing: "easeOutCubic",
    autoplay: true,
  });

  tl.add({
    targets: ".stage-eyebrow",
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 500,
  });

  letters.forEach(function (letter, index) {
    tl.add(
      {
        targets: letter,
        translateY: ["110%", "0%"],
        opacity: [0, 1],
        duration: 480,
        easing: "easeOutQuart",
      },
      280 + index * 160
    );
  });

  var afterTitle = 280 + letters.length * 160 + 80;

  tl.add(
    {
      targets: ".stage-line",
      opacity: [0, 1],
      scaleX: [0, 1],
      duration: 560,
      easing: "easeOutExpo",
    },
    afterTitle
  )
    .add(
      {
        targets: ".stage-tag",
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 620,
      },
      "-=280"
    )
    .add(
      {
        targets: ".stage-actions",
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 620,
      },
      "-=420"
    )
    .add(
      {
        targets: ".scroll-hint",
        opacity: [0, 0.7],
        duration: 500,
      },
      "-=280"
    );

  anime({
    targets: ".scroll-hint",
    translateY: [0, 6, 0],
    duration: 1800,
    easing: "easeInOutSine",
    loop: true,
    delay: 2600,
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

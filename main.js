(function () {
  var year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof anime === "undefined" || reduce) {
    document.querySelectorAll(".letter, .mega-sub, .hero-bottom, .reveal").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  anime
    .timeline({ easing: "easeOutExpo" })
    .add({
      targets: ".mega-type .letter",
      translateY: [120, 0],
      opacity: [0, 1],
      rotate: [4, 0],
      duration: 1100,
      delay: anime.stagger(70),
    })
    .add(
      {
        targets: ".mega-sub",
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 800,
      },
      "-=700"
    )
    .add(
      {
        targets: ".hero-bottom",
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
      },
      "-=550"
    );

  var track = document.querySelector(".marquee-track");
  if (track) {
    anime({
      targets: track,
      translateX: ["0%", "-50%"],
      duration: 22000,
      easing: "linear",
      loop: true,
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !reveals.length) {
    anime({
      targets: ".reveal",
      translateY: [28, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(90),
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
          translateY: [28, 0],
          opacity: [0, 1],
          duration: 850,
          easing: "easeOutCubic",
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

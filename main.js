(function () {
  var year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof anime === "undefined" || reduce) {
    document
      .querySelectorAll(
        ".letter, .stage-eyebrow, .stage-line, .stage-tag, .stage-actions"
      )
      .forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    return;
  }

  var letters = document.querySelectorAll(".stage-title .letter");
  if (!letters.length) return;

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
    );
})();

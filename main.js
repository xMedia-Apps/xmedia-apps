(function () {
  var year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof anime === "undefined" || reduce) {
    document
      .querySelectorAll(
        ".letter, .stage-eyebrow, .stage-line, .stage-tag, .stage-actions, .stage-copy"
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

  var eyebrow = document.querySelector(".stage-eyebrow");
  if (eyebrow) {
    tl.add({
      targets: eyebrow,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 500,
    });
  }

  var letterDelay = eyebrow ? 280 : 80;
  var letterStep = letters.length > 10 ? 70 : 160;

  letters.forEach(function (letter, index) {
    tl.add(
      {
        targets: letter,
        translateY: ["110%", "0%"],
        opacity: [0, 1],
        duration: 480,
        easing: "easeOutQuart",
      },
      letterDelay + index * letterStep
    );
  });

  var afterTitle = letterDelay + letters.length * letterStep + 80;

  tl.add(
    {
      targets: ".stage-line",
      opacity: [0, 1],
      scaleX: [0, 1],
      duration: 560,
      easing: "easeOutExpo",
    },
    afterTitle
  ).add(
    {
      targets: ".stage-tag, .stage-copy",
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 620,
    },
    "-=280"
  );

  if (document.querySelector(".stage-actions")) {
    tl.add(
      {
        targets: ".stage-actions",
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 620,
      },
      "-=420"
    );
  }
})();

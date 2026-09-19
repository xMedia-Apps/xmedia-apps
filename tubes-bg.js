/**
 * Neon 3D Tubes Cursor Trail background
 * Based on Kevin Levron / threejs-components TubesCursor demo
 * https://codepen.io/soju22/pen/qEbdVjK
 * Original demo licence: CC BY-NC-SA 4.0
 */
import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

const canvas = document.getElementById("tubes-bg");
if (!canvas) {
  // nothing
} else if (
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  canvas.remove();
} else if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
  canvas.remove();
} else {
  const app = TubesCursor(canvas, {
    tubes: {
      colors: ["#ffffff", "#c8d0ff", "#8fd3ff"],
      lights: {
        intensity: 180,
        colors: ["#ffffff", "#a8b4ff", "#60aed5", "#e8e8e8"],
      },
    },
  });

  document.body.addEventListener("click", function (e) {
    if (!app || !app.tubes) return;
    if (e.target.closest("a, button")) return;
    app.tubes.setColors(randomColors(3));
    app.tubes.setLightsColors(randomColors(4));
  });
}

function randomColors(count) {
  return new Array(count).fill(0).map(function () {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  });
}

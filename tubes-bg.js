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
} else {
  // Touch devices have no cursor — TubesCursor runs its idle auto-path.
  const app = TubesCursor(canvas, {
    tubes: {
      count: 8,
      colors: ["#ffffff", "#c8d0ff", "#8fd3ff"],
      minRadius: 0.0012,
      maxRadius: 0.008,
      noise: 0.025,
      lerp: 0.45,
      lights: {
        intensity: 90,
        colors: ["#ffffff", "#a8b4ff", "#60aed5", "#e8e8e8"],
      },
    },
    bloom: {
      threshold: 0.15,
      strength: 0.55,
      radius: 0.22,
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

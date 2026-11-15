/* ============================================================
   Estrellitas detrás del cursor
   Cielo Yenied Caicedo — Portafolio

   Al mover el mouse van quedando unas pocas estrellitas que
   brillan, giran un poco y se apagan solas. Solo con mouse: en
   celular no aparecen, y tampoco si se pidió menos movimiento.

   Para que salgan MÁS o MENOS estrellas, cambia PASO:
   número más grande = menos estrellas.
   ============================================================ */

(function () {
  "use strict";

  var conMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!conMouse || menosMovimiento) return;

  var PASO = 90;                        // distancia (px) entre estrella y estrella
  var COLORES = ["#F2C14E", "#E2895A", "#FFE8A3", "#8FB4E8"];

  var ESTRELLA =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z"/>' +
    '</svg>';

  var ultimaX = null;
  var ultimaY = null;

  document.addEventListener("mousemove", function (e) {
    if (ultimaX === null) {
      ultimaX = e.clientX;
      ultimaY = e.clientY;
      return;
    }
    var dx = e.clientX - ultimaX;
    var dy = e.clientY - ultimaY;
    if (Math.sqrt(dx * dx + dy * dy) < PASO) return;

    var estrella = document.createElement("span");
    estrella.className = "estrellita";
    estrella.innerHTML = ESTRELLA;
    // Cada una sale un poquito corrida, de tamaño y color distinto
    estrella.style.left = (e.clientX + (Math.random() * 16 - 8)) + "px";
    estrella.style.top = (e.clientY + (Math.random() * 16 - 8)) + "px";
    estrella.style.setProperty("--tam", (0.8 + Math.random() * 0.7).toFixed(2));
    estrella.style.color = COLORES[Math.floor(Math.random() * COLORES.length)];
    document.body.appendChild(estrella);
    setTimeout(function () { estrella.remove(); }, 1300);

    ultimaX = e.clientX;
    ultimaY = e.clientY;
  }, { passive: true });

  document.addEventListener("mouseleave", function () { ultimaX = null; });
})();

/* ============================================================
   Cursor con huellitas de perro
   Cielo Yenied Caicedo — Portafolio

   Al mover el mouse quedan huellitas (como si Nucita caminara
   detrás del cursor) que se borran solas. Solo con mouse: en
   celular no aparece, y tampoco si se pidió menos movimiento.
   ============================================================ */

(function () {
  "use strict";

  var conMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!conMouse || menosMovimiento) return;

  var HUELLA =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<ellipse cx="12" cy="16" rx="5.2" ry="4.4"/>' +
      '<ellipse cx="5.2" cy="10.2" rx="2.2" ry="2.8"/>' +
      '<ellipse cx="9.4" cy="6.2" rx="2.2" ry="2.9"/>' +
      '<ellipse cx="14.6" cy="6.2" rx="2.2" ry="2.9"/>' +
      '<ellipse cx="18.8" cy="10.2" rx="2.2" ry="2.8"/>' +
    '</svg>';

  var PASO = 46;          // distancia (px) entre huellita y huellita
  var ultimaX = null;
  var ultimaY = null;
  var lado = 1;

  document.addEventListener("mousemove", function (e) {
    if (ultimaX === null) {
      ultimaX = e.clientX;
      ultimaY = e.clientY;
      return;
    }
    var dx = e.clientX - ultimaX;
    var dy = e.clientY - ultimaY;
    var distancia = Math.sqrt(dx * dx + dy * dy);
    if (distancia < PASO) return;

    // La huella mira hacia donde va el cursor; una a la izquierda,
    // otra a la derecha, como patitas de verdad
    var angulo = Math.atan2(dy, dx);
    var corrida = 7 * lado;
    var x = e.clientX + Math.cos(angulo + Math.PI / 2) * corrida;
    var y = e.clientY + Math.sin(angulo + Math.PI / 2) * corrida;
    lado = -lado;

    var huella = document.createElement("span");
    huella.className = "huellita";
    huella.innerHTML = HUELLA;
    huella.style.left = x + "px";
    huella.style.top = y + "px";
    huella.style.setProperty("--giro", (angulo * 180 / Math.PI + 90).toFixed(0) + "deg");
    document.body.appendChild(huella);
    setTimeout(function () { huella.remove(); }, 1100);

    ultimaX = e.clientX;
    ultimaY = e.clientY;
  }, { passive: true });

  // Al salir de la ventana se empieza de cero
  document.addEventListener("mouseleave", function () { ultimaX = null; });
})();

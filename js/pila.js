/* ============================================================
   Las piezas del inicio siguen al cursor
   Cielo Yenied Caicedo — Portafolio

   Las tres piezas del hero se desplazan al mover el mouse, cada una
   a distinta distancia, como si estuvieran a distinta profundidad.
   Sin este script quedan quietas en su posición de reposo, que es
   la que define el CSS: no se pierde nada.
   ============================================================ */

(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  var piezas = hero.querySelectorAll(".hero__pieza");
  if (!piezas.length) {
    return;
  }

  /* Solo donde hay un cursor de verdad y nadie pidió menos movimiento. */
  var hayCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hayCursor.matches || menosMovimiento.matches) {
    return;
  }

  function mover(evento) {
    var caja = hero.getBoundingClientRect();

    /* Posición del cursor dentro del hero, de -0.5 a 0.5. */
    var x = (evento.clientX - caja.left) / caja.width - 0.5;
    var y = (evento.clientY - caja.top) / caja.height - 0.5;

    Array.prototype.forEach.call(piezas, function (pieza) {
      var fondo = parseFloat(pieza.getAttribute("data-profundidad")) || 1;

      pieza.style.setProperty("--dx", (x * 26 * fondo).toFixed(1) + "px");
      pieza.style.setProperty("--dy", (y * 16 * fondo).toFixed(1) + "px");
      pieza.style.setProperty("--giro-extra", (x * 2.2 * fondo).toFixed(2) + "deg");
    });
  }

  function volver() {
    Array.prototype.forEach.call(piezas, function (pieza) {
      pieza.style.setProperty("--dx", "0px");
      pieza.style.setProperty("--dy", "0px");
      pieza.style.setProperty("--giro-extra", "0deg");
    });
  }

  hero.addEventListener("mousemove", mover);
  hero.addEventListener("mouseleave", volver);
})();

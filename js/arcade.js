/* ============================================================
   Animaciones de la página de Videojuegos
   Cielo Yenied Caicedo — Portafolio

   1. Las tarjetas aparecen una tras otra al bajar.
   2. En computador, la tarjeta se inclina un poquito siguiendo
      el mouse (efecto 3D).
   Sin este script la página se ve completa y quieta.
   ============================================================ */

(function () {
  "use strict";

  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (menosMovimiento) return;

  var tarjetas = document.querySelectorAll(".juego-card");

  /* ---------- 1. Aparecer al bajar ---------- */
  if ("IntersectionObserver" in window) {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var tarjeta = entrada.target;
        // Cada tarjeta espera un poquito más que la anterior (efecto cascada)
        var orden = Array.prototype.indexOf.call(tarjetas, tarjeta) % 3;
        setTimeout(function () {
          tarjeta.classList.remove("juego-card--espera");
        }, orden * 120);
        vigia.unobserve(tarjeta);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });

    tarjetas.forEach(function (tarjeta) {
      // Solo se esconde si todavía no está en pantalla
      if (tarjeta.getBoundingClientRect().top > window.innerHeight) {
        tarjeta.classList.add("juego-card--espera");
        vigia.observe(tarjeta);
      }
    });
  }

  /* ---------- 2. Inclinación 3D con el mouse ---------- */
  var conMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!conMouse) return;

  tarjetas.forEach(function (tarjeta) {
    var caja = tarjeta.querySelector(".juego-card__caja");

    tarjeta.addEventListener("pointermove", function (e) {
      var r = caja.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;   // -0.5 a 0.5
      var y = (e.clientY - r.top) / r.height - 0.5;
      caja.style.setProperty("--inclina-y", (x * 8).toFixed(2) + "deg");
      caja.style.setProperty("--inclina-x", (-y * 8).toFixed(2) + "deg");
    });

    tarjeta.addEventListener("pointerleave", function () {
      caja.style.setProperty("--inclina-y", "0deg");
      caja.style.setProperty("--inclina-x", "0deg");
    });
  });
})();

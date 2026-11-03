/* ============================================================
   Interacciones de "Lo que hago" (index.html) y de la
   Hoja de vida (hoja-de-vida.html)
   Cielo Yenied Caicedo — Portafolio

   1. Tarjetas que se voltean al tocarlas (botones con aria-pressed).
   2. Contadores que suben de 0 al número cuando aparecen en pantalla.
   3. Línea de tiempo: cada punto se "enciende" al llegar a él.
   Sin este script todo se ve completo: las tarjetas muestran
   su texto y los números ya están escritos en el HTML.
   ============================================================ */

(function () {
  "use strict";

  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("con-js");

  /* ---------- 1. Tarjetas que se voltean ---------- */
  document.querySelectorAll(".oficio-card").forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function () {
      var volteada = tarjeta.getAttribute("aria-pressed") === "true";
      tarjeta.setAttribute("aria-pressed", volteada ? "false" : "true");
    });
  });

  if (!("IntersectionObserver" in window)) return;

  /* ---------- 2. Contadores ---------- */
  function contar(el) {
    var hasta = parseInt(el.getAttribute("data-hasta"), 10) || 0;
    var sufijo = el.getAttribute("data-sufijo") || "";
    if (menosMovimiento) {
      el.textContent = hasta + sufijo;
      return;
    }
    var duracion = 1200;      // milisegundos
    var inicio = null;
    function paso(ahora) {
      if (inicio === null) inicio = ahora;
      var avance = Math.min((ahora - inicio) / duracion, 1);
      var suave = 1 - Math.pow(1 - avance, 3);   // frena al final
      el.textContent = Math.round(hasta * suave) + sufijo;
      if (avance < 1) requestAnimationFrame(paso);
    }
    el.textContent = "0" + sufijo;
    requestAnimationFrame(paso);
  }

  var vigiaContador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      contar(entrada.target);
      vigiaContador.unobserve(entrada.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".contador").forEach(function (el) {
    vigiaContador.observe(el);
  });

  /* ---------- 3. Línea de tiempo ---------- */
  var vigiaLinea = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("linea__item--visto");
      vigiaLinea.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });

  document.querySelectorAll(".linea__item").forEach(function (item) {
    vigiaLinea.observe(item);
  });
})();

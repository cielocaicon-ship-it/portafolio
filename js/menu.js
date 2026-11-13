/* ============================================================
   Menú tipo pastilla flotante
   Cielo Yenied Caicedo — Portafolio

   1. El menú flota encima de la página. Este script mide su alto
      y lo guarda en la variable --alto-menu, para que el contenido
      de arriba no quede escondido debajo de él.
   2. Al bajar por la página la pastilla se hace más delgada
      (se esconde "Ingeniera Multimedia"); al volver arriba crece.
   ============================================================ */

(function () {
  "use strict";

  var menu = document.querySelector(".masthead");
  if (!menu) return;
  var raiz = document.documentElement;

  function medir() {
    raiz.style.setProperty("--alto-menu", menu.offsetHeight + "px");
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(medir).observe(menu);
  }
  medir();

  // Se mide al cargar, antes de achicarlo: el espacio de arriba no salta
  var abajo = false;
  var esperando = false;
  function revisar() {
    esperando = false;
    var ahora = window.scrollY > 60;
    if (ahora !== abajo) {
      abajo = ahora;
      menu.classList.toggle("masthead--abajo", abajo);
    }
  }
  window.addEventListener("scroll", function () {
    if (!esperando) {
      esperando = true;
      requestAnimationFrame(revisar);
    }
  }, { passive: true });
  revisar();
})();

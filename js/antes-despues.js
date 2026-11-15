/* ============================================================
   Antes y después (Trabajos → Fotografía)
   Cielo Yenied Caicedo — Portafolio

   Dos fotos iguales, una encima de la otra: la original abajo y
   la editada arriba. Al mover la barrita (el control deslizante)
   se recorta la editada y se ve cuánto cambió la foto.
   También funciona con el teclado (flechas) y con el dedo.
   ============================================================ */

(function () {
  "use strict";

  document.querySelectorAll(".antes-despues").forEach(function (caja) {
    var control = caja.querySelector(".antes-despues__control");
    if (!control) return;

    function mover() {
      caja.style.setProperty("--corte", control.value + "%");
    }

    control.addEventListener("input", mover);
    mover();
  });
})();

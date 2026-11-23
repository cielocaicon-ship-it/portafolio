/* ============================================================
   Filtro de juegos por tipo (juegos.html)
   Cielo Yenied Caicedo — Portafolio

   Botones "Todos · 2D · 3D · Realidad aumentada". Al elegir uno,
   las petunias y los botones de los juegos de otro tipo se ponen
   pálidos, y los del tipo elegido se quedan brillando.
   Cada juego dice su tipo con data-tipo="2d", "3d" o "ar".
   ============================================================ */

(function () {
  "use strict";

  var botones = document.querySelectorAll(".jardin__chip");
  var juegos = document.querySelectorAll(".jardin [data-tipo]");
  if (!botones.length) return;

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      var filtro = boton.getAttribute("data-filtro");
      botones.forEach(function (b) {
        b.setAttribute("aria-pressed", b === boton ? "true" : "false");
      });
      juegos.forEach(function (j) {
        var apagado = filtro !== "todos" && j.getAttribute("data-tipo") !== filtro;
        j.classList.toggle("juego--apagado", apagado);
      });
    });
  });
})();

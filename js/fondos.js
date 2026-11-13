/* ============================================================
   Fondo difuminado detrás de cada imagen de Trabajos
   Cielo Yenied Caicedo — Portafolio

   Todas las imágenes de las tarjetas van en un marco del mismo
   tamaño. Cuando una pieza es más alta o más ancha que el marco,
   en vez de quedar un espacio blanco, se ve detrás la misma
   imagen agrandada y borrosa. Este script le pasa al CSS la
   dirección de cada imagen (variable --fondo).
   ============================================================ */

(function () {
  "use strict";

  document.querySelectorAll(".blog__list .post-card__zoom").forEach(function (marco) {
    var img = marco.querySelector("img");
    if (!img) return;
    // Dirección completa: si no, el CSS la buscaría dentro de la carpeta css/
    var src = img.src;
    marco.style.setProperty("--fondo", 'url("' + src + '")');
    marco.classList.add("post-card__zoom--fondo");
  });

  // Los videos usan su imagen de portada (poster) como fondo
  document.querySelectorAll(".blog__list video[poster]").forEach(function (video) {
    var marco = video.parentElement;
    marco.style.setProperty("--fondo", 'url("' + video.poster + '")');
    marco.classList.add("post-card__gallery--fondo");
  });
})();

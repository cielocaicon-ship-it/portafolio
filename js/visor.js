/* ============================================================
   Visor de imágenes (lightbox)
   Cielo Yenied Caicedo — Portafolio

   Cada imagen de la galería está envuelta en un enlace que apunta
   al archivo original. Si este script no se ejecuta, el enlace
   sigue funcionando y la imagen se abre en el navegador.
   Este script solo mejora esa experiencia: en lugar de salir de
   la página, muestra la imagen ampliada en un cuadro de diálogo.
   ============================================================ */

(function () {
  "use strict";

  var dialogo = document.getElementById("lightbox");

  /* Si el navegador no soporta <dialog>, no hacemos nada:
     los enlaces conservan su comportamiento normal. */
  if (!dialogo || typeof dialogo.showModal !== "function") {
    return;
  }

  var figura = dialogo.querySelector(".lightbox__figure");
  var pie = dialogo.querySelector(".lightbox__caption");
  var boton = dialogo.querySelector(".lightbox__close");
  var imagenActual = null;

  function abrir(enlace) {
    var original = enlace.querySelector("img");
    var texto = original ? original.getAttribute("alt") : "";

    if (imagenActual) {
      imagenActual.remove();
    }

    imagenActual = document.createElement("img");
    imagenActual.className = "lightbox__img";
    imagenActual.src = enlace.getAttribute("href");
    imagenActual.alt = texto;

    figura.insertBefore(imagenActual, pie);
    pie.textContent = texto;
    dialogo.showModal();
  }

  var enlaces = document.querySelectorAll(".post-card__zoom");

  Array.prototype.forEach.call(enlaces, function (enlace) {
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();
      abrir(enlace);
    });
  });

  boton.addEventListener("click", function () {
    dialogo.close();
  });

  /* Un clic por fuera de la imagen también cierra el visor.
     La tecla Escape ya la maneja el propio <dialog>. */
  dialogo.addEventListener("click", function (evento) {
    if (evento.target === dialogo) {
      dialogo.close();
    }
  });
})();

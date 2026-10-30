/* ============================================================
   Contador del mensaje
   Cielo Yenied Caicedo — Portafolio

   Va contando lo que la persona escribe y avisa cuándo ya puede
   enviar. Sin este script el formulario funciona igual: el propio
   navegador exige el mínimo con el atributo minlength.
   ============================================================ */

(function () {
  "use strict";

  var campo = document.getElementById("mensaje");
  var marcador = document.getElementById("cuenta-mensaje");

  if (!campo || !marcador) {
    return;
  }

  var minimo = parseInt(campo.getAttribute("minlength"), 10) || 0;
  var maximo = parseInt(campo.getAttribute("maxlength"), 10) || 0;

  function actualizar() {
    var escrito = campo.value.trim().length;

    if (escrito === 0) {
      marcador.textContent = "";
      marcador.classList.remove("form-contador--listo");
      return;
    }

    if (escrito < minimo) {
      marcador.textContent = "Te faltan " + (minimo - escrito) + " caracteres";
      marcador.classList.remove("form-contador--listo");
    } else {
      marcador.textContent = escrito + " de " + maximo + " caracteres";
      marcador.classList.add("form-contador--listo");
    }
  }

  campo.addEventListener("input", actualizar);
  actualizar();
})();

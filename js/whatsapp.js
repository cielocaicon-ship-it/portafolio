/* ============================================================
   Botón de WhatsApp (contacto.html)
   Cielo Yenied Caicedo — Portafolio

   PARA ACTIVARLO: escribe tu número en NUMERO, con el 57 de
   Colombia adelante y sin espacios ni el signo +.
   Ejemplo: "573001234567"
   Mientras NUMERO esté vacío, el botón se ve pero abre WhatsApp
   para que la persona elija el chat (todavía no llega a ti).
   ============================================================ */

(function () {
  "use strict";

  var NUMERO = "";
  var MENSAJE = "¡Hola, Cielo! Vi tu portafolio y quiero hablarte de un proyecto.";

  var boton = document.getElementById("botonWhatsapp");
  if (!boton) return;

  boton.href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(MENSAJE);
  boton.target = "_blank";
  boton.rel = "noopener";
  boton.hidden = false;
})();

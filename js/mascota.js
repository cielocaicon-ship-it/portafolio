/* ============================================================
   Nucita, la mascota del portafolio
   Cielo Yenied Caicedo — Portafolio

   Nucita (la perrita de mis juegos) se asoma en la esquina de
   abajo. Al tocarla salta y dice algo distinto según la página.
   Se crea desde aquí para no repetir el dibujo en cada página.
   ============================================================ */

(function () {
  "use strict";

  // Frases según la página (la primera sale al tocarla la primera vez)
  var pagina = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  var FRASES = {
    "index": [
      "¡Guau! Soy Nucita, la perrita de Cielo",
      "Soy de verdad, no solo un dibujo",
      "Salgo en los juegos de la saga Petunia",
      "Toca las tarjetas de colores, se voltean",
      "Cielo me dibujó… y quedé divina",
      "¿Ya pasaste por el jardín de juegos?"
    ],
    "blog": [
      "¡Aquí está todo su trabajo!",
      "Toca una imagen para verla grande",
      "Mi favorito es el pixel art",
      "Yo superviso cada diseño desde el sofá",
      "Este empaque huele a galletas… creo",
      "¡Guau, guau! Eso significa \"contrátenla\""
    ],
    "hoja-de-vida": [
      "Esta es la hoja de vida de Cielo",
      "¡Quedaron de terceras en la Hackathon!",
      "Yo también tengo experiencia: 100 % en siestas",
      "Contrátenla, que me debe concentrado",
      "Técnica del SENA e ingeniera… y mi dueña"
    ],
    "contacto": [
      "¡Escríbele, ya no muerde!",
      "Yo sí muerdo… pero solo galletas",
      "¡Guau! Te responde rápido",
      "Por WhatsApp contesta más rápido",
      "Si traes premio, te atiendo yo"
    ]
  };
  // Frases que pueden salir en cualquier página
  var COMUNES = [
    "Soy Nucita, la mascota de Cielo",
    "Inspiré a la saga Petunia, ¿sabías?",
    "Rasca aquí… digo, toca aquí"
  ];
  var frases = (FRASES[pagina] || FRASES.index).concat(COMUNES);
  var turno = 0;

  var DIBUJO =
    '<svg class="mascota__dibujo" viewBox="-62 -66 124 104" aria-hidden="true" focusable="false">' +
      '<g class="mascota__cabeza">' +
        '<ellipse class="mascota__pelo" cx="-22" cy="-2" rx="12" ry="21" transform="rotate(18 -22 -2)"/>' +
        '<circle class="mascota__pelo" cx="0" cy="0" r="30"/><circle class="mascota__pelo" cx="-18" cy="-20" r="14"/>' +
        '<circle class="mascota__pelo" cx="2" cy="-29" r="14"/><circle class="mascota__pelo" cx="20" cy="-20" r="13"/>' +
        '<circle class="mascota__pelo" cx="-24" cy="6" r="12"/>' +
        '<circle class="mascota__blanco" cx="0" cy="-4" r="27"/>' +
        '<ellipse class="mascota__pelo" cx="20" cy="10" rx="17" ry="12"/>' +
        '<ellipse class="mascota__crema" cx="-14" cy="4" rx="11" ry="19" transform="rotate(14 -14 4)"/>' +
        '<g class="mascota__mono" transform="translate(-20 -22) rotate(-15)"><path d="M0 0 L-11 -7 L-11 7 Z M0 0 L11 -7 L11 7 Z"/><circle r="3.5"/></g>' +
        '<g class="mascota__mono" transform="translate(12 -30) rotate(10)"><path d="M0 0 L-10 -6 L-10 6 Z M0 0 L10 -6 L10 6 Z"/><circle r="3.2"/></g>' +
        '<circle class="mascota__rubor" cx="-8" cy="10" r="5"/><circle class="mascota__rubor" cx="26" cy="8" r="4"/>' +
        '<g class="mascota__ojos">' +
          '<circle class="mascota__negro" cx="2" cy="-4" r="5"/><circle class="mascota__brillo" cx="4" cy="-6" r="1.7"/>' +
          '<circle class="mascota__negro" cx="20" cy="-5" r="4.6"/><circle class="mascota__brillo" cx="21.6" cy="-7" r="1.5"/>' +
        '</g>' +
        '<ellipse class="mascota__negro" cx="33" cy="6" rx="6" ry="5"/>' +
        '<path class="mascota__boca" d="M22 15 q6 6 12 0"/>' +
        '<ellipse class="mascota__lengua" cx="28" cy="22" rx="5" ry="7"/>' +
      '</g>' +
      '<path class="mascota__panoleta" d="M-26 26 L34 26 L4 44 Z"/>' +
      '<rect class="mascota__pata" x="-30" y="26" width="18" height="14" rx="7"/>' +
      '<rect class="mascota__pata" x="20" y="26" width="18" height="14" rx="7"/>' +
    '</svg>';

  var caja = document.createElement("div");
  caja.className = "mascota";
  caja.innerHTML =
    '<p class="mascota__burbuja" role="status" aria-live="polite"></p>' +
    '<button class="mascota__boton" type="button" aria-label="Nucita, la mascota: tócala para que diga algo">' + DIBUJO + '</button>';
  document.body.appendChild(caja);

  var boton = caja.querySelector(".mascota__boton");
  var burbuja = caja.querySelector(".mascota__burbuja");
  var cierre = null;

  function hablar(texto) {
    burbuja.textContent = texto;
    caja.classList.add("mascota--habla");
    clearTimeout(cierre);
    cierre = setTimeout(function () { caja.classList.remove("mascota--habla"); }, 2800);
  }

  boton.addEventListener("click", function () {
    boton.classList.remove("mascota__boton--salta");
    void boton.offsetWidth;
    boton.classList.add("mascota__boton--salta");
    hablar(frases[turno % frases.length]);
    turno++;
  });

  // Al llegar a la página saluda una vez
  setTimeout(function () {
    caja.classList.add("mascota--lista");
    setTimeout(function () { hablar(frases[0]); turno = 1; }, 900);
  }, 1200);
})();

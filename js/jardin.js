/* ============================================================
   El jardín de Nucita (juegos.html)
   Cielo Yenied Caicedo — Portafolio

   Nucita, la perrita del Cóndor de los Andes, quiere jugar.
   Cada flor es un juego:
   1. Si pasas el mouse, enfocas con el teclado o tocas una flor
      (o su botón de abajo), Nucita corre hacia ella.
   2. Al llegar salta, mueve la cola y salen corazones de la flor.
   3. Si haces clic, Nucita llega a la flor y luego se abre el juego.
   4. Si nadie hace nada, Nucita va sola de flor en flor.
   Si la persona pidió "reducir movimiento", Nucita no corre:
   las flores son enlaces normales.
   ============================================================ */

(function () {
  "use strict";

  var escena = document.querySelector(".jardin__escena");
  var perrita = document.getElementById("perrita");
  if (!escena || !perrita) return;

  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var giro = perrita.querySelector(".perrita__giro");
  var salto = perrita.querySelector(".perrita__salto");
  var burbuja = perrita.querySelector(".burbuja");
  var textoBurbuja = perrita.querySelector(".burbuja__texto");
  var cajaBurbuja = perrita.querySelector(".burbuja__caja");
  var flores = Array.prototype.slice.call(escena.querySelectorAll(".flor"));
  var botones = Array.prototype.slice.call(document.querySelectorAll(".jardin__lista a"));

  var SUELO = 420;
  var VELOCIDAD = 330;          // unidades del dibujo por segundo
  var MIN_X = 230, MAX_X = 1150;

  var x = 250;                  // dónde está Nucita
  var destino = 250;            // a dónde va
  var mira = 1;                 // 1 = derecha, -1 = izquierda
  var florActual = -1;
  var alLlegar = null;          // qué hacer cuando llegue (por ejemplo, abrir el juego)
  var idCuadro = null;
  var ultimo = 0;
  var ultimaAccion = 0;         // última vez que la persona hizo algo
  var visible = true;

  /* ---------- Dibujo ---------- */
  function ponerPosicion() {
    perrita.setAttribute("transform", "translate(" + x.toFixed(1) + " " + SUELO + ")");
    giro.setAttribute("transform", mira < 0 ? "scale(-1 1)" : "");
  }

  function decir(texto) {
    textoBurbuja.textContent = texto;
    var ancho = 40;
    try {
      ancho = textoBurbuja.getComputedTextLength() + 40;
    } catch (error) {
      ancho = texto.length * 11 + 40;
    }
    cajaBurbuja.setAttribute("width", ancho.toFixed(0));
    // Que la burbuja no se salga del dibujo
    var izquierda = Math.min(-30, 1190 - x - ancho);
    burbuja.setAttribute("transform", "translate(" + izquierda.toFixed(0) + " -190)");
    burbuja.classList.remove("burbuja--nueva");
    void burbuja.getBBox();            // reinicia la animación
    burbuja.classList.add("burbuja--nueva");
  }

  /* ---------- Movimiento (requestAnimationFrame) ---------- */
  function cuadro(ahora) {
    var dt = Math.min((ahora - ultimo) / 1000, 1 / 30);
    ultimo = ahora;
    var falta = destino - x;
    var paso = VELOCIDAD * dt;

    if (Math.abs(falta) <= paso) {
      x = destino;
      ponerPosicion();
      llegar();
      idCuadro = null;
      return;
    }
    x += Math.sign(falta) * paso;
    ponerPosicion();
    idCuadro = requestAnimationFrame(cuadro);
  }

  function irA(indice, luego) {
    var flor = flores[indice];
    if (!flor) return;
    var fx = parseFloat(flor.getAttribute("data-x"));
    // Se para al lado de la flor, del lado del que viene
    var lado = x <= fx ? -1 : 1;
    destino = Math.max(MIN_X, Math.min(MAX_X, fx + lado * 78));
    mira = destino < fx ? 1 : -1;      // siempre mirando a la flor
    if (destino !== x) mira = destino > x ? 1 : -1;
    florActual = indice;
    alLlegar = luego || null;

    flores.forEach(function (f, i) { f.classList.toggle("flor--elegida", i === indice); });
    botones.forEach(function (b, i) { b.classList.toggle("jardin__boton--elegido", i === indice); });

    if (menosMovimiento) {
      x = destino;
      mira = x < fx ? 1 : -1;
      ponerPosicion();
      llegar();
      return;
    }
    if (Math.abs(destino - x) < 1) {
      llegar();
      return;
    }
    perrita.classList.add("perrita--corre");
    decir("¡Voy!");
    if (idCuadro === null) {
      ultimo = performance.now();
      idCuadro = requestAnimationFrame(cuadro);
    }
  }

  function llegar() {
    var flor = flores[florActual];
    perrita.classList.remove("perrita--corre");
    if (!flor) return;
    // Al llegar mira hacia la flor
    mira = x < parseFloat(flor.getAttribute("data-x")) ? 1 : -1;
    ponerPosicion();
    decir("¡Guau! ¡" + flor.getAttribute("data-nombre") + "!");

    if (!menosMovimiento) {
      salto.classList.remove("perrita__salto--brinca");
      void salto.getBBox();
      salto.classList.add("perrita__salto--brinca");
      flor.classList.remove("flor--feliz");
      void flor.getBBox();
      flor.classList.add("flor--feliz");
      corazones(flor);
    }

    if (alLlegar) {
      var accion = alLlegar;
      alLlegar = null;
      setTimeout(accion, menosMovimiento ? 0 : 450);
    }
  }

  // Corazones que salen de la flor y se desvanecen (se borran solos)
  function corazones(flor) {
    var cabeza = flor.querySelector(".flor__cabeza");
    for (var i = 0; i < 3; i++) {
      var c = document.createElementNS("http://www.w3.org/2000/svg", "path");
      c.setAttribute("d", "M0 -4 C -6 -12 -16 -4 0 8 C 16 -4 6 -12 0 -4 Z");
      c.setAttribute("class", "corazon corazon--" + (i + 1));
      cabeza.appendChild(c);
      setTimeout(function (el) { el.remove(); }.bind(null, c), 1500);
    }
  }

  /* ---------- Lo que hace la persona ---------- */
  function abrir(enlace) {
    window.location.href = enlace.getAttribute("href");
  }

  function conectar(el, indice, enlace) {
    el.addEventListener("mouseenter", function () { ultimaAccion = Date.now(); irA(indice); });
    el.addEventListener("focus", function () { ultimaAccion = Date.now(); irA(indice); }, true);
    enlace.addEventListener("click", function (e) {
      // Ctrl, Cmd, Shift o la rueda del mouse: se deja abrir en otra pestaña
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      ultimaAccion = Date.now();
      irA(indice, function () { abrir(enlace); });
    });
  }

  flores.forEach(function (flor, i) { conectar(flor, i, flor.querySelector("a")); });
  botones.forEach(function (b) {
    var i = parseInt(b.getAttribute("data-indice"), 10);
    conectar(b, i, b);
  });

  /* ---------- Paseo solo, cuando nadie hace nada ---------- */
  if (!menosMovimiento) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        visible = entradas[0].isIntersecting;
      }, { threshold: 0.3 }).observe(escena);
    }
    setInterval(function () {
      if (!visible || document.hidden || idCuadro !== null) return;
      if (Date.now() - ultimaAccion < 6000) return;
      irA((florActual + 1) % flores.length);
    }, 3800);
  }

  ponerPosicion();
  decir("¡Guau! ¿Jugamos?");
})();

/* ============================================================
   El jardín de Nucita (juegos.html)
   Cielo Yenied Caicedo — Portafolio

   Nucita, la perrita del Cóndor de los Andes, quiere jugar.
   Cada flor es un juego:
   1. Si pasas el mouse, enfocas con el teclado o tocas una flor
      (o su botón de abajo), Nucita corre hacia ella.
   2. Al llegar salta, mueve la cola y salen corazones de la flor.
   3. Si haces clic, Nucita llega a la flor y se abre la carta del
      juego: de qué se trata, con los botones Jugar y Ver el código.
   4. Al darle Jugar, sale una animación de pétalos y un círculo
      del color del juego que llena la pantalla, y se abre el juego.
   5. Si nadie hace nada, Nucita va sola de flor en flor.
   Si la persona pidió "reducir movimiento", no hay animaciones:
   la carta se abre directo y Jugar abre el juego de una vez.
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
      setTimeout(accion, menosMovimiento ? 0 : 380);
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

  /* ---------- La carta del juego ---------- */
  var dialogo = document.getElementById("cartaJuego");
  var cartas = dialogo ? Array.prototype.slice.call(dialogo.querySelectorAll(".carta")) : [];
  var abiertaDesde = null;     // el botón que abrió la carta (para devolverle el foco)

  function abrirCarta(indice) {
    if (!dialogo) return;
    cartas.forEach(function (c, i) { c.hidden = i !== indice; });
    abiertaDesde = document.activeElement;
    pintarRecord(cartas[indice]);
    dialogo.classList.remove("cartas--sale");
    if (!dialogo.open) dialogo.showModal();
    var jugar = cartas[indice].querySelector(".carta__jugar");
    if (jugar) jugar.focus();
  }

  function cerrarCarta() {
    if (!dialogo || !dialogo.open) return;
    if (menosMovimiento) { dialogo.close(); return; }
    dialogo.classList.add("cartas--sale");      // se encoge y luego se cierra
    setTimeout(function () {
      dialogo.classList.remove("cartas--sale");
      dialogo.close();
    }, 220);
  }

  if (dialogo) {
    dialogo.querySelector(".cartas__cerrar").addEventListener("click", cerrarCarta);
    // Clic afuera de la carta (en el fondo oscuro) también cierra
    dialogo.addEventListener("click", function (e) {
      if (e.target === dialogo) cerrarCarta();
    });
    dialogo.addEventListener("close", function () {
      if (abiertaDesde && abiertaDesde.focus) abiertaDesde.focus();
    });
    cartas.forEach(function (c) {
      c.querySelector(".carta__jugar").addEventListener("click", function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        arrancar(this, c);
      });
    });
  }

  /* ---------- Animación de "Jugar" ----------
     Un círculo del color del juego crece desde el botón hasta llenar
     la pantalla, salen pétalos volando y aparece "¡A jugar!".
     Después se abre el juego. */
  var arranque = document.getElementById("arranque");

  function arrancar(boton, carta) {
    var destinoUrl = boton.getAttribute("href");
    if (menosMovimiento || !arranque) {
      window.location.href = destinoUrl;
      return;
    }
    var r = boton.getBoundingClientRect();
    var color = getComputedStyle(carta).getPropertyValue("--neon").trim() || "#2BD47D";
    arranque.style.setProperty("--x", (r.left + r.width / 2) + "px");
    arranque.style.setProperty("--y", (r.top + r.height / 2) + "px");
    arranque.style.setProperty("--color", color);

    // Pétalos: cada uno sale en una dirección distinta
    var caja = arranque.querySelector(".arranque__petalos");
    caja.textContent = "";
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("span");
      var angulo = (i / 18) * Math.PI * 2;
      var distancia = 160 + Math.random() * 260;
      p.style.setProperty("--dx", (Math.cos(angulo) * distancia).toFixed(0) + "px");
      p.style.setProperty("--dy", (Math.sin(angulo) * distancia).toFixed(0) + "px");
      p.style.setProperty("--giro", (Math.random() * 540 - 270).toFixed(0) + "deg");
      p.style.animationDelay = (Math.random() * 0.12).toFixed(2) + "s";
      caja.appendChild(p);
    }

    arranque.hidden = false;
    void arranque.offsetWidth;          // reinicia las animaciones
    arranque.classList.add("arranque--activo");
    dialogo.classList.add("cartas--despegando");
    carta.classList.add("carta--despega");

    setTimeout(function () {
      window.location.href = destinoUrl;
    }, 1300);
  }

  // Si se vuelve con el botón Atrás, la página puede venir de la memoria:
  // se quita la animación para que no quede la pantalla tapada.
  window.addEventListener("pageshow", function () {
    if (!arranque) return;
    arranque.hidden = true;
    arranque.classList.remove("arranque--activo");
    cartas.forEach(function (c) { c.classList.remove("carta--despega"); });
    if (dialogo) dialogo.classList.remove("cartas--despegando");
    if (dialogo && dialogo.open) dialogo.close();
  });

  /* ---------- Lo que hace la persona ---------- */
  function conectar(el, indice, enlace) {
    el.addEventListener("mouseenter", function () { ultimaAccion = Date.now(); irA(indice); });
    el.addEventListener("focus", function () { ultimaAccion = Date.now(); irA(indice); }, true);
    enlace.addEventListener("click", function (e) {
      // Ctrl, Cmd, Shift o la rueda del mouse: se deja abrir el juego en otra pestaña
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      ultimaAccion = Date.now();
      irA(indice, function () { abrirCarta(indice); });
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
      if (!visible || document.hidden || idCuadro !== null || (dialogo && dialogo.open)) return;
      if (Date.now() - ultimaAccion < 6000) return;
      irA((florActual + 1) % flores.length);
    }, 3800);
  }

  /* ---------- Récord personal en la carta (PetuGol y PetuPong) ---------- */
  function pintarRecord(carta) {
    var el = carta.querySelector(".carta__record");
    if (!el || !window.Marcadores) return;
    var rec = window.Marcadores.leer().records[el.getAttribute("data-record")];
    if (!rec || !rec.partidos) { el.hidden = true; return; }
    el.textContent = "🏆 Tu récord contra Petunia: " + rec.victorias +
      (rec.victorias === 1 ? " victoria" : " victorias") + " en " + rec.partidos +
      (rec.partidos === 1 ? " partido" : " partidos");
    el.hidden = false;
  }

  /* ---------- Nucita ladra y María saluda (al hacerles clic) ---------- */
  var audio = null;
  function ladrar() {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.22].forEach(function (inicio) {
        var t = audio.currentTime + inicio;
        var osc = audio.createOscillator();
        var vol = audio.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(620, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.12);
        vol.gain.setValueAtTime(0.0001, t);
        vol.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
        vol.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        osc.connect(vol);
        vol.connect(audio.destination);
        osc.start(t);
        osc.stop(t + 0.15);                 // se apaga solo
      });
    } catch (error) {
      // sin sonido no pasa nada
    }
  }

  perrita.addEventListener("click", function () {
    ultimaAccion = Date.now();
    ladrar();
    decir("¡Guau guau! 🐾");
    if (menosMovimiento) return;
    salto.classList.remove("perrita__salto--gira");
    void salto.getBBox();
    salto.classList.add("perrita__salto--gira");
  });

  var maria = escena.querySelector(".maria");
  if (maria) {
    maria.addEventListener("click", function () {
      ultimaAccion = Date.now();
      decir("¡Ella es María, mi piloto!");
      if (menosMovimiento) return;
      maria.classList.remove("maria--salta");
      void maria.getBBox();
      maria.classList.add("maria--salta");
    });
  }

  /* ---------- Paralaje: el fondo se mueve un poquito con el mouse ---------- */
  var capas = Array.prototype.slice.call(escena.querySelectorAll(".paralaje"));
  var esperandoCuadro = false;
  if (!menosMovimiento && window.matchMedia("(pointer: fine)").matches) {
    escena.addEventListener("pointermove", function (e) {
      if (esperandoCuadro) return;
      esperandoCuadro = true;
      requestAnimationFrame(function () {
        esperandoCuadro = false;
        var r = escena.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;     // -0.5 a 0.5
        var dy = (e.clientY - r.top) / r.height - 0.5;
        capas.forEach(function (capa) {
          var p = parseFloat(capa.getAttribute("data-prof")) || 0;
          capa.setAttribute("transform", "translate(" + (-dx * p).toFixed(1) + " " + (-dy * p * 0.5).toFixed(1) + ")");
        });
      });
    });
    escena.addEventListener("pointerleave", function () {
      capas.forEach(function (capa) { capa.setAttribute("transform", ""); });
    });
  }

  ponerPosicion();
  decir("¡Guau! ¿Jugamos?");
})();

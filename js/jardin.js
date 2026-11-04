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
   5. Si tocas el pasto o el cielo, María lanza una pelota y
      Nucita corre a buscarla y se la devuelve.
   6. En la carta, las flechas ‹ › pasan al juego anterior o siguiente.
   7. En el celular el jardín se acomoda más compacto para verse grande.
   8. Si nadie hace nada, Nucita va sola de flor en flor.
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
  var BORDE_DER = 1190;         // borde derecho del dibujo (cambia en celular)
  var modo = "flor";            // "flor" = va a una petunia; "libre" = va a buscar la pelota

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
    var izquierda = Math.min(-30, BORDE_DER - x - ancho);
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
    modo = "flor";
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
    perrita.classList.remove("perrita--corre");
    if (modo === "libre") {
      var siguiente = alLlegar;
      alLlegar = null;
      if (siguiente) siguiente();
      return;
    }
    var flor = flores[florActual];
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

  // Correr a cualquier punto del pasto (para buscar la pelota)
  function correrA(xDestino, luego) {
    modo = "libre";
    florActual = -1;
    alLlegar = luego || null;
    destino = Math.max(MIN_X - 80, Math.min(MAX_X, xDestino));
    if (Math.abs(destino - x) < 1 || menosMovimiento) {
      x = destino;
      ponerPosicion();
      llegar();
      return;
    }
    mira = destino > x ? 1 : -1;
    perrita.classList.add("perrita--corre");
    if (idCuadro === null) {
      ultimo = performance.now();
      idCuadro = requestAnimationFrame(cuadro);
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
    cartas.forEach(function (c, i) {
      c.hidden = i !== indice;
      c.classList.remove("carta--desde-der", "carta--desde-izq");
    });
    cartaActual = indice;
    abiertaDesde = document.activeElement;
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

  // Pasar a la carta del juego anterior o siguiente (y Nucita va a esa petunia)
  var cartaActual = 0;
  function cambiarCarta(paso) {
    var nuevo = (cartaActual + paso + cartas.length) % cartas.length;
    cartas.forEach(function (c, i) {
      c.hidden = i !== nuevo;
      c.classList.remove("carta--desde-der", "carta--desde-izq");
    });
    if (!menosMovimiento) cartas[nuevo].classList.add(paso > 0 ? "carta--desde-der" : "carta--desde-izq");
    cartaActual = nuevo;
    irA(nuevo);
  }

  if (dialogo) {
    dialogo.querySelector(".cartas__cerrar").addEventListener("click", cerrarCarta);
    var antes = dialogo.querySelector(".cartas__nav--anterior");
    var despues = dialogo.querySelector(".cartas__nav--siguiente");
    if (antes) antes.addEventListener("click", function () { cambiarCarta(-1); });
    if (despues) despues.addEventListener("click", function () { cambiarCarta(1); });
    dialogo.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); cambiarCarta(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); cambiarCarta(-1); }
    });
    var toqueX = null;
    dialogo.addEventListener("touchstart", function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
    dialogo.addEventListener("touchend", function (e) {
      if (toqueX === null) return;
      var dx = e.changedTouches[0].clientX - toqueX;
      toqueX = null;
      if (Math.abs(dx) > 60) cambiarCarta(dx < 0 ? 1 : -1);
    });
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

  /* ---------- La pelota: toca el pasto o el cielo ---------- */
  var pelota = escena.querySelector(".pelota");
  var pelotaBoca = escena.querySelector(".perrita__pelota");
  var mariaX = 140;               // dónde está María (cambia en celular)
  var lanzando = false;

  function puntoDelDibujo(e) {
    var p = escena.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    return p.matrixTransform(escena.getScreenCTM().inverse());
  }

  function lanzar(xFin) {
    if (!pelota || lanzando) return;
    lanzando = true;
    ultimaAccion = Date.now();
    flores.forEach(function (f) { f.classList.remove("flor--elegida"); });
    botones.forEach(function (b) { b.classList.remove("jardin__boton--elegido"); });
    var x0 = mariaX + 30, y0 = 290, y1 = SUELO - 10;
    var dur = menosMovimiento ? 0 : 900;
    var t0 = performance.now();
    pelota.removeAttribute("hidden");
    decir("¡La pelota! ¡Voy!");

    function vuelo(ahora) {
      var t = dur ? Math.min((ahora - t0) / dur, 1) : 1;
      var px = x0 + (xFin - x0) * t;
      var py = y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * 170;   // arco
      pelota.setAttribute("transform", "translate(" + px.toFixed(1) + " " + py.toFixed(1) + ")");
      if (t < 1) requestAnimationFrame(vuelo);
    }
    requestAnimationFrame(vuelo);

    // Nucita sale corriendo apenas María lanza
    correrA(xFin - 45, function () {
      setTimeout(function () {
        pelota.setAttribute("hidden", "");
        if (pelotaBoca) pelotaBoca.removeAttribute("hidden");
        decir("¡La tengo! 🐾");
        setTimeout(function () {
          correrA(mariaX + 90, function () {
            if (pelotaBoca) pelotaBoca.setAttribute("hidden", "");
            mira = -1;
            ponerPosicion();
            decir("¡Otra vez, otra vez!");
            if (!menosMovimiento) {
              salto.classList.remove("perrita__salto--brinca");
              void salto.getBBox();
              salto.classList.add("perrita__salto--brinca");
            }
            lanzando = false;
          });
        }, 350);
      }, Math.max(0, dur - 600));
    });
  }

  escena.addEventListener("click", function (e) {
    if (e.target.closest(".flor, .perrita, .maria")) return;
    var p = puntoDelDibujo(e);
    lanzar(Math.max(MIN_X + 40, Math.min(MAX_X - 20, p.x)));
  });

  /* ---------- En el celular, el jardín se acomoda más compacto ---------- */
  var COMPACTO = { viewBox: "0 110 790 420", maria: 60, flores: [190, 290, 390, 490, 590, 690], sol: [720, 160], min: 150, max: 760, borde: 785 };
  var NORMAL = { viewBox: "0 0 1200 520", maria: 140, flores: [370, 515, 660, 805, 950, 1095], sol: [1080, 90], min: 230, max: 1160, borde: 1190 };
  var mariaGrupo = escena.querySelector(".maria") && escena.querySelector(".maria").parentNode;
  var sol = escena.querySelector(".jardin__sol");
  var disposicion = null;

  function acomodar() {
    var d = escena.getBoundingClientRect().width < 640 ? COMPACTO : NORMAL;
    if (d === disposicion) return;
    disposicion = d;
    escena.setAttribute("viewBox", d.viewBox);
    escena.classList.toggle("jardin__escena--compacta", d === COMPACTO);
    mariaX = d.maria;
    if (mariaGrupo) mariaGrupo.setAttribute("transform", "translate(" + d.maria + " 420)");
    flores.forEach(function (f, i) {
      f.setAttribute("data-x", d.flores[i]);
      f.setAttribute("transform", "translate(" + d.flores[i] + " 420)");
    });
    if (sol) { sol.setAttribute("cx", d.sol[0]); sol.setAttribute("cy", d.sol[1]); }
    MIN_X = d.min;
    MAX_X = d.max;
    BORDE_DER = d.borde;
    x = Math.max(MIN_X, Math.min(MAX_X, d === COMPACTO ? 135 : 250));
    destino = x;
    ponerPosicion();
  }

  acomodar();
  var esperaAcomodo = null;
  window.addEventListener("resize", function () {
    clearTimeout(esperaAcomodo);
    esperaAcomodo = setTimeout(acomodar, 150);
  });

  ponerPosicion();
  decir("¡Guau! ¿Jugamos?");

  /* Si se llega con juegos.html#juego-petugol (por ejemplo, desde
     "Ver un trabajo" en el Inicio), Nucita corre a esa petunia y se
     abre su carta. */
  var pedido = /^#juego-(.+)$/.exec(window.location.hash);
  if (pedido && dialogo) {
    var carta = dialogo.querySelector(".carta--" + pedido[1]);
    if (carta) {
      var indice = parseInt(carta.getAttribute("data-indice"), 10);
      ultimaAccion = Date.now();
      setTimeout(function () { irA(indice, function () { abrirCarta(indice); }); }, menosMovimiento ? 0 : 500);
    }
  }
})();

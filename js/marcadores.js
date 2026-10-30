/* ============================================================
   Marcadores del Arcade (LocalStorage API)
   Cielo Yenied Caicedo — Portafolio

   Guarda en el navegador, en formato JSON:
   - historial: los últimos partidos jugados (fútbol y ping-pong)
   - records:   estadísticas y los 5 mejores puntajes (High Scores)

   Todo queda en UNA sola clave: "arcade-cielo".
   La usan juegos.html, futbol.html, pingpong.html y PetuPong
   (que está dentro de un iframe pero es el mismo sitio, así que
   comparte el mismo localStorage).

   Para pintar en una página basta con poner atributos data-:
     <tbody data-marcador="top" data-juego="futbol">       mejores puntajes
     <tbody data-marcador="historial" data-juego="todos">  historial
     <strong data-stat="futbol.victorias">                  un número
     <button data-reiniciar>                                borrar todo
   ============================================================ */

(function () {
  "use strict";

  var CLAVE = "arcade-cielo";
  var MAX_HISTORIAL = 30;   // partidos que se guardan
  var MAX_TOP = 5;          // puntajes en la tabla de High Scores

  var NOMBRES = { futbol: "Fútbol 2D", pingpong: "Ping-Pong" };
  var NIVELES = { facil: "fácil", normal: "normal", dificil: "difícil" };

  // Estructura vacía: así se ve el JSON la primera vez
  function datosVacios() {
    return {
      version: 1,
      historial: [],
      records: {
        futbol: { partidos: 0, victorias: 0, derrotas: 0, empates: 0, goles: 0, mejorDiferencia: 0, top: [] },
        pingpong: { partidos: 0, victorias: 0, derrotas: 0, empates: 0, goles: 0, mejorDiferencia: 0, mejorRacha: 0, top: [] }
      }
    };
  }

  /* ---------- Leer y escribir ---------- */

  // Lee el JSON guardado. Si no hay nada o está dañado, devuelve uno vacío.
  function leer() {
    var vacio = datosVacios();
    try {
      var texto = localStorage.getItem(CLAVE);
      if (!texto) return vacio;
      var datos = JSON.parse(texto);
      // Completa lo que falte (por si el JSON viene de una versión vieja)
      datos.historial = Array.isArray(datos.historial) ? datos.historial : [];
      datos.records = datos.records || {};
      Object.keys(vacio.records).forEach(function (juego) {
        datos.records[juego] = Object.assign({}, vacio.records[juego], datos.records[juego]);
      });
      return datos;
    } catch (error) {
      return vacio;
    }
  }

  function escribir(datos) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos));
      return true;
    } catch (error) {
      return false; // modo incógnito o almacenamiento lleno
    }
  }

  /* ---------- Guardar un partido ---------- */

  // Puntaje para el High Score: goles a favor valen, goles en contra restan,
  // ganar da bono y el nivel difícil multiplica.
  function calcularPuntaje(p) {
    var multiplicador = { facil: 1, normal: 1.5, dificil: 2 }[p.nivel] || 1;
    var base = p.local * 100 - p.rival * 40 + (p.local > p.rival ? 300 : 0) + (p.mejorRacha || 0) * 5;
    return Math.max(0, Math.round(base * multiplicador));
  }

  /*
    p = {
      juego: "futbol" | "pingpong",
      modo: "ia" | "2j",
      nivel: "facil" | "normal" | "dificil",
      local: goles del jugador 1, rival: goles de Petunia o jugador 2,
      nombreLocal, nombreRival, duracion (segundos), mejorRacha (opcional)
    }
  */
  function guardarPartido(p) {
    var datos = leer();
    var rec = datos.records[p.juego];
    if (!rec) return null;

    var partido = {
      juego: p.juego,
      modo: p.modo,
      nivel: p.nivel || "normal",
      local: p.local,
      rival: p.rival,
      nombreLocal: p.nombreLocal || "Jugador 1",
      nombreRival: p.nombreRival || (p.modo === "ia" ? "Petunia" : "Jugador 2"),
      duracion: Math.round(p.duracion || 0),
      fecha: new Date().toISOString()
    };
    if (p.mejorRacha) partido.mejorRacha = p.mejorRacha;

    // Las estadísticas y el High Score solo cuentan contra Petunia (es lo justo)
    if (p.modo === "ia") {
      partido.puntaje = calcularPuntaje(p);
      rec.partidos += 1;
      rec.goles += p.local;
      if (p.local > p.rival) rec.victorias += 1;
      else if (p.local < p.rival) rec.derrotas += 1;
      else rec.empates += 1;
      rec.mejorDiferencia = Math.max(rec.mejorDiferencia, p.local - p.rival);
      if (p.mejorRacha && "mejorRacha" in rec) rec.mejorRacha = Math.max(rec.mejorRacha, p.mejorRacha);

      rec.top.push(partido);
      rec.top.sort(function (a, b) { return b.puntaje - a.puntaje; });
      rec.top = rec.top.slice(0, MAX_TOP);
    }

    datos.historial.unshift(partido);                       // el más nuevo primero
    datos.historial = datos.historial.slice(0, MAX_HISTORIAL);

    escribir(datos);
    avisarCambio();
    return partido;
  }

  function reiniciar() {
    try {
      localStorage.removeItem(CLAVE);
    } catch (error) {
      // nada que hacer
    }
    avisarCambio();
  }

  // Cualquier página que muestre marcadores se vuelve a pintar con este aviso
  function avisarCambio() {
    window.dispatchEvent(new CustomEvent("marcadores:cambio"));
  }

  // Si otra pestaña (o el iframe de PetuPong) cambia los datos, también se repinta
  window.addEventListener("storage", function (evento) {
    if (evento.key === CLAVE || evento.key === null) avisarCambio();
  });

  /* ---------- Pintar en la página ---------- */

  function formatoFecha(iso) {
    var f = new Date(iso);
    if (isNaN(f)) return "—";
    return f.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) + " " +
      f.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }

  function formatoDuracion(seg) {
    var m = Math.floor(seg / 60);
    var s = seg % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // Crea una celda <td> con texto (textContent: nunca se mete HTML del usuario)
  function celda(texto, clase) {
    var td = document.createElement("td");
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
  }

  function filaVacia(tbody, columnas, texto) {
    var tr = document.createElement("tr");
    tr.className = "tabla__vacia";
    var td = celda(texto);
    td.colSpan = columnas;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  function resultado(p) {
    if (p.local > p.rival) return { texto: "Ganó " + p.nombreLocal, clase: "resultado--gana" };
    if (p.local < p.rival) return { texto: "Ganó " + p.nombreRival, clase: "resultado--pierde" };
    return { texto: "Empate", clase: "" };
  }

  function pintarTop(tbody, datos) {
    var juego = tbody.getAttribute("data-juego");
    var lista = datos.records[juego] ? datos.records[juego].top : [];
    tbody.textContent = "";
    if (!lista.length) {
      filaVacia(tbody, 4, "Todavía no hay puntajes. ¡Juega contra Petunia!");
      return;
    }
    lista.forEach(function (p, i) {
      var tr = document.createElement("tr");
      tr.appendChild(celda(i + 1 + "."));
      tr.appendChild(celda(p.puntaje + " pts"));
      tr.appendChild(celda(p.local + " - " + p.rival));
      tr.appendChild(celda(NIVELES[p.nivel] || p.nivel));
      tbody.appendChild(tr);
    });
  }

  function pintarHistorial(tbody, datos) {
    var juego = tbody.getAttribute("data-juego") || "todos";
    var lista = datos.historial.filter(function (p) {
      return juego === "todos" || p.juego === juego;
    });
    var columnas = tbody.closest("table").querySelectorAll("thead th").length;
    tbody.textContent = "";
    if (!lista.length) {
      filaVacia(tbody, columnas, "Aún no hay partidos guardados.");
      return;
    }
    lista.forEach(function (p) {
      var tr = document.createElement("tr");
      var r = resultado(p);
      tr.appendChild(celda(formatoFecha(p.fecha)));
      if (juego === "todos") tr.appendChild(celda(NOMBRES[p.juego] || p.juego));
      tr.appendChild(celda(p.modo === "ia" ? "vs Petunia (" + (NIVELES[p.nivel] || p.nivel) + ")" : "2 jugadores"));
      tr.appendChild(celda(p.nombreLocal + " " + p.local + " - " + p.rival + " " + p.nombreRival));
      tr.appendChild(celda(r.texto, r.clase));
      tr.appendChild(celda(formatoDuracion(p.duracion)));
      tbody.appendChild(tr);
    });
  }

  function pintarStats(el, datos) {
    var partes = el.getAttribute("data-stat").split(".");
    var rec = datos.records[partes[0]];
    var valor = rec ? rec[partes[1]] : 0;
    el.textContent = valor == null ? "0" : String(valor);
  }

  function pintar() {
    var datos = leer();
    document.querySelectorAll('[data-marcador="top"]').forEach(function (t) { pintarTop(t, datos); });
    document.querySelectorAll('[data-marcador="historial"]').forEach(function (t) { pintarHistorial(t, datos); });
    document.querySelectorAll("[data-stat]").forEach(function (el) { pintarStats(el, datos); });
  }

  /* ---------- Botón "Reiniciar estadísticas" ----------
     Primer clic: pide confirmación (sin ventanas emergentes).
     Segundo clic en menos de 4 segundos: borra. */
  function conectarBotones() {
    document.querySelectorAll("[data-reiniciar]").forEach(function (boton) {
      var textoOriginal = boton.textContent;
      var espera = null;
      boton.addEventListener("click", function () {
        if (boton.getAttribute("data-confirmar") === "si") {
          clearTimeout(espera);
          reiniciar();
          boton.removeAttribute("data-confirmar");
          boton.textContent = textoOriginal;
          anunciar("Estadísticas borradas.");
          return;
        }
        boton.setAttribute("data-confirmar", "si");
        boton.textContent = "¿Seguro? Toca otra vez para borrar";
        espera = setTimeout(function () {
          boton.removeAttribute("data-confirmar");
          boton.textContent = textoOriginal;
        }, 4000);
      });
    });
  }

  // Mensaje para lectores de pantalla (y visible) en [data-aviso-marcadores]
  function anunciar(texto) {
    document.querySelectorAll("[data-aviso-marcadores]").forEach(function (el) {
      el.textContent = texto;
    });
  }

  window.addEventListener("marcadores:cambio", pintar);
  document.addEventListener("DOMContentLoaded", function () {
    pintar();
    conectarBotones();
  });

  // Lo que pueden usar los juegos
  window.Marcadores = {
    CLAVE: CLAVE,
    leer: leer,
    guardarPartido: guardarPartido,
    reiniciar: reiniciar,
    pintar: pintar
  };
})();

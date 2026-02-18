import { estadoJuego } from "./config.js";
export function actualizarPuntuaciones(guardar = false) {
  const nivel = estadoJuego.dificultad;

  const celdaPrimera = document.getElementById("v1");
  const celdaSegunda = document.getElementById("v2");
  const celdaTercera = document.getElementById("v3");

  // Obtener la puntuación actual en número si existe
  const elementoPuntuacionActual = document.querySelector(".puntuacion");
  let puntuacionTexto = 0;
  if (guardar && elementoPuntuacionActual) {
    const partesTiempo = elementoPuntuacionActual.textContent.split(":");
    puntuacionTexto = parseInt(partesTiempo.join(""));
  }

  // Cargar puntuaciones guardadas o inicializar
  let puntuaciones = localStorage.getItem("puntuaciones")
    ? JSON.parse(localStorage.getItem("puntuaciones"))
    : { facil: [], medio: [], dificil: [] };

  // Solo guardar nueva puntuación si se indica
  if (guardar && elementoPuntuacionActual) {
    if (!puntuaciones[nivel]) puntuaciones[nivel] = [];
    puntuaciones[nivel].push(puntuacionTexto);
    puntuaciones[nivel].sort((a, b) => a - b);
    puntuaciones[nivel] = puntuaciones[nivel].slice(0, 3);
    localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
  }

  // Mostrar las 3 mejores puntuaciones del nivel actual
  const mostrar = puntuaciones[nivel] || [];
  celdaPrimera.innerText = mostrar[0] !== undefined ? mostrar[0] : 0;
  celdaSegunda.innerText = mostrar[1] !== undefined ? mostrar[1] : 0;
  celdaTercera.innerText = mostrar[2] !== undefined ? mostrar[2] : 0;
}

export function actualizarHora() {
  const ahora = new Date();

  // Obtener hora, minutos y segundos
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();
  let segundos = ahora.getSeconds();

  // Agregar ceros a la izquierda si son menores que 10
  horas = horas < 10 ? "0" + horas : horas;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  // Mostrar el reloj
  document.getElementById(
    "reloj"
  ).textContent = `${horas}:${minutos}:${segundos}`;
}

export function iniciarRelojFooter() {
  actualizarHora();
  return setInterval(() => actualizarHora(), 1000);
}

// CRONOMETRO
const crono = new Date();
let cronoActualizandose = null;

export function crearCronometro(crono) {
  let cronometroDiv = document.createElement("div");

  // Obtener hora, minutos y segundos
  crono.setHours(0);
  crono.setMinutes(0);
  crono.setSeconds(0);

  let horas = crono.getHours();
  let minutos = crono.getMinutes();
  let segundos = crono.getSeconds();

  // Agregar ceros a la izquierda si son menores que 10
  horas = horas < 10 ? "0" + horas : horas;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  // Mostrar el reloj
  cronometroDiv.textContent = `${horas}:${minutos}:${segundos}`;
  cronometroDiv.classList.add("cronometro");
  document.getElementById("tablaPuntuaciones").appendChild(cronometroDiv);
}

export function actualizarCrono(crono) {
  let horas = crono.getHours();
  let minutos = crono.getMinutes();
  let segundos = crono.getSeconds();

  crono.setSeconds(segundos + 1);

  // Agregar ceros a la izquierda si son menores que 10
  horas = horas < 10 ? "0" + horas : horas;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  let cronometro = document.getElementsByClassName("cronometro")[0];
  if (cronometro != null) {
    cronometro.textContent = `${horas}:${minutos}:${segundos}`;
  }
}

export function iniciarCronometro() {
  if (cronoActualizandose != null) {
    clearInterval(cronoActualizandose);
  }

  crearCronometro(crono);

  if (document.querySelector("#tablaPuntuaciones .puntuacion") != null) {
    document
      .getElementById("tablaPuntuaciones")
      .removeChild(document.querySelector("#tablaPuntuaciones .puntuacion"));
  }

  cronoActualizandose = setInterval(() => actualizarCrono(crono), 1000);
}

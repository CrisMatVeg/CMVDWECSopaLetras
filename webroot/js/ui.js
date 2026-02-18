import { estadoJuego } from "./config.js";
export function actualizarPuntuaciones() {
  const nivel = estadoJuego.dificultad;
  // Comprueba si el navegador tiene conexión a internet
  const navegadorOnline = navigator.onLine;

  if (!navegadorOnline) {
    alert("NAVEGADOR OFFLINE");
  }

  // Elementos donde se muestran las 3 mejores puntuaciones
  const celdaPrimera = document.getElementById("v1");
  const celdaSegunda = document.getElementById("v2");
  const celdaTercera = document.getElementById("v3");

  // Elemento donde aparece la puntuación actual (cronómetro detenido convertido a texto)
  const elementoPuntuacionActual = document.querySelector(".puntuacion");

  // Si no existen puntuaciones guardadas y tampoco hay puntuación actual, poner todo a cero
  if (!elementoPuntuacionActual && !localStorage.getItem("puntuaciones")) {
    celdaPrimera.innerText = 0;
    celdaSegunda.innerText = 0;
    celdaTercera.innerText = 0;
    return; // No hay nada más que hacer
  }

  // Obtener la puntuación actual en número
  let puntuacionTexto = 0;
  if (elementoPuntuacionActual) {
    const partesTiempo = elementoPuntuacionActual.textContent.split(":");
    puntuacionTexto = parseInt(partesTiempo.join(""));
  }

  // Obtener o inicializar el objeto de puntuaciones
  if (!localStorage.getItem("puntuaciones")) {
    var puntuaciones = {
      facil: [],
      medio: [],
      dificil: [],
    };
  } else {
    puntuaciones = JSON.parse(localStorage.getItem("puntuaciones"));
  }

  // Guardar puntuación actual en LocalStorage
  if (elementoPuntuacionActual) {
    // Insertar la nueva puntuación y ordenar de menor a mayor (mejor tiempo primero)
    if (!puntuaciones[nivel]) {
      puntuaciones[nivel] = [];
    }
    puntuaciones[nivel].push(puntuacionTexto);
    puntuaciones[nivel].sort((a, b) => a - b);
    // Mantener solo las 3 mejores
    puntuaciones[nivel] = puntuaciones[nivel].slice(0, 3);

    // Guardar de nuevo en localStorage
    localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
  }

  // Mostrar las 3 puntuaciones en pantalla
  const mostrar = puntuaciones[nivel];
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

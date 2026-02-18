import { palabras, estadoJuego, configuracionDificultad, generarPalabras } from "./config.js";
import { calcularDimensionTabla, calcularPosicionAleatoria } from "./utils.js";
import {
  generarCuadricula,
  colocalPalabras,
  rellenarSobrantes,
} from "./cuadricula.js";
import {
  actualizarPuntuaciones,
  iniciarRelojFooter,
  iniciarCronometro,
} from "./ui.js";
import { adivinarPalabras, tdFuncion } from "./seleccion.js";

iniciarRelojFooter();
document.getElementById("dificultad").addEventListener("change", (e) => {
  estadoJuego.dificultad = e.target.value;
  actualizarPuntuaciones();
});
document.getElementsByTagName("button")[0].addEventListener("click", async(ev) => {
    const dificultad = document.getElementById("dificultad");
    const { cantidadPalabras } = configuracionDificultad[dificultad.value];
    await generarPalabras(cantidadPalabras);

    let longitudFilayCol = calcularDimensionTabla(palabras);
    let totalCeldas = longitudFilayCol * longitudFilayCol;
    iniciarCronometro();
    estadoJuego.contadorAdivinadas = 0;
    if (document.querySelector("#tablaPuntuaciones h5") != null) {
      document
        .getElementById("tablaPuntuaciones")
        .removeChild(document.querySelector("#tablaPuntuaciones h5"));
    }
    if (document.querySelector("#containerTablas h2") != null) {
      document
        .querySelector("#containerTablas")
        .removeChild(document.querySelector("#containerTablas h2"));
    }
    if (document.getElementsByTagName("table")[1] != null) {
      document
        .getElementById("containerTablas")
        .removeChild(document.getElementsByTagName("table")[1]);
    }
    if (document.querySelector("#palabras div") != null) {
      document
        .getElementById("palabras")
        .removeChild(document.querySelector("#palabras div"));
    }
    if (document.querySelector("#tablaPuntuaciones .puntuacion") != null) {
      document
        .getElementById("tablaPuntuaciones")
        .removeChild(document.querySelector("#tablaPuntuaciones .puntuacion"));
    }

    ev.target.classList.add("oculto");
    dificultad.style.visibility="hidden";
    document.getElementById("labeldif").style.visibility="hidden";
    generarCuadricula(longitudFilayCol);
    let table = document.getElementsByTagName("table")[1];
    let TDS = table.querySelectorAll("td");
    colocalPalabras(palabras, totalCeldas, longitudFilayCol, TDS);
    rellenarSobrantes(TDS);
    actualizarPuntuaciones(dificultad.value);
    document.getElementById("nombre").value = "";
    document.getElementById("nombre").setAttribute("disabled", "");
  });


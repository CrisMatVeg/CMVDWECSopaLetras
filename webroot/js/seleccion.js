import { palabras, estadoJuego } from "./config.js";
import { actualizarPuntuaciones } from "./ui.js";

// Comprueba si la palabra seleccionada está en la lista de palabras
export function adivinarPalabras(celdasMarcadas, palabraSeleccionada) {
  if (palabras.includes(palabraSeleccionada)) {
    // Cambia el color de las celdas seleccionadas a correcto
    celdasMarcadas.forEach((celda) => {
      celda.classList.remove("marcada");
      celda.classList.add("correcta");
    });

    // Marca la palabra como adivinada en la lista de palabras
    document.querySelectorAll("#palabras div span").forEach((spanPalabra) => {
      if (
        palabraSeleccionada === spanPalabra.innerText &&
        !spanPalabra.classList.contains("adivinada")
      ) {
        spanPalabra.classList.add("adivinada");
        estadoJuego.contadorAdivinadas++;

        // Si se han adivinado todas las palabras
        if (
          estadoJuego.contadorAdivinadas ===
          document.querySelectorAll("#palabras div span").length
        ) {
          document.getElementById("nombre").focus();
          document.getElementById("nombre").select();

          document.getElementsByTagName("button")[0].classList.remove("oculto");
          document.getElementById("dificultad").style.visibility="";
          document.getElementById("labeldif").style.visibility="";

          let cronometro = document.querySelector(".cronometro");
          cronometro.classList.remove("cronometro");
          cronometro.classList.add("puntuacion");

          actualizarPuntuaciones(true);

          // Desactiva todas las celdas de la tabla
          document.querySelectorAll(".tablaSopa td").forEach((td) => {
            td.classList.add("inactiva");
          });

          // Muestra mensaje de victoria
          let mensaje = document.createElement("h2");
          mensaje.innerText = "ENHORABUENA, HAS GANADO!";
          document.getElementById("containerTablas").appendChild(mensaje);
        }
      }
    });
  } else {
    // Si la palabra es incorrecta, marca celdas temporalmente
    celdasMarcadas.forEach((celda) => {
      celda.classList.remove("marcada");
      celda.classList.add("incorrecta");
    });

    setTimeout(() => {
      document.querySelectorAll(".incorrecta").forEach((celda) => {
        celda.classList.remove("incorrecta");
      });
    }, 1000);
  }
}

// Función que maneja los clicks en las celdas de la tabla
export function tdFuncion(tabla, evento) {
  const celdasSeleccionadas1 = document.getElementsByClassName("selected");
  const celdasSeleccionadas2 = document.getElementsByClassName("selected2");
  let palabraSeleccionada = "";

  if (celdasSeleccionadas1.length !== 0) {
    evento.target.classList.toggle("selected2");

    // Filas y columnas de los extremos de la selección
    const fila1 = celdasSeleccionadas1[0].parentElement;
    const fila2 = celdasSeleccionadas2[0].parentElement;

    const indiceFila1 = fila1.rowIndex;
    const indiceFila2 = fila2.rowIndex;

    const indiceColumna1 = celdasSeleccionadas1[0].cellIndex;
    const indiceColumna2 = celdasSeleccionadas2[0].cellIndex;

    // Selección horizontal
    if (indiceFila1 === indiceFila2) {
      const fila = tabla.rows[indiceFila1];
      const inicio = Math.min(indiceColumna1, indiceColumna2);
      const fin = Math.max(indiceColumna1, indiceColumna2);

      for (let col = inicio; col <= fin; col++) {
        fila.cells[col].classList.add("marcada");
        palabraSeleccionada += fila.cells[col].innerText;
      }

      if (inicio === indiceColumna2) {
        palabraSeleccionada = palabraSeleccionada.split("").reverse().join("");
      }

      const celdasMarcadas = document.querySelectorAll(".marcada");
      adivinarPalabras(celdasMarcadas, palabraSeleccionada);

      // Selección vertical
    } else if (indiceColumna1 === indiceColumna2) {
      const inicio = Math.min(indiceFila1, indiceFila2);
      const fin = Math.max(indiceFila1, indiceFila2);

      for (let fila = inicio; fila <= fin; fila++) {
        tabla.rows[fila].cells[indiceColumna1].classList.add("marcada");
        palabraSeleccionada += tabla.rows[fila].cells[indiceColumna1].innerText;
      }

      if (inicio === indiceFila2) {
        palabraSeleccionada = palabraSeleccionada.split("").reverse().join("");
      }

      const celdasMarcadas = document.querySelectorAll(".marcada");
      adivinarPalabras(celdasMarcadas, palabraSeleccionada);

      // Selección diagonal
    } else if (
      Math.abs(indiceFila1 - indiceFila2) ===
      Math.abs(indiceColumna1 - indiceColumna2)
    ) {
      const pasos = Math.abs(indiceFila1 - indiceFila2);
      const ejeY = indiceFila1 < indiceFila2 ? 1 : -1;
      const ejeX = indiceColumna1 < indiceColumna2 ? 1 : -1;

      for (let k = 0; k <= pasos; k++) {
        const fila = indiceFila1 + k * ejeY;
        const col = indiceColumna1 + k * ejeX;

        tabla.rows[fila].cells[col].classList.add("marcada");
        palabraSeleccionada += tabla.rows[fila].cells[col].innerText;
      }

      const celdasMarcadas = document.querySelectorAll(".marcada");
      adivinarPalabras(celdasMarcadas, palabraSeleccionada);
    }

    // Limpia la selección para permitir nueva selección
    for (const celda of celdasSeleccionadas1)
      celda.classList.remove("selected");
    for (const celda of celdasSeleccionadas2)
      celda.classList.remove("selected2");
  } else {
    // Si no hay ninguna celda seleccionada, marcar la primera
    evento.target.classList.toggle("selected");
  }
}

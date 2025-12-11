// Variables
const palabras = [
  "oso",
  "perro",
  "lagarto",
  "gato",
  "pajaro",
  /* "bufalo",
  "leon",
  "tigre",
  "cabra",
  "zebra",
  "elefante",
  "tiburon",
  "gallina",
  "zorro",
  "lobo",
  "aguila" */
]; // Lista de palabras a colocar en la sopa
var contadorAdivinadas = 0;
var partidaTerminada = false;

// OBTENER PALABRA MAS LARGA
// Devuelve la longitud de la palabra más larga del array
function obtenerPalabraMasLarga(arrayPalabras) {
  let maxLongitud = 0;
  for (const palabra of arrayPalabras) {
    if (palabra.length > maxLongitud) {
      maxLongitud = palabra.length;
    }
  }
  return maxLongitud;
}

// CALCULAR TOTAL DE LETRAS DE LA CUADRICULA
// Suma la longitud de todas las palabras del array
function calcularTotalLetras(arrayPalabras) {
  let acumulador = 0;
  for (const palabra of arrayPalabras) {
    acumulador += palabra.length;
  }
  return acumulador;
}

//CALCULAR DIMENSIONES MINIMAS DE LA TABLA, LONGITUD DE ANCHO Y ALTO
// Calcula una dimensión mínima cuadrada para la tabla, basada en el total de letras y longitud máxima
function calcularDimensionTabla(arrayPalabras) {
  const totalLetras = calcularTotalLetras(arrayPalabras);
  const maxPalabra = obtenerPalabraMasLarga(arrayPalabras);

  // Se toma el doble del total de letras (por seguridad) y se saca raíz cuadrada para obtener una dimensión cuadrada
  let longitudFilayCol = Math.ceil(Math.sqrt(totalLetras * 2));

  // Asegura que la tabla al menos tenga espacio para la palabra más larga
  if (longitudFilayCol < maxPalabra) {
    longitudFilayCol = maxPalabra;
  }
  return longitudFilayCol;
}

function actualizarPuntuaciones() {
  let online = navigator.onLine;
  //Se comprueba primero si el navegador está online y si no lo está avisa con un alert
  if (!online) {
    alert("NAVEGADOR OFFLINE"); //cambiar a barra roja
  } else {
    // TRY-CATCH Para controlar que LocalStorage está activado y si no lo está que avise con un alert
    //try {
    var puntuacionElemento = document.getElementsByClassName("puntuacion")[0];
    var tdp1 = document.getElementById("v1");
    var tdp2 = document.getElementById("v2");
    var tdp3 = document.getElementById("v3");
    if (
      puntuacionElemento == null &&
      localStorage.getItem("puntuaciones") == null
    ) {
      tdp1.innerText = 0;
      tdp2.innerText = 0;
      tdp3.innerText = 0;
    } else {
      if (localStorage.getItem("puntuaciones") == null) {
        var puntuacion = puntuacionElemento.textContent;
        localStorage.setItem("puntuaciones", puntuacion);
      } else if (
        localStorage.getItem("puntuaciones") != null &&
        puntuacionElemento != null
      ) {
        var puntuacion = puntuacionElemento.textContent;
        var actual = localStorage.getItem("puntuaciones");
        localStorage.setItem("puntuaciones", actual + "," + puntuacion);
      }
      var puntuaciones = localStorage.getItem("puntuaciones").split(",");
      var primero = Number.MAX_VALUE;
      var segundo = Number.MAX_VALUE;
      var tercero = Number.MAX_VALUE;
      puntuaciones.forEach((p) => {
        let aTiempo = p.split(":");
        let contadorSegundos = aTiempo.join("");
        contadorSegundos = contadorSegundos != null ? contadorSegundos : 0;
        if (contadorSegundos < primero) {
          tercero = segundo;
          segundo = primero;
          primero = contadorSegundos;
          document.getElementById("nombre").removeAttribute("disabled");
        } else if (contadorSegundos < segundo) {
          tercero = segundo;
          segundo = contadorSegundos;
          document.getElementById("nombre").removeAttribute("disabled");
        } else if (contadorSegundos < tercero) {
          tercero = contadorSegundos;
          document.getElementById("nombre").removeAttribute("disabled");
        } else {
          document.getElementById("nombre").setAttribute("disabled", "");
        }
      });

      let puntuacionesCadenas = [primero, segundo, tercero];
      puntuacionesCadenas.forEach((puntuacion, index) => {
        if (puntuacion == Number.MAX_VALUE) {
          puntuacionesCadenas[index] = 0;
        } else {
          let horasCadena = puntuacion.substr(0, 2);
          let minutosCadena = puntuacion.substr(2, 2);
          let segundosCadena = puntuacion.substr(4, 2);
          puntuacionesCadenas[
            index
          ] = `${horasCadena}:${minutosCadena}:${segundosCadena}`;
        }
      });

      tdp1.innerText = puntuacionesCadenas[0];
      tdp2.innerText = puntuacionesCadenas[1];
      tdp3.innerText = puntuacionesCadenas[2];
    }
    /* } catch (error) {
      alert("LOCAL STORAGE DESACTIVADO, NO SE PUEDEN GUARDAR PUNTUACIONES");
    } */
  }
}

function adivinarPalabras(celdasMarcadas, palabraSeleccionada) {
  if (palabras.includes(palabraSeleccionada)) {
    celdasMarcadas.forEach((celda) => {
      celda.classList.remove("marcada");
      celda.classList.add("correcta");
    });
    document.querySelectorAll("#palabras div span").forEach((palabra) => {
      if (
        palabraSeleccionada == palabra.innerText &&
        palabra.className != "adivinada"
      ) {
        palabra.classList.add("adivinada");
        contadorAdivinadas++;
        if (
          contadorAdivinadas ==
          document.querySelectorAll("#palabras div span").length
        ) {
          document.getElementById("nombre").focus();
          document.getElementById("nombre").select();
          document.getElementsByTagName("button")[0].classList.remove("oculto");
          let cronometro = document.querySelector(".cronometro");
          cronometro.classList.remove("cronometro");
          cronometro.classList.add("puntuacion");
          actualizarPuntuaciones();
          document.querySelectorAll(".tablaSopa td").forEach(td => {
              td.classList.add("inactiva");
          });
          let enhorabuena= document.createElement("h2");
          enhorabuena.innerText="ENHORABUENA, HAS GANADO!";
          document.getElementById("containerTablas").appendChild(enhorabuena);
        }
      }
    });
  } else {
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

function tdFuncion(table, ev) {
  //constantes que guardan las COLECCIONES de elementos selected y selected 2
  const cSelected1 = document.getElementsByClassName("selected");
  const cSelected2 = document.getElementsByClassName("selected2");
  var palabraSeleccionada = "";
  /* si la longitud de la coleccion de elementos selected no es 0, es que hay algun selected
    entonces al hacer click sobre una celda se le pone la clase selected2 (la he puesto con toggle)*/
  if (cSelected1.length != 0) {
    ev.target.classList.toggle("selected2");
    //obtengo el elemento padre de selected y el de selected2, que serán tr, puesto que estos son td
    const fila1 = cSelected1[0].parentElement;
    const fila2 = cSelected2[0].parentElement;
    //obtengo el indice de fila que contiene selected/selected2 de entre todos los tr (filas)
    const indiceFila1 = fila1.rowIndex;
    const indiceFila2 = fila2.rowIndex;
    //obtengo el indice de la celda que contiene selected/selected2 de entre todas las celdas de su fila (es decir, la columna)
    const indiceColumna1 = cSelected1[0].cellIndex;
    const indiceColumna2 = cSelected2[0].cellIndex;
    //si los indices de fila coinciden en selected y selected2, entonces la seleccion es HORIZONTAL
    if (indiceFila1 == indiceFila2) {
      //obtengo la fila entera que contenga selected y selected2 de la tabla mediante el índice
      const fila = table.rows[indiceFila1];
      //obtengo el indice de columna menor y el mayor de los dos para definir el inicio y final del recorrido para marcar las celdas intermedias
      let inicio = Math.min(indiceColumna1, indiceColumna2);
      let fin = Math.max(indiceColumna1, indiceColumna2);
      for (let columna = inicio; columna <= fin; columna++) {
        fila.cells[columna].classList.add("marcada");
        let contenidoCelda = fila.cells[columna].innerText;
        palabraSeleccionada = palabraSeleccionada + contenidoCelda;
      }
      //si el bucle empieza a recorrerse desde selected2 entonces la palabra estará al reves, se invierte
      if (inicio == indiceColumna2) {
        palabraSeleccionada = palabraSeleccionada.split("").reverse().join("");
      }
      // se meten las celdas marcadas en una variable y luego se recorren, si la palabra es correcta se cambia a un color y si no lo es a otro
      var celdasMarcadas = document.querySelectorAll(".marcada");
      adivinarPalabras(celdasMarcadas, palabraSeleccionada);
      //si es el índice de columna lo que coincide en selected y selected2, se hace igual pero recorriendolo en filas, coincide en VERTICAL
    } else if (indiceColumna1 == indiceColumna2) {
      let inicio = Math.min(indiceFila1, indiceFila2);
      let fin = Math.max(indiceFila1, indiceFila2);
      for (let fila = inicio; fila <= fin; fila++) {
        table.rows[fila].cells[indiceColumna1].classList.add("marcada");
        let contenidoCelda = table.rows[fila].cells[indiceColumna1].innerText;
        palabraSeleccionada = palabraSeleccionada + contenidoCelda;
      }
      //si se ha recorrido desde selected2 a selected entonces se ha recorrido al reves y hay que darle la vuelta a la palabra
      if (inicio == indiceFila2) {
        palabraSeleccionada = palabraSeleccionada.split("").reverse().join("");
      }
      // se meten las celdas marcadas en una variable y luego se recorren, si la palabra es correcta se cambia a un color y si no lo es a otro
      var celdasMarcadas = document.querySelectorAll(".marcada");
      adivinarPalabras(celdasMarcadas, palabraSeleccionada);
      //si no coinciden ni los indices de fila ni de columna, se comprueba en DIAGONAL

      /*
        para saber si una diagonal es perfecta se obtienen los valores absolutos (sin simbolo)
        de la resta de los indices de fila y la resta de los indices de columna de los extremos (selected y selected2) de la diagonal a trazar 
        y ambos valores tienen que ser iguales
      */
    } else if (
      Math.abs(indiceFila1 - indiceFila2) ===
      Math.abs(indiceColumna1 - indiceColumna2)
    ) {
      //el valor absoluto de la resta del indice de fila de selected menos el de la fila de selected2 da el numero de pasos a dar
      const pasos = Math.abs(indiceFila1 - indiceFila2);

      //obtengo que indice de fila y de columna es menor de los dos para saber los ejes x e y para recorrer la diagonal en la dirección correspondiente
      const ejeY = indiceFila1 < indiceFila2 ? 1 : -1;
      const ejeX = indiceColumna1 < indiceColumna2 ? 1 : -1;
      //(-1,-1)arriba-izquierda (-1,1)arriba-derecha
      //(1,-1)abajo-izquierda (1,1)abajo-derecha

      //k = indice de vuelta del bucle
      for (let k = 0; k <= pasos; k++) {
        //recorro las filas y las columnas a la vez de una en una
        //se recorre el numero de pasos (nº de vueltas del bucle/k)
        //la fila actual en la que se encuentra el recorrido es:
        //indice de fila de selected + nº vuelta del bucle * coordenada en eje y
        //lo mismo para la columna
        const fila = indiceFila1 + k * ejeY;
        const col = indiceColumna1 + k * ejeX;
        table.rows[fila].cells[col].classList.add("marcada");
        let contenidoCelda = table.rows[fila].cells[col].innerText;
        palabraSeleccionada = palabraSeleccionada + contenidoCelda;
      }
      // se meten las celdas marcadas en una variable y luego se recorren, si la palabra es correcta se cambia a un color y si no lo es a otro
      var celdasMarcadas = document.querySelectorAll(".marcada");
      adivinarPalabras(celdasMarcadas, palabraSeleccionada);
    }
    //despues de recorrer la selección y marcar la palabra eliminamos selected y selected2 para volverlas a poner en una nueva selección
    for (const celda of cSelected1) {
      celda.classList.remove("selected");
    }
    for (const celda of cSelected2) {
      celda.classList.remove("selected2");
    }
  } else {
    ev.target.classList.toggle("selected");
  }
}

//GENERAR LA CUADRICULA EN UN ARRAY BIDIMENSIONAL
// Crea una tabla cuadrada HTML de celdas vacías, según la longitud pasada
function generarCuadricula(longitudFilayCol) {
  const table = document.createElement("table");
  table.classList.add("tablaSopa");
  for (var i = 0; i < longitudFilayCol; i++) {
    const fila = document.createElement("tr");
    for (var j = 0; j < longitudFilayCol; j++) {
      const celda = document.createElement("td");
      celda.textContent = ``;
      //CUANDO SE HACE CLICK EN UNA CELDA
      celda.addEventListener("click", (ev) => tdFuncion(table, ev));
      fila.appendChild(celda);
    }
    table.appendChild(fila);
  }
  document.getElementById("containerTablas").appendChild(table);
}

//CALCULAR POSICION ALEATORIA
// Devuelve una posición aleatoria dentro de los límites de la tabla
function calcularPosicionAleatoria(totalCeldas) {
  return Math.floor(Math.random() * totalCeldas);
}

//CALCULAR DIRECCION ALEATORIA
// Devuelve una dirección aleatoria entre 0 y 7
function calcularDireccionAleatoria() {
  return Math.floor(Math.random() * 8);
}

//FUNCION PARA CALCULAR SI UNA POSICION DIAGONAL DADA ES VALIDA O NO
// Comprueba si una palabra cabe en una dirección diagonal desde cierta posición
function posicionDiagonalValida(
  posicion,
  direccion,
  longitudFilayCol,
  palabra
) {
  // Obtenemos fila y columna en la que estamos dada la posición inicial
  let fila = Math.floor(posicion / longitudFilayCol);
  let columna = posicion % longitudFilayCol;
  let posicionesHastaElLimite = 0; // Contador de espacios disponibles en la diagonal
  const posicionesARecorrer = palabra.length; // Longitud de la palabra a colocar

  // Calculamos cuántos espacios hay disponibles según la dirección para ver si la palabra cabe
  switch (direccion) {
    case 1: // Diagonal abajo-derecha
      while (fila < longitudFilayCol && columna < longitudFilayCol) {
        posicionesHastaElLimite++;
        fila++;
        columna++;
      }
      break;
    case 3: // Diagonal abajo-izquierda
      while (
        fila < longitudFilayCol &&
        columna >= 0 &&
        columna < longitudFilayCol
      ) {
        posicionesHastaElLimite++;
        fila++;
        columna--;
      }
      break;
    case 5: // Diagonal arriba-izquierda
      while (fila >= 0 && fila < longitudFilayCol && columna >= 0) {
        posicionesHastaElLimite++;
        fila--;
        columna--;
      }
      break;
    case 7: // Diagonal arriba-derecha
      while (fila >= 0 && columna < longitudFilayCol) {
        posicionesHastaElLimite++;
        fila--;
        columna++;
      }
      break;
    default:
      return false; // No es una diagonal válida
  }

  // Retorna true si la palabra cabe dentro de la diagonal
  return posicionesARecorrer <= posicionesHastaElLimite;
}

// CALCULAR POSICIONES VALIDAS DE CADA PALABRA
// Devuelve un array con las direcciones válidas en las que una palabra puede colocarse desde cierta posición
function sacarPosicionesValidas(palabra, longitudFilayCol, posicion, TDS) {
  let posicionesValidas = [];
  const fila = Math.floor(posicion / longitudFilayCol);
  const columna = posicion % longitudFilayCol;
  let puedeColocar = true;
  let indiceTDS = null;

  // Comprobamos cada dirección, si la palabra puede caber y no choca con letras diferentes

  // Horizontal derecha
  if (columna + palabra.length - 1 < longitudFilayCol) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      indiceTDS = fila * longitudFilayCol + (columna + i);
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(0);
  }

  // Diagonal abajo derecha
  if (posicionDiagonalValida(posicion, 1, longitudFilayCol, palabra)) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      let f = fila + i;
      let c = columna + i;
      indiceTDS = f * longitudFilayCol + c;
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(1);
  }

  // Vertical abajo
  if (fila + palabra.length - 1 < longitudFilayCol) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      indiceTDS = (fila + i) * longitudFilayCol + columna;
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(2);
  }

  // Diagonal abajo izquierda
  if (posicionDiagonalValida(posicion, 3, longitudFilayCol, palabra)) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      let f = fila + i;
      let c = columna - i;
      indiceTDS = f * longitudFilayCol + c;
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(3);
  }

  // Horizontal izquierda
  if (columna - (palabra.length - 1) >= 0) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      indiceTDS = fila * longitudFilayCol + (columna - i);
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(4);
  }

  // Diagonal arriba izquierda
  if (posicionDiagonalValida(posicion, 5, longitudFilayCol, palabra)) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      let f = fila - i;
      let c = columna - i;
      indiceTDS = f * longitudFilayCol + c;
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(5);
  }

  // Vertical arriba
  if (fila - (palabra.length - 1) >= 0) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      indiceTDS = (fila - i) * longitudFilayCol + columna;
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(6);
  }

  // Diagonal arriba derecha
  if (posicionDiagonalValida(posicion, 7, longitudFilayCol, palabra)) {
    puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      let f = fila - i;
      let c = columna + i;
      indiceTDS = f * longitudFilayCol + c;
      if (
        !TDS[indiceTDS] ||
        (TDS[indiceTDS].innerText !== "" &&
          TDS[indiceTDS].innerText !== palabra[i])
      ) {
        puedeColocar = false;
      }
    }
    if (puedeColocar) posicionesValidas.push(7);
  }

  // Retornamos el array con las direcciones válidas para colocar la palabra
  return posicionesValidas;
}

// COLOCAR PALABRA POR PALABRA COMPROBANDO POSICIONES VALIDAS
function colocalPalabras(arrayPalabras, totalCeldas, longitudFilayCol, TDS) {
  let divPalabras = document.createElement("div");
  let posicionesValidas = null;
  let posicionInicial = null;
  let direccionPalabra = null;
  let filaInicio = null;
  let indicePalabra = 0;
  let columnaInicio = null;

  // Recorremos cada palabra para colocarla en la tabla
  for (const palabra of arrayPalabras) {
    indicePalabra = 0; // Reiniciamos índice para la palabra actual
    let intentos = 0; // Contador de intentos para encontrar posición válida
    const maxIntentos = 10; // Limite de intentos para no quedar en bucle infinito

    // Intentamos encontrar una posición y dirección válida para la palabra
    do {
      posicionInicial = calcularPosicionAleatoria(totalCeldas); // Posición inicial aleatoria
      posicionesValidas = sacarPosicionesValidas(
        palabra,
        longitudFilayCol,
        posicionInicial,
        TDS
      );
      intentos++;
    } while (
      (!posicionesValidas || posicionesValidas.length === 0) &&
      intentos < maxIntentos
    );

    // Si encontramos alguna posición válida, colocamos la palabra
    if (posicionesValidas && posicionesValidas.length > 0) {
      // Elegimos una dirección aleatoria DE ENTRE LAS VALIDAS PARA ESA PALABRA
      direccionPalabra = Math.floor(Math.random() * posicionesValidas.length);
      // Calculamos fila y columna de la posición inicial
      filaInicio = Math.floor(posicionInicial / longitudFilayCol);
      columnaInicio = posicionInicial % longitudFilayCol;
      let spanPalabra = document.createElement("span");
      spanPalabra.innerText = palabra;
      divPalabras.appendChild(spanPalabra);
      document.getElementById("palabras").appendChild(divPalabras);
      // Según la dirección, colocamos la palabra letra por letra en la tabla
      switch (posicionesValidas[direccionPalabra]) {
        case 0: // derecha
          for (let j = columnaInicio; j < columnaInicio + palabra.length; j++) {
            let indice = filaInicio * longitudFilayCol + j;
            TDS[indice].innerText = palabra.charAt(indicePalabra);
            indicePalabra++;
          }
          break;
        case 1: // diagonal abajo-derecha
          for (let i = filaInicio; i < filaInicio + palabra.length; i++) {
            for (
              let j = columnaInicio;
              j < columnaInicio + palabra.length;
              j++
            ) {
              if (i - filaInicio === j - columnaInicio) {
                let indice = i * longitudFilayCol + j;
                TDS[indice].innerText = palabra.charAt(indicePalabra);
                indicePalabra++;
              }
            }
          }
          break;
        case 2: // abajo
          for (let i = filaInicio; i < filaInicio + palabra.length; i++) {
            let indice = i * longitudFilayCol + columnaInicio;
            TDS[indice].innerText = palabra.charAt(indicePalabra);
            indicePalabra++;
          }
          break;
        case 3: // diagonal abajo-izquierda
          for (let i = filaInicio; i < filaInicio + palabra.length; i++) {
            for (
              let j = columnaInicio;
              j > columnaInicio - palabra.length;
              j--
            ) {
              if (i - filaInicio === columnaInicio - j) {
                let indice = i * longitudFilayCol + j;
                TDS[indice].innerText = palabra.charAt(indicePalabra);
                indicePalabra++;
              }
            }
          }
          break;
        case 4: // izquierda
          for (let j = columnaInicio; j > columnaInicio - palabra.length; j--) {
            let indice = filaInicio * longitudFilayCol + j;
            TDS[indice].innerText = palabra.charAt(indicePalabra);
            indicePalabra++;
          }
          break;
        case 5: // diagonal arriba-izquierda
          for (let i = filaInicio; i > filaInicio - palabra.length; i--) {
            for (
              let j = columnaInicio;
              j > columnaInicio - palabra.length;
              j--
            ) {
              if (filaInicio - i === columnaInicio - j) {
                let indice = i * longitudFilayCol + j;
                TDS[indice].innerText = palabra.charAt(indicePalabra);
                indicePalabra++;
              }
            }
          }
          break;
        case 6: // arriba
          for (let i = filaInicio; i > filaInicio - palabra.length; i--) {
            let indice = i * longitudFilayCol + columnaInicio;
            TDS[indice].innerText = palabra.charAt(indicePalabra);
            indicePalabra++;
          }
          break;
        case 7: // diagonal arriba-derecha
          for (let i = filaInicio; i > filaInicio - palabra.length; i--) {
            for (
              let j = columnaInicio;
              j < columnaInicio + palabra.length;
              j++
            ) {
              if (filaInicio - i === j - columnaInicio) {
                let indice = i * longitudFilayCol + j;
                TDS[indice].innerText = palabra.charAt(indicePalabra);
                indicePalabra++;
              }
            }
          }
          break;
        default:
          break;
      }
    }
  }
  return TDS;
}

// RELLENAS CELDAS SOBRANTES
function rellenarSobrantes(TDS) {
  const abecedario = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let indiceAleatorio = null;
  for (const celda of TDS) {
    if (celda.innerText === "") {
      indiceAleatorio = Math.floor(Math.random() * abecedario.length);
      celda.innerText = abecedario[indiceAleatorio];
    }
  }
}
let longitudFilayCol = calcularDimensionTabla(palabras);
let totalCeldas = longitudFilayCol * longitudFilayCol;
let posicion = calcularPosicionAleatoria(totalCeldas);
document.getElementsByTagName("button")[0].addEventListener("click", (ev) => {
  contadorAdivinadas = 0;
  if (document.querySelector("#tablaPuntuaciones h5") != null) {
    document.getElementById("tablaPuntuaciones").removeChild(document.querySelector("#tablaPuntuaciones h5"));
  }
  if (document.querySelector("#containerTablas h2") != null) {
    document.querySelector("#containerTablas").removeChild(document.querySelector("#containerTablas h2"));
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
  generarCuadricula(longitudFilayCol);
  let table = document.getElementsByTagName("table")[1];
  let TDS = table.querySelectorAll("td");
  colocalPalabras(palabras, totalCeldas, longitudFilayCol, TDS);
  rellenarSobrantes(TDS);
  actualizarPuntuaciones();
  document.getElementById("nombre").value = "";
  document.getElementById("nombre").setAttribute("disabled", "");
});
const fila = Math.floor(posicion / longitudFilayCol);
const columna = posicion % longitudFilayCol;

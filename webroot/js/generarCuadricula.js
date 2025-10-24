// Variables
const table = document.getElementById("tabla"); // Referencia a la tabla HTML donde se generará la sopa de letras
const palabras = ["oso", "perro", "lagarto", "gato", "pajaro", "bufalo", "leon","tigre","cabra","zebra","elefante","tiburon","gallina","zorro","lobo","aguila"]; // Lista de palabras a colocar en la sopa

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

//GENERAR LA CUADRICULA EN UN ARRAY BIDIMENSIONAL
// Crea una tabla cuadrada HTML de celdas vacías, según la longitud pasada
function generarCuadricula(longitudFilayCol) {
  for (let i = 0; i < longitudFilayCol; i++) {
    const fila = document.createElement("tr");
    for (let j = 0; j < longitudFilayCol; j++) {
      const celda = document.createElement("td");
      celda.textContent = ``;
      fila.appendChild(celda);
    }
    table.appendChild(fila);
  }
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
function posicionDiagonalValida(posicion, direccion, longitudFilayCol, palabra) {
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
      while (fila < longitudFilayCol && columna >= 0 && columna < longitudFilayCol) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
      if (!TDS[indiceTDS] || (TDS[indiceTDS].innerText !== '' && TDS[indiceTDS].innerText !== palabra[i])) {
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
  let posicionesValidas = null;
  let posicionInicial = null;
  let direccionPalabra = null;
  let filaInicio = null;
  let indicePalabra = 0;
  let columnaInicio = null;

  // Recorremos cada palabra para colocarla en la tabla
  for (const palabra of arrayPalabras) {
    indicePalabra = 0; // Reiniciamos índice para la palabra actual
    let intentos = 0;  // Contador de intentos para encontrar posición válida
    const maxIntentos = 10; // Limite de intentos para no quedar en bucle infinito

    // Intentamos encontrar una posición y dirección válida para la palabra
    do {
      posicionInicial = calcularPosicionAleatoria(totalCeldas); // Posición inicial aleatoria
      posicionesValidas = sacarPosicionesValidas(palabra, longitudFilayCol, posicionInicial, TDS);
      intentos++;
    } while ((!posicionesValidas || posicionesValidas.length === 0) && intentos < maxIntentos);

    // Si encontramos alguna posición válida, colocamos la palabra
    if (posicionesValidas && posicionesValidas.length > 0){
      // Elegimos una dirección aleatoria DE ENTRE LAS VALIDAS PARA ESA PALABRA
      direccionPalabra = Math.floor(Math.random() * posicionesValidas.length);
      // Calculamos fila y columna de la posición inicial
      filaInicio = Math.floor(posicionInicial / longitudFilayCol);
      columnaInicio = posicionInicial % longitudFilayCol;

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
            for (let j = columnaInicio; j < columnaInicio + palabra.length; j++) {
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
            for (let j = columnaInicio; j > columnaInicio - palabra.length; j--) {
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
            for (let j = columnaInicio; j > columnaInicio - palabra.length; j--) {
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
            for (let j = columnaInicio; j < columnaInicio + palabra.length; j++) {
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
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
    'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];
  let indiceAleatorio = null;
  for (const celda of TDS) {
    if(celda.innerText===''){
      indiceAleatorio = Math.floor(Math.random() * abecedario.length);
      celda.innerText= abecedario[indiceAleatorio];
    }
  }
}

let longitudFilayCol = calcularDimensionTabla(palabras);
document.write("Longitud Fila y Col: " + longitudFilayCol + "<br>");
let totalCeldas = longitudFilayCol * longitudFilayCol;
document.write("Total Celdas: " + totalCeldas + "<br>");
let posicion = calcularPosicionAleatoria(totalCeldas);
generarCuadricula(longitudFilayCol);
const fila = Math.floor(posicion / longitudFilayCol);
const columna = posicion % longitudFilayCol;
let TDS = table.querySelectorAll("td");
/* console.log(TDS);
console.log(sacarPosicionesValidas("oso", longitudFilayCol, posicion,TDS)); */
colocalPalabras(palabras, totalCeldas, longitudFilayCol, TDS);
rellenarSobrantes(TDS);

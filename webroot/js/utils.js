// Devuelve la longitud de la palabra más larga del array
export function obtenerPalabraMasLarga(listaPalabras) {
  let longitudMasLarga = 0;

  for (const palabra of listaPalabras) {
    if (palabra.length > longitudMasLarga) {
      longitudMasLarga = palabra.length;
    }
  }

  return longitudMasLarga;
}

// Suma la cantidad total de letras de todas las palabras del array
export function calcularTotalLetras(listaPalabras) {
  let total = 0;

  for (const palabra of listaPalabras) {
    total += palabra.length;
  }

  return total;
}

// Calcula una dimensión mínima adecuada para la cuadrícula
export function calcularDimensionTabla(listaPalabras) {
  const totalLetras = calcularTotalLetras(listaPalabras); // Cantidad total de letras a colocar
  const palabraMasLarga = obtenerPalabraMasLarga(listaPalabras); // Longitud máxima individual

  /*
      Se calcula una dimensión base usando la raíz cuadrada del doble de las letras.
      Esto garantiza que haya espacio suficiente incluso si las palabras se cruzan.
    */
  let dimension = Math.ceil(Math.sqrt(totalLetras * 2));

  // Asegura que la cuadrícula pueda contener la palabra más larga
  if (dimension < palabraMasLarga) {
    dimension = palabraMasLarga;
  }

  return dimension;
}

// Devuelve una posición aleatoria dentro de los límites de la tabla
export function calcularPosicionAleatoria(totalCeldas) {
  return Math.floor(Math.random() * totalCeldas);
}

// Devuelve una dirección aleatoria entre 0 y 7
export function calcularDireccionAleatoria() {
  return Math.floor(Math.random() * 8);
}

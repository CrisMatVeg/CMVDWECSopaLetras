//ARCHIVO PARA VARIABLES GLOBALES
const idioma = "es";
const cantidad = 7;
export var palabras = [];

export const configuracionDificultad = {
  facil: {
    cantidadPalabras: 5,
  },
  medio: {
    cantidadPalabras: 10,
  },
  dificil: {
    cantidadPalabras: 15,
  },
};

export const estadoJuego = {
  contadorAdivinadas: 0,
  puntuacion: 0,
  dificultad: "facil",
  dificultadPartida: null,
};

export async function generarPalabras(cantidad) {
  palabras.length = 0;

  const respuesta = await fetch(
    `https://random-word-api.herokuapp.com/word?number=${cantidad}&lang=es`
  );

  const datos = await respuesta.json();

  datos.forEach((item) => {
    const palabra = item.toUpperCase().trim();

    if (palabra.includes(" ")) return;
    if (!/^[a-zñ]+$/i.test(palabra)) return;

    palabras.push(palabra);
  });
}

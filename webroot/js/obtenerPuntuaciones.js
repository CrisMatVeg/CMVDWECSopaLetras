function actualizarPuntuaciones() {
  let online = navigator.onLine;
  //Se comprueba primero si el navegador está online y si no lo está avisa con un alert
  if (!online) {
    alert("NAVEGADOR OFFLINE"); //cambiar a barra roja
  } else {
    // TRY-CATCH Para controlar que LocalStorage está activado y si no lo está que avise con un alert
    try {
      var puntuacion = document.getElementsByClassName("puntuacion")[0].textContent;
      if (localStorage.getItem("puntuaciones") == null) {
        localStorage.setItem("puntuaciones", puntuacion);
      } else {
        var actual = localStorage.getItem("puntuaciones");
        localStorage.setItem("puntuaciones", actual + "," + puntuacion);
      }
    } catch (error) {
      alert("LOCAL STORAGE DESACTIVADO, NO SE PUEDEN GUARDAR PUNTUACIONES");
    }
  }
  var puntuaciones = localStorage.getItem("puntuaciones").split(",");
  var primero = 0;
  var segundo = 0;
  var tercero = 0;
  puntuaciones.forEach((p) => {
    p = p != null ? parseInt(p) : 0;
    if (p > primero) {
      tercero = segundo;
      segundo = primero;
      primero = p;
    } else if (p > segundo) {
      tercero = segundo;
      segundo = p;
    } else if (p > tercero) {
      tercero = p;
    }
  });
  var tdp1 = document.getElementById("v1");
  var tdp2 = document.getElementById("v2");
  var tdp3 = document.getElementById("v3");
  tdp1.innerText = primero;
  tdp2.innerText = segundo;
  tdp3.innerText = tercero;
}
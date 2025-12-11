function actualizarHora() {
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
    document.getElementById("reloj").textContent = `${horas}:${minutos}:${segundos}`;
  }

  var reloj=setInterval(()=>actualizarHora(), 1000);
  actualizarHora();
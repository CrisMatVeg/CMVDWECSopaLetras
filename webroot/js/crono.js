const crono = new Date();
let cronoActualizandose=null;
function crearCronometro(crono) {
    let cronometroDiv=document.createElement("div");
    // Obtener hora, minutos y segundos
    crono.setHours(0);
    crono.setMinutes(0);
    crono.setSeconds(0);
    let horas=crono.getHours();
    let minutos=crono.getMinutes();
    let segundos=crono.getSeconds();

    // Agregar ceros a la izquierda si son menores que 10
    horas = horas < 10 ? "0" + horas : horas;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    // Mostrar el reloj
    cronometroDiv.textContent = `${horas}:${minutos}:${segundos}`;
    cronometroDiv.classList.add("cronometro");
    document.getElementById("tablaPuntuaciones").appendChild(cronometroDiv);
}
function actualizarCrono(crono) {
    let horas=crono.getHours();
    let minutos=crono.getMinutes();
    let segundos=crono.getSeconds();
    crono.setSeconds(segundos+1); 
    // Agregar ceros a la izquierda si son menores que 10
    horas = horas < 10 ? "0" + horas : horas;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;
    let cronometro=document.getElementsByClassName("cronometro")[0];
    if(cronometro!=null){
        cronometro.textContent= `${horas}:${minutos}:${segundos}`;
    }
}
document.getElementsByTagName("button")[0].addEventListener("click", (ev) => {
    if(cronoActualizandose!=null){
        clearInterval(cronoActualizandose);
    }
    crearCronometro(crono);

    if(document.querySelector("#tablaPuntuaciones .puntuacion")!=null){
        document.getElementById("tablaPuntuaciones").removeChild(document.querySelector("#tablaPuntuaciones .puntuacion"));
    }
    /* if(document.querySelector("#tablaPuntuaciones .cronometro")!=null){
        document.getElementById("tablaPuntuaciones").removeChild(document.querySelector("#tablaPuntuaciones .cronometro"));
    } */
    cronoActualizandose=setInterval(()=>actualizarCrono(crono), 1000);
});
var boton = document.querySelector('.botonBusqueda');
var buscador = document.querySelector('.buscador');
var btnProxDias = document.querySelector('.btnProxDias');
var btnVolver = document.querySelector('.btnVolver');
var ciudad = document.querySelector('.ciudad');
var body = document.querySelector('.body');
var temperaturaActual = document.querySelector('.temperatura-actual');
var estadoActualImg = document.querySelector('.estado-actual-img');
var estadoImg =[document.querySelector('.estado-0-img'), document.querySelector('.estado-1-img'), document.querySelector('.estado-2-img')];
var tempMax = document.querySelector('.temp-max');
var tempMin = document.querySelector('.temp-min');
var tempMaxMañana = document.querySelector('.temp-max-mañana');
var tempMinMañana = document.querySelector('.temp-min-mañana');
var tempMaxPasado = document.querySelector('.temp-max-pasado');
var tempMinPasado = document.querySelector('.temp-min-pasado');
var separadorTemperatura = [document.querySelector('.separador-hoy'), document.querySelector('.separador-mañana'), document.querySelector('.separador-pasado')];
var separadorDias = [document.querySelector('.separador-vertical-1'), document.querySelector('.separador-vertical-2')];
var diaHoy=document.querySelector('.hoy');
var diaMañana=document.querySelector('.mañana');
var diaPasado=document.querySelector('.pasado');
var ubicacionImg=document.querySelector('.ubicacion-img');
var divVertical=document.querySelector('.line');
var divBtnProxDias = document.querySelector('.divBtnProxDias');
var divBtnVolver = document.querySelector('.divBtnVolver');
var dataWeather;
var fecha;
var latitud;
var longitud;

divBtnProxDias.style.opacity=0;
divBtnProxDias.style.cursor = "default";
divBtnVolver.style.opacity=0;
divBtnVolver.style.cursor = "default";

const getDia = (fecha)=>{
        if(fecha==0 || fecha==7){
                return "Domingo";
        } else if(fecha==1 || fecha == 8){
                return"Lunes";
        } else if(fecha == 2 || fecha == 9){
                return "Martes";
        } else if(fecha == 3 || fecha == 10){
                return "Miercoles";
        } else if(fecha == 4 || fecha == 11){
                return "Jueves";
        } else if(fecha == 5 || fecha == 12){
                return "Viernes";
        } else if(fecha == 6 || fecha == 13){
                return "Sabado";
        }
}

function cargarTemperaturas(){
        var i=0;
        for(i=0; i<3; i++){
                separadorTemperatura[i].innerHTML = `<hr class="separador"></hr>`
                if(i<2){
                separadorDias[i].innerHTML = `<hr class="separador-vertical"></hr>`
                }
                if((dataWeather.daily[i].weather[0].icon).includes("04") || (dataWeather.daily[i].weather[0].icon).includes("03")){
                        estadoImg[i].innerHTML = `<img src="sources/03.png" class='estado-${i}-img' /></img>`
                }else if((dataWeather.daily[i].weather[0].icon).includes("09")){
                        estadoImg[i].innerHTML = `<img src='sources/09.png' class="estado-${i}-img" /></img>`
                }else if (hora>=20 || hora<6){
                        estadoImg[i].innerHTML = `<img src='sources/${parseInt(dataWeather.daily[i].weather[0].icon)}n.png' class="estado-${i}-img" /></img>` 
                }else if (hora<20 || hora>6){
                        estadoImg[i].innerHTML = `<img src='sources/${parseInt(dataWeather.daily[i].weather[0].icon)}d.png' class="estado-${i}-img" /></img>` 
                }
        }
        fecha= new Date((dataWeather.current.dt)*1000).getDay();
        diaHoy.innerHTML=`<div>Hoy</div>`;
        diaMañana.innerHTML=`<div>Mañana</div>`;
        diaPasado.innerHTML=`<div>${getDia(fecha+2)}</div>`;
        divVertical.innerHTML=`<div class="vertical-line">`;
        temperaturaActual.innerHTML=`<h1>${Math.round(dataWeather.current.temp) + '°c'}</h1>` +  
        `<div class=datos>
                <h2>${dataWeather.current.weather[0].description}</h2>
                <h2>Prob. de Precip: ${dataWeather.daily[0].pop}%</h2>
                <h2>Humedad: ${dataWeather.current.humidity}%</h2>
        </div>`;
        tempMax.innerHTML=Math.round(dataWeather.daily[0].temp.max) + '°';
        tempMin.innerHTML=Math.round(dataWeather.daily[0].temp.min) + '°';
        tempMaxMañana.innerHTML=Math.round(dataWeather.daily[1].temp.max) + '°';
        tempMinMañana.innerHTML=Math.round(dataWeather.daily[1].temp.min) + '°';
        tempMaxPasado.innerHTML=Math.round(dataWeather.daily[2].temp.max) + '°';
        tempMinPasado.innerHTML=Math.round(dataWeather.daily[2].temp.min) + '°';      
        }

boton.addEventListener('click', async function(){
        if(buscador.value==''){
                alert('Ingrese una ciudad');
        }else{
                try{
                        const responseGeolocation = await fetch('http://api.openweathermap.org/geo/1.0/direct?q='+buscador.value+'&limit=5&appid=968e5bc76148533092d6e5d86ad42a0c&lang=es')
                        const dataGeolocation = await responseGeolocation.json();
                        console.log(dataGeolocation);
                        ciudad.innerHTML = dataGeolocation[0].name+', '+ dataGeolocation[0].country;
                        latitud = dataGeolocation[0].lat;
                        longitud = dataGeolocation[0].lon;
                        divBtnProxDias.style.opacity=1;
                        divBtnProxDias.style.cursor = "pointer";
                        divBtnVolver.style.opacity=0;
                        divBtnVolver.style.cursor = "default";
                        ubicacionImg.innerHTML = `<img src="sources/ubicacion.png" class="img-ubicacion"/>                `
                        }catch(error){
                                alert("La ciudad ingresada no existe");
                        }
                const responseWeather= await fetch('http://api.openweathermap.org/data/2.5/onecall?lat=' + latitud + '&lon='+ longitud + '&units=metric&exclude=minutely,hourly&appid=968e5bc76148533092d6e5d86ad42a0c&lang=es')
                dataWeather = await responseWeather.json();
                console.log(dataWeather);
                //Carga fondo de la pagina
                if((dataWeather.current.weather[0].icon).includes("01") || (dataWeather.current.weather[0].icon).includes("02")){
                        body.classList.remove("lluvia");
                        body.classList.remove("nieve");
                        body.classList.remove("nublado");
                        body.classList.add("soleado");
                }else if((dataWeather.current.weather[0].icon).includes("09") || (dataWeather.current.weather[0].icon).includes("10") || (dataWeather.current.weather[0].icon).includes("11")){
                        body.classList.remove("soleado");
                        body.classList.remove("nieve");
                        body.classList.remove("nublado");
                        body.classList.add("lluvia");
                }else if((dataWeather.current.weather[0].icon).includes("13")){
                        body.classList.remove("lluvia");
                        body.classList.remove("soleado");
                        body.classList.remove("nublado");
                        body.classList.add("nieve");
                }else{
                        body.classList.remove("lluvia");
                        body.classList.remove("nieve");
                        body.classList.remove("soleado");
                        body.classList.add("nublado");
                }

                //Carga de los iconos y temperaturas actuales
                hora = new Date((dataWeather.current.dt)*1000).getHours();
                if((dataWeather.current.weather[0].icon).includes("04") || (dataWeather.current.weather[0].icon).includes("03")){
                        estadoActualImg.innerHTML = `<img src='sources/03.png' class="estado-actual-img" /></img>`
                }else if((dataWeather.current.weather[0].icon).includes("09")){
                        estadoActualImg.innerHTML = `<img src='sources/09.png' class="estado-actual-img" /></img>`
                }else if((dataWeather.current.weather[0].icon).includes("50")){
                        estadoActualImg.innerHTML = `<img src='sources/50.png' class="estado-actual-img" /></img>`
                }
                else if(hora>=20 || hora<=6){
                        estadoActualImg.innerHTML = `<img src='sources/${parseInt(dataWeather.current.weather[0].icon)}n.png' class="estado-actual-img" /></img>` 
                }else if(hora<20 || hora>6){
                        estadoActualImg.innerHTML = `<img src='sources/${parseInt(dataWeather.current.weather[0].icon)}d.png' class="estado-actual-img" /></img>`
                }

                //Carga de los iconos y temperatura de los proximos días
                cargarTemperaturas();
        }
})


buscador.addEventListener('keypress', async function(e){
        if (e.key === 'Enter') {
                if(e.key == 'Enter' && buscador.value==''){
                        alert('Ingrese una ciudad');
                }else{
                        try{
                        const responseGeolocation = await fetch('http://api.openweathermap.org/geo/1.0/direct?q='+buscador.value+'&limit=5&appid=968e5bc76148533092d6e5d86ad42a0c&lang=es')
                        const dataGeolocation = await responseGeolocation.json();
                        console.log(dataGeolocation);
                        ciudad.innerHTML = dataGeolocation[0].name+', '+ dataGeolocation[0].country;
                        latitud = dataGeolocation[0].lat;
                        longitud = dataGeolocation[0].lon;
                        divBtnProxDias.style.opacity=1;
                        divBtnProxDias.style.cursor = "pointer";
                        divBtnVolver.style.opacity=0;
                        divBtnVolver.style.cursor = "default";
                        ubicacionImg.innerHTML = `<img src="sources/ubicacion.png" class="img-ubicacion"/>                `
                        }catch(error){
                                alert("La ciudad ingresada no existe");
                        }
                        const responseWeather= await fetch('http://api.openweathermap.org/data/2.5/onecall?lat=' + latitud + '&lon='+ longitud + '&units=metric&exclude=minutely,hourly&appid=968e5bc76148533092d6e5d86ad42a0c&lang=es')
                        dataWeather = await responseWeather.json();
                        console.log(dataWeather);
                        //Carga fondo de la pagina
                        if((dataWeather.current.weather[0].icon).includes("01") || (dataWeather.current.weather[0].icon).includes("02")){
                                body.classList.remove("lluvia");
                                body.classList.remove("nieve");
                                body.classList.remove("nublado");
                                body.classList.add("soleado");
                        }else if((dataWeather.current.weather[0].icon).includes("09") || (dataWeather.current.weather[0].icon).includes("10") || (dataWeather.current.weather[0].icon).includes("11")){
                                body.classList.remove("soleado");
                                body.classList.remove("nieve");
                                body.classList.remove("nublado");
                                body.classList.add("lluvia");
                        }else if((dataWeather.current.weather[0].icon).includes("13")){
                                body.classList.remove("lluvia");
                                body.classList.remove("soleado");
                                body.classList.remove("nublado");
                                body.classList.add("nieve");
                        }else{
                                body.classList.remove("lluvia");
                                body.classList.remove("nieve");
                                body.classList.remove("soleado");
                                body.classList.add("nublado");
                        }

                        //Carga de los iconos y temperaturas actuales
                        hora = new Date((dataWeather.current.dt)*1000).getHours();
                        if((dataWeather.current.weather[0].icon).includes("04") || (dataWeather.current.weather[0].icon).includes("03")){
                                estadoActualImg.innerHTML = `<img src='sources/03.png' class="estado-actual-img" /></img>`
                        }else if((dataWeather.current.weather[0].icon).includes("09")){
                                estadoActualImg.innerHTML = `<img src='sources/09.png' class="estado-actual-img" /></img>`
                        }else if((dataWeather.current.weather[0].icon).includes("50")){
                                estadoActualImg.innerHTML = `<img src='sources/50.png' class="estado-actual-img" /></img>`
                        }
                        else if(hora>=20 || hora<=6){
                                estadoActualImg.innerHTML = `<img src='sources/${parseInt(dataWeather.current.weather[0].icon)}n.png' class="estado-actual-img" /></img>` 
                        }else if(hora<20 || hora>6){
                                estadoActualImg.innerHTML = `<img src='sources/${parseInt(dataWeather.current.weather[0].icon)}d.png' class="estado-actual-img" /></img>`
                        }

                        //Carga de los iconos y temperatura de los proximos días
                        cargarTemperaturas();
                }
        }
})
divBtnProxDias.addEventListener('click', async function(){
        divBtnProxDias.style.opacity=0;
        divBtnProxDias.style.cursor = "default";
        divBtnVolver.style.opacity=1;
        divBtnVolver.style.cursor = "pointer";

        var i=3;
        for(i=3; i<6; i++){
                if((dataWeather.daily[i].weather[0].icon).includes("04") || (dataWeather.daily[i].weather[0].icon).includes("03")){
                        estadoImg[i-3].innerHTML = `<img src="sources/03.png" class='estado-${i-3}-img' /></img>`
                }else if((dataWeather.daily[i].weather[0].icon).includes("09")){
                        estadoImg[i-3].innerHTML = `<img src='sources/09.png' class="estado-${i-3}-img" /></img>`
                }else if (hora>=20 || hora<6){
                        estadoImg[i-3].innerHTML = `<img src='sources/${parseInt(dataWeather.daily[i].weather[0].icon)}n.png' class="estado-${i-3}-img" /></img>` 
                }else if (hora<20 || hora>6){
                        estadoImg[i-3].innerHTML = `<img src='sources/${parseInt(dataWeather.daily[i].weather[0].icon)}d.png' class="estado-${i-3}-img" /></img>` 
                }
        }
        fecha= new Date((dataWeather.current.dt)*1000).getDay();
        diaHoy.innerHTML=`<div>${getDia((fecha+3))}</div>`;
        diaMañana.innerHTML=`<div>${getDia(fecha+4)}</div>`;
        diaPasado.innerHTML=`<div>${getDia(fecha+5)}</div>`;
        tempMax.innerHTML=Math.round(dataWeather.daily[3].temp.max) + '°';
        tempMin.innerHTML=Math.round(dataWeather.daily[3].temp.min) + '°';
        tempMaxMañana.innerHTML=Math.round(dataWeather.daily[4].temp.max) + '°';
        tempMinMañana.innerHTML=Math.round(dataWeather.daily[4].temp.min) + '°';
        tempMaxPasado.innerHTML=Math.round(dataWeather.daily[5].temp.max) + '°';
        tempMinPasado.innerHTML=Math.round(dataWeather.daily[5].temp.min) + '°';    
})

divBtnVolver.addEventListener('click', async function(){
        divBtnVolver.style.opacity=0;
        divBtnVolver.style.cursor = "default";
        divBtnProxDias.style.opacity=1;
        divBtnProxDias.style.cursor = "pointer"
        cargarTemperaturas();
        
})
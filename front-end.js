const tilesprovider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
myMap = L.map('mymap').setView([11.01756,-74.85698], 13);
myMapTR = L.map('mymapTR').setView([11.01756,-74.85698], 13);
document.getElementById("mymap").style.display = "none";
i = 1;
j = 1;


marker1 = L.marker([11.01756,-74.85698])
marker2 = L.marker([11.01756,-74.85698])

puntos= L.layerGroup([marker1]).addTo(myMap);
puntosTwo=L.layerGroup([marker2]).addTo(myMap);

const slider = document.getElementById("slider1");
const slider2= document.getElementById("slider2");

slider.style.display = "none";

slider2.style.display = "none";

var modo = 0; //TIEMPO REAL


//Leyenda Vehículo 1 
const vehiculo1 = L.icon({
    iconUrl: 'truck.png',	
    iconAnchor: [15,15]			
})			

//Leyenda Vehículo 2
const vehiculo2 = L.icon({
    iconUrl: 'truck2.png',	
    iconAnchor: [15,15]			
})				

//Inicio Leyenda
const inicio1 = L.icon({
    iconUrl: 'start24.png',	
    iconAnchor: [16,27]			
})	

//Final Leyenda
const final = L.icon({
    iconUrl: 'finish32.png',	
    iconAnchor: [16,32]			
})

//Marker vehículo 2 tiempo real
const markerred = L.icon({
    iconUrl: 'ubicacion.png',	
    iconAnchor: [15,15]			
})


/* //Inicio2 Leyenda
const inicio2 = L.icon({
    iconUrl: 'start2.png',	
    iconAnchor: [16,27]			
})	

//Final2 Leyenda
const final2 = L.icon({
    iconUrl: 'end2.png',	
    iconAnchor: [16,32]			
}) */
marker=L.marker([0,0]);
marker4=L.marker([0,0]),{icon: markerred}
truck1 = L.marker([0,0],{icon: vehiculo1})
truck2 = L.marker([0,0],{icon: vehiculo2})
start1 = L.marker([0,0],{icon: inicio1})
start2 = L.marker([0,0],{icon: inicio1})
end1 = L.marker([0,0],{icon: final})
end2 = L.marker([0,0],{icon: final})



//const slider = document.getElementById("slider2");

L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMap)

L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMapTR)



hist = [];
polyline =L.polyline(hist, {color: 'red'}).addTo(myMap); // myMap=mapa de historicos
polylineTwo =L.polyline(hist, {color: 'blue'}).addTo(myMap);


const form = document.getElementById('form')





form.addEventListener('submit', (e) => {
    

    
    e.preventDefault();

    puntos.clearLayers();
    puntosTwo.clearLayers();

    
    
    document.getElementById("mymap").style.display = "block";

    document.getElementById("mymapTR").style.display = "none";

    inicio = e.target.elements.date_timepicker_start.value;
    fin = e.target.elements.date_timepicker_end.value;
    /* console.log("Inicio: "+inicio+",fin: "+fin) */
    vehiculo= e.target.elements.carro.value;
    console.log("Este es el vehiculo numero: "+ vehiculo); //------------------------CAMBIOSSS------------------------------//
    console.log("Fecha inicial: "+ inicio); 
    console.log("Fecha final: "+ fin); 
    modo=1;

    var valoresEntrada = [];
    valoresEntrada.push(inicio);
    valoresEntrada.push(fin);
    valoresEntrada.push(vehiculo);
    
    socket.emit("valoresEntrada", valoresEntrada);


    socket.on('historia', function (output) {

        hist =[];
        histTwo=[];
        tiempo=[];
        sensorArduino=[];
        tiempo2=[];
        sensorArduino2=[];
        var coor =[];
        
        console.log("Los datos obtenidos del query tienen una long de: "+output.length);
        console.log(output);

        if (output.length !=0){

            for (var i of output) {
                /* console.log("variable i.v: "+i.vehiculo) */
                if(i.vehiculo==1){

                    coor =[i.latitud,i.longitud]
                    var tiempoData = new Date(i.stamptime).toISOString().replace(/T/,' ').replace(/\..+/,' ')
                    tiempo.push(tiempoData);
                    sensorArduino.push(i.sensor);
                    hist.push(coor);
                 
                } else {
                    
                    coorTwo =[i.latitud,i.longitud]
                    var tiempoData1 = new Date(i.stamptime).toISOString().replace(/T/,' ').replace(/\..+/,' ')
                    tiempo2.push(tiempoData1);
                    sensorArduino2.push(i.sensor);
                    histTwo.push(coorTwo)
                    
                }
                    
            }
        


/* 
            start1.setLatLng(hist[0]).update();
            start2.setLatLng(histTwo[0]).update();
            end1.setLatLng(hist[hist.length-1]).update();
            end2.setLatLng(histTwo[histTwo.length-1]).update();
            
            slider.value = `${0}`; //START VALUE
                
            slider.min = `${0}`; //MIN VALUE
            slider.max = `${hist.length-1}`;  //MAX VALUE

            slider2.value = `${0}`; //START VALUE
                
            slider2.min = `${0}`; //MIN VALUE
            slider2.max = `${histTwo.length-1}`;  //MAX VALUE
            
            truck1.setLatLng(hist[slider.value]).update();
            truck2.setLatLng(histTwo[slider2.value]).update();

            puntos.addLayer(truck1);
            puntos.addLayer(start1);
            puntos.addLayer(end1);

            puntosTwo.addLayer(truck2);
            puntosTwo.addLayer(start2);
            puntosTwo.addLayer(end2);
            
            
            
 */
            console.log("hist 2: "+ histTwo.length)
            console.log("hist 1: "+ hist.length)
            console.log(vehiculo);
            if(vehiculo==1){


               
                    console.log("im in");
                    historicos1();
                    if(hist.length==0){
                        console.log("No hay recorridos dentro de las fechas ingresadas dentro del vehiculo 1")
                        casonulo();
                    }else{
                        historicos1();

                    }
                   
            }else{

                if(vehiculo==2){

                        if(histTwo.length==0){
                            console.log("No hay recorridos dentro de las fechas ingresadas dentro del vehiculo 2")
                            casonulo();
                        }else{
                            historicos2();

                        }
                }else{
                

                        if(histTwo.length==0 && hist.length==0){
                            console.log("No hay recorridos dentro de las fechas ingresadas para ningun vehiculo")
                            casonulo();
                        }else{
                            if(histTwo.length==0){
                                console.log("No hay recorridos dentro de las fechas ingresadas dentro del vehiculo 2")
                                historicos1();
                            }else{
                                if(hist.length==0){
                                    console.log("No hay recorridos dentro de las fechas ingresadas dentro del vehiculo 1")
                                    historicos2();
                                }else{

                                    ambos();
                                }
                            }
                            
                            

                        }
                }

            }



           /*  if (hist.length != 0 && histTwo.length != 0 ){ 
                
                
                polyline.setLatLngs(hist);
                polylineTwo.setLatLngs(histTwo);
                if(hist.length!=0){
                    myMap.setView(polyline.getCenter())
                }else{
                    myMap.setView(polylineTwo.getCenter())
                }
                
                
                
            } else {
                if (hist.length != 0){

                    alert("No hay recorridos dentro de las fechas ingresadas dentro del vehiculo 2")
                    polyline.setLatLngs(hist);
                    polylineTwo.setLatLngs([]);
                    myMap.setView(polyline.getCenter())

                }else{
                    alert("No hay recorridos dentro de las fechas ingresadas dentro del vehiculo 1")
                    polyline.setLatLngs([]);
                    polylineTwo.setLatLngs(histTwo);
                    myMap.setView(polylineTwo.getCenter())
                }
            } */


            slider.addEventListener("input", sliderUpdate);
            slider2.addEventListener("input", sliderUpdate2);
        }else{

            casonulo();
        }
            
    });




    function historicos1(){

        slider.style.display = "block";

        slider2.style.display = "none";


        start1.setLatLng(hist[0]).update();
        end1.setLatLng(hist[hist.length-1]).update();
        slider.value = `${0}`; //START VALUE
                
        slider.min = `${0}`; //MIN VALUE
        slider.max = `${hist.length-1}`;  //MAX VALUE
        truck1.setLatLng(hist[slider.value]).update();

        puntos.addLayer(truck1);
        puntos.addLayer(start1);
        puntos.addLayer(end1);
        console.log("hist 1: "+ hist.length)

        polyline.setLatLngs(hist);
        polylineTwo.setLatLngs([]);


        myMap.removeLayer(puntosTwo);
        myMap.addLayer(polyline);
        myMap.removeLayer(polylineTwo);
        puntos.addTo(myMap)
        myMap.setView(polyline.getCenter())

    }

    function historicos2(){

        slider.style.display = "none";

        slider2.style.display = "block";

        start2.setLatLng(histTwo[0]).update();
        end2.setLatLng(histTwo[histTwo.length-1]).update();

        slider2.value = `${0}`; //START VALUE
                
        slider2.min = `${0}`; //MIN VALUE
        slider2.max = `${histTwo.length-1}`;  //MAX VALUE

        truck2.setLatLng(histTwo[slider2.value]).update();

        puntosTwo.addLayer(truck2);
        puntosTwo.addLayer(start2);
        puntosTwo.addLayer(end2);
        
        console.log("hist 2: "+ histTwo.length)


        polyline.setLatLngs([]);
        polylineTwo.setLatLngs(histTwo);


        myMap.removeLayer(puntos);
        myMap.addLayer(polylineTwo);
        myMap.removeLayer(polyline);
        puntosTwo.addTo(myMap)
        myMap.setView(polylineTwo.getCenter())
       

    }


    function ambos(){

        slider.style.display = "block";

        slider2.style.display = "block";

        puntos.addLayer(truck1);
        puntos.addLayer(start1);
        puntos.addLayer(end1);

        puntosTwo.addLayer(truck2);
        puntosTwo.addLayer(start2);
        puntosTwo.addLayer(end2);

        polyline.setLatLngs(hist);
        polylineTwo.setLatLngs(histTwo);

        myMap.addLayer(polyline);
        myMap.addLayer(polylineTwo);
        myMap.setView(polyline.getCenter())

        puntos.addTo(myMap)
        puntosTwo.addTo(myMap)
    }

        //------------------------CAMBIOSSS------------------------------//
    /* socket.on('carrito', function (identificador){
            if(identificador==1){

                slider.style.display = "block";

                 slider2.style.display = "none";
                console.log('Es el vehiculo uno');
                myMap.removeLayer(puntosTwo);
                myMap.addLayer(polyline);
                myMap.removeLayer(polylineTwo);
                 myMap.setView(polyline.getCenter())  
                 polylineTwo.setStyle(opacity=0.0); 
                puntos.addTo(myMap) 
        
            }
            if(identificador==2){
                slider.style.display = "none";

                slider2.style.display = "block";
                myMap.removeLayer(puntos);
                myMap.addLayer(polylineTwo);
                myMap.removeLayer(polyline);
               myMap.setView(polylineTwo.getCenter()) 
                console.log('Es el vehiculo dos');
                puntosTwo.addTo(myMap)
            }
            if(identificador==3){
                slider.style.display = "block";

                slider2.style.display = "block";
                myMap.addLayer(polyline);
                myMap.addLayer(polylineTwo);
                console.log('Es el vehiculo tres');
                puntos.addTo(myMap)
                puntosTwo.addTo(myMap)
            }     
                
    });  */

    

});

function sliderUpdate(){
    truck1.setLatLng(hist[slider.value]).update();
    $("#caja-stamptime").text(tiempo[slider.value]);
    $("#caja-sensor").text(sensorArduino[slider.value]);

}
function sliderUpdate2(){
    truck2.setLatLng(histTwo[slider2.value]).update();
    $("#caja-stamptime").text(tiempo2[slider2.value]);
    $("#caja-sensor").text(sensorArduino2[slider2.value]);

}


function tiempoReal(){
    modo=0;
    document.getElementById("mymapTR").style.display = "block";
    document.getElementById("mymap").style.display = "none";
    
}
function readFile(){
    var cArray = [];
    var cArray1 = [];
    socket.on('tiempo', function (output) {
        
        console.log('siiuuu');
        
        var coor = [lat,lon];
        for(var j of output){
            var lat = j.latitud;
            var lon = j.longitud;
            var tiempoData = new Date(j.stamptime).toISOString().replace(/T/,' ').replace(/\..+/,' ')
            var sT = tiempoData;
            var sen = j.sensor;
            var veh = j.vehiculo;
        }
        

        if (modo==0){
            $("#caja-latitude").text(lat);
            $("#caja-longitude").text(lon);
            $("#caja-stamptime").text(sT);
            $("#caja-sensor").text(sen);
        }

        if(veh==1){
            var coorsgt =[lat, lon];
            marker.setLatLng([lat, lon]).update();
            marker.addTo(myMapTR);
            myMapTR.setView([lat, lon])
            if (coor[0]!=coorsgt[0] && coor[1]!=coorsgt[1]  ) {
                cArray.push(coorsgt)
                line(cArray);                         
            }
        }else{
            var coorsgt1 =[lat, lon];
            marker4.setLatLng([lat, lon]).update();
            marker4.addTo(myMapTR);
            myMapTR.setView([lat, lon])
            if (coor[0]!=coorsgt1[0] && coor[1]!=coorsgt1[1]  ) {
                cArray1.push(coorsgt1)
                line1(cArray1);                         
            }
        }
        
            
        
        function line(cArray){
            var polyline =L.polyline(cArray, {color: 'red'}).addTo(myMapTR);
        }
        function line1(cArray1){
            var polyline1 =L.polyline(cArray1, {color: 'blue'}).addTo(myMapTR);
        } 


    });
    
};

function casonulo (){

    polyline.setLatLngs([]);
    polylineTwo.setLatLngs([]); 
    slider.style.display = "none";
    slider2.style.display = "none";
    console.log("Llegó a caso nulo")
    alert("No hay recorridos dentro de las fechas ingresadas")
    e.stopImmediatePropagation();
}

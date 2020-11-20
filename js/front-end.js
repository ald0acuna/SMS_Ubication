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

var enable1 =0; //Habilitadores de centralización TR
var enable2=0;

var lat1=0; //Inicialización de la centralización de los mapas en TR
var lon1=0;

var lat2=0;//Inicialización de la centralización de los mapas en TR
var lon2=0;

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

marker=L.marker([0,0]); // Vehiculo 2 TR
marker4=L.marker([0,0]); //Vehiculo 1 TR
truck1 = L.marker([0,0],{icon: vehiculo1})
truck2 = L.marker([0,0],{icon: vehiculo2})
start1 = L.marker([0,0],{icon: inicio1})
start2 = L.marker([0,0],{icon: inicio1})
end1 = L.marker([0,0],{icon: final})
end2 = L.marker([0,0],{icon: final})



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

var polyline1 =L.polyline(hist, {color: 'red'}).addTo(myMapTR); // myMapTR=mapa de tiempo real
var polyline2 =L.polyline(hist, {color: 'blue'}).addTo(myMapTR);

const form = document.getElementById('form')





form.addEventListener('submit', (e) => {
    

    
    e.preventDefault();

    puntos.clearLayers();
    puntosTwo.clearLayers();

    document.getElementById("labelsen").innerHTML = "Sensor:";
    document.getElementById("caja-sensor").style.display = "block"
    document.getElementById("labelsen").style.display = "block"
    document.getElementById("mymap").style.display = "block";
    document.getElementById("caja-sensor-two").style.display = "none"
    document.getElementById("labelsen2").style.display = "none"

    document.getElementById("slide-one").style.display = "block";
    document.getElementById("slide-two").style.display = "block";

    document.getElementById("mymapTR").style.display = "none";

    inicio = e.target.elements.date_timepicker_start.value;
    fin = e.target.elements.date_timepicker_end.value;
  
    vehiculo= e.target.elements.carro.value;
    console.log("Este es el vehiculo numero: "+ vehiculo); 
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

        start1.setLatLng(hist[0]).update();
        end1.setLatLng(hist[hist.length-1]).update();
        slider.value = `${0}`; //START VALUE
                
        slider.min = `${0}`; //MIN VALUE
        slider.max = `${hist.length-1}`;  //MAX VALUE
        truck1.setLatLng(hist[slider.value]).update();

        slider2.style.display = "block";

        start2.setLatLng(histTwo[0]).update();
        end2.setLatLng(histTwo[histTwo.length-1]).update();

        slider2.value = `${0}`; //START VALUE
                
        slider2.min = `${0}`; //MIN VALUE
        slider2.max = `${histTwo.length-1}`;  //MAX VALUE

        truck2.setLatLng(histTwo[slider2.value]).update();


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
    vehicle= document.getElementById('carro').value;
    console.log(vehicle);
    modo=0;
    document.getElementById("labelsen").innerHTML = "Sensor1:";
    if(vehicle==1){

        polyline1.addTo(myMapTR); 
        polyline2.remove(myMapTR); 
        marker4.addTo(myMapTR);
        marker.remove(myMapTR);
        document.getElementById("caja-sensor").style.display = "block"
        document.getElementById("labelsen").style.display = "block"
        document.getElementById("caja-sensor-two").style.display = "none"
        document.getElementById("labelsen2").style.display = "none"

        if (enable1==1){

             myMapTR.setView([lat1, lon1]);

        }
        
    }else{

        if(vehicle==2){

            polyline2.addTo(myMapTR); 
            polyline1.remove(myMapTR); 
            marker.addTo(myMapTR);
            marker4.remove(myMapTR);
            document.getElementById("caja-sensor").style.display = "none"
            document.getElementById("labelsen").style.display = "none"
            document.getElementById("caja-sensor-two").style.display = "block"
            document.getElementById("labelsen2").style.display = "block"

            if (enable2==1){

                myMapTR.setView([lat2, lon2]);
            }

        }else{

            polyline1.addTo(myMapTR); 
            polyline2.addTo(myMapTR); 
            marker.addTo(myMapTR);
            marker4.addTo(myMapTR);
            document.getElementById("caja-sensor").style.display = "block"
            document.getElementById("labelsen").style.display = "block"
            document.getElementById("caja-sensor-two").style.display = "block"
            document.getElementById("labelsen2").style.display = "block"

        }
    }

    document.getElementById("mymapTR").style.display = "block";
    document.getElementById("mymap").style.display = "none";
    document.getElementById("slide-one").style.display = "none";
    document.getElementById("slide-two").style.display = "none";

    
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
            if(veh==1){
                $("#caja-sensor").text(sen);
                lat1=j.latitud;
                lon1=j.longitud;
            } else {
                lat2=j.latitud;
                lon2=j.longitud;
                $("#caja-sensor-two").text(sen);
            }
            
        }

        if(veh==1){
            enable1= 1;
            var coorsgt =[lat, lon];
            marker4.setLatLng([lat, lon]).update();
           
            if (coor[0]!=coorsgt[0] && coor[1]!=coorsgt[1]  ) {
                cArray.push(coorsgt)
                line(cArray);                         
            }
        }else{
            enable2= 1;
            var coorsgt1 =[lat, lon];
            marker.setLatLng([lat, lon]).update();
        
            if (coor[0]!=coorsgt1[0] && coor[1]!=coorsgt1[1]  ) {
                cArray1.push(coorsgt1)
                line1(cArray1);                         
            }
        }
        
            
        
        function line(cArray){
            polyline1.setLatLngs(cArray);
           
        }
        function line1(cArray1){
            polyline2.setLatLngs(cArray1);
            console.log(polyline2.length);
            console.log(polyline1.length);
          
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

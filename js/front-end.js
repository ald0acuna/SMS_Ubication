const tilesprovider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var myMap = L.map('mymap').setView([11.01756,-74.85698], 13);
var myMapTR = L.map('mymapTR').setView([11.01756,-74.85698], 13);
document.getElementById("mymap").style.display = "none";
var i = 1;

L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMap)

L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMapTR)

var mymarker = L.icon({
    iconUrl: 'ubicacion.png',
    iconSize: [60,60],
    iconAnchor: [30,60]

})

var hist = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
];
var polyline =L.polyline(hist, {color: 'red'}).addTo(myMap); // myMap=mapa de historicos
function historics(){

    document.getElementById("mymap").style.display = "block";

	document.getElementById("mymapTR").style.display = "none";
    
    socket.on('historia', function (output) {
    hist =[];

    var coor =[];
    
    for (var i of output) {
        console.log("variable i: "+i);
         coor =[i.latitud,i.longitud]
         hist.push(coor)
         markerCircle = L.circleMarker([i.latitud,i.longitud],{radius:2, color:'deeppink'}).addTo(myMap)
         markerCircle.bindTooltip("</h4>tiempo: "+ i.tiempo)
         
    }
    console.log(hist);
    polyline.setLatLngs(hist);
    myMap.setView(polyline.getCenter())
    //var polyline =L.polyline(hist, {color: 'red'}).addTo(myMap);
    });
      
}
function tiempoReal(){

    document.getElementById("mymapTR").style.display = "block";
    document.getElementById("mymap").style.display = "none";
    
}
function readFile(){

    jQuery.get('../coordenadas.txt', function(txt){


        lat=  txt.toString('utf8').split("/")[0];
        $("#caja-latitude").text(lat);
        lon =txt.toString('utf8').split("/")[1];
        $("#caja-longitude").text(lon);
        sT = txt.toString('utf8').split("/")[2];
        $("#caja-stamptime").text(sT);
        marker = L.marker([lat,lon]).addTo(myMapTR)  //myMapTR= mapa en tiempo real
        
    })
    var cArray = [];
    setInterval(function(){ 
        var coor = [lat,lon];
        jQuery.get('../coordenadas.txt', function(txt){
            lat=  txt.toString('utf8').split("/")[0];
            $("#caja-latitude").text(lat);
            lon =txt.toString('utf8').split("/")[1];
            $("#caja-longitude").text(lon);
            sT = txt.toString('utf8').split("/")[2];  //CAMBIAR STAMPTIME AQUI O EN EL SERVIDOR
            $("#caja-stamptime").text(sT);
            var coorsgt =[lat, lon];
            marker.setLatLng([lat, lon]).update();
            myMapTR.setView([lat, lon])
            if (coor[0]!=coorsgt[0] && coor[1]!=coorsgt[1]  ) {
                cArray.push(coorsgt)
                line(cArray); 
                
            }
        })

    },1000);
    function line(cArray){
        var polyline =L.polyline(cArray, {color: 'red'}).addTo(myMapTR);
    }
}; 
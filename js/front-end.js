
const tilesprovider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var myMap = L.map('mymap').setView([11.01756,-74.85698], 13);
/* var myMapH = L.map('mymap').setView([11.01756,-74.85698], 13); */

var i = 1;

L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMap)

/* L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMapH) */

var mymarker = L.icon({
    iconUrl: 'ubicacion.png',
    iconSize: [60,60],
    iconAnchor: [30,60]

})

function historics(){
    
    socket.on('historia', function (output) {
    var hist =[];

    var coor =[];
    
    for (var i of output) {
        
         coor =[i.latitud,i.longitud]
         hist.push(coor)
         
    }
    console.log(hist);
    var polyline =L.polyline(hist, {color: 'red'}).addTo(myMap);
    });
      
}

function readFile(){
    jQuery.get('../coordenadas.txt', function(txt){

        

        lat=  txt.toString('utf8').split("/")[0];
        $("#caja-latitude").text(lat);
        lon =txt.toString('utf8').split("/")[1];
        $("#caja-longitude").text(lon);
        sT = txt.toString('utf8').split("/")[2];
        $("#caja-stamptime").text(sT);
        marker = L.marker([lat,lon]).addTo(myMap)
        
    })
    var cArray = [];
    setInterval(function(){ 
        var coor = [lat,lon];
        jQuery.get('../coordenadas.txt', function(txt){
            lat=  txt.toString('utf8').split("/")[0];
            $("#caja-latitude").text(lat);
            lon =txt.toString('utf8').split("/")[1];
            $("#caja-longitude").text(lon);
            sT = txt.toString('utf8').split("/")[2];
            $("#caja-stamptime").text(sT);
            var coorsgt =[lat, lon];
            marker.setLatLng([lat, lon]).update();
            if (coor[0]!=coorsgt[0] && coor[1]!=coorsgt[1]  ) {
                cArray.push(coorsgt)
                line(cArray); 
                
            }
        })


      
           

    },1000);
    function line(cArray){
        var polyline =L.polyline(cArray, {color: 'red'}).addTo(myMap);
    }
}; 


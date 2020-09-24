/* const jq =req('j') */

const tilesprovider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var myMap = L.map('mymap').setView([11.01756,-74.85698], 13);

var i = 1;

L.tileLayer(tilesprovider,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
    

}).addTo(myMap)

var mymarker = L.icon({
    iconUrl: 'ubicacion.png',
    iconSize: [60,60],
    iconAnchor: [30,60]

})



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
        jQuery.get('../coordenadas.txt', function(txt){
            lat=  txt.toString('utf8').split("/")[0];
            $("#caja-latitude").text(lat);
            lon =txt.toString('utf8').split("/")[1];
            $("#caja-longitude").text(lon);
            sT = txt.toString('utf8').split("/")[2];
            $("#caja-stamptime").text(sT);
        
            marker.setLatLng([lat, lon]).update();
            var coor = [lat,lon];
            cArray.push(coor)
            line(cArray);
        })
        

    },1000);
    function line(cArray){
        var polyline =L.polyline(cArray, {color: 'red'}).addTo(myMap);
    }
};


const express = require('express');
const { fstat } = require('fs');
var net =require('net');

const httpserver = express();
const path = require('path');
var latitud ='soplao';
var longitud ='chavez';
var stamptime ='soplao';
const fs= require('fs');

//Settings
httpserver.set('port', 10000);



//Rutas
httpserver.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

httpserver.get('/css/style.css', (req,res) => {
    res.sendFile(__dirname + '/css/style.css');
});

httpserver.get('/js/front-end.js', (req,res) => {
    res.sendFile(__dirname + '/js/front-end.js');
});

httpserver.get('/js/mapa.js', (req,res) => {
    res.sendFile(__dirname + '/js/mapa.js');
});

httpserver.get('/js/ubicacion.png', (req,res) => {
    res.sendFile(__dirname + '/js/ubicacion.png');
});

httpserver.get('/coordenadas.txt', (req,res) => {
    res.sendFile(__dirname + '/coordenadas.txt');
});





var port = (process.argv[2] || 5000);

var server = net.createServer(function(socket){
    console.log('Truck Tracer\n');

    socket.on('data', function(data){

        
        var latitud= data.toString('utf8').split("/")[0];
        latitud=  latitud;
        var longitud= data.toString('utf8').split("/")[1];
        longitud=  longitud;
        var stamptime= data.toString('utf8').split("/")[2];
        stamptime= stamptime;

        var gpsinfo = latitud+"/"+longitud+"/"+stamptime;
        
        
        fs.writeFile('coordenadas.txt', gpsinfo, function(error){

            if(error){
                return console.log(error);
            }
            console.log("File created");
            console.log(gpsinfo);
        })
        
       

     
        
    });
    
  
});

server.listen(port);


//Listening the server
httpserver.listen(httpserver.get('port'), () => {
    console.log('Server on port', httpserver.get('port'));
});



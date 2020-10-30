const express = require('express');
const { fstat } = require('fs');
var socketio = require('socket.io');


var dgram =require('dgram');
const mysql = require('mysql');
const httpserver = express();
const udpserver = dgram.createSocket('udp4');
var server = require('http').Server(httpserver);       
var io = socketio.listen(server); 

const path = require('path');

const fs= require('fs');
const { Console } = require('console');

//Settings
httpserver.set('port', 10000);

//Conexión a la base de datos
const database = mysql.createConnection({
    host: 'truckdatabase.cdbskvzb6zoi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'trucktracer',
    database: 'gpsdata'
});




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

httpserver.get('/js/jquery.js', (req,res) => {
    
    res.sendFile(__dirname + '/js/jquery.js');
});

httpserver.get('/js/jquery.datetimepicker.min.css', (req,res) => {
    res.sendFile(__dirname + '/js/jquery.datetimepicker.min.css');
    
});

httpserver.get('/js/jquery.datetimepicker.full.js', (req,res) => {
    res.sendFile(__dirname + '/js/jquery.datetimepicker.full.js');
   
});

httpserver.get('/js/jquery-3.5.1.min.js', (req,res) => {
    res.sendFile(__dirname + '/js/jquery-3.5.1.min.js');
   
});

httpserver.get('/js/ubicacion.png', (req,res) => {
    res.sendFile(__dirname + '/js/ubicacion.png');
});

httpserver.get('/coordenadas.txt', (req,res) => {
    res.sendFile(__dirname + '/coordenadas.txt');
});

httpserver.get('/archivos/jquery.js', (req,res) => {
    res.sendFile(__dirname + '/archivos/jquery.js');
});
httpserver.get('/archivos/jquery.datetimepicker.css', (req,res) => {
    res.sendFile(__dirname + '/archivos/jquery.datetimepicker.css');
});

httpserver.get('/archivos/build/jquery.datetimepicker.full.min.js', (req,res) => {
    res.sendFile(__dirname + '/archivos/build/jquery.datetimepicker.full.min.js');
});



var port = (process.argv[2] || 5000);


udpserver.on('error', (err)=>{

console.log('server error:\n${err.stack}')
udpserver.close();
})
 
io.on('connection', socket => {

    socket.on('valoresEntrada', msg => {
        //console.log(msg)

        var fi = msg[0];
        var hora = msg[1];
        var minuto = msg[2];
        var ff = msg[3];
        var horaTF = msg[4];
        var minutoTF = msg[5];
        var id = msg[6];

        if (hora  <10 ) {
            hora = "0" + hora;
            console.log(hora)
        };
    
        if (minuto< 10) {
            minuto = "0" + minuto
            console.log(minuto)
        };
    
        if (horaTF  <10 ) {
            horaTF = "0" + horaTF;
            console.log(horaTF)
        } ;
    
        if (minutoTF< 10) {
            minutoTF = "0" + minutoTF
            console.log(minutoTF)
        };
    
        var yeari =fi.split("/")[0]; //año
        var monthi =fi.split("/")[1]; //mes
        var dayi =fi.split("/")[2]; //dia
    
    
        fi =dayi+"/"+monthi+"/"+yeari+" "+hora+":"+minuto+":00" //
        console.log(fi);
    
        //Fecha final
    
        var yearf =ff.split("/")[0]; //año
        var monthf =ff.split("/")[1]; //mes
        var dayf =ff.split("/")[2]; //dia
    
    
    
        ff = dayf+"/"+monthf+"/"+yearf+" "+horaTF+":"+minutoTF+":00"
        console.log(ff);
    
        var histlon = [];
        var histlat=[];
        var hist=[]
        
        var rd = `SELECT longitud, latitud, tiempo, vehiculo FROM gpsdata WHERE (tiempo BETWEEN '${fi}' AND '${ff}') AND (vehiculo='${id}')`;
        //console.log(rd);
        database.query(rd, function (err, result) {
            
            if (err) throw err;

            socket.emit('historia', result); 
        });

    });

});



udpserver.on('message', function(msg){  // no recibe si cambio el nombre de 'message' y msg
        
    console.log('Truck Tracer for udp\n');

    console.log(msg.toString('utf8'));
                
    var latitud= msg.toString('utf8').split("/")[0];
    latitud=  latitud;
    var longitud= msg.toString('utf8').split("/")[1];
    longitud=  longitud;
    var stamptime= msg.toString('utf8').split("/")[2];

    var vehiculo = msg.toString('utf8').split("/")[3];
        
    var uppertime=stamptime.split(" ")[0]; //YYYY-MM-DD
    var downtime=stamptime.split(" ")[1];  //HH:MM:SS

    var year =uppertime.split("-")[0]; //año
    var month =uppertime.split("-")[1]; //mes
    var day =uppertime.split("-")[2]; //dia
       
    //MODIFICAR LECTURA DEL ULTIMO DATO------------------------------------------------------------------------------

    var timeformat= day+"/"+month+"/"+year+" "+downtime;

        

    var gpsinfo = latitud+"/"+longitud+"/"+timeformat+"/"+vehiculo;   

    fs.writeFile('coordenadas.txt', gpsinfo, function(error){


        if(error){
            return console.log(error);
        }
        console.log("File created");
        console.log(gpsinfo);
    })


    truckdata = {latitud: latitud, longitud: longitud, tiempo: timeformat, vehiculo: vehiculo }

    /* let sql = 'INSERT INTO gpsdata SET ?';

    let query = database.query(sql,truckdata,(err,result) =>{
        if(err) throw err;
    }) */

    //console.log(stamptime,timeformat);      

});


udpserver.on('listening', () => {
    
    const address = udpserver.address();
    console.log(`udpserver on port ${address.port}`);
});

database.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to DB');

});

udpserver.bind(port);

server.listen(10000, () => {
    console.log("Server on port 10000");
});

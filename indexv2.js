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

httpserver.get('/ubicacion.png', (req,res) => {
    res.sendFile(__dirname + '/ubicacion.png');
});

httpserver.get('/coordenadas.txt', (req,res) => {
    res.sendFile(__dirname + '/coordenadas.txt');
});

httpserver.get('/finish32.png', (req,res) => {
    res.sendFile(__dirname + '/finish32.png');
});

httpserver.get('/end2.png', (req,res) => {
    res.sendFile(__dirname + '/end2.png');
});

httpserver.get('/start24.png', (req,res) => {
    res.sendFile(__dirname + '/start24.png');
});
httpserver.get('/start2.png', (req,res) => {
    res.sendFile(__dirname + '/start2.png');
});
httpserver.get('/truck.png', (req,res) => {
    res.sendFile(__dirname + '/truck.png');
});
httpserver.get('/truck2.png', (req,res) => {
    res.sendFile(__dirname + '/truck2.png');
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
        
        var fi = msg[0];
        var ff = msg[1];
        var identificador = msg[2]; 
     
        var fi_up= fi.split(" ")[0];
        var fi_down= fi.split(" ")[1];
        var yeari =fi_up.split("/")[0]; //año
        var monthi =fi_up.split("/")[1]; //mes
        var dayi =fi_up.split("/")[2]; //dia

        var hi = fi_down.split(":")[0];
        var mi = fi_down.split(":")[1];
        fiDate = yeari+'-'+monthi+'-'+dayi+' '+hi+':'+mi+':00';
        
        var ff_up= ff.split(" ")[0];
        var ff_down= ff.split(" ")[1];
        var yearf =ff_up.split("/")[0]; //año
        var monthf =ff_up.split("/")[1]; //mes
        var dayf =ff_up.split("/")[2]; //dia

        var hf = ff_down.split(":")[0];
        var mf = ff_down.split(":")[1];

        ffDate = yearf+'-'+monthf+'-'+dayf+' '+hf+':'+mf+':00';
      
        var histlon = [];
        var histlat=[];
        var hist=[];


        console.log("Fecha inicial llegada al back end: "+fiDate);
        console.log("Fecha final llegada al back end: "+ffDate);


        var rd = `SELECT longitud, latitud, stamptime, vehiculo, sensor FROM muestreo WHERE (stamptime BETWEEN '${fiDate}' AND '${ffDate}') ORDER BY stamptime`;
        console.log(rd);
        database.query(rd, function (err, result) {
            
            if (err) throw err;
           
            socket.emit('historia', result); 
        });

        socket.emit('carrito',identificador); 

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
        var sensor = msg.toString('utf8').split("/")[4];
        var uppertime=stamptime.split(" ")[0]; //YYYY-MM-DD
        var downtime=stamptime.split(" ")[1];  //HH:MM:SS

        var year =uppertime.split("-")[0]; //año
        var month =uppertime.split("-")[1]; //mes
        var day =uppertime.split("-")[2]; //dia
        
        
        var timeformat= year+"-"+month+"-"+day+" "+downtime;


        
        truckdata = {latitud: latitud, longitud: longitud, stamptime : timeformat, vehiculo: vehiculo, sensor:sensor }

        let sql = 'INSERT INTO muestreo SET ?';

        let query = database.query(sql,truckdata,(err,result) =>{
            if(err) throw err;
        }) 
    
        console.log("time format: "+timeformat); 
        
        var tr = `SELECT latitud, longitud, stamptime, vehiculo, sensor FROM gpsdata.muestreo WHERE id=(SELECT MAX(id) FROM gpsdata.muestreo)`;
        database.query(tr, function (err, result) {
                
            if (err) throw err;
        
            socket.emit('tiempo', result);
            console.log("result: "+result) 
        });

    });



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

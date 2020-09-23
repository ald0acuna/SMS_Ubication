const express = require('express');
const { fstat } = require('fs');

var dgram =require('dgram');
const mysql = require('mysql');
const httpserver = express();
const path = require('path');


const fs= require('fs');

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

httpserver.get('/js/mapa.js', (req,res) => {
    res.sendFile(__dirname + '/js/mapa.js');
});

httpserver.get('/js/ubicacion.png', (req,res) => {
    res.sendFile(__dirname + '/js/ubicacion.png');
});

httpserver.get('/coordenadas.txt', (req,res) => {
    res.sendFile(__dirname + '/coordenadas.txt');
});



const udpserver = dgram.createSocket('udp4');

var port = (process.argv[2] || 5000);


udpserver.on('error', (err)=>{

    console.log('server error:\n${err.stack}')
    udpserver.close();
    })
    
    
    udpserver.on('message', function(msg){  // no recibe si cambio el nombre de 'message' y msg
            
            console.log('Truck Tracer for udp\n');
    
        
    
                    
            var latitud= msg.toString('utf8').split("/")[0];
            latitud=  latitud;
            var longitud= msg.toString('utf8').split("/")[1];
            longitud=  longitud;
            var stamptime= msg.toString('utf8').split("/")[2];
            stamptime= stamptime;
    
            var gpsinfo = latitud+"/"+longitud+"/"+stamptime;
    
            /* truckdata = {latitud: latitud, longitud: longitud, stamptime: stamptime}
            let sql = 'INSERT INTO gpsdata SET ?';
    
            let query = database.query(sql,truckdata,(err,result) =>{
                if(err) throw err;
            }) */
            
            
            fs.writeFile('coordenadas.txt', gpsinfo, function(error){
    
                if(error){
                    return console.log(error);
                }
                console.log("File created");
                console.log(gpsinfo);
            })
    
    
    });
    udpserver.bind(port);
   
    

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


//Listening the server
httpserver.listen(httpserver.get('port'), () => {
    console.log('Server on port', httpserver.get('port'));
});



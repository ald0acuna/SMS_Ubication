const express = require('express');
const { fstat } = require('fs');
var socketio = require('socket.io');



var bodyParser = require('body-parser');
var dgram =require('dgram');
const mysql = require('mysql');
const httpserver = express();
const udpserver = dgram.createSocket('udp4');
var server = require('http').Server(httpserver);       
var io = socketio.listen(server); 

const path = require('path');

var urlencodedParser = bodyParser.urlencoded({ extended:false})
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

//comentario de prueba

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





var port = (process.argv[2] || 5000);


udpserver.on('error', (err)=>{

console.log('server error:\n${err.stack}')
udpserver.close();
})
    
httpserver.post('/', urlencodedParser, function(req, res){
    console.log(req.body);
    var fi = req.body.start;
    var ff= req.body.end;
    

    var fi_up=fi.split(" ")[0]; //YYYY-MM-DD
    var fi_down=fi.split(" ")[1];  //HH:MM

    

    var ff_up=ff.split(" ")[0]; //YYYY-MM-DD
    var ff_down=ff.split(" ")[1];  //HH:MM

    //

    var yeari =fi_up.split("/")[0]; //año
    var monthi =fi_up.split("/")[1]; //mes
    var dayi =fi_up.split("/")[2]; //dia

    /* var houri =fi_down.split(":")[0]; //hora
    var mini =fi_down.split(":")[1]; //minuto */

    fi = dayi+"/"+monthi+"/"+yeari+" "+fi_down+":00" //
    console.log(fi);

    //Fecha final

    var yearf =ff_up.split("/")[0]; //año
    var monthf =ff_up.split("/")[1]; //mes
    var dayf =ff_up.split("/")[2]; //dia

   /*  var hourf =ff_down.split(":")[0]; //hora
    var minf =ff_down.split(":")[1]; //minuto */

    ff = dayf+"/"+monthf+"/"+yearf+" "+ff_down+":00"
    console.log(ff);

    

    var histlon = [];
    var histlat=[];
    var hist=[]
    var rd = 'SELECT longitud, latitud FROM gpsdata WHERE (tiempo >= ? AND tiempo <= ? ) ';
    database.query(rd, [fi,ff], function (err, result) {
      if (err) throw err;
      

      
      io.sockets.emit('historia', result); 
     
    });
    
    
});







udpserver.on('message', function(msg){  // no recibe si cambio el nombre de 'message' y msg
        
        console.log('Truck Tracer for udp\n');

    

        
           
       /*  io.sockets.emit('udp message', msg.toString('utf-8')); */ //JY
        //Enviar info a la base de datos
        





                
        var latitud= msg.toString('utf8').split("/")[0];
        latitud=  latitud;
        var longitud= msg.toString('utf8').split("/")[1];
        longitud=  longitud;
        var stamptime= msg.toString('utf8').split("/")[2];
        
        var uppertime=stamptime.split(" ")[0]; //YYYY-MM-DD
        var downtime=stamptime.split(" ")[1];  //HH:MM:SS

        var year =uppertime.split("-")[0]; //año
        var month =uppertime.split("-")[1]; //mes
        var day =uppertime.split("-")[2]; //dia

       
//MODIFICAR LECTURA DEL ULTIMO DATO------------------------------------------------------------------------------

        var timeformat= day+"/"+month+"/"+year+" "+downtime;

        

        var gpsinfo = latitud+"/"+longitud+"/"+timeformat;   

        fs.writeFile('coordenadas.txt', gpsinfo, function(error){

            if(error){
                return console.log(error);
            }
            console.log("File created");
            console.log(gpsinfo);
        })

        truckdata = {latitud: latitud, longitud: longitud, tiempo: timeformat}
        let sql = 'INSERT INTO gpsdata SET ?';

        let query = database.query(sql,truckdata,(err,result) =>{
            if(err) throw err;
        })
        console.log(stamptime,timeformat);      
        

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


//Listening the server
/* httpserver.listen(httpserver.get('port'), () => {
    console.log('Server on port', httpserver.get('port'));
}); */


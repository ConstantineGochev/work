'use strict'


const CLUSTER_CHILDREN = 1;

////////////////////////////
const https = require('https');
const http = require('http')
const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser')
const xmlparser = require('express-xml-bodyparser');
const express_json = require('express-json');
var cluster = require('cluster');
const mongoose = require('mongoose');
const cors = require('cors')
const session = require('express-session');
const helmet = require('helmet')
const _ = require('lodash');
const keys = require('./config/keys');
const {cookie} = keys;




// const chooseport = fs.readFileSync('settings.txt')
// console.log(chooseport)


const port = 8158; //process.env.PORT || 3000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var https_options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),

};



if (cluster.isMaster) {
    console.log("helo master");
    for (var i=0; i<CLUSTER_CHILDREN; i++) {
        cluster.fork();
    }

} else if (cluster.isWorker) {
const app = express();
// const server = http.createServer(app)
// server.listen(8080)
const WebSocket = require('ws')
const wsEvents = require('ws-events')
const socket_server  = https.createServer(https_options, app).listen(8080)
const wss = new WebSocket.Server({
    server: socket_server,
    autoAcceptConnections: false
})
   

//const io = require('socket.io').listen(socket_server).sockets
    // Tell express to use the body-parser middleware and to not parse extended bodies
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(helmet())

    const ConnectToDB = require('./config/db-connect')

    ConnectToDB(function(UserCollection,DefCodeCollection, GamesCollection, ChatCollection){
        console.log('connect to db invoked')
        
         var clients = [];
         wss.on('connection', function (socket) {
            console.log('socket connected')
            const events = wsEvents(socket)
            clients.push(events);
            //console.log(events)
            //get chats from collection 
            function refresh_msgs() {
                ChatCollection.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
                    if (err) {
                        throw err
                    }
                    //emit the messages
                     clients.forEach(function each(client) {
                       client.emit('message',JSON.stringify(res))            
                     });
                });
            }
           
            refresh_msgs()
            events.on('message', function (data) {
                 console.log(data)
                let json = JSON.parse(data);
                //let msg = JSON.parse(data.msg);
                let name = json.name
                let msg = json.msg

           
                    //insert msg
                    ChatCollection.insert({ name: name, msg: msg }, function () {
                        console.log('insert callback')
                        refresh_msgs()

                    })
                
            })

            events.on('clear', function (data) {
                ChatCollection.remove({}, function () {
                    events.emit('cleared');
                    refresh_msgs() 
                })
            })
       wss.on('error', function(err) {
           console.log(err)
       })
        wss.on('close', function(socket) {
            console.log('socket has closed')
            socket.destroy()   
        })
        })

        //expess session
        //must have setting to set expiration of the session FIX
        const dc_expiry_seconds = 6000000
        //session inittialization

        app.use(session({ secret: cookie,
                          saveUninitialized: false,
                          resave:false,
                          cookie: { maxAge: dc_expiry_seconds, secure: true }}));
        const corsOptions = {
             origin: '*'
              }

         app.use(cors(corsOptions))

      //  debugger;
         require('./routes/log_paths')(app)
         require('./routes/player_paths')(app,UserCollection)
         require('./routes/requests_paths')(app)
         require('./routes/games_paths')(app, GamesCollection)
         require('./routes/transaction_paths')(app,UserCollection,DefCodeCollection)


});



    https.createServer(https_options, app).on('connection', (socket) => {
        socket.setTimeout(10000);
    }).listen(port);
     //app.listen(port)
    console.log(`listening on port ${port}`);
}

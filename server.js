import express from 'express';
import {Server} from 'socket.io';
import cors from 'cors';
import http from 'http';

//1. create the server
const server = http.createServer(express());

//2. create the socket server (the socket connection keeps the connection on)
const io = new Server(server, { //io uses the http server to establish the connection
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
}); 

//3. use the socket events
io.on('connection', (socket) => { //'connection' event is fired when a user connects to the server
    console.log('client connected');
    //socket is the instance of io

    //setting the username recvd by the client
    socket.on('setUsername',(data)=>{
        socket.username = data;
        //console.log(data);
    });

    //listening and broadcasting the message
    socket.on('new_message', (data) => {
        //console.log(data);

        //set the usn and msg
        let message = {
            username: socket.username,
            message: data,
        };
        
        socket.broadcast.emit('broadcast_message', message); 
        //client is not expecting this response, server will automatically broadcast this message to all the clients
    });
    
    
    socket.on('disconnect', () => { //'disconnect' event is fired when a user disconnects from the server
        console.log('client disconnected');
    });
});

//4. start the server
server.listen(3000, () => {
    console.log('server is running on port 3000...');
});
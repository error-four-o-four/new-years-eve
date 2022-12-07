const express = require('express');

const http = require('http');
const path = require("path");
// const sock = require('socket.io');
const port = process.env.PORT || 5500;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, "client")));

io.on('connection', (socket) => {
	socket.on('launch', (data) => {
		io.emit('data', data);
	})
})

server.listen(port, function() {
   console.log(`Server running at *:${port}/`);
})
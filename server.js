const express = require('express');

const http = require('http');
const path = require("path");
const sock = require('socket.io');
const port = 3000 || process.env.PORT;


const app = express();
const server = http.createServer(app);
const io = sock(server);

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
	socket.on('launch', (data) => {
		// console.log(data);
		io.emit('data', data);
	})
})

server.listen(port, function() {
   console.log(`Server running at *:${port}/`);
})
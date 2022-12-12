const express = require('express');

const http = require('http');
const path = require("path");
// const sock = require('socket.io');
const port = process.env.PORT || 5500;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const serve = (process.env.NODE_ENV === 'production')
? path.join(__dirname, "client", "build")
: path.join(__dirname, "client", "src");

app.use(express.static(serve));

io.on('connection', (socket) => {
	socket.on('launch', (data) => {
		io.emit('data', data);
	})
})

server.listen(port, function() {
	if (process.env.NODE_ENV === 'development') console.log(`Server running at *:${port}/`);
})
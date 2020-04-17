const io = require("socket.io-client");
const ioClient = io.connect("http://localhost:8000");

var intervalHandle = null;

ioClient.on('connect', (socket) => {
    intervalHandle = setInterval(function(){ myFnc(); }, 3000);
});

ioClient.on('disconnect', (socket) => {
    clearInterval(intervalHandle)
});

console.log("Test message");

function myFnc() {
    ioClient.emit('msg', 'test');
}
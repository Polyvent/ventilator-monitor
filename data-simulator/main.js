const io = require("socket.io-client")
const ioClient = io.connect("http://localhost:8000")



console.log("Test message");
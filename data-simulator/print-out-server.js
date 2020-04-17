const io = require("socket.io")

const server = io.listen(8000)

server.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`)


    socket.on('sendMessage', (message) => {
        console.log(message)
    });

    socket.on("disconnect", () => {
        console.info(`Client disconnected [id=${socket.id}]`)
    });
});

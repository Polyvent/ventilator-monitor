const io = require("socket.io")

const server = io.listen(8000)

server.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on('msg', (msg) => {
        console.log(msg)
    })

    socket.on("disconnect", () => {
        console.info(`Client disconnected [id=${socket.id}]`);
    });
});

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    server.close();
    process.exit();
});
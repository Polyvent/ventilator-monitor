const express   = require('express')
const app       = express()
const next      = require('next')

const dev       = process.env.NODE_ENV !== 'production'
const nextApp   = next({ dev })
const http      = require('http').createServer(app)
const io        = require('socket.io')(http)
const handle    = nextApp.getRequestHandler()

const PORT = 8080

nextApp.prepare()
.then(() => {

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    io.on('connection', (socket) => {
      console.log("[IO] It works !");
    });

    http.listen(PORT, (err) => {
        if (err) throw err
        console.log("Listening on port " + PORT)
    })

})

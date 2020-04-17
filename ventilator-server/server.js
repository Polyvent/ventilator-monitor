const app       = require('express')()
const http      = require('http').Server(app)
const io        = require('socket.io')(http)
const emitters  = io.of('/emit')
const clients   = io.of('/realtime')
const next      = require('next')

const dev       = process.env.NODE_ENV !== 'production'
const nextApp   = next({ dev })
const handle    = nextApp.getRequestHandler()

const db        = require('./database.js')

const PORT      = 8080

nextApp.prepare()
.then(() => {
    // Default route for react/nextjs
    app.get('*', (req, res) => {
        return handle(req, res)
    })

    // socket.io connect/disconnect events for emitters
    emitters.on('connection', (socket) => {
        console.log(`New emitter with id ${socket.id}`)

        socket.on('disconnect', () => {
            console.log(`Emitter with id ${socket.id} disconnected`)
        })

        socket.on('data', (data) => {
            db.insert(data)

            // TODO: check for anomalies and add to object

            // notify clients about new data
            console.log(`New data: ${data.value}`)
            clients.emit('data', data)
        })
    })

    // socket.io connect/disconnect events for clients
    clients.on('connection', (socket) => {
        console.log(`New client with id ${socket.id}`)

        socket.on('disconnect', () => {
            console.log(`Client with id ${socket.id} disconnected`)
        })

        // Send ventilators list to client
        socket.emit('ventilators', () => {
            
        })
    })

    db.initialize(() => {
        console.log('Database setup successful. Starting HTTP server...')

        // Start HTTP server after database initialization
        http.listen(PORT, (err) => {
            if (err) throw err
            console.log("Listening on port " + PORT)
        })
    })
})

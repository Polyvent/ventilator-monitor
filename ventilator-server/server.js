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

var emitterConnections = []

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
            // De-register emitter
            emitterConnections = emitterConnections.filter(conn => conn.socketID !== socket.id)

            console.log(`Emitter with id ${socket.id} disconnected`)
        })

        // emitter data in event
        socket.on('data', (data) => {
            if (!emitterConnections.some(conn => conn.socketID === socket.id)) {
                // New emitter - check if device_id exists in database
                db.ventilatorExists(data.ventdata.device_id, exists => {
                    if (exists) {
                        console.log(`Ventilator ${data.ventdata.device_id} already in database`)
                    } else {
                        console.log(`Adding Ventilator ${data.ventdata.device_id} to database`)
                        db.addVentilator({"deviceID": data.ventdata.device_id, "firstName": "Ventilator", "lastName": String(data.ventdata.device_id)}, () => {
                            db.getVentilators(vents => {
                                clients.emit('ventilators', vents)
                            })
                        })
                    }
                })

                // Register emitter
                if (emitterConnections.some(conn => conn.deviceID === data.ventdata.device_id)) {
                    console.log(`ERROR: Duplicate device ID for emitter ${socket.id}`)
                    socket.disconnect()
                    return
                }
                emitterConnections.push({socketID: socket.id, deviceID: data.ventdata.device_id})
                console.log(`Emitter ${socket.id} registered as device ${data.ventdata.device_id}`)
            } else {
                // Existing emitter - make sure the device ID matches
                var emitterConn = emitterConnections.find(conn => conn.socketID === socket.id)
                if (emitterConn.deviceID !== data.ventdata.device_id) {
                    console.log(`ERROR: Device ID for emitter ${socket.id} changed`)
                    socket.disconnect()
                    return
                }
            }

            db.insert(data)

            // TODO: check for anomalies and add to object
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
        db.getVentilators(vents => {
            socket.emit('ventilators', vents)
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

const app       = require('express')()
const http      = require('http').Server(app)
const io        = require('socket.io')(http)
const emitters  = io.of('/emit')
const clients   = io.of('/realtime')
const next      = require('next')
const sqlite3 = require('sqlite3')

const dev       = process.env.NODE_ENV !== 'production'
const nextApp   = next({ dev })
const handle    = nextApp.getRequestHandler()

const PORT = 8080

var db = new sqlite3.Database('ventDB');

db.serialize(function() {
    db.run("CREATE TABLE if not exists ventilators (deviceID int, firstName varchar(100), lastName varchar(100))")
    db.run(
        `CREATE TABLE if not exists dataset
           (deviceID int,
            expiredCO2 int,
            expiredO2 int,
            MVe int,
            frequency int,
            FiO2 int,
            IE float,
            IVe int,
            PEEP float,
            RR int,
            VT int,
            humidity int,
            pressureMax int,
            pressureMean int,
            ventilationMode string,
            volumePerMinute int,
            volumePerMovement int,
            CO2 int,
            O2 int,
            angleSensor int,
            current int,
            motorRPM int,
            pressure1 int,
            pressure2 int,
            temperature1 int,
            temperature2  int,
            time bigint)`
        )
})

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
            // add data to DB
            data.forEach(dataPoint =>
                db.serialize(function () {
                    var stmt = db.prepare("INSERT INTO dataset VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
                    stmt.run(
                        dataPoint.device_id,
                        dataPoint.processed.ExpiredCO2,
                        dataPoint.processed.ExpiredO2,
                        dataPoint.processed.MVe,
                        dataPoint.processed.frequency,
                        dataPoint.processed.triggerSettings.FiO2,
                        dataPoint.processed.triggerSettings.IE,
                        dataPoint.processed.triggerSettings.MVe,
                        dataPoint.processed.triggerSettings.PEEP,
                        dataPoint.processed.triggerSettings.RR,
                        dataPoint.processed.triggerSettings.VT,
                        dataPoint.processed.triggerSettings.humidity,
                        dataPoint.processed.triggerSettings.pressure_max,
                        dataPoint.processed.triggerSettings.pressure_mean,
                        dataPoint.processed.ventilationMode,
                        dataPoint.processed.volumePerMinute,
                        dataPoint.processed.volumePerMovement,
                        dataPoint.raw.CO2,
                        dataPoint.raw.O2,
                        dataPoint.raw.angleSensor,
                        dataPoint.raw.current,
                        dataPoint.raw.motorRPM,
                        dataPoint.raw.pressure1,
                        dataPoint.raw.pressure2,
                        dataPoint.raw.temperature1,
                        dataPoint.raw.temperature2,
                        dataPoint.time)

                    stmt.finalize()
                })
            )

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
    })

    // socket.io data event for emitters (incoming data)
    emitters.on('data', (data) => {

    })

    // Start HTTP server
    http.listen(PORT, (err) => {
        if (err) throw err
        console.log("Listening on port " + PORT)
    })

})

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

var db = new sqlite3.Database('database.db');

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
                    var stmt = db.prepare("INSERT INTO dataset VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
                    stmt.run(
                        dataPoint.ventdata.device_id,
                        dataPoint.ventdata.processed.ExpiredCO2,
                        dataPoint.ventdata.processed.ExpiredO2,
                        dataPoint.ventdata.processed.MVe,
                        dataPoint.ventdata.processed.frequency,
                        dataPoint.ventdata.processed.triggerSettings.FiO2,
                        dataPoint.ventdata.processed.triggerSettings.IE,
                        dataPoint.ventdata.processed.triggerSettings.MVe,
                        dataPoint.ventdata.processed.triggerSettings.PEEP,
                        dataPoint.ventdata.processed.triggerSettings.RR,
                        dataPoint.ventdata.processed.triggerSettings.VT,
                        dataPoint.ventdata.processed.triggerSettings.humidity,
                        dataPoint.ventdata.processed.triggerSettings.pressure_max,
                        dataPoint.ventdata.processed.triggerSettings.pressure_mean,
                        dataPoint.ventdata.processed.ventilationMode,
                        dataPoint.ventdata.processed.volumePerMinute,
                        dataPoint.ventdata.processed.volumePerMovement,
                        dataPoint.ventdata.raw.CO2,
                        dataPoint.ventdata.raw.O2,
                        dataPoint.ventdata.raw.angleSensor,
                        dataPoint.ventdata.raw.current,
                        dataPoint.ventdata.raw.motorRPM,
                        dataPoint.ventdata.raw.pressure1,
                        dataPoint.ventdata.raw.pressure2,
                        dataPoint.ventdata.raw.temperature1,
                        dataPoint.ventdata.raw.temperature2,
                        dataPoint.vitalsigns.bloodpressure.systole,
                        dataPoint.vitalsigns.bloodpressure.diastole,
                        dataPoint.vitalsigns.bodyTemperature,
                        dataPoint.vitalsigns.heartRate,
                        dataPoint.vitalsigns.oxygenSaturation,
                        dataPoint.ventdata.time)
            
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

    db.serialize(function() {
        console.log('Setting up database...')
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
                bloodPressureSystole int,
                bloodPressureDiastole int,
                bodyTemperature int,
                heartRate int,
                oxygenSaturation int,
                time bigint)`
            )
        db.parallelize(() => {
            console.log('Database setup successful. Starting HTTP server...')

            // Start HTTP server after database initialization
            http.listen(PORT, (err) => {
                if (err) throw err
                console.log("Listening on port " + PORT)
            })
        })
    })
})

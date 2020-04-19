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

function updateClientVentilators() {
    db.getVentilators(vents => {
        clients.emit('ventilators', vents.map(v => {
            var emitterConnection = emitterConnections.find(c => c.deviceID === v.deviceID)
            var online = emitterConnection !== undefined
            var alarm = online ? emitterConnection.alarms !== undefined : false

            return {
                name: v.firstName + ' ' + v.lastName,
                firstName: v.firstName,
                lastName: v.lastName,
                id: v.deviceID,
                status: online ? (alarm ? "alarm" : "online") : "offline",
                limits: {
                    systoleMin: v.systoleMin,
                    systoleMax: v.systoleMax,
                    diastoleMin: v.diastoleMin,
                    diastoleMax: v.diastoleMax,
                    bodyTemperatureMin: v.bodyTemperatureMin,
                    bodyTemperatureMax: v.bodyTemperatureMax,
                    heartRateMin: v.heartRateMin,
                    heartRateMax: v.heartRateMax,
                    oxygenSaturationMin: v.oxygenSaturationMin,
                    oxygenSaturationMax: v.oxygenSaturationMax
                }
            }
        }))
    })
}

function setAlarm(emitterConnection, name) {
    if (emitterConnection.alarms === undefined)
        emitterConnection.alarms = {}

    emitterConnection.alarms[name] = true
}

function processTriggers(data, callback) {
    var deviceID = data.ventdata.device_id
    var emitterConnection = emitterConnections.find(c => c.deviceID == deviceID)
    db.getVentilator(deviceID, vent => {
        var alarmBefore = emitterConnection.alarms !== undefined

        // set alarms
        if (data.vitalsigns.heartRate < vent.heartRateMin || data.vitalsigns.heartRate > vent.heartRateMax)
            setAlarm(emitterConnection, 'heartRate')
        if(data.vitalsigns.bloodpressure.systole < vent.systoleMin || data.vitalsigns.bloodpressure.systole > vent.systoleMax)
            setAlarm(emitterConnection, 'systole')
        if(data.vitalsigns.bloodpressure.diastole < vent.diastoleMin || data.vitalsigns.bloodpressure.diastole > vent.diastoleMax)
            setAlarm(emitterConnection, 'diastole')
        if (data.vitalsigns.bodyTemperature < vent.bodyTemperatureMin || data.vitalsigns.bodyTemperature > vent.bodyTemperatureMax)
            setAlarm(emitterConnection, 'bodyTemperature')
        if (data.vitalsigns.oxygenSaturation < vent.oxygenSaturationMin || data.vitalsigns.oxygenSaturation > vent.oxygenSaturationMax)
            setAlarm(emitterConnection, 'oxygenSaturation')

        data.alarms = emitterConnection.alarms

        // Update client ventilators in case alarm has changed (so status updates)
        if (alarmBefore !== (emitterConnection.alarms !== undefined))
            updateClientVentilators()
        callback(data)
    })
}

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
            updateClientVentilators()
        })

        // emitter data in event
        socket.on('data', (data) => {
            if (!emitterConnections.some(conn => conn.socketID === socket.id)) {
                // New emitter - add device to database if it doesn't exist
                db.ventilatorExists(data.ventdata.device_id, exists => {
                    if (!exists) {
                        console.log(`Adding Ventilator ${data.ventdata.device_id} to database`)
                        db.addVentilator({"deviceID": data.ventdata.device_id, "firstName": "Ventilator", "lastName": String(data.ventdata.device_id)}, () => {
                            updateClientVentilators()
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
                updateClientVentilators()
            } else {
                // Existing emitter - make sure the device ID matches
                var emitterConn = emitterConnections.find(conn => conn.socketID === socket.id)
                if (emitterConn.deviceID !== data.ventdata.device_id) {
                    console.log(`ERROR: Device ID for emitter ${socket.id} changed`)
                    socket.disconnect()
                    return
                }

                // Process triggers/alarms
                processTriggers(data, dataWithAlarms => {
                    clients.emit('data', dataWithAlarms)
                })
            }

            db.insert(data)
        })
    })

    // socket.io connect/disconnect events for clients
    clients.on('connection', (socket) => {
        console.log(`New client with id ${socket.id}`)

        socket.on('disconnect', () => {
            console.log(`Client with id ${socket.id} disconnected`)
        })

        // update ventilator settings and/or limits
        socket.on('config', (config) => {
            console.log("Config event for device " + config.device_id)
            console.log(config)
            
            db.updateVentilator(config, () => {
                updateClientVentilators();
            })
        })

        // clear alarms
        socket.on('clearalarms', deviceID => {
            var conn = emitterConnections.find(c => c.deviceID === deviceID)
            // Don't clear alarms for offline ventilators
            if (conn !== undefined) {
                conn.alarms = undefined
                updateClientVentilators()
            }
        })

        // Send ventilators list to client
        updateClientVentilators()
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

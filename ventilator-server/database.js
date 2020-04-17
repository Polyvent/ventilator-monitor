const sqlite = require('sqlite3')

var db = new sqlite.Database('database.db');

// Creates necessary tables if they don't exist
exports.initialize = (callback) => {
    db.serialize(function() {
        console.log('Setting up database...')
        db.run("CREATE TABLE if not exists ventilators (deviceID int, firstName varchar(100), lastName varchar(100))")
        db.run(
            `CREATE TABLE if not exists dataset
               (deviceID int,
                expiredCO2 int,
                expiredO2 int,
                MVe int,
                flowrate int,
                frequency int,
                pressure int,
                FiO2 int,
                IE float,
                MVe int,
                PEEP float,
                RR int,
                VT int,
                humidity int,
                pressure_max int,
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
                temperature2 int,
                bloodPressureSystole int,
                bloodPressureDiastole int,
                bodyTemperature int,
                heartRate int,
                oxygenSaturation int,
                time bigint)`
            )
        db.parallelize(callback)
    })
}

exports.addVentilator = (ventilator) => {
    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO dataset VALUES (?,?,?)")
        stmt.run(
            ventilator.deviceID,
            ventilator.firstName,
            ventilator.lastName)

        stmt.finalize()
    })
}

exports.ventilatorExists = (deviceID) => {
    db.run("SELECT * FROM dataset WHERE deviceID = ?", [deviceID], (err, rows) => {
        return (rows.length > 0)
    })
}

exports.getDataPoints = (deviceID, fromTime, toTime) => {
    var result = []
    db.each("SELECT * FROM dataset WHERE deviceID = ? AND time BETWEEN ? AND ? ORDER BY time asc", [deviceID, fromTime, toTime], (error, row) => {
        result.push(
            {
                "ventdata":{
                    "device_id":row.deviceID,
                    "processed":{
                        "ExpiredCO2":row.expiredCO2,
                        "ExpiredO2":row.expiredO2,
                        "MVe":row.MVe,
                        "flowrate":row.flowrate,
                        "frequency":row.frequency,
                        "pressure":row.pressure,
                        "triggerSettings":{
                            "FiO2":row.FiO2,
                            "IE":row.IE,
                            "MVe":row.MVe,
                            "PEEP":row.PEEP,
                            "RR":row.RR,
                            "VT":row.VT,
                            "humidity":row.humidity,
                            "pressure_max":row.pressure_max
                        },
                        "ventilationMode":row.ventilationMode,
                        "volumePerMinute":row.volumePerMinute,
                        "volumePerMovement":row.volumePerMovement
                    },
                    "raw":{
                        "CO2":row.CO2,
                        "O2":row.O2,
                        "angleSensor":row.angleSensor,
                        "current":row.current,
                        "motorRPM":row.motorRPM,
                        "pressure1":row.pressure1,
                        "pressure2":row.pressure2,
                        "temperature1":row.temperature1,
                        "temperature2":row.temperature2
                    },
                    "time":row.time
                },
                "vitalsigns":{
                    "bloodpressure":{
                        "systole":row.bloodPressureSystole,
                        "diastole":row.bloodPressureDiastole
                    },
                    "bodyTemperature":row.bodyTemperature,
                    "heartRate":row.heartRate,
                    "oxygenSaturation":row.oxygenSaturation
                }
            }
        )
    })
    return result
}

// Inserts datapoints into the database
exports.insert = (data) => {
    data.forEach(dataPoint =>
        db.serialize(function () {
            var stmt = db.prepare("INSERT INTO dataset VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
            stmt.run(
                dataPoint.ventdata.device_id,
                dataPoint.ventdata.processed.ExpiredCO2,
                dataPoint.ventdata.processed.ExpiredO2,
                dataPoint.ventdata.processed.MVe,
                dataPoint.ventdata.processed.flowrate,
                dataPoint.ventdata.processed.frequency,
                dataPoint.ventdata.processed.pressure,
                dataPoint.ventdata.processed.triggerSettings.FiO2,
                dataPoint.ventdata.processed.triggerSettings.IE,
                dataPoint.ventdata.processed.triggerSettings.MVe,
                dataPoint.ventdata.processed.triggerSettings.PEEP,
                dataPoint.ventdata.processed.triggerSettings.RR,
                dataPoint.ventdata.processed.triggerSettings.VT,
                dataPoint.ventdata.processed.triggerSettings.humidity,
                dataPoint.ventdata.processed.triggerSettings.pressure_max,
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
}

const sqlite = require('sqlite3')

var db = new sqlite.Database('database.db');

// Creates necessary tables if they don't exist
exports.initialize = (callback) => {
    db.serialize(function() {
        console.log('Setting up database...')
        db.run(
            `CREATE TABLE if not exists ventilators 
               (deviceID int, 
                firstName varchar(100), 
                lastName varchar(100),
                systoleMin int,
                systoleMax int,
                diastoleMin int,
                diastoleMax int,
                bodyTemperatureMin float,
                bodyTemperatureMax float,
                heartRateMin int,
                heartRateMax int,
                oxygenSaturationMin int,
                oxygenSaturationMax int)`)

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
                trigMVe int,
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
                bodyTemperature float,
                heartRate int,
                oxygenSaturation int,
                time bigint)`
            )
        db.parallelize(callback)
    })
}

exports.addVentilator = (ventilator, callback) => {
    exports.ventilatorExists(ventilator.deviceID, (exists) => {
        if (exists) {
            console.log("Updating ventilator " + ventilator.deviceID)
            db.serialize(() => {
                var stmt = db.prepare("UPDATE ventilators SET firstName = ?, lastName = ? WHERE deviceID = ?")
                stmt.run(
                    ventilator.firstName,
                    ventilator.lastName,
                    ventilator.deviceID)
                stmt.finalize(err => {
                    callback()
                })
            })
        } else {
            console.log("Adding ventilator " + ventilator.deviceID)
            db.serialize(() => {
                var stmt = db.prepare("INSERT INTO ventilators VALUES (?,?,?,90,140,60,90,35.5,37.5,60,130,90,101)")
                stmt.run(
                    ventilator.deviceID,
                    ventilator.firstName,
                    ventilator.lastName)
                stmt.finalize(err => {
                    callback()
                })
            })
        }
    })
}

exports.getVentilators = (callback) => {
    db.all("SELECT * FROM ventilators", (err,rows) => {
        callback(rows)
    })
}

exports.getVentilator = (deviceID, callback) => {
    db.get("SELECT * FROM ventilators WHERE deviceID=?", deviceID, (err, row) => {
        callback(row)
    })
}

exports.ventilatorExists = (deviceID, callback) => {
    db.all("SELECT * FROM dataset WHERE deviceID = ?", [deviceID], (err, rows) => {
        callback(rows.length > 0)
    })
}

exports.updateVentilator = (ventilator, callback) => {
    db.serialize(() => {
        var stmt = db.prepare(`UPDATE ventilators
            SET firstName=?,lastName=?,systoleMin=?,systoleMax=?,diastoleMin=?,diastoleMax=?,bodyTemperatureMin=?,
            bodyTemperatureMax=?,heartRateMin=?,heartRateMax=?,oxygenSaturationMin=?,oxygenSaturationMax=?
            WHERE deviceID=?`)

            stmt.run(ventilator.firstName, ventilator.lastName, ventilator.limits.systoleMin, ventilator.limits.systoleMax,
                ventilator.limits.diastoleMin, ventilator.limits.diastoleMax, ventilator.limits.bodyTemperatureMin, ventilator.limits.bodyTemperatureMax,
                ventilator.limits.heartRateMin, ventilator.limits.heartRateMax, ventilator.limits.oxygenSaturationMin, ventilator.limits.oxygenSaturationMax,
                ventilator.deviceID)
            stmt.finalize(err => {
                callback()
            })
    })
}

exports.updateLimit = (deviceID, vital, min, max, callback) => {
    var s1 = vital + "Min"
    var s2 = vital + "Max"
    db.serialize(function () {
        var stmt = db.prepare("UPDATE ventilators SET ? = ? AND ? = ? WHERE deviceID = ?")
        stmt.run(s1,min,s2,max,deviceID)
        stmt.finalize(err => {
            callback()
        })
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
                            "MVe":row.trigMVe,
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
        db.serialize(function () {
            var stmt = db.prepare("INSERT INTO dataset VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
            stmt.run(
                data.ventdata.device_id,
                data.ventdata.processed.ExpiredCO2,
                data.ventdata.processed.ExpiredO2,
                data.ventdata.processed.MVe,
                data.ventdata.processed.flowrate,
                data.ventdata.processed.frequency,
                data.ventdata.processed.pressure,
                data.ventdata.processed.triggerSettings.FiO2,
                data.ventdata.processed.triggerSettings.IE,
                data.ventdata.processed.triggerSettings.MVe,
                data.ventdata.processed.triggerSettings.PEEP,
                data.ventdata.processed.triggerSettings.RR,
                data.ventdata.processed.triggerSettings.VT,
                data.ventdata.processed.triggerSettings.humidity,
                data.ventdata.processed.triggerSettings.pressure_max,
                data.ventdata.processed.ventilationMode,
                data.ventdata.processed.volumePerMinute,
                data.ventdata.processed.volumePerMovement,
                data.ventdata.raw.CO2,
                data.ventdata.raw.O2,
                data.ventdata.raw.angleSensor,
                data.ventdata.raw.current,
                data.ventdata.raw.motorRPM,
                data.ventdata.raw.pressure1,
                data.ventdata.raw.pressure2,
                data.ventdata.raw.temperature1,
                data.ventdata.raw.temperature2,
                data.vitalsigns.bloodpressure.systole,
                data.vitalsigns.bloodpressure.diastole,
                data.vitalsigns.bodyTemperature,
                data.vitalsigns.heartRate,
                data.vitalsigns.oxygenSaturation,
                data.ventdata.time)

        stmt.finalize()
    })
}

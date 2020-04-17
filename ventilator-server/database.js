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
        db.parallelize(callback)
    })
}

// Inserts datapoints into the database
exports.insert = (data) => {
    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO dataset VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        stmt.run(
            data.ventdata.device_id,
            data.ventdata.processed.ExpiredCO2,
            data.ventdata.processed.ExpiredO2,
            data.ventdata.processed.MVe,
            data.ventdata.processed.frequency,
            data.ventdata.processed.triggerSettings.FiO2,
            data.ventdata.processed.triggerSettings.IE,
            data.ventdata.processed.triggerSettings.MVe,
            data.ventdata.processed.triggerSettings.PEEP,
            data.ventdata.processed.triggerSettings.RR,
            data.ventdata.processed.triggerSettings.VT,
            data.ventdata.processed.triggerSettings.humidity,
            data.ventdata.processed.triggerSettings.pressure_max,
            data.ventdata.processed.triggerSettings.pressure_mean,
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

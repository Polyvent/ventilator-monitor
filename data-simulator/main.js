var config = require('config');
var settings = config.get('settings');
var vital = config.get('vital');
setInterval(function (){configReload();}, 500);

const io = require('socket.io-client');
const ioClient = io.connect(settings.serverURL);
const fetch = require('node-fetch');

var emitIntervalHandle      = null;
var adjustIntervalHandel    = null;

var fetchCounter = 0;
var currentPushInterval = settings.pushInterval;
var currentVitalSignAdjustSpeed = settings.vitalSignAdjustSpeed;

var currentSystole          = vital.steadyValues.bloodpressure.systole;
var currentDiastole         = vital.steadyValues.bloodpressure.diastole;
var currentBodyTemperature  = vital.steadyValues.bodyTemperature;
var currentHeartRate        = vital.steadyValues.heartRate;
var currentOxygenSaturation = vital.steadyValues.oxygenSaturation;

adjustIntervalHandel = setInterval(function(){ vitalSignAdjustment(); }, settings.vitalSignAdjustSpeed);

ioClient.on('connect', (socket) => {
    emitIntervalHandle = setInterval(function(){ dataEmit(); }, settings.pushInterval);
});

ioClient.on('disconnect', (socket) => {
    clearInterval(emitIntervalHandle)
});

function dataEmit() {

    var data = {
        ventdata: null,
        vitalsigns: {
            bloodpressure: {
                systole: getIntPlus(vital.deviation.bloodpressure.systole, currentSystole),
                diastole: getIntPlus(vital.deviation.bloodpressure.diastole, currentDiastole)
            },
            bodyTemperature: getFloatPlus(vital.deviation.bodyTemperature, currentBodyTemperature),
            heartRate: getIntPlus(vital.deviation.heartRate, currentHeartRate),
            oxygenSaturation: getIntPlus(vital.deviation.oxygenSaturation, currentOxygenSaturation)
        }
    }

    fetch(settings.dataAPI)
    .then(response => response.json())
    .then(ventdata => {
        data.ventdata = ventdata['0']
        ioClient.emit('data', [data]);
    })
    .catch(err => console.error(err))    
    console.info("Fetch Counter: " + ++fetchCounter);
}

function vitalSignAdjustment() {
    if (currentSystole < vital.steadyValues.bloodpressure.systole - vital.deviation.bloodpressure.systole ||
        currentSystole > vital.steadyValues.bloodpressure.systole + vital.deviation.bloodpressure.systole) {
            if (currentSystole > vital.steadyValues.bloodpressure.systole) {
                currentSystole = currentSystole - (vital.deviation.bloodpressure.systole / 2);
            } else {
                currentSystole = currentSystole + (vital.deviation.bloodpressure.systole / 2);
            }
    }

    if (currentDiastole < vital.steadyValues.bloodpressure.diastole - vital.deviation.bloodpressure.diastole ||
        currentDiastole > vital.steadyValues.bloodpressure.diastole + vital.deviation.bloodpressure.diastole) {
            if (currentDiastole > vital.steadyValues.bloodpressure.diastole) {
                currentDiastole = currentDiastole - (vital.deviation.bloodpressure.diastole / 2);
            } else {
                currentDiastole = currentDiastole + (vital.deviation.bloodpressure.diastole / 2);
            }
    }
    
    if (currentBodyTemperature < vital.steadyValues.bodyTemperature - vital.deviation.bodyTemperature ||
        currentBodyTemperature > vital.steadyValues.bodyTemperature + vital.deviation.bodyTemperature) {
            if (currentBodyTemperature > vital.steadyValues.bodyTemperature) {
                currentBodyTemperature = currentBodyTemperature - (vital.deviation.bodyTemperature / 2);
            } else {
                currentBodyTemperature = currentBodyTemperature + (vital.deviation.bodyTemperature / 2);
            }
    }

    if (currentHeartRate < vital.steadyValues.heartRate - vital.deviation.heartRate ||
        currentHeartRate > vital.steadyValues.heartRate + vital.deviation.heartRate) {
            if (currentHeartRate > vital.steadyValues.heartRate) {
                currentHeartRate = currentHeartRate - (vital.deviation.heartRate / 2);
            } else {
                currentHeartRate = currentHeartRate + (vital.deviation.heartRate / 2);
            }
    }

    if (currentOxygenSaturation < vital.steadyValues.oxygenSaturation - vital.deviation.oxygenSaturation ||
        currentOxygenSaturation > vital.steadyValues.oxygenSaturation + vital.deviation.oxygenSaturation) {
            if (currentOxygenSaturation > vital.steadyValues.oxygenSaturation) {
                currentOxygenSaturation = currentOxygenSaturation - (vital.deviation.oxygenSaturation / 2);
            } else {
                currentOxygenSaturation = currentOxygenSaturation + (vital.deviation.oxygenSaturation / 2);
            }
    }
}

function getFloatPlus(derv, val) {
    var num = Math.random() * (2 * derv)  - derv + val;
    return Math.round(num * 10)/10;
}

function getIntPlus(derv, val) {  
    return Math.round(Math.random() * (2 * derv)  - derv) + val;
}

function configReload () {
    global.NODE_CONFIG = null;
    delete require.cache[require.resolve('config')];
    var config  = require('config');
    settings    = config.get('settings');
    vital       = config.get('vital');

    if (currentPushInterval != settings.pushInterval) {
        clearInterval(emitIntervalHandle);
        emitIntervalHandle  = setInterval(function(){ dataEmit(); }, settings.pushInterval);
        currentPushInterval = settings.pushInterval;
    }

    if (currentVitalSignAdjustSpeed != settings.vitalSigneAdjustSpeed) {
        clearInterval(adjustIntervalHandel);
        adjustIntervalHandel        = setInterval(function(){ vitalSignAdjustment(); }, settings.vitalSignAdjustSpeed);
        currentVitalSignAdjustSpeed = settings.vitalSignAdjustSpeed;
    }
}
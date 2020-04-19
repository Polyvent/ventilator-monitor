// TODO: Fix HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fs = require('fs');
var ventNum =  '0';

if (process.argv.length > 2) {
    ventNum = process.argv[2];
}

process.env.NODE_ENV = ventNum;
fs.copyFileSync('./config/default.json', './config/'+ ventNum + '.json');
console.log('./config/'+ ventNum + '.json was created');

var config = require('config');
var settings = config.get('settings');
var vital = config.get('vital');
setInterval(function (){configReload();}, 500);

const io = require('socket.io-client');
const ioClient = io.connect(settings.serverURL);
const fetch = require('node-fetch');

const https = require('https');
const agent = new https.Agent({
  keepAlive: true
});

var emitIntervalHandle      = null;
var adjustIntervalHandle    = null;

var fetchCounter = 0;
var currentPushInterval = settings.pushInterval;
var currentVitalSignAdjustSpeed = settings.vitalSignAdjustSpeed;

var currentSystole          = vital.steadyValues.bloodpressure.systole;
var currentDiastole         = vital.steadyValues.bloodpressure.diastole;
var currentBodyTemperature  = vital.steadyValues.bodyTemperature;
var currentHeartRate        = vital.steadyValues.heartRate;
var currentOxygenSaturation = vital.steadyValues.oxygenSaturation;

adjustIntervalHandle = setInterval(function(){ vitalSignAdjustment(); }, settings.vitalSignAdjustSpeed);

ioClient.on('connect', (socket) => {
    console.info("Start fetching data...");
    emitIntervalHandle = setInterval(function(){ dataEmit(); }, settings.pushInterval);
});

ioClient.on('disconnect', (socket) => endProcessAndUnlinkFile());

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

    fetch(settings.dataAPI, {
        headers: {
            'Connection': 'keep-alive'
        },
        agent: agent
    })
    .then(response => response.json())
    .then(ventdata => {
        console.log(ventdata[ventNum].time)
        data.ventdata = ventdata[ventNum];
        data.ventdata.processed.triggerSettings.FiO2 = 20;
        data.ventdata.processed.triggerSettings.IE = 20;
        data.ventdata.processed.triggerSettings.MVe = 50000;
        data.ventdata.processed.triggerSettings.PEEP = 6.1;
        data.ventdata.processed.triggerSettings.RR = 15;
        data.ventdata.processed.triggerSettings.VT = 400;
        data.ventdata.processed.triggerSettings.humidity = 70;
        data.ventdata.processed.triggerSettings.pressure_max = 50;
        console.log(data.ventdata.processed.triggerSettings)
        ioClient.emit('data', data);
    })
    .catch(err => console.error(err))    
}

const ADJ_FACTOR = 1

function vitalSignAdjustment() {
    if (Math.abs(currentSystole - vital.steadyValues.bloodpressure.systole) > vital.deviation.bloodpressure.systole) {
        currentSystole -= Math.sign(currentSystole - vital.steadyValues.bloodpressure.systole) * vital.deviation.bloodpressure.systole * ADJ_FACTOR
    } else {
        currentSystole = vital.steadyValues.bloodpressure.systole
    }

    if (Math.abs(currentDiastole - vital.steadyValues.bloodpressure.diastole) > vital.deviation.bloodpressure.diastole) {
        currentDiastole -= Math.sign(currentDiastole - vital.steadyValues.bloodpressure.diastole) * vital.deviation.bloodpressure.diastole * ADJ_FACTOR
    } else {
        currentDiastole = vital.steadyValues.bloodpressure.diastole
    }

    if (Math.abs(currentBodyTemperature - vital.steadyValues.bodyTemperature) > vital.deviation.bodyTemperature) {
        currentBodyTemperature -= Math.sign(currentBodyTemperature - vital.steadyValues.bodyTemperature) * vital.deviation.bodyTemperature * ADJ_FACTOR
    } else {
        currentBodyTemperature = vital.steadyValues.bodyTemperature
    }

    if (Math.abs(currentHeartRate - vital.steadyValues.heartRate) > vital.deviation.heartRate) {
        currentHeartRate -= Math.sign(currentHeartRate - vital.steadyValues.heartRate) * vital.deviation.heartRate * ADJ_FACTOR
    } else {
        currentHeartRate = vital.steadyValues.heartRate
    }

    if (Math.abs(currentOxygenSaturation - vital.steadyValues.oxygenSaturation) > vital.deviation.oxygenSaturation) {
        currentOxygenSaturation -= Math.sign(currentOxygenSaturation - vital.steadyValues.oxygenSaturation) * vital.deviation.oxygenSaturation * ADJ_FACTOR
    } else {
        currentOxygenSaturation = vital.steadyValues.oxygenSaturation
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
        clearInterval(adjustIntervalHandle);
        adjustIntervalHandle        = setInterval(function(){ vitalSignAdjustment(); }, settings.vitalSignAdjustSpeed);
        currentVitalSignAdjustSpeed = settings.vitalSignAdjustSpeed;
    }
}

process.on('SIGINT', () => endProcessAndUnlinkFile());

function endProcessAndUnlinkFile() {
    console.log("Disconnected.");
    clearInterval(emitIntervalHandle);
    clearInterval(adjustIntervalHandle);
    fs.unlink('./config/'+ ventNum + '.json', (err) => {
        if (err) throw err;
        console.log('./config/'+ ventNum + '.json was deleted');
        process.exit();
      });
}
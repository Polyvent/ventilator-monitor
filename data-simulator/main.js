var config = require('config');
var settings = config.get('settings');
var vital = config.get('vital');
setInterval(function (){configReload();}, 500);

const io = require('socket.io-client');
const ioClient = io.connect(settings.serverURL);
const fetch = require('node-fetch');

var intervalHandle = null;
var fetchCounter = 0;
var currentPushInterval = settings.pushInterval;

ioClient.on('connect', (socket) => {
    intervalHandle = setInterval(function(){ myFnc(); }, settings.pushInterval);
});

ioClient.on('disconnect', (socket) => {
    clearInterval(intervalHandle)
});

function myFnc() {

    var data = {
        ventdata: null,
        vitalsigns: {
            bloodpressure: {
                systole: getIntPlus(vital.deviation.bloodpressure.systole, vital.startValues.bloodpressure.systole),
                diastole: getIntPlus(vital.deviation.bloodpressure.diastole, vital.startValues.bloodpressure.diastole)
            },
            bodyTemperature: getFloatPlus(vital.deviation.bodyTemperature, vital.startValues.bodyTemperature),
            heartRate: getIntPlus(vital.deviation.heartRate, vital.startValues.heartRate),
            oxygenSaturation: getIntPlus(vital.deviation.oxygenSaturation, vital.startValues.oxygenSaturation)
        }
    }

    fetch(settings.dataAPI)
    .then(response => response.json())
    .then(ventdata => {
        data.ventdata = ventdata['0']
        ioClient.emit('msg', data);
    })
    .catch(err => console.error(err))    
    console.info("Fetch Counter: " + ++fetchCounter);
}

function getFloatPlus(derv, val) {
    var num = Math.random() * (2 * derv + 1)  - derv + val;
    return Math.round(num * 10)/10;
}

function getIntPlus(derv, val) {  
    return Math.round(Math.random() * (2 * derv + 1)  - derv) + val;
}

function configReload () {
    global.NODE_CONFIG = null;
    delete require.cache[require.resolve('config')];
    var config = require('config');
    settings = config.get('settings');

    if (currentPushInterval != settings.pushInterval) {
        clearInterval(intervalHandle);
        intervalHandle = setInterval(function(){ myFnc(); }, settings.pushInterval);
        currentPushInterval = settings.pushInterval;
    }
}
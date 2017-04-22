// cc2emon-server.js: Current Cost Elecricity Meter app in Node.js
// uploads data for ch1 to emonCMS https://emoncms.org/ 

var serialport = require("serialport");
var SerialPort = serialport;
var libxmljs = require("libxmljs");
var request = require('request');
var config = require('./config/default.json');
var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    filename: './logs/log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: config.logLevel
  });
  
  var logger = new (winston.Logger)({
    transports: [
      transport
    ]
  });

// buffer to hold data from serial port before parsing
var buffer = "";

// get current cost serial port
var serialdevice = config.comPort;
// COM4 
// /dev/ttyUSB0

// current cost meter serial settings are 57600 baud, 
// 8 data bits, no parity, 1 stop bit
var sp = new SerialPort(serialdevice, {baudrate: 57600 });

sp.on("open", function() {
  logger.info("Serial port opened.");
});

sp.on("data", function(data) {
  // got some data to read, add it to current buffer for parsing
  buffer += data.toString();
  // look for start of data
  // see http://cumbers.wordpress.com/2008/05/07/breakdown-of-currentcost-xml-output/
  var startmsg = buffer.indexOf("<msg>");
  if (startmsg != -1) {
    // found start of data
    // now look for end
    var endmsg = buffer.indexOf("</msg>");
    if (endmsg != -1) {
      // got a complete message, extract it from the buffer
      var msg = buffer.substring(startmsg, endmsg+6); // include the end tag
      logger.debug(msg);

      var xmlDoc = libxmljs.parseXml(msg);      
      var watts = xmlDoc.get('//ch1/watts');    

       if (watts != undefined)
      {
        logger.debug('Watts value: ' + watts);

        var options = { method: 'POST',
        url: config.uploadURL,
        qs: { node: config.uploadNode, apikey: config.uploadAPIKey },
        timeout: 2500,
        headers: 
        { 'cache-control': 'no-cache',
          'content-type': 'multipart/form-data;' },
        formData: { data: '{Power:'+watts.text()+'}' } };

        request(options, function (error, response, body) {
          if (error) {
            logger.error(error)
            //throw new Error(error);
          }
            
        });
      }

      // now clear the buffer ready for the next data to come in
      buffer = "";
    }
  }
});
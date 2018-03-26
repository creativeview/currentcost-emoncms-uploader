# Current Cost energy monitor data uploader to emonCMS
A Node.js script to process data from a [Current Cost](http://www.currentcost.com/) energy monitor and import it to [emonCMS](https://emoncms.org/)



## Requirements 
- [Node.js](https://nodejs.org/en/) => v8.10.0

## Dependencies
 - Node.js package - [serialport](https://www.npmjs.com/package/serialport)
 - Node.js package - [libxmljs](https://www.npmjs.com/package/libxmljs)
 - Node.js package - [request](https://www.npmjs.com/package/request)
 - Node.js package - [winston](https://www.npmjs.com/package/winston)
 - Node.js package - [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file)

## Installation

- Download from Github ```git clone https://github.com/creativeview/currentcost-emoncms-uploader.git```
- ```cd currentcost-emoncms-uploader```
- To install dependencies run ```npm install```  
Installation of dependencies on ARM systems takes a long time. On a Raspberry Pi Zero this can take over 30mins.

## Configuration
The Current Cost to emonCMS uploader is configured using the `default.json` file located within the config folder. 

| Key          | Value                                                                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| uploadURL    | The url for the post.json file on the emoncms server.  ```http://emonserver/input/post.json``` You should only need to update the server name. |
| uploadNode   | The Node you will be uploading data to on emoncms.                                                                                             |
| uploadAPIKey | The API key for your emoncms server.                                                                                                           |
| comPort      | The com port the Current Cost is connected to. E.g. On Linux this could be: ```/dev/ttyUSB0```. On Windows this could be ```COM4```            |
| logLevel     | The logging level the application uses.                                                                                                        |


```json 
{
    "uploadURL": "http://emonserver/input/post.json",
    "uploadNode": "1",
    "uploadAPIKey": "emonapikey",
    "comPort":"/dev/ttyUSB0",
    "logLevel":"info"
}
```

## Running Current Cost to emonCMS uploader
To run the application use the command ```npm start```

## Running as a service
To run the Current Cost to emonCMS uploader as a service on Linux you can install [PM2](http://pm2.keymetrics.io/) using the following steps:

- Install PM2 globally on your system with the following command
```
$ npm install pm2@latest -g
```

- To start, daemonize and monitor Current Cost to emonCMS uploader use this command: 
```
$ pm2 start cc2emon-server.js
```

- Finally setup a startup script to generate an active startup script using this command: 
```
$ pm2 startup
```





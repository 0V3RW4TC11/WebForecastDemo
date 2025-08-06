//  Filename:   server.js
//  Author:     Lane O'Rafferty
//  Date:       March 2023
//  Brief:      Starts a http server

'use strict';

let http = require('http');
let url = require('url');

function startServer(route, handle)
{
    // port configuration
    let port = 40408;

    http.createServer((request, response) => {
        // extracts the path from the URL
        let pathname = url.parse(request.url).pathname;
        // forwards request to the router
        route(pathname, handle, request, response);
    }).listen(port);
    
    // reports server status
    console.log('http server started');
    console.log('Port:', port);
    console.log(`Process ID: ${process.pid}`);
}
exports.startServer = startServer;
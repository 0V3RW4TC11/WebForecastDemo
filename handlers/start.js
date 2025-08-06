//  Filename:   start.js
//  Author:     Lane O'Rafferty
//  Date:       March 2023
//  Brief:      Handles '/start' or '/' requests

'use strict';

let fs = require('fs');

function reqStart(request, response)
{
    // reports that the handler was called
    console.log('Request handler \'start\' was called');
    
    let startFile = './html/start.html';

    // reads the start file
    fs.readFile(startFile, 'utf8', (err, data) => {
        // displays an error if read failed
        if (err)
        {
            console.log(err);
            response.writeHead(404, {'Content-Type':'text/plain'});
            response.write('Error reading file: ' + startFile);
            response.end();
        }
        else
        // displays the html content
        {
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(data);
            response.end();
        }
    });
}
exports.reqStart = reqStart;
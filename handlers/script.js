//  Filename:   script.js
//  Author:     Lane O'Rafferty
//  Date:       March 2023
//  Brief:      Handles '/js' requests

'use strict';

let fs = require('fs');
let url = require('url');

function reqScript(request, response)
{
    // reports that the handler was called
    console.log('Request handler \'script\' was called');

    // extracts the URL path
    let pathname = url.parse(request.url).pathname;
    // extracts the filename from the path
    let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    // generates the server path to the js file
    let jsFile = "./js/" + filename;

    // reads the file
    fs.readFile(jsFile, 'utf8', (err, data) => {
        // displays an error if read failed
        if (err)
        {
            console.log(err);
            response.writeHead(404, {'Content-Type':'text/plain'});
            response.write('Error reading file: ' + jsFile);
            response.end();
        }
        else
        // displays the html content
        {
            response.writeHead(200, {'Content-Type':'text/javascript'});
            response.write(data);
            response.end();
        }
    });
    
}
exports.reqScript = reqScript;
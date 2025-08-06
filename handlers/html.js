//  Filename:   content.js
//  Author:     Lane O'Rafferty
//  Date:       March 2023
//  Brief:      Handles '/html' requests

'use strict';

let fs = require('fs');
let url = require('url');

function reqHTML(request, response)
{
    // reports that the handler was called
    console.log('Request handler \'html\' was called');
    
    // extracts the URL path
    let pathname = url.parse(request.url).pathname;
    // extracts the filename from the path
    let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    // generates the server path to the content file
    let htmlFile = "./html/" + filename;

    // reads the start file
    fs.readFile(htmlFile, 'utf8', (err, data) => {
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
exports.reqHTML = reqHTML;
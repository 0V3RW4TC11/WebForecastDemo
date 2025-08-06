/**
 *  File        search.js
 *  Author      Lane O'Rafferty
 *  Brief       Provides functions for gathering data from weather log files
 */

"use strict";

const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const xmlParser = require("../parsers/xml");
const jsonParser = require("../parsers/json");

class weatherData
{
    wsAverages = {};
    srTotals = {};
}

function reqSearch(request, response)
{
    const directory = "./data";
    let query = querystring.parse(url.parse(request.url).query);
    
    const options =
    {
        monthStart: parseInt(query.monthStart),
        monthEnd: parseInt(query.monthEnd),
        ws: "data1" in query,
        sr: "data2" in query
    }

    readDir(directory)
    .catch(err => { throw err; })
    .then(files => { return filterFiles(files, directory, query.year); })
    .then(matchedFile => { return processFile(matchedFile, options); })
    .catch(err => { throw err; })
    .then(data =>
    {
        response.writeHead(200, {'Content-Type':'text/plain'});
        response.write(JSON.stringify(data));
        response.end();
    })
    .catch(err =>
    {
        console.error(err);
        response.writeHead(500, {'Content-Type':'text/plain'});
        response.write(JSON.stringify(""));
        response.end();
    });
}
exports.reqSearch = reqSearch;

function readDir(dir)
{
    return new Promise((resolve, reject) =>
    {
        fs.readdir(dir, (err, files) =>
        {
            if (err)
                reject(err);
            else
                resolve(files);
        });
    });
}

function filterFiles(files, directory, name)
{
    const matchedFile = files.filter(file => file.includes(name))[0];

    return (matchedFile) ? directory + '/' + matchedFile : null;
}

function processFile(matchedFile, options)
{
    if (matchedFile == null)
        return null;

    const extensionMap =
    {
        xml: xmlParser.processXML,
        json: jsonParser.processJSON
    };

    const extension = matchedFile.split('.').pop().toLowerCase();
    if (extension.length == 0)
        return null;

    if (extensionMap.hasOwnProperty(extension))
    {
        return new Promise((resolve, reject) =>
        {
            fs.readFile(matchedFile, "utf-8", (err, fileData) =>
            {
                if (err)
                    reject(err);
                else
                {
                    const data = extensionMap[extension](fileData, options);
                    resolve(data);
                    return;
                }
            });
        });
    }
    return new Error("file-determination-error");
}
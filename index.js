//  Filename:   index.js
//  Author:     Lane O'Rafferty
//  Date:       March 2023
//  Brief:      Initializes components of and starts a http server  

'use strict';

let server = require('./server');
let router = require('./router');

// sets up request handlers
let handle = {};
handle['/'] = require('./handlers/start').reqStart;
handle['/start'] = require('./handlers/start').reqStart;
handle['/html'] = require('./handlers/html').reqHTML;
handle['/js'] = require('./handlers/script').reqScript;
handle['/css'] = require('./handlers/stylesheet').reqStyleSheet;
handle['/search'] = require('./handlers/search').reqSearch;

// starts the server
server.startServer(router.route, handle);
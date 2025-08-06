//  Filename:   router.js
//  Author:     Lane O'Rafferty
//  Date:       March 2023
//  Brief:      Forwards requests to the appropriate handlers

'use strict';

function route(pathname, handle, request, response)
{
    // reports the path being routed
    console.log('Routing:', pathname);

    // returns root path
    let queryPos = pathname.indexOf('/', 1);
    if (queryPos != -1)
    {
        pathname = pathname.substring(0, queryPos);
    }

    // checks if path relates to a handler
    if (typeof handle[pathname] === 'function')
    {
        // forwards the request to the handler
        handle[pathname](request, response);
    }
    // displays message if no handler was found
    else
    {
        console.log('No handler found for:', pathname);
        
        response.writeHead(200, {'Content-Type':'text/plain'});
        response.write('Resource not found!');
        response.end();
    }
}
exports.route = route;
"use strict";

exports.processJSON = (file, options) =>
{
    const jsondoc = JSON.parse(file);

    // get the "record" elements
    const records = jsondoc.weather.record;

    // declare data + datasets
    let wsRead, wsData, wsCount, srRead, srData, srCount;

    // initialize datasets
    if (options.ws)
    {
        wsData = new Array(12);
        wsCount = new Array(12);

        for (let i = 0; i < 12; ++i)
        {
            wsData[i] = 0;
            wsCount[i] = 0;
        }
    }
    if (options.sr)
    {
        srData = new Array(12);
        srCount = new Array(12);

        for (let i = 0; i < 12; ++i)
        {
            srData[i] = 0;
            srCount[i] = 0;
        }
    }

    // setup month tracking
    let currentMonth;

    let lastMonth = {};
    lastMonth.value = "";

    let monthNum = {};
    monthNum.value;
    
    let trackedMonths = [];

    // initialize months that are tracked
    for (let i = options.monthStart; i <= options.monthEnd; ++i)
        trackedMonths.push(i);

    // loop through the elements - WS
    if (options.ws && !options.sr)
    {
        for (const record of Array.from(records))
        {
            currentMonth = record.date.slice(3, 5);
            updateMonth(currentMonth, lastMonth, monthNum);
            
            if (trackedMonths.includes(monthNum.value))
            {
                wsRead = parseInt(record.ws);
                updateWS(wsRead, wsData, wsCount, monthNum.value);
            }
                
        }

        calculateWSAverages(wsData, wsCount);
        convertWSunits(wsData);

        return {wsData};
    }

    // loop through the elements - SR
    else if (!options.ws && options.sr)
    {
        for (const record of Array.from(records))
        {
            currentMonth = record.date.slice(3, 5);
            updateMonth(currentMonth, lastMonth, monthNum);
            
            if (trackedMonths.includes(monthNum.value))
            {
                srRead = parseInt(record.sr);
                updateSR(srRead, srData, srCount, monthNum.value);
            }
        }

        convertSRunits(srData);

        return {srData};
    }   
    
    // loop through the elements - WS + SR
    else
    {
        for (const record of Array.from(records))
        {
            currentMonth = record.date.slice(3, 5);
            updateMonth(currentMonth, lastMonth, monthNum);

            if (trackedMonths.includes(monthNum.value))
            {
                wsRead = parseInt(record.ws);
                updateWS(wsRead, wsData, wsCount, monthNum.value);
                srRead = parseInt(record.sr);
                updateSR(srRead, srData, srCount, monthNum.value);
            }
        }

        calculateWSAverages(wsData, wsCount);
        convertWSunits(wsData);
        convertSRunits(srData);

        return {wsData, srData};
    }
}

// updates the month for the current record being inspected
function updateMonth(currentMonth, lastMonth, monthNum)
{
    if (currentMonth !== lastMonth)
    {
        monthNum.value = parseInt(currentMonth);
        lastMonth = currentMonth;
    }
}

// updates the wind speed total for the current month
function updateWS(reading, wsData, wsCount, monthNum)
{
    wsData[monthNum - 1] += reading;
    ++wsCount[monthNum - 1];
}

// updates the solar rad total for the current month
function updateSR(reading, srData, srCount, monthNum)
{
    if (reading >= 100)
    {
        srData[monthNum - 1] += reading;
        ++srCount[monthNum - 1];
    }
}

// calculates the wind speed monthly averages
function calculateWSAverages(wsData, wsCount)
{
    for (let i = 0; i < 12; ++i)
    {
        if (wsCount[i] < 1)
            wsCount[i] = 1;

        wsData[i] /= wsCount[i];
    }
}

// converts ws units from m/s to km/h
function convertWSunits(wsData)
{
    for (let i = 0; i < 12; ++i)
        wsData[i] *= 3.6;
}

// converts sr units from wh/m2 to kwh/m2
function convertSRunits(srData)
{
    for (let i = 0; i < 12; ++i)
        srData[i] /= 6000;
}
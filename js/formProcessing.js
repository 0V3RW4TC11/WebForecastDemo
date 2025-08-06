"use strict";

export {submitForm};
export {removeChart};

import { tableHeaderBuilder } from "./tableBuilder.js";
import { tableRowBuilder } from "./tableBuilder.js";
import { computeActiveMonths } from "./dataHandler.js";
import { computeActiveData } from "./dataHandler.js";
import { truncateData } from "./dataHandler.js";

let chart;

function getQueryString(HTMLForm)
{
    let queryString = "?";
    const formData = new FormData(HTMLForm);

    for (const pair of formData.entries()) {
        queryString += `${pair[0]}=${pair[1]}&`;
    }

    return queryString.slice(0, -1);
}

function showNoResultsMessage()
{
    const message = document.createElement("p");
    message.innerText = "No results found";
    document.getElementById("out-table").appendChild(message);
}

function processDataSets(data)
{
    const procData = {};

    const monthStart = document.getElementById("weather-frm-monthStart").value - 1;
    const monthEnd = document.getElementById("weather-frm-monthEnd").value - 1;
    const hasWS = document.getElementById("weather-frm-windSpd").checked;
    const hasSR = document.getElementById("weather-frm-solarRad").checked;

    const activeMonths = computeActiveMonths(monthStart, monthEnd);
    let activeData = computeActiveData(monthStart, monthEnd, data);

    procData.activeMonths = activeMonths;
    procData.activeData = activeData;
    procData.hasWS = hasWS;
    procData.hasSR = hasSR;

    return procData;
}

function buildWeatherDataTable(procData)
{
    const activeMonths = [...procData.activeMonths];
    activeMonths.unshift("");

    const activeData = JSON.parse(JSON.stringify(procData.activeData));
    truncateData(activeData, 2);

    const rowHeaders = [];
    if (procData.hasWS)
        rowHeaders.push("Wind speed");
    if (procData.hasSR)
        rowHeaders.push("Solar radiation");

    const table = document.createElement("table");
    tableHeaderBuilder(table, activeMonths);
    tableRowBuilder(table, activeData, rowHeaders);

    document.getElementById("out-table").appendChild(table);
}

function removeChart()
{
    if (chart)
        chart.destroy();
}

function buildChart(procData)
{
    const canvas = document.createElement("canvas");
    canvas.id = "lineGraph";
    document.getElementById("out-graph").appendChild(canvas);
    
    const activeDataSets = [];

    if (procData.hasWS)
    {
        activeDataSets.push({
            label: "Wind Speed",
            data: procData.activeData.wsData,
            borderColor: "blue",
            fill: false
        });
    }

    if (procData.hasSR)
    {
        activeDataSets.push({
            label: "Solar Radiation",
            data: procData.activeData.srData,
            borderColor: "red",
            fill: false
        });
    }

    chart = new Chart("lineGraph", {
        type: "line",
        data: {
            labels: procData.activeMonths,
            datasets: activeDataSets
        },
        options: {
            legend: {display: true}
        }
    });
}

function processResponse(data)
{
     if (data)
     {
        const procData = processDataSets(data);
        buildWeatherDataTable(procData);
        buildChart(procData);
     }
     else
        showNoResultsMessage();
}

function submitForm(HTMLForm)
{
    const queryString = getQueryString(HTMLForm);
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "/search" + queryString);
    xhr.onload = function() {
        processResponse(JSON.parse(this.responseText));
    };
    xhr.send();
}
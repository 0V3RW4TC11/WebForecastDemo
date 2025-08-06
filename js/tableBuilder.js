/**
 *  File        tableBuilder.js
 *  Author      Lane O'Rafferty
 *  Brief       provides functions for generating the search results table
 *  Acknowledgements:
 *      sourced from https://www.valentinog.com/blog/html-table/
 */

"use strict";

export {tableHeaderBuilder};
export {tableRowBuilder};

/**
 * Generates the table header row
 * 
 * @param {HTMLElement} table 
 * @param {Array} headers 
 */
function tableHeaderBuilder(table, headers)
{
    const thead = table.createTHead();
    const row = thead.insertRow();
    
    for (const element of headers) 
    {
      const th = document.createElement("th");
      const text = document.createTextNode(element);
      th.appendChild(text);
      row.appendChild(th);
    }
}

/**
 * Generates the table rows
 * 
 * @param {HTMLElement} table 
 * @param {Object} cellData
 * @param {Boolean} hasRowHeaders
 */
function tableRowBuilder(table, data, rowHeaders)
{
    const tbody = document.createElement("tbody");
    let rowCount = 0;

    for (const key in data) 
    {
        const row = document.createElement("tr");

        if (rowHeaders)
        {
            const th = document.createElement("th");
            const headerText =  document.createTextNode(rowHeaders[rowCount]);
            th.appendChild(headerText);
            row.appendChild(th);
        }

        for (let value of data[key])
        {
            const cell = row.insertCell();
            const cellText = document.createTextNode(value);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }

        tbody.appendChild(row);
        ++rowCount;
    }

    table.appendChild(tbody);
}
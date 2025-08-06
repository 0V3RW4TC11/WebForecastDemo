"use strict";

export {computeActiveMonths};
export {computeActiveData};
export {truncateData};

function computeActiveMonths(monthStart, monthEnd)
{
    let activeMonths = [];

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    for (let i = monthStart; i <= monthEnd; ++i)
    {
        activeMonths.push(monthNames[i]);
    }

    return activeMonths;
}

function computeActiveData(monthStart, monthEnd, data)
{
    let activeData = {};

    for (const key in data)
    {
        activeData[key] = [];

        for (let i = monthStart; i <= monthEnd; ++i)
        {
            activeData[key].push(data[key][i]);
        }
    }

    return activeData;
}

function truncateData(data, decimalPlaces)
{
    for (const key in data)
    {
        data[key] = data[key].map(value => { return value.toFixed(decimalPlaces); });
    }
}
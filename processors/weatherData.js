"use strict";

class WeatherData
{
    // readings
    wsRead; wsData; wsCount; srRead; srData; srCount;

    // month tracking
    lastMonth; monthNum; 
    trackedMonths = [];

    constuctor(options)
    {
        // initialize datasets
        if (options.ws)
        {
            this.wsData = new Array(12);
            this.wsCount = new Array(12);

            for (let i = 0; i < 12; ++i)
            {
                this.wsData[i] = 0;
                this.wsCount[i] = 0;
            }
        }
        if (options.sr)
        {
            this.srData = new Array(12);
            this.srCount = new Array(12);

            for (let i = 0; i < 12; ++i)
            {
                this.srData[i] = 0;
                this.srCount[i] = 0;
            }
        }

        // initialize months that are tracked
        for (let i = options.monthStart; i <= options.monthEnd; ++i)
            this.trackedMonths.push(i);
    }

    // updates the month for the current record being inspected
    updateMonth(currentMonth)
    {
        if (currentMonth !== this.lastMonth)
        {
            this.monthNum = parseInt(currentMonth);
            this.lastMonth = currentMonth;
        }
    }

    // updates the wind speed total for the current month
    updateWS(reading)
    {
        this.wsData[monthNum - 1] += reading;
        this.wsCount[monthNum - 1]++;
    }

    // updates the solar rad total for the current month
    updateSR(reading)
    {
        if (reading >= 100)
        {
            this.srData[monthNum - 1] += reading;
            this.srCount[monthNum - 1]++;
        }
    }

    // calculates the wind speed monthly averages
    calculateWSAverages()
    {
        for (let i = 0; i < 12; ++i)
        {
            if (this.wsCount[i] < 1)
                this.wsCount[i] = 1;

            this.wsData[i] /= this.wsCount[i];
        }
    }

    // converts ws units from m/s to km/h
    convertWSunits()
    {
        for (let i = 0; i < 12; ++i)
            this.wsData[i] *= 3.6;
    }

    // converts sr units from wh/m2 to kwh/m2
    convertSRunits()
    {
        for (let i = 0; i < 12; ++i)
            this.srData[i] /= 6000;
    }
}

module.exports = WeatherData;
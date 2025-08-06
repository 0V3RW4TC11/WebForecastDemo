"use strict";

export {clearAllAlerts};
export {validateForm};
export {validateYear};

let alertMap = {};

function isEmpty(element)
{
    return (element.value.length == 0)
}

function checkYear(year, yearCutoff)
{
    const currentYear = new Date().getFullYear();

    if (year < yearCutoff)
        return 1;
    if (year > currentYear)
        return 2;

    return 0;
}

function checkMonth(monthValue)
{
    return !(monthValue < 1 || monthValue > 12);
}

function checkMonthStartEnd(startVal, endVal)
{
    return (endVal - startVal >= 0);
}

function dataChecked(checkBox1, checkBox2)
{
    return (checkBox1.checked || checkBox2.checked);
}

function createAlert(alertText)
{
    let alert = document.createElement("p");
    alert.className = "alert";
    alert.innerText = alertText;

    return alert;
}

function clearAllAlerts()
{
    for (const key in alertMap)
        if (alertMap.hasOwnProperty(key))
            alertMap[key].remove();
}

function validateForm(HTMLForm)
{
    const alertText = "Form contains errors";
    let success = true;

    clearAllAlerts();

    const year = HTMLForm.elements.namedItem("year");
    const monthStart = HTMLForm.elements.namedItem("monthStart");
    const monthEnd = HTMLForm.elements.namedItem("monthEnd");
    const windSpeed = HTMLForm.elements.namedItem("data1");
    const solarRadiation = HTMLForm.elements.namedItem("data2");

    if (isEmpty(year) == true)
    {
        alertMap["year"] = createAlert("Year cannot be empty");
        year.insertAdjacentElement("afterend", alertMap["year"]);
        success = false;
    }

    if (success)
    {
        success = validateYear(year);
    }

    if (checkMonth(monthStart.value) == false)
    {
        // no alert element as user would have to modify html code to change this
        console.log("monthStart contains an invalid value");
        success = false;
    }

    if (checkMonth(monthEnd.value) == false)
    {
        // no alert element as user would have to modify html code to change this
        console.log("monthEnd contains an invalid value");
        success = false;
    }

    if (checkMonthStartEnd(monthStart.value, monthEnd.value) == false)
    {
        // no alert element as user would have to modify {html, js} code to change this
        console.log("start and end months do not align");
        success = false;
    }

    if (dataChecked(windSpeed, solarRadiation) == false)
    {
        alertMap["data"] = createAlert("At least one data should be selected");
        solarRadiation.nextElementSibling.insertAdjacentElement("afterend", alertMap["data"]);
        success = false;
    }
        
    if (success == false)
    {
        alertMap["form"] = createAlert(alertText);
        HTMLForm.appendChild(alertMap["form"]);
    }

    return success;
}

function validateYear(HTMLYear)
{
    const cutoffYear = 1970;

    let alertText = "";
    let success = true;
    
    if (alertMap["year"])
        alertMap["year"].remove();
    
    switch(checkYear(HTMLYear.value, cutoffYear))
    {
        case 1:
            alertText = "Year cannot be less than " + cutoffYear;
            success = false;
            break;
        case 2:
            alertText = "Year cannot be greater than the current year";
            success = false;
            break;
    }

    if (success == false)
    {
        alertMap["year"] = createAlert(alertText);
        HTMLYear.insertAdjacentElement("afterend", alertMap["year"]);
    }
    
    return success;
}
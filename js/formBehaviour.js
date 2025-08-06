"use strict";

import { validateForm } from "./formValidation.js";
import { validateYear } from "./formValidation.js";
import { clearAllAlerts } from "./formValidation.js";
import { submitForm } from "./formProcessing.js";
import { removeChart } from "./formProcessing.js";

const weatherForm = document.getElementById("weather-frm");
const startMonthSelect = weatherForm.elements.namedItem("monthStart");
const endMonthSelect = weatherForm.elements.namedItem("monthEnd");

initializeForm();

function clampLength(event)
{
    const maxLength = 4;
    let targetVal = event.target.value;
    
    if (targetVal.length > maxLength)
    {
        event.target.value = targetVal.slice(0, maxLength);
    }
}

function fillMonths(selectElement)
{
    const months = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 },
    ];

    let option;

    months.forEach((month) => {
        option = document.createElement("option");
        option.text = month.name;
        option.value = month.value;
        selectElement.appendChild(option);
    })
}

function updateMonthOptions()
{
    // Enable all options in both select lists
    enableAllMonths(startMonthSelect);
    enableAllMonths(endMonthSelect);

    // Disable options in the start month select that are after the end month
    for (let i = endMonthSelect.selectedIndex + 1; i < startMonthSelect.options.length; i++) {
        startMonthSelect.options[i].disabled = true;
    }

    // Disable options in the end month select that are before the start month
    for (let i = 0; i < startMonthSelect.selectedIndex; i++) {
        endMonthSelect.options[i].disabled = true;
    }
}

function enableAllMonths(selectElement) {
    for (let i = 0; i < selectElement.options.length; i++) {
        selectElement.options[i].disabled = false;
    }
}

function clearResults()
{
    removeChart();

    const table = document.getElementById("out-table").firstChild;
    if (table)
        table.remove();

    const graph = document.getElementById("out-graph").firstChild;
    if (graph)
        graph.remove();
}

function onFormSubmit(event)
{
    event.preventDefault();

    clearResults();

    if (validateForm(weatherForm))
    {
        submitForm(weatherForm);
    }
}

function onFormReset(event)
{
    event.preventDefault();

    clearResults();

    weatherForm.elements.namedItem("year").value = "";
    startMonthSelect.selectedIndex = 0;
    endMonthSelect.selectedIndex = 11;
    updateMonthOptions();
    weatherForm.elements.namedItem("data1").checked = false;
    weatherForm.elements.namedItem("data2").checked = false;

    clearAllAlerts();
}

function initializeForm()
{
    fillMonths(startMonthSelect);
    fillMonths(endMonthSelect);
    endMonthSelect.selectedIndex = 11;

    const inputYear = weatherForm.elements.namedItem("year");
    inputYear.addEventListener("input", clampLength);
    inputYear.addEventListener("change", e => validateYear(e.target));

    startMonthSelect.addEventListener("change", updateMonthOptions);
    endMonthSelect.addEventListener("change", updateMonthOptions);

    weatherForm.addEventListener("submit", onFormSubmit);
    weatherForm.addEventListener("reset", onFormReset);

    updateMonthOptions();
}
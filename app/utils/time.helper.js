var fs = require("fs");
var path = require("path");
const nodeDate = require('node-datetime');

exports.convertMillsecondsToFormattedTime = function (millseconds) {
    let date = nodeDate.create(millseconds);
    let formattedDataTime = date.format('Y-m-d H:M:S');
    return formattedDataTime;
}

exports.convertFormattedTimeToMillseconds = function (formattedTime) {
    let time = new Date(formattedTime).getTime();
    return time;
}








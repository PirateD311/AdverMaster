/**
 * Created by liuxun on 16/11/26.
 */
var StatReportModel = require('./StatReportModel');

StatReportModel.everyDayAdvertReport();

var DayTimes = 12 * 60 * 60 *1000;
setInterval(function(){
    StatReportModel.everyDayAdvertReport();
},DayTimes);

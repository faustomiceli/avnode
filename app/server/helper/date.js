var moment = require('moment');

exports.getEventDate = function (date) {
	var d = new Date(date);
	//return moment(d).format("dddd, MMMM Do YYYY, h:mm");
	return moment(d).format("dddd, MMMM Do YYYY");
}

exports.getPerformanceTime = function (date) {
	//return moment(d).format("dddd, MMMM Do YYYY, h:mm");
	return moment(date).format("hh:mm");
}

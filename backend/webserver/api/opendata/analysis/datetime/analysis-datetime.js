
var moment = require("moment");

var formats = [
    moment.ISO_8601,
    // "MM/DD/YYYY HH:mm:ss",
    // "DD/MM/YYYY HH:mm:ss",
    "DD/MM/YYYY",
    "DD/M/YYYY",
    "D/M/YYYY",
    "D/MM/YYYY",
    "MM/DD/YYYY",
    "M/D/YYYY",
    "M/DD/YYYY",
    "MM/D/YYYY",
    "YYYY/MM/DD"
];


var common_formats = [
	"DD/MM/YYYY",
	"MM/DD/YYYY"
];

var number_format = [
	"YYYY"
];

module.exports = {
  	isDatetime  	: isDatetime,
  	isYear 			: isYear,
  	isDataDatetime	: isDataDatetime,
  	isYearsData		: isYearsData,
  	isTimeData		: isTimeData
 };

 function clearDate(date){
 	date = date.replace(/ /g,"");
 	var temp = date.split("/");
 	if (temp.length < 3) {
 		temp = date.split("-");
 	}
 	for (var i = 0; i < temp.length; i++) {
 		if(temp[i].length == 1)
 			temp[i] = "0"+temp[i];
 	}

 	var data = "";

 	for (var i = 0; i < temp.length; i++) {
 		if(i == 0){
 			data += temp[i];
 			continue;
 		}
 		data += "/"+temp[i];
 	}
 	return data;
 }

function isDatetime(str){
	var t = moment(str.replace(/ /g, ""), formats, true).isValid();
	return t;
}

function isYear(str){
	return moment(str.replace(/ /g, ""),number_format,true).isValid();
}

function isDataDatetime(array_data){
	var flag = true;
	for (var i = 0; i < array_data.length; i++) {
		if(!isDatetime(array_data[i])){
			flag = false;
			break;
		}
	}
	if (flag) 
		return true;
	return false;
}

function isYearsData(array){
	var flag = true;
	for (var i = 0; i < array.length; i++) {
		if(isYear(array[i])){
			if(((i+1) < array.length) && (0<Math.abs(array[i] - array[i+1])<=10)){ //for 
				continue;
			}else if(i+1 == array.length){ //for the last item 
				continue;
			}
			flag = false;
			break;
		}else{
			flag = false;
			break;
		}
	}

	if (!flag) {
		return false;
	}
	return true;
}

function isTimeData(data){
	if (isYearsData(data['data'])) {
		data['format'] = "YYYY";
		return true
	}else if(isDataDatetime(data['data'])){
		for (var i = 0; i < data['data'].length; i++) {
			data['data'][i] = clearDate(data['data'][i]);
		}
		
		var format = findDateFormat(data['data']);
		data['year'] = findYear(data['data'],format);
		data['month'] = findMonth(data['data'],format);
		data['data'] = formatAllDate(format,data['data']);
		data['format'] = "YYYY/MM/DD";
		
		return true;
	}

	return false;
}


function formatAllDate(format,allDate){
	for (var i = 0; i < allDate.length; i++) {
		var t = moment(allDate[i],format);
		allDate[i] = t.format("YYYY")+"/"+t.format("MM")+"/"+t.format("DD");
	}
	return allDate;
}

function findMonth(data,format){
	var check = [];
	for (var i = 0; i < data.length; i++) {
		var t = moment(data[i],format);
		check.push(t.format("YYYY")+"/"+t.format("MM"));
	}
	return check;
}

function findYear(data,format){
	var check = [];
	for (var i = 0; i < data.length; i++) {
		var t = moment(data[i],format);
		check.push(t.format("YYYY"));
	}
	return check;
}



function findDateFormat(data){
	var valid = findFormatsValid(data);
	var temp = [];
	for (var i = 0; i < valid.length; i++) {
		if(i != 0){
			if(temp.length == 1){
				temp = isHasData(valid[i],temp[0]);
			}else if(temp.length == 0){
				return false;
			}else{
				temp = findCommonData(temp,valid[i]);
			}
		}else{
			temp = findCommonData(valid[i],valid[i+1]);
		}
	}
	return temp[0];
}

function findFormatsValid(data){
	var valid = [];
	var validFor = [];

	for (var i = 0; i < data.length; i++) {
		validFor = [];
		for (var j = 0; j < common_formats.length; j++) {
			if(isFormatValid(common_formats[j],data[i])){
				validFor.push(common_formats[j]);
			}
		}
		valid.push(validFor);
	}

	return valid;
}

function isFormatValid(format,str){
	return moment(str, format, true).isValid();
}

function findCommonData(array1,array2){
	var common = [];
	for (var i = 0; i < array1.length; i++) {
		if(array2.indexOf(array1[i]) != -1)
			common.push(array1[i]);
	}
	return common;
}

function isHasData(array,data){
	return array.indexOf(data) != -1 ? [data] : [];
}


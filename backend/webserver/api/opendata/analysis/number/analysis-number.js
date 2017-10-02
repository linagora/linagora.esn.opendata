var numeral = require('numeral');

var currencyPattern = [
	/^[0-9]+((.|,){1}[0-9]+)*\${1}$/,
	/^[0-9]+((.|,){1}[0-9]+)*euro{1}$/i,
	/^[0-9]+((.|,){1}[0-9]+)*dollars{1}$/i,
	/^[0-9]+((.|,){1}[0-9]+)*VND{1}$/i
]

var numberPattern = [
	/^[0-9]+((.|,){1}[0-9]+)*K{1}$/,
	/^[0-9]+((.|,){1}[0-9]+)*M{1}$/,
	/^[0-9]+((.|,){1}[0-9]+)*B{1}$/
];

var lengthPattern = [
	/^[0-9]+((.|,){1}[0-9]+)*nm$/,
	/^[0-9]+((.|,){1}[0-9]+)*mm$/,
	/^[0-9]+((.|,){1}[0-9]+)*cm$/,
	/^[0-9]+((.|,){1}[0-9]+)*dm$/,
	/^[0-9]+((.|,){1}[0-9]+)*m$/,
	/^[0-9]+((.|,){1}[0-9]+)*km$/,
	/^[0-9]+((.|,){1}[0-9]+)*ft$/,
	/^[0-9]+((.|,){1}[0-9]+)*inch$/,
	/^[0-9]+((.|,){1}[0-9]+)*mile$/,
	/^[0-9]+((.|,){1}[0-9]+)*AU$/,
];

var weighPattern = [
	/^[0-9]+((.|,){1}[0-9]+)*mg$/,
	/^[0-9]+((.|,){1}[0-9]+)*g$/,
	/^[0-9]+((.|,){1}[0-9]+)*kg$/,
	/^[0-9]+((.|,){1}[0-9]+)*tons$/,
	/^[0-9]+((.|,){1}[0-9]+)*pound$/,
];

var timePattern = [
	/^[0-9]+((.|,){1}[0-9]+)*ms$/,
	/^[0-9]+((.|,){1}[0-9]+)*s$/,
	/^[0-9]+((.|,){1}[0-9]+)*min$/,
	/^[0-9]+((.|,){1}[0-9]+)*h$/,
	/^[0-9]+((.|,){1}[0-9]+)*days$/,
	/^[0-9]+((.|,){1}[0-9]+)*months$/,
	/^[0-9]+((.|,){1}[0-9]+)*years$/,
];

var dataPattern = [
	/^[0-9]+((.|,){1}[0-9]+)*bits$/i,
	/^[0-9]+((.|,){1}[0-9]+)*Kb$/,
	/^[0-9]+((.|,){1}[0-9]+)*Mb$/,
	/^[0-9]+((.|,){1}[0-9]+)*Bytes$/i,
	/^[0-9]+((.|,){1}[0-9]+)*MB$/,
	/^[0-9]+((.|,){1}[0-9]+)*KB$/,
	/^[0-9]+((.|,){1}[0-9]+)*GB$/,
	/^[0-9]+((.|,){1}[0-9]+)*TB$/,
];

var unitAnalysis = [
	{
		id 		: 1,
		unit 	: "none",
		check 	: isNoneUnitCol
	},
	{
		id 		: 2,
		unit 	: "%",
		check	: isPercentCol
	},
	{
		id 		: 3,
		unit 	: "currency",
		check	: isCurrencyCol,
	},
	{
		id 		: 4,
		unit 	: "number",
		check	: isNumberCol
	},
	{
		id 		: 5,
		unit 	: "length",
		check	: isLengthCol
	},
	{
		id 		: 6,
		unit 	: "weigh",
		check	: isWeighCol
	},
	{
		id 		: 7,
		unit 	: "time",
		check 	: isTimeCol
	},
	{
		id 		: 8,
		unit 	: "data",
		check 	: isDataCol
	}
];

module.exports = {
	isNumeric 			: isNumeric,
  	isNumbericData  	: isNumbericData,
  	unitAnalysis 		: unitAnalysis
 };


 function isNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    var result =  (RE.test(numeral(input.replace(" ", "")).value()));
    return result;
}

function isNumbericData(data){
	for (var i = 0; i < data.length; i++) {
		if(!isNumeric(data[i])){
			return false;
		}
	}
	return true;
}

function isPercent(input){
	if (/^[0-9]((.|,){1}[0-9]+)*%{1}$/.test(input.replace(/ /g, ""))) {
		if(numeral(input.replace(" ", "")).value()*100 <= 100)
			return true;
	}
	return false;
}
function isPercentCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isPercent(data[i])){
			return false;
		}
	}
	return true;
}

function isCurrency(input){
	for (var i = 0; i < currencyPattern.length; i++) {
		if(currencyPattern[i].test(input.replace(/ /g,"")))
			return true;
	}
	return false;
}

function isCurrencyCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isCurrency(data[i]))
			return false;
	}
	return true;
}

function isNoneUnit(input){
	return /^[0-9]+((.|,){1}[0-9]+)*$/.test(input.replace(/ /g,""));
}

function isNoneUnitCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isNoneUnit(data[i]))
			return false;
	}
	return true;
}

function isNumber(input){
	for (var i = 0; i < numberPattern.length; i++) {
		if(numberPattern[i].test(input.replace(/ /g,"")))
			return true;
	}
	return false;
}

function isNumberCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isNumber(data[i]))
			return false;
	}
	return true;
}

function isLength(input){
	for (var i = 0; i < lengthPattern.length; i++) {
		if(lengthPattern[i].test(input.replace(/ /g,"")))
			return true;
	}
	return false;
}

function isLengthCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isLength(data[i]))
			return false;
	}
	return true;
}

function isWeigh(input){
	for (var i = 0; i < weighPattern.length; i++) {
		if(weighPattern[i].test(input.replace(/ /g,"")))
			return true;
	}
	return false;
}

function isWeighCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isWeigh(data[i]))
			return false;
	}
	return true;
}

function isTime(input){
	for (var i = 0; i < timePattern.length; i++) {
		if(timePattern[i].test(input.replace(/ /g,"")))
			return true;
	}
	return false;
}

function isTimeCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isTime(data[i]))
			return false;
	}
	return true;
}

function isData(input){
	for (var i = 0; i < dataPattern.length; i++) {
		if(dataPattern[i].test(input.replace(/ /g,"")))
			return true;
	}
	return false;
}

function isDataCol(data){
	for (var i = 0; i < data.length; i++) {
		if(!isData(data[i]))
			return false;
	}
	return true;
}

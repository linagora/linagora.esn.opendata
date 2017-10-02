'use strict';


var analysis 		= require('./analysis/analysis-data');
var timeAnalysis 	= analysis.timeAnalysis;
var stringAnalysis 	= analysis.stringAnalysis;
var numberAnalysis 	= analysis.numberAnalysis;
var base 			= analysis.base;

module.exports = function(dependencies) {
  return {
    cutRow 		: cutRow,
    cutData 	: cutData,
    classifyData: classifyData,
    detectData 	: detectData 
  };
};


function detectData(data){
	var t1 = cutRow(data);
	var t2 = cutData(t1);
	var t3 = classifyData(t2);

	return t3;
}



function cutRow(data){ //cut each line of input
	var cut = [];
	var sub = "";
	for(var i=0;i<data.length;i++){
		if(data.charAt(i) != '\n'){
			sub+=data.charAt(i);
		}else{
			if(((i+1) <= data.length) && (data.charAt(i+1) == '\n')){
				continue;
			}else{
				cut.push(sub);
				sub = "";
			}
		}
	}
	cut.push(sub);
	return cut;
}

function cutData(data){ //cut each item in line by ","
	var char =[];
	// console.log(analysis);
	data = stringAnalysis.clearData(data);

	for(var i=0;i<data.length;i++){
		char[i] = data[i].split(",");
	}
	return char;
}

function isValidData(data){
	for (var i = 0; i < data.length; i++) {
		var valid = true; //flag for detect inValid data
		for (var j = 0; j < data[i]['data'].length; j++) {
			if(data[i]["data"][j] == null || data[i]["data"][j] == ""){
				valid = false;
				break;
			}
		}

		if (!valid) {
			data[i]['type'] = 4; // invalid
		}
	}
	return data;
}

function detectTypeData(data){
	for (var i = 0; i < data.length; i++) {
		if(data[i]['type'] == 0){
			if(timeAnalysis.isTimeData(data[i]))
				data[i]['type'] = 2;
		}
	}

	for (var i = 0; i < data.length; i++) {
		if(data[i]['type'] == 0){
			if(numberAnalysis.isNumbericData(data[i]['data'])){
				data[i]['type'] = 3;
			}else{
				data[i]['type'] = 1;
			}
		}
	}

	return data;
}


function setLabelsCol(data){
	var flag = false;
	for (var i = 0; i < data.length; i++) {
		if(((data[i]['type'] == 1) || (data[i]['type'] == 2)) && (!data[i])['category']){
			if(!flag){
				data[i]['label'] = true;
				data[i]['description'] = false;
				flag = true;
			}else{
				data[i]['label'] = false;
				data[i]['description'] = true;
			}
		}
	}
	return data;
}

/*
	data['type'] : 0:undefine , 1:string , 2:time , 3:number , 4:invalid
*/
function classifyData(char){
	var cl = [];
	
	var labels = []; //detect line of labels -> headerRow
	for(var i=0;i<char.length;i++){
		var flag = true;
		for(var j=0;j<char[i].length;j++){
			if(numberAnalysis.isNumeric(char[i][j])){
				if(!timeAnalysis.isYear(char[i][j])){
					flag = false; // if one column in this line is number data -> this line isn't headerRow
					break;
				}
			}
		}
		if(!flag){
			continue; // if not found headerRow yet -> continue
		}else{
			labels = char[i];
			for(var k=0;k<char[i].length;k++){ //parse each item in headerRow to object for save data of each column
				var obj = {};
				obj["title"] = char[i][k];
				obj['data'] = [];
				obj['type'] = 0; //undefine
				cl.push(obj);
			}
			char.splice(i, 1); //cut this line from data array
			break;
		}
	}

	for(var x=0;x<char.length;x++){ //move data item to their column
		for(var y=0;y<char[x].length;y++){
			cl[y]['data'].push(char[x][y]);
		}
	}

	// cut to min lenght of all column
	cutMinData(cl,minLenghtData(cl));

	cl = isValidData(cl);
	cl = detectTypeData(cl);
	cl = base.detectCategory(cl);
	cl = analysis.number(cl);
	cl = setLabelsCol(cl);
	cl = setLabel(cl);

	console.log(cl);

	return cl;

}


//set label col if data don't have yet
function setLabel(data){
	var flag = false;
	for (var i = 0; i < data.length; i++) {
		if(((data[i]['type'] == 1) || (data[i]['type'] == 2)) && data[i]['label'] == true)
			flag = true;
	}
	if (flag) {
		return data;
	}else{
		for (var i = 0; i < data.length; i++) {
			if((data[i]['type'] == 1) || (data[i]['type'] == 2)){
				data[i]['label'] = true;
				break;
			}
		}
		return data;
	}
}




function minLenghtData(data){ //min of all column
	var min = null;
	for (var i = 0; i < data.length; i++) {
	 	if(min == null){
	 		min = data[i]['data'].length;
	 	}else{
	 		if (min > data[i]['data'].length) {
	 			min = data[i]['data'].length;
	 		}
	 	}

	 }
	 return min;
}


function cutMinData(data,min){ // cut data to min lenght
	for (var i = 0; i < data.length; i++) {
		if(data[i]['data'].length > min){
			while((data[i]['data'].length - min) > 0){
				data[i]['data'].pop();
			}
		}
	}
}
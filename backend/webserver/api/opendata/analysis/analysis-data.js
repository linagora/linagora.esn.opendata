var base 		 	= require("./base/base");
var timeAnalysis 	= require("./datetime/analysis-datetime");
var stringAnalysis	= require("./string/analysis-string");
var numberAnalysis	= require("./number/analysis-number");

module.exports = {
    number 		   : analysisNumberData,
    string 		   : analysisStringData,
    datetime	   : analysisDatatimeData,
    base		   : base,
    timeAnalysis   : timeAnalysis,
    stringAnalysis : stringAnalysis,
    numberAnalysis : numberAnalysis
  };


function analysisNumberData(data){
	for (var i = 0; i < data.length; i++) {
		if(data[i]['type'] == 3){
			data[i]['unit'] = 0; //undefine
			for (var j = 0; j < numberAnalysis.unitAnalysis.length; j++) {
				if(numberAnalysis.unitAnalysis[j].check(data[i]['data'])){
					data[i]['unit'] = numberAnalysis.unitAnalysis[j]['id'];
					break;
				}
			}
			if(data[i]['unit'] == 0){
				if(stringAnalysis.testStringData(data[i]['data'])){
					data[i]['type'] = 1;
				}
			}
		}
	}
	return data;
}

function analysisStringData(){

}

function analysisDatatimeData(){
	// for develop
}

function demo(){
	return base.demo();
}


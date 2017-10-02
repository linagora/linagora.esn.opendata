
module.exports = {
  	testString  	: testString,
  	testStringData 	: testStringData,
  	clearString		: clearString,
  	clearData		: clearData
 };


function testString(str){
	var regex = /[a-z]/gim;
	return regex.test(str);
}

function testStringData(data){
	var flag = true;
	for (var i = 0; i < data.length; i++) {
		if(!testString(data[i])){
			flag = false;
			break;
		}
	}
	if(flag)
		return true;
	return false;
}

function clearString(str){
	str = str.replace(/, /g,";");
	str = str.replace(/ ,/g,";");
	str = str.replace(/\r/g,"");
	return str;
}

function clearData(data){
	for (var i = 0; i < data.length; i++) {
		data[i] = clearString(data[i]);
	}
	return data;
}

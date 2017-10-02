module.exports = {
  	detectCategory 	: detectCategory,
  	isCategory		: isCategory,
  	demo			: demo
 };


function isCategory(data){
	var set = new Set(data);

	if(set.size < data.length)
		return true;
	return false;

}

function detectCategory(data){
	for (var i = 0; i < data.length; i++) {
		if((data[i]['type'] == 1) || (data[i]['type'] == 2)){
			if(isCategory(data[i]['data']))
				data[i]['category'] = true;
			else
				data[i]['category'] = false;
		}

	}
	return data;
}

function demo(){
	return "hellooooooooooooooooooooo";
}

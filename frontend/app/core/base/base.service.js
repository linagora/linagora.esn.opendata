angular.module("core.base")
	.service("baseService",function (){
		var self = this;

		this.randomGroup = function(){
			var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
			return shapes[Math.floor((Math.random() * 10))];
		}

		this.classifyMonth = function(month){
			switch(month){
				case "01" : return "Jan";
				case "02" : return "Feb";
				case "03" : return "Mar";
				case "04" : return "Apr";
				case "05" : return "May";
				case "06" : return "Jun";
				case "07" : return "Jul";
				case "08" : return "Aug";
				case "09" : return "Sep";
				case "10" : return "Oct";
				case "11" : return "Nov";
				case "12" : return "Dec";
				default : return "unknow";
			}
		}

		this.getYearOfData = function(data){
			if(data['type'] != 2)
				return [];
			if(data['format'] == "YYYY")
				return data['data'];
			var years = [];
			for (var i = 0; i < data['data'].length; i++) {
				var t = moment(data['data'][i],data['format']);
				years.push(t.format("YYYY"));
			}
			return years;
		}

		this.getCountByKey = function(key,data){
			var count  = 0;
			for (var i = 0; i < data.length; i++) {
				if(key == data[i])
					count++;
			}
			return count;
		}

		this.countItem = function(data){
			var items = [];
			for (var i = 0; i < data.length; i++) {
				var flag = false;
				for (var j = 0; j < items.length; j++) {
					if(items[j]['key'] == data[i]){
						items[j]['count'] += 1;
						flag = true;
						break;
					}
				}

				if (!flag) {
					items.push({
						key   : data[i],
						count : 1
					});
				}
			}

			return items;
		}

		this.getMaxCount = function(data){
			var max = {
				key 	: "",
				count 	: 0
			};
			for (var i = 0; i < data.length; i++) {
				if(data[i]['count'] > max['count'])
					max = data[i];
			}

			return max;
		}

		this.getMinCount = function(data){
			var min = data[0];

			for (var i = 0; i < data.length; i++) {
				if(data[i]['count'] < min['count'])
					min = data[i];
			}

			return min;
		}

		this.getMax = function(data){
			var max = {
				index : 0,
				max   : 0
			};
			
			for (var i = 0; i < data.length; i++) {
				if(data[i] > max['max']){
					max['index'] = i;
					max['max'] = data[i];
				}
			}

			return max;
		}

		this.getMin = function(data){
			var min = {
				index : 0,
				min   : data[0]
			}

			for (var i = 0; i < data.length; i++) {
				if(data[i] < min['min']){
					min['index'] = i;
					min['min'] = data[i];
				}
			}

			return min;
		}

		this.getAverage = function(data){
			var s = 0;
			for (var i = 0; i < data.length; i++) {
				s += parseInt(data[i]);
			}

			return Math.round(s/data.length);
		}


		this.splitByProperty = function(data,property){
			var propertyData = [];
			var p = [];

			for (var i = 0; i < data.length; i++) {
				if(p.indexOf(data[i][property]) == -1){
					p.push(data[i][property]);
					propertyData.push({
						property : data[i][property],
						data : [data[i]]
					});
				}else{
					propertyData[self.getObjectIndexByProperty('property',propertyData,data[i][property])]['data']
					.push(data[i]);
				}
			}
			console.log(propertyData);
			return propertyData;
		}

		this.getDataByFileIndex = function(file_index,data){
			for (var i = 0; i < data.length; i++) {
				if(data[i]['file_index'] == file_index)
					return data[i]['data'];
			}
			return [];
		}

		this.getObjectIndexByFileIndex = function(file_index,data){
			for (var i = 0; i < data.length; i++) {
				if(data[i]['file_index'] == file_index)
					return i;
			}
			return -1;
		}

		this.getObjectIndexByName = function(name,data){
			for (var i = 0; i < data.length; i++) {
				if(data[i]['name'] == name)
					return i;
			}
			return -1;
		}

		this.getObjectIndexByProperty = function(property,data,value){
			for (var i = 0; i < data.length; i++) {
				if(data[i][property] == value)
					return i;
			}
			return -1;
		}

		this.getDatasByProperty = function(property,data,value){
			var array = [];
			for (var i = 0; i < data.length; i++) {
				if(data[i][property] == value)
					array.push(data[i]);
			}
			return array;
		}

		this.getDataByProperty = function(property,data,value){
			for (var i = 0; i < data.length; i++) {
				if(data[i][property] == value)
					return data[i];
			}
			return null;
		}

		this.makeKey = function(array){
			var keys = [];
			for (var i = 0; i < array[0]['data'].length; i++) {
				var k = "";
				for (var j = 0; j < array.length; j++) {
					k+=array[j]['data'][i]+"-";
				}
				keys.push(k);
			}
			return keys;
		}

		this.getColumnsByProperty = function(array,filter,property){
			var columns = [];
			for (var i = 0; i < array.length; i++) {
				if(filter.indexOf(array[i][property]) != -1)
					columns.push(array[i]);
			}
			return columns;
		}

		this.renderTitleToArray = function(data){
			var array = [];
			for (var i = 0; i < data.length; i++) {
				array.push(data[i]['title']);
			}
			return array;
		}

		this.isContain = function(src,des){
			if((!Array.isArray(src)) && (!Array.isArray(des))){
				return src == des ? true : false;
			}
			if((!Array.isArray(src)) && (Array.isArray(des))){
				return false;
			}
			if((Array.isArray(src)) && (!Array.isArray(des))){
				return src.indexOf(des) == -1 ? false : true;
			}
			if((Array.isArray(src)) && (Array.isArray(des))){
				var flag = true;
				for (var i = 0; i < des.length; i++) {
					if (src.indexOf(des[i]) == -1) {
						flag = false;
						break;
					}
				}
				return flag;
			}
		}

		this.delete_item = function(array,arrayToDelete,property){
			if (array.length == 0) return arrayToDelete;
			for (var i = arrayToDelete.length - 1; i >= 0 ; i--) {
				if(array.indexOf(arrayToDelete[i][property]))
					arrayToDelete.splice(i,1);
			}
			return arrayToDelete;
		}

		this.cutArray = function (array,index,offset){
			if(index < 0 || offset < 0)
				return [];
			if (array.length < index)
				return [];
			if ((offset > array.length) || (offset+index > array.length))
				return array;

			var cut = [];
			for (var i = 0; i < offset; i++) {
				cut.push(array[index]);
				index+=1;
			}
			return cut;
		};

		this.sloveTotalArray = function(array){
			var t = 0;
			for (var i = 0; i < array.length; i++) {
				t+=Math.abs(numeral(array[i].replace(" ","")).value());
			}
			return t;
		};

		this.sloveTotalArrayCategory = function(array){
			var listTotal = new Array(array[0].length);
				listTotal.fill(0);
			for (var i = 0; i < array.length; i++) {
				for (var j = 0; j < array[i]['value'].length; j++) {
					listTotal[j]+=Math.abs(numeral(array[i]['value'][j]).value());
				}
			}
			return listTotal;
		}

		this.sloveByKey = function(key,array,data){
			var s = 0;
			for (var i = 0; i < array.length; i++) {
				if(key == array[i])
					s+=Math.abs(numeral(data[i]).value());
			}
			return s;
		}

		this.detectChartId = function(id){
			var params = id.split("-");
			params.shift();
			return params;
		};

		this.delete_file = function(index,data){
			for (var i = 0; i < data.length; i++) {
				if(data[i].file_index == index){
					data.splice(i, 1);
					break;
				}
			}
			return data;
		}

		this.isDatetime = function (str){
			var t =  moment(str.replace(" ", ""),self.formats, true).isValid();
			return t;
		};

		this.isYear = function (str){
			var t = moment(str.replace(" ", ""),self.number_format,true).isValid();
			return t;
		};
		this.number_format = [
			"YYYY"
		];

		this.formats = [
    		moment.ISO_8601,
    		"MM/DD/YYYY HH:mm:ss",
    		"DD/MM/YYYY HH:mm:ss",
    		"DD/MM/YYYY",
    		"DD/M/YYYY",
    		"D/M/YYYY",
    		"D/MM/YYYY",
    		"MM/DD/YYYY",
    		"YYYY/MM/DD"
		];


	});
angular.module("core.chartValid")
	.service("comboChartValidService" , ["baseService" , 
		function comboChartValidService(baseService) {
		
			// condition to draw combo chart is input data has more than 2 "number" column which unit different from 
			// other and has at least 1 "time" column 
			this.comboChartValid = function(labels,data_labels,datas){
				// return false;
				data_labels = data_labels.concat(labels);
				var data = baseService.splitByProperty(datas,'unit');
				if(data.length > 1){
					for (var i = 0; i < data_labels.length; i++) {
						if(data_labels[i]['type'] == 2)
							return true;
					}
				}
				return false;
			}

			this.parseToComboData = function(labels,data_labels,datas){
				var chart_data = [];
			
				var chart_table = {
					chart : 6,
					data  : []
				};

				var unitData = baseService.splitByProperty(datas,'unit');

				data_labels = data_labels.concat(labels);

				for (var i = 0; i < unitData.length; i++) {
					// unitData[i]['data']
					if((i + 1) < unitData.length){
						for (var j = 0; j < data_labels.length; j++) {
							if(data_labels[j]['type'] == 2){
								var sorted1 = sortDataByDatetime({time_col:data_labels[j] , datas : unitData[i]['data']});
								var sorted2 = sortDataByDatetime({time_col:data_labels[j] , datas : unitData[i+1]['data']});
								var parse  = parseCategoryData(sorted1['time_col'],sorted1['datas'],sorted2['datas']);

								chart_data.push(parse);
								chart_table['data'].push({
									labels  : data_labels[j],
									data 	: unitData[i]['data'].concat(unitData[i+1]['data'])
								});
							}
						}
					}
				}

				allChartTable[allData.length - 1]['data'].push(chart_table);
				return chart_data;
			}


			function parseCategoryData(data_title,datas1,datas2){
				
				var data = [];

				if(data_title['category']){
					var bar  = categoryBarData(data_title,datas1);
					var line = categoryLineData(data_title,datas2);
					var data = bar.concat(line);
				}else{
					var bar  = barData(data_title,datas1);
					var line = lineData(data_title,datas2);
					var data = bar.concat(line);
				}
					
		
				return data;
			}



			function categoryBarData(category,datas){
				var set 	= new Set(category['data']);
				var array 	= Array.from(set);
				var data 	= [];
				/*
				{
					key : ?,
					bar : true,
					values : [{x : ? , y : ?}];
				}
				*/

				for (var i = 0; i < datas.length; i++) {
					var temp = {
						key 	: datas[i]['title'],
						bar 	: true,
						values 	: []
					}

					for (var j = 0; j < array.length; j++) {
						var t = [ new Date(array[j]).getTime(), 
							baseService.sloveByKey(array[j],category['data'],datas[i]['data'])
						];
						// var t = {
						// 	x :  new Date(array[j]).getTime(),
						// 	y : baseService.sloveByKey(array[j],category['data'],datas[i]['data'])
						// }
						temp['values'].push(t);
					}
					data.push(temp);
				}

				

				return data;
			}

			function categoryLineData(category,datas){
				var set 	= new Set(category['data']);
				var array 	= Array.from(set);
				var data 	= [];
				/*
				{
					key : ?,
					bar : true,
					values : [{x : ? , y : ?}];
				}
				*/

				for (var i = 0; i < datas.length; i++) {
					var temp = {
						key 	: datas[i]['title'],
						values 	: []
					}

					for (var j = 0; j < array.length; j++) {
						var t  = [ new Date(array[j]).getTime(), 
							baseService.sloveByKey(array[j],category['data'],datas[i]['data'])
						];
						// var t = {
						// 	x :  new Date(array[j]).getTime(),
						// 	y : baseService.sloveByKey(array[j],category['data'],datas[i]['data'])
						// }
						temp['values'].push(t);
					}
					data.push(temp);
				}

				

				return data;
			}


			function barData(labels,datas){
				var data 	= [];
				/*
				{
					key : ?,
					bar : true,
					values : [{x : ? , y : ?}];
				}
				*/

				for (var i = 0; i < datas.length; i++) {
					var temp = {
						key 	: datas[i]['title'],
						bar 	: true,
						values 	: []
					}

					for (var j = 0; j < labels['data'].length; j++) {
						var t = [ new Date(labels['data'][j]).getTime(), datas[i]['data'][j]];
						temp['values'].push(t);
					}
					data.push(temp);
				}

				return data;
			}

			function lineData(labels,datas){
				var data 	= [];
				/*
				{
					key : ?,
					bar : true,
					values : [{x : ? , y : ?}];
				}
				*/

				for (var i = 0; i < datas.length; i++) {
					var temp = {
						key 	: datas[i]['title'],
						values 	: []
					}

					for (var j = 0; j < labels['data'].length; j++) {
						var t = [ new Date(labels['data'][j]).getTime(), datas[i]['data'][j]];
						temp['values'].push(t);
					}
					data.push(temp);
				}

				return data;
			}

			function sortDataByDatetime(obj){
				var array = [];
				for (var i = 0; i < obj['time_col']['data'].length; i++) {
					var t = {}
					t['id'] = i;
					t['date'] = obj['time_col']['data'][i];
					t['data'] = [];
					for (var j = 0; j < obj['datas'].length; j++) {
						t['data'].push(obj['datas'][j]['data'][i]);
					}

					array.push(t);
				}

				array.sort(sortFunction);

				for (var i = 0; i < obj['time_col']['data'].length; i++) {
					obj['time_col']['data'][i] = array[i]['date'];
					for (var j = 0; j < obj['datas'].length; j++) {
						obj['datas'][j]['data'][i] = array[i]['data'][j];
					}
				}
				return obj;
			}

			function sortFunction(a,b){  
	    		var dateA = new Date(a.date);
	    		var dateB = new Date(b.date);
	    		return dateA > dateB ? 1 : -1;  
			}

	}]);
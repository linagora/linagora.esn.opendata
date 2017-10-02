angular.module("core.chartValid")
	.service("lineChartValidService" , ["baseService" , 
		function lineChartValidService(baseService) {


		
		this.lineChartValid = function(labels,data_labels,datas){
			// for time column
			if(labels['type'] == 2)
				return true;
			for (var i = 0; i < data_labels.length; i++) {
				if(data_labels[i]['type'] == 2)
					return true;
			}

			// for time title
			var count = 0;
			for (var i = 0; i < datas.length; i++) {
				if((baseService.isYear(datas[i]['title']) || baseService.isDatetime(datas[i]['title']))){
					count+=1;
				}
			}
			if(count > 2)
				return true;
			return false;
		}

		this.parseToLineData = function(labels,data_labels,datas){
			var chart_data = [];
			var chart = [];
			var year_data = [];

			var chart_table = {
				chart : 3,
				data  : []
			};
			var t = {
				data 	: [],
				table 	: []
			}

			data_labels = data_labels.concat(labels);

			// array of all time column
			var data_title_category = [];
			for (var i = 0; i < data_labels.length; i++) {
				if (data_labels[i]['type'] == 2){
					data_title_category.push(data_labels[i]);
				}
			}


			//split by unit
			var unitData = baseService.splitByProperty(datas,'unit');

			for (var x = 0; x < unitData.length; x++) {

				t = parseCategoryData(data_title_category,unitData[x]['data']);
				if(t['data'].length != 0){
					for (var i = 0; i < t['data'].length; i++) {
						chart = [];
						for (var k = 0; k < t['data'][i]['data_title'].length; k++) {
							var temp = {};
							temp['key'] = t['data'][i]['data_title'][k];
							temp['values'] = [];
							for (var j = 0; j < t['data'][i]['data_category'].length; j++) {
								
								temp['values'].push({
									x : (new Date(t['data'][i]['data_category'][j]['key'])).getTime(),
									y : t['data'][i]['data_category'][j]['value'][k]
								});
							}
							chart.push(temp);
						}
						chart_data.push(chart)
					}
	
					for (var i = 0; i < t['table'].length; i++) {
						chart_table['data'].push(t['table'][i]);
					}
				}


				for (var k = 0; k < data_labels.length; k++) {
					if((data_labels[k]['type'] == 2) && (!data_labels[k]['category'])){
						var t = sortDataByDatetime({time_col:data_labels[k] , datas : unitData[x]['data']});
						data_labels[k] = t['time_col'];
						unitData[x]['data'] = t['datas'];
						chart = [];
						for (var i = 0; i < unitData[x]['data'].length; i++) {
							var temp = {}
							temp['key'] = unitData[x]['data'][i]['title'];
							temp['values'] = [];
							for (var j = 0; j < data_labels[k]['data'].length; j++) {
								temp['values'].push({
									x : (new Date(data_labels[k]['data'][j])).getTime(),
									y : numeral(unitData[x]['data'][i]['data'][j].replace(" ","")).value()
								});
							}
							chart.push(temp);
						}
						chart_data.push(chart);
						chart_table['data'].push({
						labels  : data_labels[k],
						data 	: unitData[x]['data']
					});
					}
				}

				for (var i = 0; i < unitData[x]['data'].length; i++) {
					if((baseService.isYear(unitData[x]['data'][i]['title']) || 
						baseService.isDatetime(unitData[x]['data'][i]['title'])))
						year_data.push(unitData[x]['data'][i]);
				}

			}

			if(year_data.length!=0){
				chart = [];
				for (var i = 0; i < labels['data'].length; i++) {
					var temp = {};
					temp['key'] = labels['data'][i];
					temp['values'] = [];
					for (var j = 0; j < year_data.length; j++) {
						temp['values'].push({
							x : (new Date(year_data[j]['title'])).getTime(),
							y : numeral(year_data[j]['data'][i].replace(" ","")).value()
						});
					}
					chart.push(temp);
				}
				chart_data.push(chart);
				chart_table['data'].push({
					labels  : labels,
					data 	: datas
				});

			}

			// split by month for each month
			var monthDataByYear = monthByYear(data_labels,datas);
			chart_data = chart_data.concat(monthDataByYear['data']);
			chart_table['data'] = chart_table['data'].concat(monthDataByYear['table']);

			allChartTable[allData.length - 1]['data'].push(chart_table);
			return chart_data;
		}

		function monthByYear(labels,datas){
			var data_return  = {
				data  : [],
				table : []
			}
			
			for (var i = 0; i < labels.length; i++) {
				if(labels[i]['month_label']){
					var monthDataByYear = [];
					var years = baseService.getYearOfData(labels[i]);
					var set = new Set(years);
					var yearArray = Array.from(set);

					for (var x = 0; x < yearArray.length; x++) {
						monthDataByYear.push({
							year  : yearArray[x],
							month : []
						});
						for (var y = 1; y <= 12; y++) {
							monthDataByYear[x]['month'].push({
								month : y < 10 ? "0"+y : y+"",
								data  : 0
							});
						}
					}

					for (var k = 0; k < datas.length; k++) {
						for (var j = 0; j < labels[i]['data'].length; j++) {
							var y = moment(labels[i]['data'][j],labels[i]['format']).format("YYYY");
							var m = moment(labels[i]['data'][j],labels[i]['format']).format("MM");
							var yIndex = baseService.getObjectIndexByProperty('year',monthDataByYear,y);
							var mIndex = baseService.getObjectIndexByProperty('month',monthDataByYear[yIndex]['month'],m);
							monthDataByYear[yIndex]['month'][mIndex]['data'] += numeral(datas[k]['data'][j]).value();
						}

						var tempData = [];
						for (var x = 0; x < monthDataByYear.length; x++) {
							var temp = {
								key : monthDataByYear[x]['year'],
								values : []
							}
							for (var y = 0; y < monthDataByYear[x]['month'].length; y++) {
								temp['values'].push({
									x : monthDataByYear[x]['month'][y]['month'],
									y : monthDataByYear[x]['month'][y]['data']
								});
							}
							tempData.push(temp);

						}
						data_return['data'].push(tempData);
						data_return['table'].push({
							labels : labels[i],
							data   : [datas[k]]
						});
					}



				}
			}
			return data_return;
		}

		function parseCategoryData(data_title,datas){
			var data = {
				data 	: [],
				table 	: [],
			};

			for (var i = 0; i < data_title.length; i++) {
				if (data_title[i]['category'] && ((data_title[i]['type'] == 2) || 
					((new Set(data_title[i]['data']))).size < 25) ) {

					var t = sortDataByDatetime({time_col:data_title[i] , datas : datas});
					data_title[i] = t['time_col'];
					datas = t['datas'];
					
					data['data'].push(categoryData(data_title[i]['data'],datas,data_title[i]['title']));
					data['table'].push({
						labels 	: data_title[i],
						data 	: datas
					});
				}
			}
			return data;
		}

		function categoryData(category,datas,title){
			var set 	= new Set(category);
			var array 	= Array.from(set);
			var data 	= {
				title 			: title,
				data_title 		: [],
				data_category 	: []
			};

			for (var i = 0; i < datas.length; i++) {
				data['data_title'].push(datas[i]['title']);
			}

			for (var i = 0; i < array.length; i++) {
				var temp = {
					key 	: array[i],
					value 	: []
				};
				for (var j = 0; j < datas.length; j++) {
					temp['value'].push(baseService.sloveByKey(temp['key'],category,datas[j]['data']));
				}


				data['data_category'].push(temp);
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
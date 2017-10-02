angular.module("core.chartValid")
	.service("pieChartValidService" , ["baseService" , 
		function pieChartValidService(baseService) {
		
		this.pieChartValid = function(labels,data_labels,datas){
			return true;
		}

		this.parseToPieData = function(labels,data_labels,datas){
			var chart_data = [];
			var chart = [];
			var chart_table = {
				chart : 2,
				data  : []
			};

			var t = {
				data 	: [],
				table 	: []
			}
			var data_title_category = [];
			for (var i = 0; i < data_labels.length; i++) {
				if (data_labels[i]['type'] != 2)
					data_title_category.push(data_labels[i]);
			}

			//parse for category data
			for (var k = 0; k < datas.length; k++) {
				if((labels['category']) && (labels['type'] != 2)){
					t = parseCategoryData(labels,data_title_category,[datas[k]]);
				}else if((!labels['category']) && (labels['type'] != 2)){
					t = parseCategoryData([],data_title_category,[datas[k]]);
				}
				if(t['data'].length != 0){
					for (var i = 0; i < t['data'].length; i++) {
						var s = baseService.sloveTotalArrayCategory(t['data'][i]['data_category']);
						chart = [];
						for (var j = 0; j < t['data'][i]['data_category'].length; j++) {
							chart.push({
								label : t['data'][i]['data_category'][j]['key'],
								values: (numeral(t['data'][i]['data_category'][j]['value'][0]).value()*100)/s[0]

							});
						}
						
						chart_data.push(chart)
					}

					for (var i = 0; i < t['table'].length; i++) {
						chart_table['data'].push(t['table'][i]);
					}
				}
			}


			// parse for none category data
			if((!labels['category']) && (labels['type'] !=2) && (labels['data'].length <=20)){
				for (var i = 0; i < datas.length; i++) {
					var s = baseService.sloveTotalArray(datas[i]['data']);
					chart = [];
					for (var j = 0; j < labels['data'].length; j++) {
						chart.push({
							label  : labels['data'][j],
							values : (numeral((datas[i]['data'])[j].replace(" ","")).value()*100)/s
						});
					}
					chart_data.push(chart);
					chart_table['data'].push({
						labels  : labels,
						data 	: [datas[i]]
					});
				}
			}

			for (var k = 0; k < data_labels.length; k++) {
				if((!data_labels[k]['category']) && (data_labels[k]['type'] != 2) && (data_labels[k]['data'].length <= 20)){
					for (var i = 0; i < datas.length; i++) {
						var s = baseService.sloveTotalArray(datas[i]['data']);
						chart = [];
						for (var j = 0; j < data_labels[k]['data'].length; j++) {
							chart.push({
								label  : data_labels[k]['data'][j],
								values : (numeral((datas[i]['data'])[j].replace(" ","")).value()*100)/s
							});
						}
						chart_data.push(chart);
						chart_table['data'].push({
							labels  : data_labels[k],
							data 	: [datas[i]]
						});
					}
				}
			}

			var statistic = statisticCategory(data_labels.concat(labels));
			chart_data = chart_data.concat(statistic['data']);
			chart_table['data'] = chart_table['data'].concat(statistic['table']);

			allChartTable[allData.length - 1]['data'].push(chart_table);
			return chart_data;
		}
		
		function statisticCategory(labels){
			var return_value = {
				data  : [],
				table : []
			};
			for (var i = 0; i < labels.length; i++) {
				if((labels[i]['category']) && (labels[i]['type'] != 2) ){
					var set = new Set(labels[i]['data']);
					if(set.size < 20){
						var temp = [];
						var array = Array.from(set);
						for (var j = 0; j < array.length; j++) {
							temp.push({
								label  : array[j],
								values : 100*baseService.getCountByKey(array[j],labels[i]['data'])/labels[i]['data'].length
							});
						}
						return_value['data'].push(temp);
						return_value['table'].push({
							labels : labels[i],
							data   : []
						})
					}else{
						continue;
					}
				}
			}
			return return_value;
		}

		function parseCategoryData(labels,data_title,datas){
			var data = {
				data 	: [],
				table 	: []
			};

			if(labels['category']){
				data['data'].push(categoryData(labels['data'],datas,labels['title']));
				data['table'].push({
					labels 	: labels,
					data 	: datas
				});
			}

			for (var i = 0; i < data_title.length; i++) {
				if (data_title[i]['category'] && ((data_title[i]['type'] == 2) || 
					((new Set(data_title[i]['data']))).size < 25) ) {
					if(data_title[i]['type'] != 2){
						data['data'].push(categoryData(data_title[i]['data'],datas,data_title[i]['title']));
					}else{
						data['data'].push(categoryData(data_title[i]['month'],datas,data_title[i]['title']));
					}

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
					var t = baseService.sloveByKey(temp['key'],category,datas[j]['data']);
					temp['value'].push(t);
				}


				data['data_category'].push(temp);
			}

			return data;
		}

	}]);
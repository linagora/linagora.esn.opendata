angular.module("core.chartValid")
	.service("bubbleChartValidService" , [ "baseService" , 
		function bubbleChartValidService(baseService) {

			// condition to draw bubble chart is the input data has more than 2 "number" col
			this.bubbleChartValid = function(labels,data_labels,datas){
				// return false;
				if(datas.length > 2)
					return true;
				return false;
			}

			this.parseToBubbleData = function(labels,data_labels,datas){
				var chart_data = [];
			
				var chart_table = {
					chart : 5,
					data  : []
				};

				data_labels = data_labels.concat(labels);

				var t = parseCategoryData(data_labels,datas);
				if(t['data'].length != 0){
					var ignore = [];
					for (var i = 0; i < t['data'].length; i++) {
						if(t['data'][i]['data_category'].length <= 15){
							chart_data.push(t['data'][i]['data_category']);
						}else{
							ignore.push(i);
						}
					}

					for (var i = 0; i < t['table'].length; i++) {
						if(ignore.indexOf(i) != -1)
							continue;
						chart_table['data'].push(t['table'][i]);
					}
				}

				allChartTable[allData.length - 1]['data'].push(chart_table);
				return chart_data;
			}


			function parseCategoryData(data_title,datas){
				var data = {
					data 	: [],
					table 	: []
				};

				for (var i = 0; i < data_title.length; i++) {
					if (data_title[i]['category']) {
						var index  = 0;
						var offset = 3;
						for (var j = 0; j < datas.length; j++) {
							index = j;
							if((j + offset) > datas.length)
								break;

							data['data'].push(categoryData(data_title[i]['data'],
								baseService.cutArray(datas,index,offset),data_title[i]['title']));
							data['table'].push({
								labels 	: data_title[i],
								data 	: baseService.cutArray(datas,index,offset)
							});

						}
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
						values 	: []
					};
					for (var j = 0; j < datas[0]['data'].length; j++) {
						if(category[j] == array[i]){
							temp['values'].push({
								shape : baseService.randomGroup(),
								size  : numeral(datas[0]['data'][j]).value(),
								x 	  : numeral(datas[1]['data'][j]).value(),
								y	  : numeral(datas[2]['data'][j]).value()
							});
						}
					}


					data['data_category'].push(temp);
				}

				return data;
			}

		}
	]);
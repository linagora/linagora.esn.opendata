angular.module("core.chartValid")
	.service("barChartService" , [ "baseService" , 
		function barChartService(baseService) {

		var self = this;
		
		this.parseAllowRow = function(labels,datas,data_title){
			var chart_data = [];
			for (var i = 0; i < labels.length; i++) {
				var chart_item = {};
				var chart_item_data = [];
				chart_item['key'] = labels[i];
				for (var j = 0; j < datas.length; j++) {
					var temp = {};
					temp['x'] = data_title[j];
					temp['y'] = numeral(datas[j][i]).value()*100;
					chart_item_data.push(temp);
				}
				chart_item['values'] = chart_item_data;
				chart_data.push(chart_item);
			}
			return chart_data;
		}

		this.parseAllowCol = function(labels,datas,data_title){
			var chart_data = [];
			for (var i = 0; i < datas.length; i++) {
				var chart_item = {};
				var chart_item_data = [];
				chart_item['key'] = data_title[i];
				for (var j = 0; j < labels.length; j++) {
					var temp = {};
					temp['x'] = labels[j];
					temp['y'] = numeral(datas[i][j]).value()*100;
					chart_item_data.push(temp);
				}
				chart_item['values'] = chart_item_data;
				chart_data.push(chart_item);
			}
			return chart_data;
		}


		this.parseToBarData = function(labels,data_labels,datas,type){
			var chart_data = [];
			var chart = null;
			
			var index;
			var offset;
			var chart_table = {
				chart : type,
				data  : []
			};

			//split by unit
			var unitData = baseService.splitByProperty(datas,'unit');

			// parse for category data
			for (var x = 0; x < unitData.length; x++) {
				
				var t = parseCategoryData(labels,data_labels,unitData[x]['data']);
				if(t['data'].length != 0){
					var ignore = [];
					for (var i = 0; i < t['data'].length; i++) {
						if(t['data'][i]['data_category'].length <= 30){
							chart = [];
							for (var k = 0; k < t['data'][i]['data_title'].length; k++) {
								var temp = {};
								temp['key'] = t['data'][i]['data_title'][k];
								temp['values'] = [];
								for (var j = 0; j < t['data'][i]['data_category'].length; j++) {
									temp['values'].push({
										x : t['data'][i]['data_category'][j]['key'],
										y : t['data'][i]['data_category'][j]['value'][k]
									});
								}
								chart.push(temp);
							}
							chart_data.push(chart);
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
			}


			// parse for none category data
			for (var x = 0; x < unitData.length; x++) {

				var data = [];
				var data_title = [];
				for (var i = 0; i < unitData[x]['data'].length; i++) {
					data.push(unitData[x]['data'][i]['data']);
					data_title.push(unitData[x]['data'][i]['title']);
				}

				if((!labels['category']) && ((labels['data'].length < 20) || (type != 1))){
					for (var i = 0; i < unitData[x]['data'].length; i+=3) {
						chart = null;
						index = i;
						i+3 >  unitData[x]['data'].length ? (offset =  unitData[x]['data'].length - i):offset = 3;
	
						if(labels['data'].length >=  unitData[x]['data'].length){
							chart = self.parseAllowCol(labels['data'],
								baseService.cutArray(data,index,offset),
								baseService.cutArray(data_title,index,offset),chart_table);
					    }else{
							chart = self.parseAllowRow(labels['data'],
								baseService.cutArray(data,index,offset),
								baseService.cutArray(data_title,index,offset),chart_table);
					    }
	
			    
					    chart_data.push(chart);
	
				 	   chart_table['data'].push({
							labels  : labels,
							data 	: baseService.cutArray(unitData[x]['data'],index,offset)
						});
					}
				}

				for (var i = 0; i < data_labels.length; i++) {
					if((!data_labels[i]['category']) && (data_labels[i]['data'].length <= 20)){
						for (var j = 0; j < unitData[x]['data'].length; j+=3) {
							chart = null;
							index = j;
							j+3 > unitData[x]['data'].length ? (offset = unitData[x]['data'].length - j):offset = 3;

						if(data_labels[i]['data'].length >= unitData[x]['data'].length){
							chart = self.parseAllowCol(data_labels[i]['data'],
								baseService.cutArray(data,index,offset),
								baseService.cutArray(data_title,index,offset),chart_table);
				    	}else{
							chart = self.parseAllowRow(data_labels[i]['data'],
								baseService.cutArray(data,index,offset),
								baseService.cutArray(data_title,index,offset),chart_table);
				    	}

				    	chart_data.push(chart);

			    

				    	chart_table['data'].push({
							labels  : data_labels[i],
							data 	: baseService.cutArray(unitData[x]['data'],index,offset)
						});

						}
					}
				}

			}

			allChartTable[allData.length - 1]['data'].push(chart_table);
			return chart_data;
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
				if (data_title[i]['category'] && (data_title[i]['type'] != 2) && 
					((new Set(data_title[i]['data']))).size < 25)  {

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


	}]);
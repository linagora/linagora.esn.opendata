angular.module("dashboard")
	.service("dashboardService" , [
		"coreService",
		"statisticTable", 
		"dashboardStatistic" ,

		function (coreService,statisticTable,dashboardStatistic) {
		var self = this;
		
		this.renderItems = function(data){
			var items = [];
			var item = {};
			var index = 0;
			for (var i = 0; i < data.length; i++) {
				item = {};
				item['index'] = index;
				item['type'] = data[i]['type'];
				item['title'] = data[i]['title'];
				item['label'] = data[i]['label'];
				item['data'] = data[i]['data'];
				item['unit'] = data[i]['unit'];
				item['category'] = data[i]['category'];
				item['format'] = data[i]['format'];

				var category_flag = true;
				if((item['type'] == 1) || (item['type'] == 2) && item['label'] == true){
					item['active'] = true;
				}else if ((item['type'] == 1) || (item['type'] == 2) && category_flag == true) {
					item['active'] = true;
					category_flag = false;
				}else if(item['type'] == 3){
					item['active'] = true;
				}else{
					item['active'] = false;
				}


				items.push(item);
				index++;
			}


			for (var i = 0; i < data.length; i++) {
				if((data[i]['type'] == 2) && (data[i]['format'] != "YYYY")){
					var month = {};
					var year = {};

					month['index'] = index;
					month['type'] = 2;
					month['title'] ="month of "+data[i]['title'];
					month['label'] = false;
					month['data'] = data[i]['month'];
					month['category'] = data[i]['category'];
					month['format'] = "YYYY/MM";
					month['month_label'] = true;

					items.push(month);
					index++;

					year['index'] = index;
					year['type'] = 2;
					year['title'] = "year of "+data[i]['title'];
					year['label'] = false;
					year['data'] = data[i]['year'];
					year['category'] = data[i]['category'];
					year['format'] = "YYYY";

					items.push(year);
					index++;
				}
			}

			return items;
		}

		this.parseToChartData = function(data,filter){
			var all_chart_data = [];
			var chart_data = [];
		
			var labels = [];
			var datas = [];
			var data_labels = [];
			var chart_id = null;

			for (var i = 0; i < data.length; i++) {
				
					if((data[i]['type'] == 1) || (data[i]['type'] == 2)){
						if(data[i]['label']){
							labels = data[i];
							continue;
						}
						data_labels.push(data[i]);
					}else{
						datas.push(data[i]);
					}	
			}

			var valid = coreService.baseService.delete_item(filter,coreService.chartValid.chartValid,'id');
			for (var i = 0; i < coreService.chartValid.chartValid.length; i++) {
				chart_data = [];
				chart_id = 0;
				if(coreService.chartValid.chartValid[i].name(labels,data_labels,datas)){

					chart_id = coreService.chartValid.chartValid[i].id;
					chart_data = coreService.chartValid.chartValid[i].data(labels,data_labels,datas);
					
					all_chart_data.push({
						chart : chart_id,
						data  : chart_data
					});
				}
			}

			console.log(all_chart_data);
			return all_chart_data;
		}


		this.classifyChartId = function(id){
			switch(id){
				case 0 : return "VERTICAL_BAR_CHART";
				case 1 : return "HORIZONTAL_BAR_CHART";
				case 2 : return "PIE_CHART";
				case 3 : return "Evolution of"; //line chart
				case 4 : return "AREA_CHART";
				case 5 : return "BUBBLE_CHART";
				case 6 : return "COMBO_CHART";
				default : return "Chart of";
			}
		}

		this.autoChartTitle = function(id,table){
			var name = self.classifyChartId(id);
			name = name +"_"+ table['labels']['title'];
			for (var i = 0; i < table['data'].length; i++) {
				name = name +","+ table['data'][i]['title'];
			}
			return name;
		}		

		this.parseToDataTable = function(table){
			var data_table = {};
			var label = [];
			var data = [];
			
			label.push(table['labels']['title']);
			for (var i = 0; i < table['data'].length; i++) {
				label.push(table['data'][i]['title']);
			}
		
			for (var i = 0; i < table['labels']['data'].length; i++) {
				var temp = {};
					temp['label'] = table['labels']['data'][i];
					temp['data'] = [];
				for (var j = 0; j < table['data'].length; j++) {
					temp['data'].push(table['data'][j]['data'][i]);
				}
				data.push(temp);
			}
				
			data_table['label'] = label;
			data_table['data']  = data;
			return data_table;
		}

		this.parseToStatisticTable = function(type,data,table){
			var data_table = {
				labels: [],
				data  : []
			};

			(table['data']).unshift(table['labels']);
			for (var i = 0; i < table['data'].length; i++) {
				data_table['labels'].push(table['data'][i]['title']);		
			}
			(table['data']).shift();
		

			switch(type){
				case 0 : 
					var t = statisticTable.statisticBarChartTable(data);
					data_table['data'] = t;
					break;
				case 1 : 
					var t = statisticTable.statisticBarChartTable(data);
					data_table['data'] = t;
					break;
				case 2 : 
					var t = statisticTable.statisticPieChartTable(data);
					data_table['data'] = t;
					break;
				case 3 : 
					var t = statisticTable.statisticLineChartTable(data);
					if(!Array.isArray(t)){
						(t['label_return']).unshift(data_table['labels'][0]);
						data_table['labels'] = t['label_return'];
						data_table['data'] = t['data_return'];
					}else{
						data_table['data'] = t;
					}
					break;
				case 4 : 
					var t = statisticTable.statisticAreaChartTable(data);
					data_table['data'] = t;
					break;
				case 5 : 
					var t = statisticTable.statisticBubbleChartTable(data);
					data_table['data'] = t;
					break;
				case 6 : 
					var t = statisticTable.statisticComboChartTable(data);
					data_table['data'] = t;
					break;
				default : 
					var t = statisticTable.statisticBarChartTable(data);
					data_table['data'] = t;
					break;
			};
			return data_table;
		}

		this.parseToStatistic = function(type,table){
			var t =  dashboardStatistic.statisticChart(table);
			return t;
		}
		

	}]);
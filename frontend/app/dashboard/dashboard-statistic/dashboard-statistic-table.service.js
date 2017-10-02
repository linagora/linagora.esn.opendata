angular.module("dashboard")
	.service("statisticTable" , ["baseService" , function statisticTable(baseService) {

		this.statisticBarChartTable = function(data){
			var data_return = [];

			for (var i = 0; i < data[0]['values'].length; i++) {
				var temp = {
					label : data[0]['values'][i]['x'],
					data  : []
				}
				for (var j = 0; j < data.length; j++) {
					temp['data'].push(Math.round(data[j]['values'][i]['y']));
				}
				data_return.push(temp);
			}

			return data_return;
		}
		

		this.statisticPieChartTable = function(data){
			var data_return = [];

			for (var i = 0; i < data.length; i++) {
				data_return.push({
					label : data[i]['label'],
					data  : [Math.round(data[i]['values'])]
			    });
			}

			return data_return;
		}


		this.statisticLineChartTable = function(data){
			var data_return = [];

			var flag = true;
			for (var i = 0; i < data.length; i++) {
				if((!baseService.isYear(data[i]['key'])) || (data[i]['values'].length != 12)){
					flag = false;
					break;
				}
			}

			

			if(flag){
				var obj_return = {
					label_return : [],
					data_return  : []
				};

				for (var i = 0; i < data.length; i++) {
					obj_return['label_return'].push(data[i]['key']);
				}

				for (var i = 0; i < data[0]['values'].length; i++) {
					var temp = {
						label : baseService.classifyMonth(data[0]['values'][i]['x']),
						data  : []
					}
					for (var j = 0; j < data.length; j++) {
						temp['data'].push(data[j]['values'][i]['y']);
					}
					data_return.push(temp);
				}

				obj_return['data_return'] = data_return;

				return obj_return;
			}else{
				for (var i = 0; i < data[0]['values'].length; i++) {
					var temp = {
						label : d3.time.format('%x')(new Date(data[0]['values'][i]['x'])),
						data  : []
					}
					for (var j = 0; j < data.length; j++) {
						temp['data'].push(data[j]['values'][i]['y']);
					}
					data_return.push(temp);
				}
			}

			return data_return;
		}


		this.statisticAreaChartTable = function(data){
			var data_return = [];

			for (var i = 0; i < data[0]['values'].length; i++) {
				var temp = {
					label : d3.time.format('%x')(new Date(data[0]['values'][i]['x'])),
					data  : []
				}
				for (var j = 0; j < data.length; j++) {
					temp['data'].push(data[j]['values'][i]['y']);
				}
				data_return.push(temp);
			}

			return data_return;
		}


		this.statisticBubbleChartTable = function(data){
			var data_return = [];

			for (var i = 0; i < data.length; i++) {
				var temp = {
					label : data[i]['key'],
					data  : []
				}
				var size = 0;
				var x = 0;
				var y = 0;
				for (var j = 0; j < data[i]['values'].length; j++) {
					size+=data[i]['values'][j]['size'];
					x+=data[i]['values'][j]['x'];
					y+=data[i]['values'][j]['y'];
				}
				temp['data'].push(size);
				temp['data'].push(x);
				temp['data'].push(y);
				data_return.push(temp);
			}

			return data_return;

		}


		this.statisticComboChartTable = function(data){
			var data_return = [];

			for (var i = 0; i < data[0]['values'].length; i++) {
				var temp = {
						label : d3.time.format('%x')(new Date(data[0]['values'][i][0])),
						data  : []
					};
				for (var j = 0; j < data.length; j++) {
					temp['data'].push(data[j]['values'][i][1]);
				}
				data_return.push(temp);
			}

			return data_return;
		}
	}]);
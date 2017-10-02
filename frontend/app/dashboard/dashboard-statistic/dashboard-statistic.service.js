angular.module("dashboard")
	.service("dashboardStatistic" , ["baseService" , 
		function dashboardStatistic(baseService) {

		/*
			var data_return = {
				// label_title : 
				// label_most :
				// label_most_count : 
				// label_most_percent : 
				// label_least :
				// label_least_count : 
				// label_least_percent : 
				// data_statistic : [
				//	{
				//		title : 
				//		max   :
				// 		min	  : 
				//		avg   :  
				//	}
				//]
			}
		*/


		this.statisticChart = function(table){
			var data_return  = {};


			var label_statistic = baseService.countItem(table['labels']['data']);
			var most = baseService.getMaxCount(label_statistic);
			var least = baseService.getMinCount(label_statistic);

			data_return['label_title'] = table['labels']['title'];

			data_return['label_most'] = most['key'];
			data_return['label_most_count'] = most['count'];
			data_return['label_most_percent'] = Math.round(100*most['count']/table['labels']['data'].length) + "%";

			data_return['label_least'] = least['key'];
			data_return['label_least_count'] = least['count'];
			data_return['label_least_percent'] = Math.round(100*least['count']/table['labels']['data'].length) + "%";

			data_return['data_statistic'] = [];
			for (var i = 0; i < table['data'].length; i++) {
				data_return['data_statistic'].push({
					title : table['data'][i]['title'],
					max   : baseService.getMax(table['data'][i]['data']),
					min   : baseService.getMin(table['data'][i]['data']),
					avg   : baseService.getAverage(table['data'][i]['data'])
				});
			}

			return data_return;

		}

	}]);
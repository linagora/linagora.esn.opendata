angular.module("core.chartValid")
	.service("verticalBarChartService" , ["barChartService" ,
		function verticalBarChartService(barChartService) {
		
		this.verticalBarChartValid = function(labels,data_labels,datas){
			return true;
		}

		this.parseToVerticalBarData = function(labels,data_labels,datas){
			return barChartService.parseToBarData(labels,data_labels,datas,0);
		}

	}]);
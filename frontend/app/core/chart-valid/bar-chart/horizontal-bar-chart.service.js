angular.module("core.chartValid")
	.service("horizontalBarChartService" , ["barChartService" , 
		function horizontalBarChartService(barChartService) {

		this.horizontalBarChartValid = function(labels,data_labels,datas){
			return true;
		}


		this.parseToHorizontalBarData = function(labels,data_labels,datas){
			return barChartService.parseToBarData(labels,data_labels,datas,1);
		}


	}]);
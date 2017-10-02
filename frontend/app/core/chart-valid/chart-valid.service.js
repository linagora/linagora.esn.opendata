angular.module("core.chartValid")
	.service("chartValid" ,[
		"baseService" , 
		"horizontalBarChartService" , 
		"verticalBarChartService" , 
		"pieChartValidService" ,
		"lineChartValidService" ,
		"bubbleChartValidService" ,
		"comboChartValidService" ,
		"areaChartValidService" ,

		function (baseService,horizontalBarChartService,
			verticalBarChartService,pieChartValidService,lineChartValidService,
			bubbleChartValidService,comboChartValidService,areaChartValidService) {

		var self = this;

		this.chartValid = [
			{
				name : function(labels,data_labels,datas){
					return verticalBarChartService.verticalBarChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return verticalBarChartService.parseToVerticalBarData(labels,data_labels,datas);
				},
				id : 0
			},
			{
				name : function(labels,data_labels,datas){
					return horizontalBarChartService.horizontalBarChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return horizontalBarChartService.parseToHorizontalBarData(labels,data_labels,datas);
				},
				id : 1
			},
			{
				name : function(labels,data_labels,datas){
					return pieChartValidService.pieChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return pieChartValidService.parseToPieData(labels,data_labels,datas);
				},
				id : 2
			},
			{
				name : function(labels,data_labels,datas){
					return lineChartValidService.lineChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return lineChartValidService.parseToLineData(labels,data_labels,datas);
				},
				id : 3
			},
			{
				name : function(labels,data_labels,datas){
					return areaChartValidService.areaChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return areaChartValidService.parseToAreaData(labels,data_labels,datas);
				},
				id : 4
			},
			{
				name : function(labels,data_labels,datas){
					return bubbleChartValidService.bubbleChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return bubbleChartValidService.parseToBubbleData(labels,data_labels,datas);
				},
				id : 5
			},
			{
				name : function(labels,data_labels,datas){
					return comboChartValidService.comboChartValid(labels,data_labels,datas);
				},
				data : function(labels,data_labels,datas){
					return comboChartValidService.parseToComboData(labels,data_labels,datas);
				},
				id : 6
			},
		];


	}]);
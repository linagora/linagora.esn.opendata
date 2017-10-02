var count = 0; //file index (auto increase)
var allData = []; // array of file data (data of file1 : index 0 , data of file2 : index 1)
var allChart = [];// array of all chart
var allChartData = [];// array of all chart_data
var allChartTable = []; // table data of each chart
var allChartTableSum = [];
var tableFilterTemp = [];



/*
	allChartData = [obj0,obj1,obj2,.....];
	obj = [
		{
			chart-type : x,
			data : [
				data of chart1 type x,
				data of chart2 type x.....
			]
		},
		{
			chart-type : y,
			data : [
				data of chart1 type y,
				data of chart2 type y.....
			]
		}
	]

*/


angular.module("linagora.esn.opendata" , [
  'op.dynamicDirective',
  'ui.router',
  'core',
  'subheader',
  'opendataSidebar',
  'dashboard'
]);
angular.module("core.draw")
	.service("drawPieChartService" , [function drawPieChartService() {
		this.draw = function(id,data){
			nv.addGraph(function() {
  				var chart = nv.models.pieChart()
      				.x(function(d) { return d.label })
      				.y(function(d) { return d.values/100 })
      				.showLabels(true)
              .labelType("percent")
              .showLegend(false) 
              .labelThreshold(.07);
              // .reduceXTicks(true);

          	if(data.length <= 12)
            	chart.showLegend(true);
        	chart.valueFormat(d3.format('.2%'));

    		d3.select(id)
        		.datum(data)
        		.call(chart);
    		allChart.push(chart);
  			return chart;
			});
		}

		// //draw pie chart
		// function pie_chart(id,data){
			
		// };
	}]);
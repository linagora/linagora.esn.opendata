angular.module("core.draw")
	.service("drawLineChartService" , function drawLineChartService() {
		this.draw = function(id,data){
			nv.addGraph(function() {
  				var chart = nv.models.lineChart()
                	.margin({left: 100})
                	.useInteractiveGuideline(true)
                	.showLegend(true)
                	.showYAxis(true)
                	.showXAxis(true);

  				chart.xAxis
      				.axisLabel('Time')
        			.tickFormat(function(d) {
                if((d+"").length >= 6)
          			 return d3.time.format('%x')(new Date(d));
                else
                  return d;
    			});
  				chart.yAxis     //Chart y-axis settings
  				    .tickFormat(d3.format('.02f')).tickFormat(d3.format('.2s'));

  				d3.select(id)
      				.datum(data)
      				.call(chart);

  				nv.utils.windowResize(chart.update());
  				allChart.push(chart);
  				return chart;
			});
		}
	});
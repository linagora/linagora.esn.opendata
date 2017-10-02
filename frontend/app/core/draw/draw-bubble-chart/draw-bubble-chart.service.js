angular.module("core.draw")
	.service("drawBubbleChartService" , function drawBubbleChartService() {
		this.draw = function(id,data){
			nv.addGraph(function() {
        		var chart = nv.models.scatterChart()
                      .showDistX(true)    
                      .showDistY(true)
                      .color(d3.scale.category10().range());

        		//Axis settings
       		 	chart.xAxis.tickFormat(d3.format('.02f')).tickFormat(d3.format('.2s'));
        		chart.yAxis.tickFormat(d3.format('.02f')).tickFormat(d3.format('.2s'));
		
        		d3.select(id)
        		    .datum(data)
         		   .call(chart);

        		nv.utils.windowResize(chart.update);
        		allChart.push(chart);
        		return chart;
      		});
		}
	});
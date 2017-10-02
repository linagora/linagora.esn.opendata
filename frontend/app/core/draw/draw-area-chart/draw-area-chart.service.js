angular.module("core.draw")
	.service("drawAreaChartService" , function drawAreaChartService() {
		this.draw = function(id,data){
			nv.addGraph(function() {
        		var chart = nv.models.stackedAreaChart()
        		              .margin({right: 50})
        		              .x(function(d) { return d.x })   //We can modify the data accessor functions...
        		              .y(function(d) { return d.y })   //...in case your data is formatted differently.
        		              .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
        		              .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
        		              .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
        		              .clipEdge(true);
    
        		//Format x-axis labels with custom function.
        		chart.xAxis
        		   .tickFormat(function(d) { 
        		      return d3.time.format('%x')(new Date(d)) 
        		});

        		chart.yAxis
        		    .tickFormat(d3.format(',.2f')).tickFormat(d3.format('.2s'));

        		d3.select(id)
        		  .datum(data)
        		  .call(chart);
    
        		nv.utils.windowResize(chart.update);
        		allChart.push(chart);

        		return chart;
      		});
		}
	});
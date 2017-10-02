angular.module("core.draw")
	.service("drawBarChartService" , ["$q" , function drawBarChartService($q) {
		var self = this;

		this.draw = function(id,data,type){
			type == 0 ? self.drawVertical(id,data) : self.drawHorizontal(id,data);
    }

		this.drawVertical = function(id,data){
			nv.addGraph(function() {
    			var chart = nv.models.multiBarChart()
            	.y(function(d) { return d.y})
      			.reduceXTicks(true)
      			.rotateLabels(15)
      			.showControls(true)
      			.groupSpacing(0.1);

    		// chart.xAxis
    		//     .tickFormat(d3.format(',f'));

  				chart.yAxis
      				.tickFormat(d3.format('.2s'));

    			d3.select(id)
        			.datum(data)
        			.call(chart);

    			nv.utils.windowResize(chart.update);
    			allChart.push(chart);
    			return chart;
			});
		}

		this.drawHorizontal = function(id,data){
			nv.addGraph(function() {
    			var chart = nv.models.multiBarHorizontalChart()
        			.x(function(d) { return d.x })
        			.y(function(d) { return d.y})
        			// .showValues(true)
              .valueFormat(d3.format('.2s'))
        			.showControls(true);
        
              if(window.innerWidth > 800){
                chart.margin({left: 100});
              }
              
  				chart.yAxis
      				.tickFormat(d3.format('.2s'));


    			d3.select(id)
        			.datum(data)
        			.call(chart);

    			nv.utils.windowResize(chart.update);
    			allChart.push(chart);
    			return chart;
  			});

		}
	}]);
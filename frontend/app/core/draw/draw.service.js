angular.module("core.draw").
	factory("drawService" , [
    "drawPieChartService" ,
    "drawBubbleChartService",
    "drawComboChartService",
    "drawLineChartService" ,
    "drawAreaChartService" ,
    "drawBarChartService" ,


  function (drawPieChartService,drawBubbleChartService,drawComboChartService,
    drawLineChartService,drawAreaChartService,drawBarChartService) {

		return {
			drawAll : function(allChartData,file_index){
				for (var i = 0; i < allChartData.length; i++) {
					for (var j = 0; j < allChartData[i]['data'].length; j++) {
						classifyDraw("chart",file_index,allChartData[i]['chart'],i,j,allChartData[i]['data'][j]);
					}
				}
			},
      drawShow : function(type,data){
        classifyDraw("modal",0,type,0,0,data);
      },
      classifySizeX : function(id,data){
        switch(id){
          case 0 : return autoSizeXVerticalBarChart(data);
          case 1 : return autoSizeXHorizontalBarChart(data);
          case 2 : return autoSizeXPieChart(data);
          case 3 : return autoSizeXLineChart(data);
          case 4 : return autoSizeXAreaChart(data);
          case 5 : return autoSizeXBubbleChart(data);
          case 6 : return autoSizeXComboChart(data);
          default : return 2;
        }
      },
      classifySizeY : function(id,data){
        switch(id){
          case 0 : return autoSizeYVerticalBarChart(data);
          case 1 : return autoSizeYHorizontalBarChart(data);
          case 2 : return autoSizeYPieChart(data);
          case 3 : return autoSizeYLineChart(data);
          case 4 : return autoSizeYAreaChart(data);
          case 5 : return autoSizeYBubbleChart(data);
          case 6 : return autoSizeYComboChart(data);
          default : return 2;
        }
      }
		};

    function autoSizeXVerticalBarChart(data){
        if(data[0]['values'].length > 30)
          return 6;
        if(data[0]['values'].length < 10)
          return 2
        return 3;
    }
    function autoSizeYVerticalBarChart(data){
        if(data[0]['values'].length > 30)
          return 3;
        return 2;
    }
    function autoSizeXHorizontalBarChart(data){
        if(data[0]['values'].length > 30)
          return 6;
        return 3;
    }
    function autoSizeYHorizontalBarChart(data){
        if(data[0]['values'].length > 30)
          return 6;
        if(data[0]['values'].length < 10)
          return 2;
        return 3;
    }
    function autoSizeXPieChart(data){
        return 2;
    }
    function autoSizeYPieChart(data){
        return 2;
    }
    function autoSizeXLineChart(data){
      if(data[0]['values'].length < 10)
        return 3;
      return 6;
    }
    function autoSizeYLineChart(data){
        return 2;
    }
    function autoSizeXAreaChart(data){
      if(data[0]['values'].length < 10)
        return 3;
      return 6;
    }
    function autoSizeYAreaChart(data){
        return 2;
    }
    function autoSizeXBubbleChart(data){
        return 6;
    }
    function autoSizeYBubbleChart(data){
        return 3;
    }
    function autoSizeXComboChart(data){
       if(data[0]['values'].length > 30)
          return 6;
        if(data[0]['values'].length < 10)
          return 2
        return 3;
    }
    function autoSizeYComboChart(data){
        if(data[0]['values'].length > 30)
          return 3;
        return 2;
    }


    //chartid = "chart||modal" + file_index + chart_type + obj_index + data_index
		function classifyDraw(name_id,file_index,id,obj_id,data_id,data){
      var chart_id = "";
      if("modal" == name_id){
        chart_id = "#chart_modal svg";
        d3.select(chart_id + " *").remove();
      }else{
        chart_id = "#"+name_id+"-"+file_index+"-"+id+"-"+obj_id+"-"+data_id+" svg"
      }
			switch(id){
				case 0 : drawBarChartService.draw(chart_id,data,0);
					break;
				case 1 : drawBarChartService.draw(chart_id,data,1);
					break;
				case 2 : drawPieChartService.draw(chart_id,data);
					break;
				case 3 : drawLineChartService.draw(chart_id,data);
					break;
				case 4 : drawAreaChartService.draw(chart_id,data);
          break;
				case 5 : drawBubbleChartService.draw(chart_id,data);
					break;
				case 6 : drawComboChartService.draw(chart_id,data);
          break;
				default : return;
			}

		};



	}]);
angular.module("dashboard").
	controller("dashboardController" , ["coreService", "dashboardService","$rootScope",
		function dashboardController(coreService,dashboardService,$rootScope,$scope,$q) {
		var self = this;


		this.gridsterOpts = {
            	minRows: 1,
            	maxRows: 1000,
            	columns: 6, 
            	colWidth: 'auto', 
            	rowHeight: 'match',
            	margins: [10, 10], 

            	resizable: {
            	    enabled: true,
            	    start: function (event, uiWidget, $element) {
            	    }, // optional callback fired when resize is started,
           		    resize: function (event, uiWidget, $element) {
           	    	}, // optional callback fired when item is resized,
            	    stop: function (event, uiWidget, $element) {
                        
                        var e = event.target;
                        var width   = angular.element(e).parent().css("width");
                        var height  = angular.element(e).parent().css("height");
                        angular.element(e).parent().find("svg").width(width);
                        angular.element(e).parent().find("svg").height(height);
                        for (var i = 0; i < allChart.length; i++) {
                            allChart[i].update();
                        }
                        
            	    } // optional callback fired when item is finished resizing
            	},

            	draggable: {
            	    enabled: true, // whether dragging items is supported
            	    handle: '.title', // optional selector for resize handle
            	   start: function (event, uiWidget, $element) {
             	   }, // optional callback fired when drag is started,
             	   drag: function (event, uiWidget, $element) {
             	   }, // optional callback fired when item is moved,
             	   stop: function (event, uiWidget, $element) {
             	   } // optional callback fired when item is finished dragging
            	}
        	};
            

            $rootScope.addFile = function(filename){
                self.files.push({
                    filename : filename,
                    file_index:allData[allData.length-1]['file_index']
                });
            };

            this.dashboardFile = [];

            $rootScope.drawData = function(){
                // read document for this function
                var items = dashboardService.renderItems(allData[allData.length-1]['data']);
                var obj   = dashboardService.parseToChartData(items,[]);
                var dashboardItems = [];
                var file_index = allData[allData.length-1]['file_index'];
                for (var i = 0; i < obj.length; i++) {
                    for (var j = 0; j < obj[i]['data'].length; j++) {
                            dashboardItems.push({
                                title   : dashboardService.autoChartTitle(obj[i]['chart'],coreService.baseService.getDataByFileIndex(file_index,allChartTable)[i]['data'][j]),
                                id      : "chart-"+file_index+"-"+obj[i]['chart']+"-"+i+"-"+j,
                                type    : obj[i]['chart'],
                                file    : file_index,
                                sizeX   : coreService.drawService.classifySizeX(obj[i]['chart'],obj[i]['data'][j]),
                                sizeY   : coreService.drawService.classifySizeY(obj[i]['chart'],obj[i]['data'][j]),
                                active  : {
                                    type_flag       : true,
                                    labels_flag     : true,
                                    category_flag   : true
                                },
                                temp    : false,
                                data    : obj[i]['data'][j],
                                table   : coreService.baseService.getDataByFileIndex(file_index,allChartTable)[i]['data'][j]
                        });
                    }  
                }

                self.dashboardFile.push({
                    file_index      : file_index,
                    filename        : allData[allData.length-1]['filename'],
                    dashboardItems  : dashboardItems
                });
                
                // hide "no data"
                self.hasData = true;
                // set active
                self.active = file_index;

                allChartData.push({
                    file_index : file_index,
                    data       : obj
                });

                $rootScope.setFiltersCategory(file_index);

                // coreService.drawService.drawAll(obj,file_index);
                coreService.drawService.drawAll(obj,file_index);
            };


            // check flag to show
            this.checkActiveFlag = function(item){
                if((item['active']['type_flag']) && (item['active']['labels_flag']) && (item['active']['category_flag'])){
                    return true;
                }
                return false;
            }

            // delete chart box in popup
            this.deleteWidget = function(i,j,id){
                self.dashboardFile[i]['dashboardItems'].splice(j, 1); // delete from dashboard file
                var position = coreService.baseService.detectChartId(id);

                for (var i = 0; i < allChartData.length; i++) {
                    if(allChartData[i]['file_index'] == parseInt(position[0])){
                        index = i;
                        flag = true;
                        break;
                    }
                }

                // delete from "allChartData" var
                allChartData[index]['data'][parseInt(position[2])]['data'].splice([parseInt(position[3])],1);
                
                // delete from "allChartTable" var
                allChartTable[index]['data'][parseInt(position[2])]['data'].splice([parseInt(position[3])],1);
            }

            // all variable for popup
            this.table = {
                /*
                    labels : labels,
                    data   : data
                */
            };

            this.sum_table = {}; // sum table tab
            this.statistic = {}; // statistic tab

            this.title = ""; // title of chart

        	this.show = function(event,temp_flag,title){
                var e = angular.element(event.currentTarget).parents("li").find("div[type]");
                //e -> id = "chart-0-1-2-3" <=> "chart-file_index-chart_type-obj_index-data_index"
                var position = coreService.baseService.detectChartId(e[0]['id']);
                //posiition = [file_index,chart_type,obj_index,data_index]
                var index = 0;
                var flag = false;
                for (var i = 0; i < allChartData.length; i++) {
                    if(allChartData[i]['file_index'] == parseInt(position[0])){
                        index = i;
                        flag = true;
                        break;
                    }
                }

                self.title = title;

                // draw chart in popup
                coreService.drawService.drawShow(parseInt(position[1]),
                    allChartData[index]['data'][parseInt(position[2])]['data'][parseInt(position[3])]);

                // render chart data to table tab
                self.table = dashboardService.parseToDataTable(
                    allChartTable[index]['data'][parseInt(position[2])]['data'][parseInt(position[3])]);

                // render data to sum-table tab
                self.sum_table = dashboardService.parseToStatisticTable(parseInt(position[1]),
                    allChartData[index]['data'][parseInt(position[2])]['data'][parseInt(position[3])],
                    allChartTable[index]['data'][parseInt(position[2])]['data'][parseInt(position[3])]);

                // render data to statistic tab
                self.statistic = dashboardService.parseToStatistic(parseInt(position[1]),
                    allChartTable[index]['data'][parseInt(position[2])]['data'][parseInt(position[3])]);
            };

            // popup tab control
            this.table_tab = 0;
            this.change_table_tab = function(index){
                self.table_tab = index;
            }
            this.check_table_tab = function(index){
                var t = false;
                index == self.table_tab ? t = true : t = false;
                return t;
            }


            // all variables for the file bar

            this.hasData = false;

            this.files = [
                // {
                //      filename : "demo.csv",
                //      file_index : 0
                // },
            ];

            // two variables for the popup to show when user want to delete file
            this.file_delete_index = 0;
            this.file_delete_name = "";

            this.deleteDataDialog = function(item){
                self.file_delete_index = item.file_index;
                self.file_delete_name = item.filename;
            }

            this.deleteData = function(){
                //delete data of file
                allData = coreService.baseService.delete_file(self.file_delete_index,allData);

                //delete data of chart of file
                allChartData = coreService.baseService.delete_file(self.file_delete_index,allChartData);

                //delete table of chart of file
                allChartTable = coreService.baseService.delete_file(self.file_delete_index,allChartTable);

                //delete chart of file
                self.dashboardFile = coreService.baseService.delete_file(self.file_delete_index,self.dashboardFile);
                
                // delete file in filebar
                self.files = coreService.baseService.delete_file(self.file_delete_index,self.files);
                //check if all files has been delete -> show "no data"

                // change active tab to the last tab
                self.changeTabActive((allData.length == 0) ? 0 : allData[allData.length-1]['file_index']);

                // if we only have one file upload and then remove it so we don't have any file -> hasData = false
                if (self.files.length == 0)
                    self.hasData = false;

                
            }

            //tab control
            this.tabActive = (allData.length == 0) ? 0 : allData[allData.length-1]['file_index'];
            this.isTabActive = function(i){
                if(i == self.active) 
                    return true;
                return false;
            }
            this.changeTabActive = function(i){
                self.active = i;
                coreService.drawService.drawAll(coreService.baseService.getDataByFileIndex(i,allChartData),i);
                $rootScope.setFiltersCategory(i);
            }

           

	}]);
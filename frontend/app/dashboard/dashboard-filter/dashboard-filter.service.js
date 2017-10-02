angular.module("dashboard")
	.service("dashboardFilterService" , ["coreService","dashboardService", 
		function (coreService,dashboardService) {
		var self = this;
		this.active = -1;

		this.filter = function(dashboardFile,filterOption){
			self.active = filterOption['file_index'];
			var f1 = self.filterType(dashboardFile,filterOption['filterType']);
			var f2 = self.filterLabels(f1,filterOption['labels']);
			var f3 = self.limit(f2,filterOption['limit']);
			var f4 = self.sort(f3,filterOption['sort']);
			var f5 = self.filterCategory(f4,filterOption);
			return f5;
		}

        //need recode
		this.filterType = function(dashboardFile,type){
			if (type.length == 0) {
                for (var i = 0; i < dashboardFile.length; i++) {
                    if(dashboardFile[i]['file_index'] == self.active){
                        for (var j = 0; j < dashboardFile[i]['dashboardItems'].length; j++) {
                            dashboardFile[i]['dashboardItems'][j]['active']['type_flag'] = true;
                        }
                    }
                }
            }else{
                for (var i = 0; i < dashboardFile.length; i++) {
                    if(dashboardFile[i]['file_index'] == self.active){
                        for (var j = 0; j < dashboardFile[i]['dashboardItems'].length; j++) {
                            if(type.indexOf(dashboardFile[i]['dashboardItems'][j]['type']) == -1){
                                dashboardFile[i]['dashboardItems'][j]['active']['type_flag'] = false;
                            }else{
                                dashboardFile[i]['dashboardItems'][j]['active']['type_flag'] = true;   
                            }
                        }
                    }
                }
            }

			return dashboardFile;
		}

        //need recode
		this.filterLabels = function(dashboardFile,labels){
			if (labels.length == 0) {
                for (var i = 0; i < dashboardFile.length; i++) {
                    if(dashboardFile[i]['file_index'] == self.active){
                        for (var j = 0; j < dashboardFile[i]['dashboardItems'].length; j++) {
                            dashboardFile[i]['dashboardItems'][j]['active']['labels_flag'] = true;
                        }
                    }
                }
            }else{
                for (var i = 0; i < dashboardFile.length; i++) {
                    if(dashboardFile[i]['file_index'] == self.active){
                        for (var j = 0; j < dashboardFile[i]['dashboardItems'].length; j++) {
                        	var array = dashboardFile[i]['dashboardItems'][j]['table']['data'].concat(
                        		[dashboardFile[i]['dashboardItems'][j]['table']['labels']]);
                        	var titelArray = coreService.baseService.renderTitleToArray(array);
                        	
                        	if (coreService.baseService.isContain(titelArray,labels)) {
                        		dashboardFile[i]['dashboardItems'][j]['active']['labels_flag'] = true; 
                        	}else{
                        		dashboardFile[i]['dashboardItems'][j]['active']['labels_flag'] = false;
                        	}
                        }
                    }
                }
            }

			return dashboardFile;
		}
		this.limit = function(dashboardFile,limit){
			return dashboardFile;
		}
		this.sort = function(dashboardFile,sort){
			return dashboardFile;
		}

		this.filterCategory = function(dashboardFile,option){
			if(option['category'].length == 0)
				return dashboardFile;

			for (var i = 0; i < dashboardFile.length; i++) {
				for (var j = 0; j < dashboardFile[i]['dashboardItems'].length; j++) {
					dashboardFile[i]['dashboardItems'][j]['active']['category_flag'] = false;
				}
			}


			var dataToFilter = coreService.baseService.getDataByFileIndex(self.active,allData);

			for (var i = dataToFilter.length - 1; i >=0 ; i--) {
				if(dataToFilter.length <= 3)
					break;
				if((option['labels'].indexOf(dataToFilter[i]['title']) == -1) && (dataToFilter[i]['type'] != 3)
					&& (dataToFilter[i]['category'])){
					dataToFilter.splice(i,1);
				}
			}

			var c = coreService.baseService.getDataByProperty('title',dataToFilter,option['category'][0]['name']);
			for (var i = c['data'].length - 1; i >= 0 ; i--) {
				if (option['category'][0]['values'].indexOf(c['data'][i]) == -1) {
					for (var j = 0; j < dataToFilter.length; j++) {
						dataToFilter[j]['data'].splice(i,1);
					}
				}
			}
			// console.log(dataToFilter);
			var id = coreService.baseService.getObjectIndexByProperty('title',dataToFilter,option['category'][0]['name']);
			dataToFilter.splice(id,1);


			var items = dashboardService.renderItems(dataToFilter);
			var obj = dashboardService.parseToChartData(items,option['filterType']);

			var dashboardItems = [];
			for (var i = 0; i < obj.length; i++) {
                for (var j = 0; j < obj[i]['data'].length; j++) {
                        dashboardItems.push({
                            title   : dashboardService.autoChartTitle(obj[i]['chart'],coreService.baseService.getDataByFileIndex(self.active,allChartTable)[i]['data'][j]),
                            id      : "filter-"+self.active+"-"+obj[i]['chart']+"-"+i+"-"+j,
                            type    : obj[i]['chart'],
                            file    : self.active,
                            sizeX   : coreService.drawService.classifySizeX(obj[i]['chart'],obj[i]['data'][j]),
                            sizeY   : coreService.drawService.classifySizeY(obj[i]['chart'],obj[i]['data'][j]),
                            active  : {
                                type_flag       : true,
                                labels_flag     : true,
                                category_flag   : true
                            },
                            temp    : true,
                            data    : obj[i]['data'][j],
                            table   : coreService.baseService.getDataByFileIndex(self.active,allChartTable)[i]['data'][j]
                    });
          	    }  
            }

            dashboardFile.push({
                file_index      : self.active,
                filename        : "demo",
                dashboardItems  : dashboardItems
             });
			
			

			return {file : dashboardFile,data : obj,file_index : self.active};
		}
	}]);
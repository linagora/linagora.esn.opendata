angular.module("dashboard")
	.controller("dashboardFilterController" , ["dashboardService" , "$rootScope","dashboardFilterService",
    "baseService","drawService",
		function dashboardFilterController(dashboardService,$rootScope,dashboardFilterService,baseService,drawService) {
		var self = this;
    this.filterOption = [];
    var dashboardController;

    this.$onInit = function(){
        dashboardController = self.dashboard;
    }

		
		this.filter_collapse = true;

		this.open_filter = function(){
			self.filter_collapse == true ? self.filter_collapse = false : self.filter_collapse = true;
			return self.filter_collapse;
		}

		this.limitProcess = function(){
			alert(self.limit);
		}

		this.select2Options = {
        	allowClear:true,
          multiple: true
    	};

    	//filter bar
        this.filter_items = [];
        $rootScope.setFiltersCategory = function(file_index){
            self.filter_items = [];
            var data = baseService.getDataByFileIndex(file_index,allData);
            self.filter_items.push({
            	model 	: "",
            	name 	: "Chart Type :",
            	option 	: ["All","Horizontal Bar Chart","Vertical Bar Chart",
            	"Pie Chart","Line Chart","Area Chart","Combo Chart","Bubble Chart"]
            });
            self.filter_items.push({
            	model 	: "",
            	name 	: "Labels :",
            	option 	: []
            });
            self.filter_items[1]['option'].push("All");
            for (var i = 0; i < data.length; i++) {
            	self.filter_items[1]['option'].push(data[i]['title']);
            }

           	for (var i = 0; i < data.length; i++) {
           		if(data[i]['category']){
           			var temp = new Set(data[i]['data']);
                	self.filter_items.push({
                		  model 	: "",
                    	name    : data[i]['title']+" :",
                    	option  : ["All"].concat(Array.from(temp))
                	});
                }
            }
        }

        this.selected = function(i){
          var index = baseService.getObjectIndexByFileIndex(dashboardController.active,self.filterOption);

          if(index == -1){
            self.filterOption.push({
              filterType  : [],
              labels      : [],
              limit       : -1,
              sort        : -1,
              category    : [],
              file_index  : dashboardController.active
            });
            index = self.filterOption.length - 1;
          }
          switch(i){
            
            case 0 :
              var t = self.classifyChartType(self.filter_items[i]['model']);
              if(t != -1){
                self.filterOption[index]['filterType'].push(t);
              }else{
                self.filterOption[index]['filterType'] = [];
              }
              break;

            case 1 :
              var t = self.filter_items[i]['model'];
              if("All" == t){
                self.filterOption[index]['labels'] = [];
              }else{
                self.filterOption[index]['labels'].push(t);
              }
              break;

            default : 
              var category_filter_index = baseService.getObjectIndexByName(
                self.filter_items[i]['name'].replace(/ :/g,""),self.filterOption[index]['category']);
              if(category_filter_index == -1){
                self.filterOption[index]['category'].push({
                  name  : (self.filter_items[i]['name']).replace(/ :/g,""),
                  values : []
                });
                category_filter_index = self.filterOption[index]['category'].length - 1;
              }
              if("All" == self.filter_items[index]['model']){
                self.filterOption[index]['category'][category_filter_index]['values'] = [];
              }else{
                self.filterOption[index]['category'][category_filter_index]['values'].push(self.filter_items[i]['model']);
              }
              break;
          }
        	
          self.filter(self.filterOption[index]);
        }

        this.filter = function(option){
            var temp = dashboardController.dashboardFile;
            temp = dashboardFilterService.filter(temp,option);
              dashboardController.dashboardFile = temp['file'];
    
        }

        this.classifyChartType = function(type){
        	 switch(type){
        	 	  case "All"					        : return -1;
          		case "Vertical Bar Chart" 	: return  0;
          		case "Horizontal Bar Chart" : return  1;
          		case "Pie Chart" 			      : return  2;
          		case "Line Chart" 			    : return  3;
          		case "Area Chart" 			    : return  4;
          		case "Bubble Chart" 		    : return  5;
          		case "Combo Chart" 			    : return  6;
          		default 					          : return  0;
          }
        }

	}]);
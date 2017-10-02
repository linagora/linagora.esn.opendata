angular.module("opendataSidebar")
	.controller("opendatatSidebarController" , ["$http","$rootScope" , "opendataSidebarService",
     function sidebarController($http,$rootScope,opendataSidebarService) {
      var self = this;
			this.collapse = false;
      this.collapse_menu = function(){
          var x = angular.element(document.getElementById("opendata-sidebar"));
          self.collapse == true ? x.width("300px") : x.width("40px");
          if(!self.collapse){
              if (!self.hide) {
                self.hide_submenu();
              }
          }
          self.collapse == true ? self.collapse = false : self.collapse = true;

      }
      this.collapse_item = function(){
        if(self.collapse == true)
          self.collapse_menu();
      }


      this.filename = "Click here to select file !";
      
      this.hide_submenu = function(){
        return self.hide == true ? self.hide = false : self.hide = true;
      }
      this.hide = false;
      this.drop_down = function(){
        return self.hide;
      }
      this.clear = function($event){
        $event.stopPropagation();
      }


      this.menu = [
          {
            icon      : "mdi mdi-share",
            title     : "Share",
            drop_down : false,
          },
          {
            icon      : "mdi mdi-file",
            title     : "Export",
            drop_down : false,
          },
          {
            icon      : "mdi mdi-server",
            title     : "Save",
            drop_down : false,
          },
          {
            icon      : "mdi mdi-settings",
            title     : "Settings",
            drop_down : false,
          }
      ];

			this.uploadFile = function(){
				var f = this.file;
				var fd = new FormData();
        		fd.append('file', f);

        		// opendataSidebarService.upload(fd , "/opendata/fileupload");
        		
        		$http.post("/opendata/fileupload" , fd ,{
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(response){
                
               		if(response['status']){
                    allData.push({
                      data       : response['data'],
                      file_index : count,
                      filename   : self.filename
                    });

                    allChartTable.push({
                      file_index : count,
                      filename   : self.filename,
                      data       : []
                    });
                  
                    $rootScope.drawData();

                    self.collapse_menu(); // collapse menu when user upload file success
                  
                    $rootScope.addFile(self.filename);
                    count+=1;
                  }else{
                    alert(response['error']);
                  }
               })
            
               .error(function(){
               		// return 1
               });
			}

      
	}]);
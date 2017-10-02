angular.module("opendataSidebar").
	component("opendataSidebar" , {
		templateUrl : "/opendata/app/sidebar/sidebar.html",
    // transclude: true,
  	// bindings : {},
    
		controller : "opendatatSidebarController"
	})
  

	.directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                bindings: {},
                transclude: true,
                require : "^?opendataSidebar",
               link: function(scope, element, attrs , opendataSidebar) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                        opendataSidebar.filename = element[0].files[0].name;
                     });
                  });
               }
            };
         }]);
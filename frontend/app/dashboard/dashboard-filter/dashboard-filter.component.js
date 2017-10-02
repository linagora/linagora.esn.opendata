angular.module("dashboard")
	.component("dashboardFilter" , {
		require: {
    		dashboard: '^dashboard'
  		},
  		bindings: {
  		},
		templateUrl : "/opendata/app/dashboard/dashboard-filter/dashboard-filter.html",
		controller 	: "dashboardFilterController"
	});
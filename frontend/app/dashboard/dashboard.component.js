angular.module("dashboard").
	component("dashboard" , {
		transclude: true,
		templateUrl : "/opendata/app/dashboard/dashboard.html",
		controller  : "dashboardController"
	});
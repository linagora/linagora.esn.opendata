angular.module("core")
	.service("coreService" , [
		"drawService",
		"chartValid",
		"baseService",
		function coreService(drawService,chartValid,baseService) {

			this.drawService = drawService;
			this.chartValid  = chartValid;
			this.baseService = baseService;
		
	}]);
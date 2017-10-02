angular.module("subheader").
	controller("subheaderController" , function subheaderController() {
		this.items = [
			{
				title 		: "Dashboards",
				icon  		: "mdi mdi-view-module",
				dropdown	: true,
				submenu		: 
				{
					show	: false,
					menu :	[
								{
									title : "All Dashboards"
								},
								{
									title : "Dashboard 1"
								},
								{
									title : "Dashboard 2"
								},
								{
									title : "Dashboard 3"
								}
							]
				}
			},
			{
				title 		: "Business & Economy",
				icon  		: "mdi mdi-check",
				dropdown	: false
			},
			{
				title 		: "Education & Science",
				icon  		: "mdi mdi-book",
				dropdown	: false
			},
			{
				title 		: "Environment & Territory",
				icon  		: "mdi mdi-web",
				dropdown	: false
			},
			{
				title 		: "Health & Society",
				icon  		: "mdi mdi-clipboard-account",
				dropdown	: false
			}
		];


		this.itemClick = function(i){
			if(this.items[i]['dropdown'] == true){
				this.items[i]['submenu']['show'] == true ? this.items[i]['submenu']['show'] = false : this.items[i]['submenu']['show'] = true;
			}else{
				
			}
		}
	});
'use strict';

angular.module('linagora.esn.opendata')
.config([
  '$stateProvider',
  'dynamicDirectiveServiceProvider',
  function($stateProvider, dynamicDirectiveServiceProvider) {
    var opendata = new dynamicDirectiveServiceProvider.DynamicDirective(true, 'application-menu-open-data', {priority: 28});
    dynamicDirectiveServiceProvider.addInjection('esn-application-menu', opendata);

    $stateProvider
      .state('opendata', {
        url: '/opendata',
        templateUrl: '/opendata/app/app.html',
      })
      .state('opendata.chart', {
        url: '/:chart',
        template : "<h1>hellooooooo</h1>"
      });
  }
]);


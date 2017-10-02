'use strict';

var AwesomeModule = require('awesome-module');
var Dependency = AwesomeModule.AwesomeModuleDependency;
var path = require('path');
var glob = require('glob-all');
var FRONTEND_JS_PATH = __dirname + '/frontend/app/';

var opendataModule = new AwesomeModule('linagora.esn.opendata', {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.logger', 'logger'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.wrapper', 'webserver-wrapper')
  ],

  states: {
    lib: function(dependencies, callback) {
      var opendatalib = require('./backend/lib')(dependencies);
      var opendata = require('./backend/webserver/api/opendata/router')(dependencies);

      var lib = {
        api: {
          opendata: opendata
        },
        lib: opendatalib
      };

      return callback(null, lib);
    },

    deploy: function(dependencies, callback) {
      // Register the webapp
      const app = require('./backend/webserver/application')(dependencies);
      // Register every exposed endpoints
      app.use('/', this.api.opendata);

      var webserverWrapper = dependencies('webserver-wrapper');
      const frontendJsFilesFullPath = glob.sync([
        FRONTEND_JS_PATH + '**/*.module.js',
        FRONTEND_JS_PATH + '**/*.route.js',
        FRONTEND_JS_PATH + '**/*.service.js',
        FRONTEND_JS_PATH + '**/*.controller.js',
        FRONTEND_JS_PATH + '**/*.constant.js',
        FRONTEND_JS_PATH + '**/*.component.js'
        // FRONTEND_JS_PATH + '**/!(*spec).js'
      ]);

      const frontendJsFilesUri = frontendJsFilesFullPath.map(function(filepath) {
        return filepath.replace(FRONTEND_JS_PATH, '');
      });


      webserverWrapper.injectAngularAppModules("opendata", frontendJsFilesUri, ["linagora.esn.opendata"], ['esn'], {
        localJsFiles: frontendJsFilesFullPath
      });
      var lessFile = path.join(FRONTEND_JS_PATH, 'app.less');

      webserverWrapper.injectLess("opendata", [lessFile], 'esn');
      webserverWrapper.addApp('opendata', app);

      return callback();
    }
  }
});

/**
 * The main AwesomeModule describing the application.
 * @type {AwesomeModule}
 */
module.exports = opendataModule;

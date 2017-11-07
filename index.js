'use strict';

var AwesomeModule = require('awesome-module');
var Dependency = AwesomeModule.AwesomeModuleDependency;
var path = require('path');
var glob = require('glob-all');
var FRONTEND_JS_PATH = __dirname + '/frontend/app/';
const MODULE_NAME = 'opendata';
const AWESOME_MODULE_NAME = 'linagora.esn.' + MODULE_NAME;

var opendataModule = new AwesomeModule(AWESOME_MODULE_NAME, {
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


      webserverWrapper.injectAngularAppModules(MODULE_NAME, frontendJsFilesUri, [AWESOME_MODULE_NAME], ['esn'], {
        localJsFiles: frontendJsFilesFullPath
      });
      const lessFile = path.join(FRONTEND_JS_PATH, 'app.less');

      webserverWrapper.injectLess(MODULE_NAME, [lessFile], 'esn');

      const jsResourceFiles = [
        '../components/select2/select2.js',
        '../components/angular-gridster/dist/angular-gridster.min.js',
        '../components/numeral/min/numeral.min.js',
        '../components/d3/d3.min.js',
        '../components/nvd3/build/nv.d3.min.js',
        '../components/angular-ui-select2/src/select2.js'
      ];
      webserverWrapper.injectJS(MODULE_NAME, jsResourceFiles, 'esn');

      webserverWrapper.addApp(MODULE_NAME, app);

      return callback();
    }
  }
});

/**
 * The main AwesomeModule describing the application.
 * @type {AwesomeModule}
 */
module.exports = opendataModule;

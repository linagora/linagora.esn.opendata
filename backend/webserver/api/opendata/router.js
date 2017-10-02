'use strict';

var express = require('express');

module.exports = function(dependencies) {

  var controller = require('./controller')(dependencies);
  var middleware = require('./middleware')(dependencies);

  var router = express.Router();

  router.get('/api/opendata', middleware.passThrough, controller.sayHello);
	//router.get(url,proxy,function(req,res))
  router.post('/fileupload', middleware.passThrough, controller.upload);
  return router;
};

'use strict';

var fs = require('fs');
var path = require('path');
var PATH_UPLOAD = path.normalize(__dirname+'/file-upload/');
var formidable = require('formidable');
var logger;
var core = require('./core');
var file_pattern = /[0-9a-z]+\.+csv$/i;


function sayHello(req, res) {
  logger.info('My module controller says hello world!');
  console.log(analysis);
  return res.json(200, {message: "analysis.demo()"});
}
function upload(req, res) {
  // receive form data
  var form = new formidable.IncomingForm();
  
	form.parse(req, function (err, fields, files) {
    // check file
    if(!file_pattern.test(files.file.name)){
      res.json(200,{status : 0 , error : "Sorry , we only accept .csv files !!!!"});
      return;
    }
  	var content = fs.readFileSync(files.file.path).toString();

  	fs.writeFileSync(PATH_UPLOAD+files.file.name, content);
  	content = fs.readFileSync(PATH_UPLOAD+files.file.name).toString();
  	res.json(200,{status : 1 , data : core.detectData(content)});
});
}

module.exports = function(dependencies) {
  logger = dependencies('logger');
  core = require('./core')(dependencies);
  return {
    sayHello: sayHello,
    upload : upload
  };
};

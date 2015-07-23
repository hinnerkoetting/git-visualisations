'use strict';

var http = require('http');
var express = require('express');
var app = express();
var git = require('./services/git.js');
var send = require('send');
var parseUrl = require('url').parse;

configureRoutes();
startServer();


function configureRoutes() {
  app.get('/', fromFileSystem('./public/index.html'));
  app.get('/git', git);
  app.get('/*', fileFromPublicFolder);
}



function fileFromPublicFolder(request, response) {
  var url = parseUrl(request.url, true);  
  fromFileSystem( 'public' + url.pathname )(request, response);
}

function fromFileSystem(path) {
  return function(request, response) {
     send(request, path).pipe(response);
  }
}


function startServer() {
  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is listening at http://%s:%s', host, port);
  });
}

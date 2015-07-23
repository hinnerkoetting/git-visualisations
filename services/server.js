
var http = require('http');
var express = require('express');
var app = express();
var git = require('./git.js');
var send = require('send');
var parseUrl = require('url').parse;
var server = null;


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

function startServer(callback) {
  console.log("Starting server");
  if (server)
    throw {message: 'Server was already started'};
  configureRoutes();
  var localServer;
  server = app.listen(3000, function () {
    var host = localServer.address().address;
    var port = localServer.address().port;

    console.log('Server is listening at http://%s:%s', host, port);
    if (callback)
      callback();
  });
  localServer = server;
}

function stopServer() {
  console.log("Stopping server");
  if (!server)  {
    throw {message:'Server was not started'};
  }
  server.close();
  server = undefined;  
}

module.exports.startServer = startServer;
module.exports.stopServer = stopServer;

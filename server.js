'use strict';

var http = require('http');
var express = require('express');
var app = express();
var git = require('./services/git.js');

configureRoutes();
startServer();


function configureRoutes() {
  app.get('/git', git);

}

function startServer() {
  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is listening at http://%s:%s', host, port);
  });
}

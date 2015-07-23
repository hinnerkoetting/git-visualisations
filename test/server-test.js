var server = require('../services/server.js');
var http = require('http');
var assert = require('assert');
var testedPort = 3001;
var testedHost = 'localhost';

describe('server', function() {
  describe('#startServer()', function() {
    it('should be able to start and stop server', function(done) {
      server.startServer(testedPort, function() {
        server.stopServer();
        done();
      })
    });
  });
  describe('#HTTP GET', function() {
    it('/ should return a HTML file', function(done) {
      var options = {
        host: testedHost,
        port: testedPort,
        path: '/'
      };
      http.request(options, isHtmlFile(done)).end();
    });
    it('should return existing file in public folder', function(done) {
      var options = {
        host: testedHost,
        port: testedPort,
        path: '/index.html'
      };
      http.request(options, isHtmlFile(done)).end();
    });
    it('should return error if file does not exist', function(done) {
      var options = {
        host: testedHost,
        port: testedPort,
        path: '/file-does-not-exist'
      };
      http.request(options, function(res) {
          assert.equal(res.statusCode, 404);
          done();
      }).end();
    });
    it('/git should return a JSON response', function(done) {
      var options = {
        host: testedHost,
        port: testedPort,
        path: '/git'
      };
      http.request(options, isJsonResponse(done)).end();
    });
    before(function(done) {
      server.startServer(testedPort, function() {
        done();
      })
    });
    after(function() {
      server.stopServer();
    });
  });
});

function isHtmlFile(done) {
  return function(res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
    done();
  }
}

function isJsonResponse(done) {
  return function(res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
    done();
  }
}

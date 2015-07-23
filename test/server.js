var server = require('../services/server.js');

describe('server', function() {
  describe('#startServer()', function() {
    it('should be able to start and stop server', function(done) {
      server.startServer(function() {
        server.stopServer();
        done();
      })
    });
  });
});

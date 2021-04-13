'use strict';

var gitlog = require('gitlog').default;

var options =
    { repo: __dirname + '/..'
    , number: 20
    , fields:
      [ 'hash'
      , 'abbrevHash'
      , 'subject'
      , 'authorName'
      , 'authorDate'
      ]
    }



function logGit(request, response) {
  gitlog(options, function(error, commits) {
      response.send(commits);
  })

}

module.exports = logGit;

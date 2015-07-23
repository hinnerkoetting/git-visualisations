

var gitlog = require('gitlog');

var options =
    { repo: __dirname + '/..'
    , number: 20
    , fields:
      [ 'hash'
      , 'abbrevHash'
      , 'subject'
      , 'authorName'
      , 'authorDateRel'
      ]
    }



function logGit(request, response) {
  gitlog(options, function(error, commits) {
      response.send(commits);
  })

}

module.exports = logGit;

QUnit.test( "aggregateInput returns empty array for empty input", function( assert ) {
  var aggregatedInput = aggregateInput([]);
  assert.equal(aggregatedInput.length, 0);
});

QUnit.test( "aggregateInput returns one entry for input with one entry", function( assert ) {
  var aggregatedInput = aggregateInput(createGitDataWithOneEntry());
  assert.equal(aggregatedInput.length, 1);
});

QUnit.test( "aggregateInput returns one entry for input with two entries on same day", function( assert ) {
  var aggregatedInput = aggregateInput(createGitDataWithTwoEntriesForSameDay());
  assert.equal(aggregatedInput.length, 1);
});

QUnit.test( "aggregateInput returns files length of one input entry", function( assert ) {
  var aggregatedInput = aggregateInput(createGitDataWithOneEntry());
  assert.equal(aggregatedInput[0].changedFiles, 2);
});

QUnit.test( "aggregateInput returns summed files length of two input entries on same day", function( assert ) {
  var aggregatedInput = aggregateInput(createGitDataWithOneEntry());
  assert.equal(aggregatedInput[0].changedFiles, 2);
});

QUnit.test( "aggregateInput returns two entries for two input entries on different days", function( assert ) {
  var aggregatedInput = aggregateInput(createGitDataWithTwoEntriesOnDifferentDays());
  assert.equal(aggregatedInput.length, 2);
});

QUnit.test( "aggregateInput returns two entries for three input entries on two different days", function( assert ) {
  var aggregatedInput = aggregateInput(createThreeGitEntriesOnTwoDifferentDays());
  assert.equal(aggregatedInput.length, 2);
});

function createGitDataWithOneEntry() {
  return [ {
      files: {
        length: 2
      },
      authorDate:"2015-07-23 14:40:57 +0200"
    }];
}

function createGitDataWithTwoEntriesForSameDay() {
  return [ {
      files: {
        length: 2
      },
      authorDate:"2015-07-23 14:40:57 +0200"
    },
    {
      files: {
        length: 3
      },
      authorDate:"2015-07-23 14:30:57 +0200"
    }
  ];
}

function createGitDataWithTwoEntriesOnDifferentDays() {
  return [ {
      files: {
        length: 2
      },
      authorDate:"2015-07-23 14:40:57 +0200"
    },
    {
      files: {
        length: 3
      },
      authorDate:"2015-07-24 14:30:57 +0200"
    }
  ];
}

function createThreeGitEntriesOnTwoDifferentDays() {
  return [ {
      files: {
        length: 2
      },
      authorDate:"2015-07-23 14:30:57 +0200"
    },
    {
      files: {
        length: 2
      },
      authorDate:"2015-07-23 14:40:57 +0200"
    },
    {
      files: {
        length: 3
      },
      authorDate:"2015-07-24 14:30:57 +0200"
    }
  ];
}

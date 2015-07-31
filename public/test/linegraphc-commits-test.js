QUnit.test( "can create bar chart without error", function( assert ) {
  var chart = createChartData(dummyGitData());
  createBarChart(chart);
  expect(0);
});

QUnit.test( "maximum Y value is at pixel 0", function( assert ) {
  var chart = createChartData(dummyGitData());
  var yScale = createYScale(chart);
  assert.equal(yScale(3), 0);
});

QUnit.test( "Y value of 0 is at chart height", function( assert ) {
  var chart = createChartData(dummyGitData());
  var yScale = createYScale(chart);
  assert.equal(yScale(0), chart.height);
});



function dummyGitData() {
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
  ]
}

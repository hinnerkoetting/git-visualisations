QUnit.test( "bar width for one entry is equal to chart width", function( assert ) {
  var chart = {
    data: [1],
    width: 10
  }
  var barWidth = computeBarWidth(chart);
  assert.equal(10, barWidth);
});

QUnit.test( "bar width with two entries is half of chart width", function( assert ) {
  var chart = {
    data: [1, 2],
    width: 10
  }
  var barWidth = computeBarWidth(chart);
  assert.equal(5, barWidth);
});

QUnit.test( "can create bar chart without error", function( assert ) {
  var chart = createChartOptions([1,2]);
  createBarChart(chart);
  expect(0);
});

function processGitResponse(data) {
  var numberOfFiles = data.map(function(entry) { return entry.files.length;});
  var chart = createChartOptions(numberOfFiles);

  createBarChart(chart);
}


function createBarChart(chart) {

    var y = createYScale(chart);


    var chartElement = d3.select(".chart")
      .attr("width", chart.width)
      .attr("height", chart.height);


    var bar = chartElement.selectAll("g")
      .data(chart.data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * computeBarWidth(chart) + ",0)"; });

    bar.append("rect")
      .attr("y", yPosition(y, chart))
      .attr("height", function(d) { return chart.height - y(d); })
      .attr("width", computeBarWidth(chart) - 1);

    bar.append("text")
      .attr("x", computeBarWidth(chart) / 2)
      .attr("y", function(d) { return y(d) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d; });
  }

function createYScale(chart) {
  var y = d3.scale.linear()
    .range([chart.height, 0]);
  y.domain([0, d3.max(chart.data, function(d) { return d; })]);
  return y;
}

function createChartOptions(input) {
  return {
    data: input,
    width: 1000,
    height: 500,
    getValue: function(d) { return d;}
  }
}

function computeBarWidth(chart) {
  return chart.width / chart.data.length;
}

function yPosition(y, chart) {
  return function(data) {
    return y(chart.getValue(data));
  }
}

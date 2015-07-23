
var input = [4, 8, 15, 16, 23, 42, 150];

$.ajax({
  url: "git",
})
.done(function( data ) {
  var numberOfFiles = data.map(function(entry) { return entry.files.length;});



  var chart = {
    data: numberOfFiles,
    width: 1000,
    height: 500,
    getValue: function(d) { return d;}
  }

  createBarChart(chart);

  function createBarChart(chart) {

    var y = d3.scale.linear()
      .range([chart.height, 0]);
    y.domain([0, d3.max(chart.data, function(d) { return d; })]);



    var chartElement = d3.select(".chart")
      .attr("width", chart.width)
      .attr("height", chart.height);

    var barWidth = chart.width / chart.data.length;
    var bar = chartElement.selectAll("g")
      .data(chart.data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

    bar.append("rect")
      .attr("y", yPosition(y, chart))
      .attr("height", function(d) { return chart.height - y(d); })
      .attr("width", barWidth - 1);

    bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d; });
  }

  function yPosition(y, chart) {
    return function(data) {
      return y(chart.getValue(data));
    }
  }
});

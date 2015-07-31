function processGitResponse(data) {
  var chart = createChartData(data);
  createLineChart(chart);
}

function createChartData(data) {
  var mapXEntry = function(entry, index) { return index;};
  var mapYEntry = function(entry) { return entry.files.length;};
  return createChartOptions(data, mapXEntry, mapYEntry);
}


function createLineChart(chart) {
    var y = createYScale(chart);
    var x = createXScale(chart);

    var svg = d3.select(".chart").
      attr("width", chart.width).
      attr("height", chart.height );


    var graph = svg.selectAll("g").
      data(chart.data).
      enter().append("g").
      attr("transform", function(d, i) { return "translate(" + computeRadius() / 2 + ", 0)"; });

    appendCircles(x, y, graph, chart);
    appendCircleDescription(x, y, graph, chart);
    appendPath(x,y, chart, svg);
    createYAxis(svg, y, chart);
}

function appendCircles(x, y, graph, chart) {
  graph.append("circle").
    attr("transform", function() {return "translate(-" + (computeRadius(chart) / 2)+ ", 0)";}).
    attr("cy", position(y, chart.getYValue)).
    attr("cx", position(x, chart.getXValue)).
    attr("r", computeRadius(chart)).
    attr("width", computeRadius(chart));
}

function appendCircleDescription(x, y, graph, chart) {
  graph.append("text").
    attr("x", position(x, chart.getXValue)).
    attr("y", function(d) { return y(chart.getYValue(d)) + 10; }).
    attr("dy", ".75em").
    text( chart.getYValue);
}

function appendPath(x, y, chart, svg) {
  var lineFunc = d3.svg.line().
    x(position(x, chart.getXValue)).
    y(position(y, chart.getYValue)).
    interpolate('linear');

  svg.append('svg:path').
    attr('d', lineFunc(chart.data)).
    attr('stroke', 'blue').
    attr('stroke-width', 2).
    attr('fill', 'none');
}

function createYAxis(svg, y, chart){
  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);
  svg.
    append("g").
    attr("transform", "translate(0,0)").
    attr("class", "axis").
    style("fill", "steelblue").
    call(yAxis);
  svg.
    append("text").
    attr("x", 0).
    attr("y", -10).
    attr("text-anchor", "start").
    text("Number of changed files per commit");
}

function formatYYYYMMDD(date) {
  return date.getFullYear() + "-" +pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function pad(dateEntry) {
  return dateEntry < 10 ? "0" + dateEntry : dateEntry;
}

function createXScale(chart) {
  var x = d3.scale.linear().
    rangeRound([0, chart.width]);
  x.domain([0, chart.data.length]);
  return x;
}

function createYScale(chart) {
  var y = d3.scale.linear().
    range([chart.height, 0]);
  y.domain([0, d3.max(chart.data, chart.getYValue)]);
  return y;
}

function createChartOptions(input, mapXValue, mapYValue) {
  return {
    data: input,
    width: 1000,
    height: 500,
    getXValue: mapXValue,
    getYValue: mapYValue
  }
}

function computeRadius(chart) {
  return 10;
}

function position(scale, valueFunction) {
  return function(data, index) {
    return scale(valueFunction(data, index));
  }
}

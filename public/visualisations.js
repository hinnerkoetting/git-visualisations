
function processGitResponse(data) {

  var chart = createChartData(data);

  createBarChart(chart);
}

function createChartData(data) {
  var mapXEntry = function(entry, index) { return Date.parse(entry.authorDate);};
  var mapYEntry = function(entry) { return entry.files.length;};
  return createChartOptions(data, mapXEntry, mapYEntry);
}


function createBarChart(chart) {
    var y = createYScale(chart);
    var x = createXScale(chart);

    var svg = d3.select(".chart").
      attr("width", chart.width).
      attr("height", chart.height );


    var bar = svg.selectAll("g").
      data(chart.data).
      enter().append("g").
      attr("transform", function(d, i) { return "translate(" + computeBarWidth(chart) / 2 + ", 0)"; });

    appendCircles(x, y, bar, chart);
    appendCircleDescription(x,y, bar, chart);
    appendPath(x,y, chart, svg);
    createYAxis(svg, y, chart);
    createXAxis(svg, x, chart);
}

function appendCircles(x, y, bar, chart) {
  bar.append("circle").
    attr("cy", position(y, chart.getYValue)).
    attr("cx", position(x, chart.getXValue)).
    attr("r", computeBarWidth(chart)).
    attr("width", computeBarWidth(chart));
}

function appendCircleDescription(x, y, bar, chart) {
  bar.append("text").
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
    attr("transform", "translate(15,0)").
    attr("class", "axis").
    style("fill", "steelblue").
    call(yAxis);
  svg.
    append("text").
    attr("x", 0).
    attr("y", -10).
    attr("text-anchor", "start").
    text("Number of changed files");
}

function createXAxis(svg, x, chart){
  var xAxis = d3.svg.axis().scale(x);
  svg.
    append("g").
    attr("transform", "translate(0," + chart.height + ")").
    attr("class", "axis").
    style("fill", "steelblue").
    call(xAxis);
  svg.
    append("text").
    attr("x", chart.width - 100).
    attr("y", chart.height - 10).
    attr("text-anchor", "end").
    text("Commit time");
}

function createXScale(chart) {
  var x = d3.time.scale().
    rangeRound([0, chart.width - 200]);
  x.domain([d3.min(chart.data, chart.getXValue) - 1000 * 60 * 15 , d3.max(chart.data, chart.getXValue)]);
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

function computeBarWidth(chart) {
  return 10;
}

function position(scale, valueFunction) {
  return function(data, index) {
    return scale(valueFunction(data, index));
  }
}

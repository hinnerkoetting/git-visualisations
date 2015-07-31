function processGitResponse(data) {
  var chart = createChartData(data);
  createLineChart(chart);
}

function createChartData(data) {
  var mapXEntry = function(entry, index) { return data.length - index;};
  var options = createChartOptions(data, mapXEntry);
  options.lines.push({
    valueMapper: numberOfFilesWithStatus("M"),
    color: 'steelblue'
  });
  options.lines.push({
    valueMapper: numberOfFilesWithStatus("A"),
    color: 'green'
  });
  options.lines.push({
    valueMapper: numberOfFilesWithStatus("D"),
    color: 'red'
  });
  options.lines.push({
    valueMapper: function(entry) { return entry.files.length;},
    color: 'darkblue'
  });


  return options;
}

function numberOfFilesWithStatus(checkStatus) {
  return function (entry) {
    return entry.status.reduce(function(last, current) {
        if (current === checkStatus) {
          last++;
        }
        return last;
    }, 0);
  }
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

      appendPath(x,y, chart, svg);
    appendCircles(x, y, graph, chart);
    appendCircleDescription(x, y, graph, chart);

    createYAxis(svg, y, chart);
}

function appendCircles(x, y, graph, chart) {
  chart.lines.forEach(function(line) {
    graph.append("circle").
      style("fill", line.color).
      attr("transform", function() {return "translate(-" + (computeRadius(chart) / 2  )+ ", 0)";}).
      attr("cy", position(y, line.valueMapper)).
      attr("cx", position(x, chart.getXValue)).
      attr("r", computeRadius(chart)).
      attr("width", computeRadius(chart));
  });
}

function appendCircleDescription(x, y, graph, chart) {
  chart.lines.forEach(function(line) {
    graph.append("text").
      attr("x", position(x, chart.getXValue)).
      attr("y", function(d) { return y(line.valueMapper(d)) + 10; }).
      attr("dy", ".75em").
      text(line.valueMapper);
  });
}

function appendPath(x, y, chart, svg) {
  chart.lines.forEach(function (line) {
    var lineFunc = d3.svg.line().
      x(position(x, chart.getXValue)).
      y(position(y, line.valueMapper));

    svg.append('svg:path').
      attr('d', lineFunc(chart.data)).
      attr('stroke', line.color);
  });
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
  y.domain([0, maxOfAllValues(chart)]);
  return y;
}

function maxOfAllValues(chart) {
  var max = 0;
  chart.lines.forEach(function (line) {
    var maxOfLine = d3.max(chart.data, line.valueMapper);
    max = max > maxOfLine ? max : maxOfLine;
  });
  return max;
}


function createChartOptions(input, mapXValue) {
  return {
    data: input,
    width: 1000,
    height: 500,
    lines: [],
    getXValue: mapXValue
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

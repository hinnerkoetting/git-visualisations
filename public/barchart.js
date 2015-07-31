function processGitResponse(data) {
  var chart = createChartData(data);
  createBarChart(chart);
}

function createChartData(data) {
  var mapXEntry = function(entry, index) {
    return entry.authorDate;};
  var mapYEntry = function(entry) { return entry.changedFiles;};
  return createChartOptions(data, mapXEntry, mapYEntry);
}

function createChartOptions(input, mapXValue, mapYValue) {
  return {
    padding: { left: 25, top: 0, right: 25, bottom: 50 },
    data: aggregateInput(input),
    width: 1000,
    height: 500,
    getXValue: mapXValue,
    getYValue: mapYValue,
    numberOfXEntries: 20
  }
}

function aggregateInput(data) {
  return data.sort(function(a, b) {
    return Date.parse(a.authorDate) - Date.parse(b.authorDate);
  }).map(function(entry) {
    var date = Date.parse(entry.authorDate);
    return {
      changedFiles: entry.files.length,
      authorDate: stripDate(new Date(date))
    }
  }).reduce(function (last, current) {

    if (last.length == 0 || last[last.length - 1].authorDate.getTime() !== current.authorDate.getTime()) {
      last.push(current);
    } else {
      last[last.length - 1].changedFiles += current.changedFiles;
    }
    return last;
  }, []);
}

function stripDate(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function formatYYYYMMDD(date) {
  return date.getFullYear() + "-" +pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function pad(dateEntry) {
  return dateEntry < 10 ? "0" + dateEntry : dateEntry;
}

function createBarChart(chart) {
  var xScale = createXScale(chart);
  var yScale = createYScale(chart);

  var svg = d3.select(".chart").
    attr("width", chart.width).
    attr("height", chart.height );

    var graph = svg.selectAll("g").
      data(chart.data).
      enter().append("g").
      attr("transform", function(d, i) { return "translate(0, 0)"; });

    appendRectangles(xScale, yScale, graph, chart);
    appendTexts(xScale, yScale, graph, chart);
    createXAxis(svg, xScale, chart);
}

function appendRectangles(x, y, graph, chart) {
  graph.append("rect").
    attr("transform", function(){ return "translate(" + ( - computeBarWidth(chart) / 2) + ", 0)";}).
    attr("y", function(entry) {
      return chart.height - position(y, computeBarHeight(chart))(entry);
    }).
    attr("x", position(x, chart.getXValue)).
    attr("height", position(y, computeBarHeight(chart))).
    attr("width", computeBarWidth(chart));
}

function appendTexts(x, y, graph, chart) {
  graph.append("text").
    attr("transform", function(){ return "translate(-10, 10)";}).
    attr("x", position(x, chart.getXValue)).
    attr("y", function(entry) {
      return chart.height - position(y, computeBarHeight(chart))(entry);
    }).
    attr("dy", ".75em").
    text( chart.getYValue);

}

function position(scale, valueFunction) {
  return function(data, index) {
    return scale(valueFunction(data, index));
  }
}

function computeBarHeight(chart) {
  return function(entry) {
    return chart.getYValue(entry);
  }
}

function computeBarWidth(chart) {
  return chart.width  / chart.numberOfXEntries;
}

function createXScale(chart) {
  var x = d3.time.scale().
    rangeRound([0, chart.width - chart.padding.right - chart.padding.left]);
  x.domain([d3.min(chart.data, chart.getXValue), d3.max(chart.data, chart.getXValue)]);
  return x;
}

function createYScale(chart) {
  var y = d3.scale.linear().
    range([0, chart.height - chart.padding.top - chart.padding.bottom]);
  y.domain([0, d3.max(chart.data, chart.getYValue)]);
  return y;
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
    attr("x", chart.width).
    attr("y", chart.height).
    attr("text-anchor", "end").
    text("Date");
}

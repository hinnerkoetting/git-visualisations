function processGitResponse(data) {
  var chart = createChartData(data);
  createBarChart(chart);
}

function createChartData(data) {
  var mapXEntry = function(entry, index) { return Date.parse(entry.authorDate);};
  var mapYEntry = function(entry) { return entry.files.length;};
  return createChartOptions(data, mapXEntry, mapYEntry);
}

function createChartOptions(input, mapXValue, mapYValue) {
  return {
    padding: { left: 0, top: 0, right: 50, bottom: 50 },
    data: aggregateInput(input),
    width: 1000,
    height: 500,
    getXValue: mapXValue,
    getYValue: mapYValue
  }
}

function aggregateInput(data) {
  return data.sort(function(a, b) {
    return b.authorDate - a.authorDate;
  }).map(function(entry) {
    var date = Date.parse(entry.authorDate);    
    return {
      changedFiles: entry.files.length,
      authorDate: formatYYYYMMDD(new Date(date))
    }
  }).reduce(function (last, current) {

    if (last.length == 0 || last[last.length - 1].authorDate !== current.authorDate) {
      last.push(current);
    } else {
      last[last.length - 1].changedFiles += current.changedFiles;
    }
    return last;
  }, []);
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
      attr("transform", function(d, i) { return "translate(10, 0)"; });

    appendRectangles(xScale, yScale, graph, chart);
}

function appendRectangles(x, y, graph, chart) {
  graph.append("rect").
    attr("y", position(y, computeBarHeight(chart))).
    attr("x", position(x, chart.getXValue)).
    attr("height", position(y, computeBarHeight(chart))).
    attr("width", computeBarWidth(chart));
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
  return chart.width  / chart.data.length;
}

function createXScale(chart) {
  var x = d3.time.scale().
    rangeRound([0, chart.width - chart.padding.right - chart.padding.left]);
  x.domain([d3.min(chart.data, chart.getXValue), d3.max(chart.data, chart.getXValue)]);
  return x;
}

function createYScale(chart) {
  var y = d3.scale.linear().
    range([chart.height - chart.padding.top - chart.padding.bottom, 0]);
  y.domain([0, d3.max(chart.data, chart.getYValue)]);
  return y;
}

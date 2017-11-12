var n = 20, // number of layers
    m = 200, // number of samples per layer
    k = 10; // number of bumps per layer

var canvasMargin = 50;
var svg = d3.select("svg")
var width = svg.attr("width") - canvasMargin;
var height = svg.attr("height") - canvasMargin;
var g0 = svg.append("g")
	.attr("transform", "translate(" + canvasMargin / 2 + "," + canvasMargin / 2 + ")");

var data = d3.range(n).map(function() {return bumps(m, k)});
//data[0]: 1 row and 200 columns
//data : 20 row and 200 columns
//In data, each row represents the evolution of an attribute
//In data, each column represents a specific timestamp.
console.log(data);

var stack = d3.stack()
    .keys(d3.range(n))
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

var layers = stack(d3.transpose(data)); //transposing is necessary due to API's feature.  
//series : 20 row and 200 columns, each cell is [accumulate data, accumulate data + current data] in column context
console.log(layers);

var x = d3.scaleLinear()
	.domain([0, m - 1])
	.range([0, width])

var y = d3.scaleLinear()
	.domain([d3.min(layers, function(layer) {return d3.min(layer, function(d) {return d[0];})}), 
			 d3.max(layers, function(layer) {return d3.max(layer, function(d) {return d[1];})})])
	.range([height, 200])
	
var z = d3.interpolateWarm;

var area = d3.area()
    .x(function(d, i) { return x(i); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

g0.selectAll("path")
  .data(layers)
  .enter().append("path")
    .attr("d", area)
    .attr("fill", function() { return z(Math.random()); });	

function bumps(n, m) {//return a sequence of value showing evolution
	var a = [], i;
	for (i = 0; i < n; ++i) a[i] = 0;
	for (i = 0; i < m; ++i) bump(a, n);
	return a;
}

function bump(a, n) {
	var x = 1 / (0.1 + Math.random());
	var y = 2 * Math.random() - 0.5;
	var z = 10 / (0.1 + Math.random());
	for (var i = 0; i < n; i++) {
		var w = (i / n - y) * z;
		a[i] += x * Math.exp(-w * w);
	}
}

/*
//used to test bumps(m, k)
var area2 = d3.area()
	.x(function(d, i) {return i})
	.y0(0)
	.y1(function(d) {return d * 20})

var item = bumps(m, k)
//console.log(item)
g0.append("path")
	.each(function(d, i) {console.log(i)})
	.attr("d", area2(item))
	.attr("fill", "red")
*/


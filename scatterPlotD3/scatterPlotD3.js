var svg = d3.select("svg");
var leftMargin = 50, topMargin = 50;
var width = svg.attr("width") - leftMargin;
var height = svg.attr("height") - topMargin;
var g0 = svg.append("g")
    .attr("transform", "translate(" + leftMargin + "," + topMargin + ")");

var size = 180;
var margin = 20;
var padding = 160;

var scaleAttributes = {};
var x = d3.scaleLinear()
    .range([0, padding]);
var attributes = d3.keys(iris[0]).filter(function(attribute) {
    return attribute != "species" && (  scaleAttributes[attribute] =  
        d3.scaleLinear()
            .domain(d3.extent(iris, function(flower) { return flower[attribute]; }))
            .range([0, padding]));
});


var color = d3.schemeCategory10;
var cross = cross(attributes, attributes);
var brush = d3.brush()
	.extent([[0, 0], [padding, padding]])
	.on("start", brushstart)
	.on("brush", brushmove)
	.on("end", brushend);


var i = -1;
g0.selectAll(".cell")
.data(cross)
.enter()
.append("g")
.attr("class", "window")
.attr("transform", function() {
	i++;
	var row = Math.floor(i / 4);
	var col = i % 4;
	return "translate(" + (col * size) + "," + (row * size) + ")";
})
.attr("id", function(cross) {return cross;})
.each(plot)
.append("g")
.attr("class", "brush")
.call(brush)


function plot(cross) {
	d3.select(this)
	.append("rect")
	.attr("class", "frame")
	.attr("width", padding)
	.attr("height", padding)
	
	d3.select(this)
	.selectAll(".point")
	.data(iris)
	.enter()
	.append("circle")
	.attr("r", 4)
	.attr("cx", function(flower) {
		var xAttr = cross.x;
		return scaleAttributes[xAttr](flower[xAttr])
	})
	.attr("cy", function(flower) {
		var yAttr = cross.y;
		return scaleAttributes[yAttr](flower[yAttr])
	})
	.attr("fill", function(flower) {
		if (flower.species === "Iris-setosa")
			return '#e41a1c';
		else if (flower.species === "Iris-versicolor")
			return '#377eb8';
		else
			return '#4daf4a';
	})
}


function cross(a, b) {
	var c = [];
	for (var i = 0; i < a.length; i++) {
		for (var j = 0; j < b.length; j++) {
			var attr1 = a[i];
			var attr2 = b[j];
			c.push({x:attr1, i:i, y:attr2, j:j});
		}
	}
	return c;
}

var brushCell;

function brushstart(p) {
	console.log(p)
	console.log(this)
	console.log(brushCell)
	if (brushCell !== this) {
		d3.event.selection = null;
		console.log(d3.event);
		//d3.select(brushCell).remove();//这样子直接把事件给移走了
		//方案一 再把事件添加回去
		//方案二 不要把整个事件移走
		/*
		d3.selectAll(".window")
		.append("g")
		.attr("class", "brush")
		.call(brush)*/
		
	}
	//添加回去


	brushCell = this;
}

function brushmove(cross) {
	var xAttr = cross.x;
	var yAttr = cross.y;
	var x = parseFloat(d3.select(this).select(".selection").attr("x"))
	var y = parseFloat(d3.select(this).select(".selection").attr("y"))
	var x2 = x + parseFloat(d3.select(this).select(".selection").attr("width"))
	var y2 = y + parseFloat(d3.select(this).select(".selection").attr("height"))
	var xLower = scaleAttributes[xAttr].invert(x);
	var xUpper = scaleAttributes[xAttr].invert(x2);
	var yLower = scaleAttributes[yAttr].invert(y);
	var yUpper = scaleAttributes[yAttr].invert(y2);
	d3.selectAll("circle").classed("hidden", function(flower) {
		return ( flower[xAttr] < xLower
		||  flower[xAttr] > xUpper
		||  flower[yAttr] < yLower
		|| flower[yAttr] > yUpper );
	})

}

function brushend() {
	
	console.log(d3.event.selection)
	if (!d3.event.selection) 
		svg.selectAll(".hidden").classed("hidden", false);
}
var svg = d3.select("svg");
var width = svg.attr("width")
var height = svg.attr("height")

var color = d3.scaleOrdinal(d3.schemeCategory20);  //generate an array of color

var simulation = d3.forceSimulation(graph.nodes)
.force("link", d3.forceLink(graph.links).id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width / 2, height / 2))
.on("tick", ticked) 
// tick event is triggered since the simulation started
// and then the locations of points and links automatically refreshed
// ticked is a function to draw the points and links

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

var node = svg.append("g")
    .attr("class", "node")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 4)
    .attr("fill", function(d) { return color(d.group); })

function ticked() {
    link.attr("x1", function(d) {return d.source.x})
        .attr("y1", function(d) {return d.source.y})
        .attr("x2", function(d) {return d.target.x})
        .attr("y2", function(d) {return d.target.y})
    node.attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y})
}



var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height") - 30;

var x = d3.scaleTime()
.domain([new Date(2013, 7, 1), new Date(2013, 7, 15) - 1])
.range([0, width]);

svg.append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(10,"+ height +")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeDay)
        .tickSize(-height)
    )
    .selectAll("text")
    .attr("x", 6)
    
svg.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended)
    );

function brushended() {
    var loc = d3.event.selection;
    var start = new Date(x.invert(loc[0] - 10));
    var end = new Date(x.invert(loc[1] - 10))
    d3.selectAll("p").remove();
    d3.select("div").selectAll("p")
    .data([start, end])
    .enter()
    .append("p")
    .attr("transform", "translate(10)")
    .html(function(p) { return p.toString();});
}
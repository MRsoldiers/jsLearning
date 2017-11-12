
var svg = d3.select("svg")
var width = svg.attr("width")
var height = svg.attr("height");   //get attributes

var i = 0;
var root = d3.hierarchy(data)                                                       //generate hierarchical structure
    .eachBefore(function(d) { 
        d.data.id = i;
        d.data.parentId = d.parent ? d.parent.data.id: -1;
        i++;
    })                                                                              //traverse the tree and invoke the function for each node 
    .sum(sumBySize)                                 //a specific attribute of descendants after accumulated
    .sort(function(a, b) { return b.height - a.height || b.value - a.value; });     //sort the siblings for each level

var treemap = d3.treemap()       
    .tile(d3.treemapResquarify)  //algorithm to assign tiles
    .size([width, height])       //total size
    .round(true)                 //round setting
    .paddingInner(2);            //padiing setting

treemap(root)   //fulfill the hierarchical structure with data named root.

var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.1); };
var color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
//interpolateRgb(a,b) returns a sequence of color.
//interpolateRgb(a,b)(x) means color of x * a + (1 - x) * b
//d3.schemeCategory20 generates a array with 20 kinds of color
//array.map(function()) returns a new array where each element is transformed by function from original one
//scaleOrdinal() map the sequence of data into 0,1,2,3,4,...

for (var i = 0; i < 100; i++) { console.log(color(i));}

var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", function(d) { 
        return "translate(" + d.x0 + "," + d.y0 + ")"; 
    })
//cell returns a series of <g></g>

cell.append("rect")
    .attr("width", function(d) { return d.x1 - d.x0; })
    .attr("height", function(d) { return d.y1 - d.y0; })
    .attr("fill", function(d) {
        var colorIndex = parseInt(d.data.parentId) / 2
        return color(colorIndex)
    })
    .attr("id", function(d) { return d.data.name})
    .on("mouseover", function(d) {
        var name = d3.select(this).attr("id");
        $("#text" + name).text(function(d) {return name});
    })
    .on("mouseout", function(d) {
        var name = d3.select(this).attr("id");
        $("#text" + name).text("");
    })

cell.append("text")
    .attr("id", function(d) {return "text" + d.data.name})
    .attr("x", function(d) {return 1;})
    .attr("y", function(d) {return 10;})
    .text(function(d) {
        if((200 > ((d.x1 - d.x0) * (d.y1 - d.y0))) || (d.x1 - d.x0 < d.data.name.length * 5))
            return "";
        else
            return d.data.name;
    })

d3.selectAll("input")
    .data([sumBySize, sumByCount], function(d) {return d ? d.name : this.value; })
    .on("change", function(d) { //here, d is the function to calculate the value used for ordering
        treemap(root.sum(d));
        cell.transition()
            .duration(750)
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
            .select("rect")
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; });
        cell.selectAll("text").remove();
        cell.append("text")
        .attr("id", function(d) { return "text" + d.data.name})
        .attr("x", function(d) { return 1;})
        .attr("y", function(d) { return 10;})
        .text(function(d) {
            if((200 > ((d.x1 - d.x0) * (d.y1 - d.y0))) || (d.x1 - d.x0 < d.data.name.length * 5))
                return "";
            else
                return d.data.name;
        })
    });

function sumByCount(d) { return d.children ? 0 : 1;} 
function sumBySize(d) { return d.size;}


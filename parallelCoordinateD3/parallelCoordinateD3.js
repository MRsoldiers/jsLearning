var svg2 = d3.select("svg");
var width = svg2.attr("width");
var height = svg2.attr("height");
var svg = svg2.append("g") //generate a g for easy transformation

var x = d3.scalePoint().range([0, width]),   //Constructs a new point scale
y = {};

var line = d3.line();
var axis = d3.axisRight();

var count = 0;
x.domain(attributes = d3.keys(cars[0]).filter(function(attribute) { //d3.keys(car[0]) get the names(keys) of attributes
    return attribute != "name" && (                                 //filter out attribute of name and "&&" help to accelerate by skipping the  
                                                                    //following process if the attribute is name;
        //following process:                                        
        y[attribute] = d3.scaleLinear()  //Constructs a new continuous scale                            
            .domain(d3.extent(cars, function(aCar) {return aCar[attribute]; })) //domain
            .range([height, 0])                                                 //range
    );
}))
//domain： [min max] of attribute value. Due to the attributes
//is not indexed by number, the specific attribute for each car  
//is accessed by aCar[attribute].

//path
var paths = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(cars)
    .enter().append("path")
    .attr("d", path);

//coordinate
var g = svg.selectAll(".dimension")
    .data(attributes)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(attribute) { return "translate(" + x(attribute) + ")"; });

//g is a series of <g></g>
 g.append("g")
    .attr("class", "axis")
    .each(function(attribute) {
		//this is equivalent to "axis.scale(y[attribute])(d3.select(this))"
        d3.select(this).call(axis.scale(y[attribute]));
	})
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d; });

//path generator
function path(aCar) {
    return line(attributes.map(function(attribute) { //missing data leads to undefined
        return [x(attribute), y[attribute](aCar[attribute])]; 
        //x(attribute):the x-location of axis cooresponding a specific attribute,
        //aCar[attribute]:the value of a specific attribute of the car
        //y[attribute](aCar[attribute]): the y-location after transformation by y[attribute], a function of scaleLiner()
    }));
}

svg.attr("transform", "translate(40,70) scale(0.8)")
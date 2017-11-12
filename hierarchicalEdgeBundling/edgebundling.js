var diameter = 1080;
var radius = diameter / 2;
var innerRadius = radius - 260;

var map = {};
flare.forEach(function(d) { generate(d.name, d);})

var hierData = d3.hierarchy(map["flare"])
	.sum(function(d) { return d.size; });

var cluster = d3.cluster()
    .size([360, innerRadius]);//[360, 360]

cluster(hierData);

var g0 = d3.select("body")
	.append("svg")
	.attr("width", diameter)
	.attr("height", diameter)
	.append("g")
	.attr("transform", "translate(" + (diameter / 2) + "," + (diameter / 2) + ")");

var node = g0.selectAll(".node");
var link = g0.selectAll(".link");

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(0.85))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

node = node
	.data(hierData.leaves())
	.enter()
	.append("text")
	.attr("class", "node")
	.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
	.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; }) //文本相对基点（x，y）的位置
	.text(function(d) { return d.data.key; });


link = link
	.data(paths(hierData.leaves()))
	.enter()
	.append("path")
	.attr("class", "link")
	.attr("d", line)
	
function paths(leaves) {
	var nameMap = {};
	hierData.leaves().forEach(function(d) { nameMap[d.data.name] = d;})
	
	var paths = [];
	leaves.forEach(function(leave) {
		var imports = leave.data.imports;
		imports.forEach(function(d) {
			var path = leave.path(nameMap[d]);
			paths.push(path);
		})
	})
	return paths;
}
	  
	 
	 
	 
	 
/*
g0.selectAll(".circle")
.data(hierData.leaves())
.enter()
.append("circle")
.attr("r", 3)
.attr("cx", function(d) { return d.x })
.attr("cy", function(d) { return d.y })
.attr("fill", "red")

*/












function generate(nodeName, data) {
	var node = map[nodeName];
	if (!node) {// the node is not exist.
		if (data) {
			var imports = data.imports;
			var size = data.size;
			node = {imports : imports, size : size, name: nodeName, parent : [], key : null};
		} else {
			node = {name: nodeName, children: [], parent : []};
		}
		var lastDot = nodeName.lastIndexOf(".");
		var fatherName = nodeName.substring(0, lastDot);
		if (!fatherName.length) {
			map[nodeName] = node;
			return node;
		}			
		var key = nodeName.substring(lastDot + 1);
		var fatherNode = generate(fatherName);
		node.parent = fatherNode;
		node.key = key;
		fatherNode.children.push(node);
		map[nodeName] = node;
	}
	return node;
}



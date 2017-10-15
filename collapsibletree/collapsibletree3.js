var flare = {
	"name": "subjects",
	"children" : [
		{"name": "alert"},
		{"name": "aloud"},
		{
			"name": "apple",
			"children": [
				{"name": "pear"},
				{"name": "grape"},
				{"name": "banana"},
				{
					"name": "melon",
					"children": [
						{"name": "watermelon"},
						{"name": "cucumber"},
						{"name": "gourd"}
					]
				}
			]
		},
		{
			"name": "computer",
			"children": [
				{"name": "keyboard"},
				{"name": "mouse"},
				{"name": "USB"},
				{"name": "monitor"}
			]
		},
		{
			"name": "man",
			"children": [
				{"name": "male"},
				{"name": "female"}
			]
		},
		{
			"name": "desk",
			"children": [
				{"name": "table"}
			]
		},
		{"name": "abandon"},
		{
			"name": "annoy",
			"children": [
				{"name": "happy"},
				{"name": "sad"},
				{"name": "frustrated"},
				{"name": "cry"},
				{"name": "confused"},
				{"name": "interesting"}
			]
		},
		{
			"name": "sport",
			"children": [
				{
					"name": "baseball",
					"children": [
						{"name": "basketball"},
						{"name": "football"}
					]
				},
				{"name": "swim"},
				{"name": "run"},
				{"name": "skate"}
			]
		},
		{"name": "heelo"}
	]
}


//创建node类
function Node(id, children, father, depth, name) {
	var node = new Object;
	node.x = 0;
	node.y = 0;
	node.r = 8;
	node.isChildrenShown = false;
	node.isShown = false;
	node.name = name;
	node.children = children;
	node.father = father;
	node.depth = depth;
	node.id = id;
	node.effect = [];
	return node;
}

var nodeList = [];
flare.depth = 0;

var selectNode = flare; 
var id = 0;
var depthArray = [[], [], [], [], []];

var depthShownDict0 = new Dictionary(); 
var depthShownDict1 = new Dictionary(); 
var depthShownDict2 = new Dictionary(); 
var depthShownDict3 = new Dictionary(); 
var depthShownDict4 = new Dictionary(); 
var depthShownDict = [depthShownDict0, depthShownDict1, depthShownDict2, depthShownDict3, depthShownDict4];

if (selectNode != null) {
	var queue = [];
	queue.unshift(selectNode);
	while (queue.length != 0) {
		var item = queue.shift();
		//visit
		item.isChildrenShown = false;
		item.id = id;
		id++;
		var children = item.children;
		if (!children) continue;
		for (var i = 0; i < children.length; i++) {
			children[i].depth = item.depth + 1;
			queue.push(children[i]);
		}
	}
}
if (selectNode != null) {
	var queue = [];
	queue.unshift(selectNode);
	while (queue.length != 0) {
		var item = queue.shift();
		//visit
		depthArray[item.depth].push(item.id);
		var currentNode = Node(item.id, item.children, item.father, item.depth, item.name);
		nodeList.push(currentNode);
		var children = item.children;
		if (!children) continue;
		for (var i = 0; i < children.length; i++) {
			children[i].father = item;
			queue.push(children[i]);
		}
	}
}


nodeList[0].x = 100;
nodeList[0].y = 400;
nodeList[0].isShown = true;
drawCircle(nodeList[0], nodeList[0].x, nodeList[0].y);
depthShownDict[0].put(0, nodeList[0]);
console.log(nodeList[1]);


function drawCircle(node, x, y) {
	var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("r", node.r);
	if (typeof(node.children) === "undefined")
		circle.setAttribute("fill", "blue");		
	else 
		circle.setAttribute("fill", "red");
	circle.setAttribute("id", "circle" + node.id);
	circle.addEventListener("click", function() {
		if (nodeList[node.id].isChildrenShown) {
			nodeList[node.id].isChildrenShown = false
			var nodeSChildren = nodeList[node.id].children;
			if (typeof(nodeSChildren) !== "undefined") {
				var stack = [];
				for (var i = 0; i < nodeSChildren.length; i++) {
					var childId = nodeSChildren[i].id;
					stack.push(childId);
				}
				while (stack.length != 0) {
					var item = stack.pop();
					nodeList[item].isShown = false;
					if (nodeList[item].isChildrenShown) nodeList[item].isChildrenShown = false;
					depthShownDict[nodeList[item].depth].remove(item);
					var children = nodeList[item].children;
					if (typeof(children) !== "undefined") {
						for (var i = 0; i < children.length; i++) {
							var childId = children[i].id;
							if (nodeList[childId].isShown) {
								stack.push(childId);
							}
						}
					}
				}	
				update(node.id, false);//收缩
			}

			
		} else {
			nodeList[node.id].isChildrenShown = true;
			var nodeSChildren = nodeList[node.id].children;
			if (typeof(nodeSChildren) !== "undefined") {
				for (var i = 0; i < nodeSChildren.length; i++) {
					var childId = nodeSChildren[i].id;
					nodeList[childId].isShown = true;
					depthShownDict[nodeList[childId].depth].put(childId, nodeList[childId]);
				}
				update(node.id, true);//展开
			}
		}
		
	});
	var svg = document.getElementById("svg1");
	svg.appendChild(circle);
}

function update(id, bool) {
	//更新位置
	if (bool) {//展开
		var children = nodeList[id].children;
		var childrenX = nodeList[id].x + 130;
		var childrenMinY = nodeList[id].y - (children.length - 1) * (40 / 2);
		var childrenMaxY = nodeList[id].y + (children.length - 1) * (40 / 2);
		
		for (var i = 0; i < children.length; i++) {
			var childId = children[i].id;
			nodeList[childId].x = childrenX;
			nodeList[childId].y = childrenMinY + i * 40;
		}
		
		
		var yRange = [childrenMinY - 20, childrenMaxY + 20];
		var otherRange = [];
		var targetDepthDict = depthShownDict[nodeList[id].depth];
		for (var key in targetDepthDict.data) {//那字典还有用吗？
			if (!targetDepthDict.get(key)) continue;
			if (!nodeList[key].isChildrenShown) continue;
			var nodeShowingChildren = nodeList[key];
			var nodeShowingChildrenChildrenX = nodeShowingChildren.x + 130;
			var nodeShowingChildrenchildrenMinY = nodeShowingChildren.y - (nodeShowingChildren.children.length - 1) * (40 / 2);
			var nodeShowingChildrenchildrenMaxY = nodeShowingChildren.y + (nodeShowingChildren.children.length - 1) * (40 / 2);
			otherRange.push([nodeShowingChildrenchildrenMinY - 20, nodeShowingChildrenchildrenMaxY + 20]);
		}
		
		//先验证只相交一种的情况
		$("line").remove();
		$("circle").remove();
		$("text").remove(); 
		console.log(otherRange);
		var yRangeOrigin0 = yRange[0];
		var yRangeOrigin1 = yRange[1];
		console.log(otherRange.length);
		for (var i = 0; i < otherRange.length; i++) {
			//console.log(otherRange[i][0] === yRangeOrigin0 && otherRange[i][1] === yRangeOrigin1);
			if (otherRange[i][0] === yRangeOrigin0 && otherRange[i][1] === yRangeOrigin1) continue;
			//不考虑根节点上下均衡
			
			console.log(">>>>>>>>>>");
			console.log(isIntersect(yRange, otherRange[i]));
			console.log(otherRange[i]);
			console.log(yRange);
			console.log(">>>>>>>>>>");
			
			if (isIntersect(yRange, otherRange[i]) === 0) {//情况0,处理方案-主动上移（变小）
				var moveDistY = yRange[1] - otherRange[i][0];
				//深度遍历上方的所有showing的节点，上移moveDistY（y减小）
				for (var theId = id; theId >= 1; theId--) {
					var stack = [];  
					stack.push(nodeList[theId].id);  
					while (stack.length != 0) {  
						var item = stack.pop();
						console.log(item);
						nodeList[item].y -= moveDistY;//visit
						nodeList[id].effect.push([item, -moveDistY]);
						var children = nodeList[item].children; 
						if (typeof(children) === "undefined") continue;
						for (var ii = children.length - 1; ii >= 0; ii--)
							if (nodeList[children[ii].id].isShown)
								stack.push(children[ii].id);						  
					}  
				}
				for (var iii = 0; iii < otherRange.length; iii++) {
					var yRangeMid = (yRange[0] + yRange[1]) / 2;
					var otherRangeMid = (otherRange[iii][1] + otherRange[iii][0]) / 2;
					if (yRangeMid > otherRangeMid) {
						otherRange[iii][0] -= moveDistY;
						otherRange[iii][1] -= moveDistY;
					}
				}
				yRange[0] -= moveDistY;//不仅要更新自己的，还要【先】更新其他人的
				yRange[1] -= moveDistY;
				
				console.log("上移moveDistY  :  " + moveDistY);
				console.log(yRange);
				
			} else if (isIntersect(yRange, otherRange[i]) === 1) {//情况1,处理方案-主动下移（变大）
				var moveDistY = otherRange[i][1] - yRange[0];
				//深度遍历下方的所有showing的节点，下移moveDistY（y增大）
				for (var theId = id; theId < 11; theId++) {
					var stack = [];  
					stack.push(nodeList[theId].id);  
					while (stack.length != 0) {  
						var item = stack.pop();
						nodeList[item].y += moveDistY;//visit
						console.log(item);
						nodeList[id].effect.push([item, moveDistY]);
						var children = nodeList[item].children; 
						if (typeof(children) === "undefined") continue;
						for (var ii = children.length - 1; ii >= 0; ii--)
							if (nodeList[children[ii].id].isShown)
								stack.push(children[ii].id);						  
					}  
				}
				for (var iii = 0; iii < otherRange.length; iii++) {
					var yRangeMid = (yRange[0] + yRange[1]) / 2;
					var otherRangeMid = (otherRange[iii][1] + otherRange[iii][0]) / 2;
					if (yRangeMid < otherRangeMid) {
						otherRange[iii][0] += moveDistY;
						otherRange[iii][1] += moveDistY;
					}
				}
				yRange[0] += moveDistY;
				yRange[1] += moveDistY;
				
				console.log("下移moveDistY  :  " + moveDistY);
				console.log(yRange);
			}		
		}
	} else {//收缩
		$("text").remove();
		$("line").remove();
		$("circle").remove();
		console.log(nodeList[id].effect);
		var effect = nodeList[id].effect;
		for (var i = 0; i < effect.length; i++) {
			var item = effect[i][0];
			var distY = effect[i][1];
			nodeList[item].y -= distY;
		}
		nodeList[id].effect = [];
	}
	
	//绘制
	for (var depth = 0; depth < 5; depth++) {
		for (var key in depthShownDict[depth].data) {
			if (depthShownDict[depth].data[key] !== null) {
				drawCircle(nodeList[key], nodeList[key].x, nodeList[key].y);//画本身
				drawLine(key);//画线
				drawText(key);//添加文本 
			}
		}
	}
}


function drawLine(key) {
	var node = nodeList[key];
	if (node.id === 0) return;
	var fatherNodeId = node.father.id;
	var fatherNode = nodeList[fatherNodeId];
	var line = document.createElementNS('http://www.w3.org/2000/svg','line');
	line.setAttribute("x1", node.x);
	line.setAttribute("y1", node.y);
	line.setAttribute("x2", fatherNode.x);
	line.setAttribute("y2", fatherNode.y);
	line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:2");
	var svg = document.getElementById("svg1");
	svg.appendChild(line);
}

function drawText(key) {
	var node = nodeList[key];
	var Text = document.createElementNS('http://www.w3.org/2000/svg','text');
	Text.setAttribute("x", node.x - 10);
	Text.setAttribute("y", node.y + 18);
	Text.setAttribute("fill", "black");
	Text.append(node.name);  
	var svg = document.getElementById("svg1");
	svg.appendChild(Text);
}



function Dictionary() {
	this.data = new Array();
	this.put = function(key, value) {
		this.data[key] = value;
	};
	this.get = function(key) {
		return this.data[key];
	};
	this.remove = function(key) {
		this.data[key] = null;
	};
	this.isEmpty = function() {
		return this.data.length == 0;
	};
	this.size = function() {
		var count = 0;
		for (var key in this.data) 
			if (this.data[key] !== null)
				count++;
		return count;
	};
}

function isIntersect(range1, range2) {//拿range2去检查range1
	var yMidLoc = (range1[1] + range1[0]) / 2;
	var otherMidLoc = (range2[1] + range2[0]) / 2;
	if (range1[0] < range2[0] && range2[0] < range1[1] && range1[1] < range2[1])
		return 0;//情况0
	else if (range2[0] <= range1[0] && range1[1] < range2[1] && yMidLoc < otherMidLoc)
		return 0;//情况1
	else if (range1[0] < range2[0] && range2[1] <= range1[1] && yMidLoc < otherMidLoc)
		return 0;//情况2
	else if (range2[0] < range1[0] && range1[1] <= range2[1] && yMidLoc > otherMidLoc)
		return 1;//情况3
	else if (range1[0] <= range2[0] && range2[1] < range1[1] && yMidLoc > otherMidLoc)
		return 1;//情况4
	else if (range2[0] < range1[0] && range1[0] < range2[1] && range2[1] < range1[1])
		return 1;//情况5
	else return -1;
}


var url = "http://www.w3.org/2000/svg";
drawCircle(0, 0, 200);



var nodeList = [];
var queueNodes = [];
var leafCount = 0;
var mat = [];
var relationName = [
	["女朋友", "红与黑"], 
	["女朋友", "美国电影"], 
	["女朋友", "音乐"], 
	["女朋友", "照片"], 
	["照片", "日本电影"], 
	["论文", "课件"], 
	["论文", "红与黑"]
];
var plate = ["blue", "red", "green", "yellow", "gray", "pink", "LawnGreen"];
var relationIndex = [];
queueNodes.unshift(root);
wideTraversal();
generateMat();
drawNode();
generateRelaIndex();
drawGraph();

function drawNode() {//仅用作测试
	var stepAngelLeaf = Math.PI * 2 / leafCount;
	var stepAngelNotLeaf = Math.PI * 2 / (nodeList.length - leafCount);
	var jL = 0, jNoL = 0;
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].isLeaf) {
			var x = 200 * Math.cos(jL * stepAngelLeaf);
			var y = 200 * Math.sin(jL * stepAngelLeaf);
			jL++;
		} else {
			var x = 125 * Math.cos(jNoL * stepAngelNotLeaf);
			var y = 125 * Math.sin(jNoL * stepAngelNotLeaf);
			jNoL++;
		}
		nodeList[i].x = x;
		nodeList[i].y = y;
		drawCircle(x, y, 15);
		//ctx.fillStyle = "black";
		//ctx.fillText(nodeList[i].name, x ,y);
	}
}

function drawGraph() {
	for (var i = 0; i < relationIndex.length; i++) {//有没有可能直接相邻？有别的方法省空间
		var node1 = relationIndex[i][0];
		var node2 = relationIndex[i][1];
		//获取node1到根节点的路径
		var node1Route = [];
		var node2Route = [];
		node1Route.push(node1);
		node2Route.push(node2);
		while (nodeList[node1].fatherIndex !== -1) {
			node1 = nodeList[node1].fatherIndex;
			node1Route.push(node1);
		}
		//至此 node1到根节点的路径已经找到。包括自己和根节点。根节点在后面
		while (nodeList[node2].fatherIndex !== -1) {
			node2 = nodeList[node2].fatherIndex;
			var ii = InList(node1Route, node2);
			//console.log(ii);
			if (ii < 0) {
				node2Route.push(node2);
			} else {
				//如果找到公共节点了，
				//此时节点2还没将公共节点放入数组；
				//则将节点1 i之前（包括i）的节点从后往前放入数组
				for (var j = ii; j >= 0; j--) {
					node2Route.push(node1Route[j]);
				}
				//至此得到了节点node1-->节点node2的路径  于node2Route中
				break;
			}
		}
		drawLink(node2Route, i);
	}
}

function InList(nodeRoute, index) {
	for (var i = 0; i < nodeRoute.length; i++) {
		if (index === nodeRoute[i]) {
			return i;
		}
	}
	return -1;
}

function generateRelaIndex() {
	for (var i = 0; i < relationName.length; i++) {
		var name1 = relationName[i][0];
		var name2 = relationName[i][1];
		relationIndex.push([indexFromName(name1), indexFromName(name2)]);	
	}
}

function indexFromName(name) {
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].name == name)
			return i;
	}
	return -1;
}

function generateMat() {
	for (var k = 0; k < nodeList.length; k++) {//临接矩阵
		mat[k] = new Array();    
		for (var j = 0; j < nodeList.length; j++){      
			mat[k][j] = 2000;//足够大的数       
		}
	} 
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].fatherIndex > -1) {
			mat[nodeList[i].index][nodeList[i].fatherIndex] = 1;
			mat[nodeList[i].fatherIndex][nodeList[i].index] = 1;
		}
	}
}

function wideTraversal() {
	var nodeIndex = 0;
	var nodeInTree;
	var node;
	while (queueNodes.length > 0) {//遍历完 得到 节点编号+节点name+是否为叶子+爸爸名字+爸爸节点的编号
		nodeInTree = queueNodes.pop();
		node = Node(nodeInTree.name, nodeIndex);
		if (nodeInTree.fatherIndex > -1) {	
			node.setFatherIndex(nodeInTree.fatherIndex);
			node.setFatherName(nodeInTree.fatherName);
		} else {
			node.setFatherIndex(-1);
			node.setFatherName("");
		}
		nodeList.push(node);
		nodeIndex++;
		if (nodeInTree.children && nodeInTree.children.length > 0) { //如果不是叶子,说明有儿子
			node.setIsLeafFalse();
			for (var i = 0; i < nodeInTree.children.length; i++) {
				nodeInTree.children[i].fatherName = node.name;
				nodeInTree.children[i].fatherIndex = node.index;
				queueNodes.unshift(nodeInTree.children[i]);
			}
		} else { //如果是叶子节点
			leafCount++;
		}
	}
}

function Node(name, index) {
	var node = new Object;
	node.name = name;
	node.index = index;
	node.isLeaf = true; //默认是叶子节点
	node.setIsLeafFalse = function() {
		node.isLeaf = false;
	}
	node.fatherName = "";
	node.setFatherName = function(name) {
		node.fatherName = name;
	}
	node.fatherIndex = -1;
	node.setFatherIndex = function(index) {
		node.fatherIndex = index;
	}
	return node;
}

function drawCircle(cx, cy, r) {
	var mysvg = document.getElementById("svg1");
	var cirObj = document.createElementNS(url,"circle");
	if(cirObj){
		cirObj.setAttribute("cx", cx);
		cirObj.setAttribute("cy", cy);
		cirObj.setAttribute("r", r);
		cirObj.setAttribute("style", "fill:rgb(255,255,255);stroke-width:2;stroke:black");
		cirObj.setAttribute("transform", "translate(300 ,300)");
		mysvg.appendChild(cirObj);
	}
}

function drawLink(r, i) {
	
	var mysvg = document.getElementById("svg1");
	var pathObj = document.createElementNS(url,"path");
	var str = "";
	pathObj.setAttribute("stroke", plate[i]);
	pathObj.setAttribute("fill", "none");
	pathObj.setAttribute("stroke-width", 5);
	pathObj.setAttribute("transform", "translate(300 ,300)");

	switch (r.length) {//test
		case 3:
			str = "M " + nodeList[r[0]].x + " " + nodeList[r[0]].y + " Q " 
			+ nodeList[r[1]].x + " " +　nodeList[r[1]].y　+ " " +　nodeList[r[2]].x　+ " " +　nodeList[r[2]].y;
			pathObj.setAttribute("d", str);
		break;
		case 4:
			/*str = "M " + nodeList[r[0]].x + " " + nodeList[r[0]].y + " Q " + nodeList[r[1]].x + " " + nodeList[r[1]].y
			+ " " + nodeList[r[2]].x + " " + nodeList[r[2]].y + " T " + nodeList[r[3]].x + " " + nodeList[r[3]].y;*/
			str = "M " + nodeList[r[0]].x + " " + nodeList[r[0]].y + " C " + nodeList[r[1]].x + " " + nodeList[r[1]].y
			+ " " + nodeList[r[2]].x + " " + nodeList[r[2]].y + " " + nodeList[r[3]].x + " " + nodeList[r[3]].y;
			pathObj.setAttribute("d", str);
		break;
		case 5:
			str = "M " + nodeList[r[0]].x + " " + nodeList[r[0]].y + " C " + nodeList[r[1]].x + " " + nodeList[r[1]].y
			+ " " + nodeList[r[2]].x + " " + nodeList[r[2]].y + " " + (nodeList[r[2]].x + nodeList[r[3]].x) / 2 + " " + (nodeList[r[2]].y + nodeList[r[3]].y) / 2
			+ " S " + nodeList[r[3]].x + " " + nodeList[r[3]].y
			+ " " + nodeList[r[4]].x + " " + nodeList[r[4]].y;
			pathObj.setAttribute("d", str);
		break;
		case 6:
			str = "M " + nodeList[r[0]].x + " " + nodeList[r[0]].y + " C " + nodeList[r[1]].x + " " + nodeList[r[1]].y
			+ " " + nodeList[r[2]].x + " " + nodeList[r[2]].y + " " + nodeList[r[3]].x + " " + nodeList[r[3]].y
			+ " S " + nodeList[r[4]].x + " " + nodeList[r[4]].y + " " + nodeList[r[5]].x + " " + nodeList[r[5]].y;
			pathObj.setAttribute("d", str);
		break;
	}
	mysvg.appendChild(pathObj);
}
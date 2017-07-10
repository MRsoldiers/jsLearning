var canvas = document.getElementById("canvas"); //画布
var ctx = canvas.getContext("2d"); //2d绘图环境
ctx.translate(300, 300);
ctx.beginPath();
ctx.arc(0, 0, 200, 0, 2 * Math.PI, false);
ctx.stroke();

var nodeList = [];
var queueNodes = [];
queueNodes.unshift(root);
wideTraversal();
var mat = [];
generateMat();

var relation = [
	["女朋友", "红与黑"], 
	["女朋友", "美国电影"], 
	["女朋友", "音乐"], 
	["女朋友", "照片"], 
	["照片", "日本电影"], 
	["论文", "课件"], 
	["论文", "红与黑"]
];

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
			;
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


/*

var stepAngel = Math.PI * 2 / leaf.length;
var nodeLeafList = [];
var nodeNoLeafList = [];
var relation = [[0, 0], [0 ,9]]

function Node(x, y, r, index) {
	var node = new Object;
	node.x = x;
	node.y = y;
	node.r = r;
	node.index = 
	node.setName = function(name) {
		node.name = name;
	}
	return node;
}

for (var i = 0; i < leaf.length; i++) {
	var x = 200 * Math.cos(i * stepAngel);
	var y = 200 * Math.sin(i * stepAngel);
	var node = Node(x, y, 10);
	node.setName(leaf[i]); 
	nodeLeafList.push(node);
	ctx.beginPath();
	ctx.arc(x, y, node.r, 0, 2 * Math.PI, false); 
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "black";
	ctx.fillText(node.name, x ,y);
}

for (var i = 0; i < noleaf.length; i++) {
	var x, y;
	var x = 100 * Math.cos(i * Math.PI / 2);
	var y = 100 * Math.sin(i * Math.PI / 2);
	var node = Node(x, y, 12);
	node.setName(noleaf[i]); 
	nodeNoLeafList.push(node);
	ctx.beginPath();
	ctx.arc(x, y, node.r, 0, 2 * Math.PI, false); 
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "black";
	ctx.fillText(node.name, x ,y);
}
*/

var N = 12, edgeList = [[0,3],[1,3],[2,3],[3,4],[4,5],[4,6],[4,7],[6,8],[7,9],[9,10],[7,10],[10,11],[9,11],[6,7]];
var nodeList = [];
var canvas = document.getElementById("canvas"); //画布
var ctx = canvas.getContext("2d"); //2d绘图环境
var mat = new Array(); //邻接表
var kk = 10000.0;
var ks = 0.1;
var springL = 20;
var step = 0.8;
for (var k = 0; k < N; k++){//临接矩阵
	mat[k] = new Array();    
	for (var j = 0; j < N; j++){      
		mat[k][j] = 0;       
	}
}
	
	
function Node(x, y) {
	var node = new Object;
	node.x = x;
	node.y = y;
	node.r = 15;
	node.add = function(dx, dy) {
		node.x = node.x + dx;
		node.y = node.y + dy;
	}
	return node;
}

function Edge(x1, y1, x2, y2) {
	var edge = new Object;
	edge.x1 = x1;
	edge.y1 = y1;
	edge.x2 = x2;
	edge.y2 = y2;
	edge.color = 'blue';
	edge.oriLength = 20;
	edge.nowLength = 0;
	return edge;
}


function generateGraph() {//生成图
	//生成点
	for(var i = 0; i < N; i++){
		var x, y;
		x = Math.round(Math.random() * (canvas.width - 200) + 100);
		y = Math.round(Math.random() * (canvas.height - 600) + 100);
		var node = Node(x, y);
		nodeList.push(node);
	}
	//生成边
	for(var i = 0; i < edgeList.length; i++){
        mat[edgeList[i][0]][edgeList[i][1]] = 1;
        mat[edgeList[i][1]][edgeList[i][0]] = 1;
	}
}

function drawGraph() {
	for(var i = 0; i < edgeList.length; i++){
		ctx.beginPath();
		ctx.moveTo(nodeList[edgeList[i][0]].x, nodeList[edgeList[i][0]].y);
		ctx.lineTo(nodeList[edgeList[i][1]].x, nodeList[edgeList[i][1]].y);
		ctx.stroke();
	}
	for(var i = 0; i < N; i++){
		ctx.beginPath();
		ctx.arc(nodeList[i].x, nodeList[i].y, nodeList[i].r, 0, 2 * Math.PI, false);
		ctx.fillStyle = "gray";
		ctx.fill();
		ctx.stroke();
	}
}

generateGraph();
drawGraph();
console.log(nodeList);
//function refresh() {
while (1) {
 	ctx.clearRect(0, 0, 1000, 1000);
	//记录此时的各个点的坐标
	var flag = 1;
	
	//弹簧力是吸引力
	//遍历每一条edge，给edge的两端的点都添加吸引力
	for(var i = 0; i < edgeList.length; i++){//更新点的x y坐标
		var xyAtt = calAttraction(edgeList[i][0], edgeList[i][1]);
		nodeList[edgeList[i][0]].add(xyAtt[0], xyAtt[1]);
		nodeList[edgeList[i][1]].add(-xyAtt[0], -xyAtt[1]);		
		console.log(Math.sqrt(xyAtt[0] * xyAtt[0] + xyAtt[1] * xyAtt[1]));
		if (Math.sqrt(xyAtt[0] * xyAtt[0] + xyAtt[1] * xyAtt[1]) > 8) flag = 0;
	}
	//库仑力是排斥力
	//遍历除了自己以外的所有点
	for(var i = 0;i < N; i++){//更新点的x y坐标
		for(var j = i + 1; j < N; j++){
			var xyRep = calRepulsion(i, j);
			nodeList[i].add(xyRep[0], xyRep[1]);
			nodeList[j].add(-xyRep[0], -xyRep[1]);			
		}
	}
	drawGraph();
	
	if (flag) break;
}
//}

function calRepulsion(i, j) {//计算出来的是i的
	var dis2, xDis, yDis, fRep, dx, dy;
	xDis = nodeList[i].x - nodeList[j].x;
	yDis = nodeList[i].y - nodeList[j].y;
	dis2 = xDis * xDis + yDis * yDis;
	fRep = kk / dis2;
	dx = fRep * xDis / Math.sqrt(dis2) * step;
	dy = fRep * yDis / Math.sqrt(dis2) * step;
	return [dx, dy];//返回给i点的 带符号的 分别两个方向上的位移。//这一步语法可能有问题
}
function calAttraction(i, j) {//计算出来的是i的
	var dis2, xDis, yDis, fAtt;
	xDis = nodeList[i].x - nodeList[j].x;
	yDis = nodeList[i].y - nodeList[j].y;
	dis2 = xDis * xDis + yDis * yDis;
	fAtt = ks * (Math.sqrt(dis2) - springL);
	dx = -fAtt * xDis / Math.sqrt(dis2) * step;
	dy = -fAtt * yDis / Math.sqrt(dis2) * step;
	return [dx, dy];//返回给i点的 带符号的 分别两个方向上的位移。//这一步语法可能有问题
}


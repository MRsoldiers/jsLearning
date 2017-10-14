var canvas = document.getElementById("canvas"); //画布
var ctx = canvas.getContext("2d"); //2d绘图环境
var kk = 10000.0;
var ks = 0.1;
var springL = 20;
var step = 0.2;

//已经知道0 1 2 3 确定4的位置
//4 和 1 2 3 均相连
var N = 5, edgeList = [[0, 4],[1, 4],[2, 4],[3, 4]];
var data = [[50, 100], [1250, 100], [1200, 50], [1200, 150]];
var nodeList = [];

function generateGraph() {
	var x, y;
	for (var i = 0; i < data.length; i++) {
		var node = Node(data[i][0], data[i][1]);
		nodeList.push(node);
	}
	x = Math.round(Math.random() * 200 + 50);
	y = Math.round(Math.random() * 100 + 50);
	var node = Node(x, y);
	nodeList.push(node);//加入点4  即待定的点 给一个随机的坐标
	console.log(nodeList);
}
generateGraph();


var flag = 0;
while (1) {
	flag++;
	//弹簧力是吸引力
	//遍历每一条edge，给edge的末端点（即4）都添加吸引力
	for(var i = 0; i < edgeList.length; i++){//更新点的x y坐标
		var xyAtt = calAttraction(edgeList[i][1], edgeList[i][0]);
		nodeList[edgeList[i][1]].add(xyAtt[0], xyAtt[1]);		
	}
	
	//库仑力是排斥力
	//遍历除了点4以外的所有点 在nodeList里面是第3
	for(var i = 0; i < N - 1; i++){//更新点的x y坐标
		var xyRep = calRepulsion(4, i);
		nodeList[4].add(xyRep[0], xyRep[1]);
	}
	
	if (flag>100) break;
}
drawGraph();
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
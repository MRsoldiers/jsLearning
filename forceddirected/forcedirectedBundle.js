var canvas = document.getElementById("canvas"); //����
var ctx = canvas.getContext("2d"); //2d��ͼ����
var kk = 10000.0;
var ks = 0.1;
var springL = 20;
var step = 0.2;

//�Ѿ�֪��0 1 2 3 ȷ��4��λ��
//4 �� 1 2 3 ������
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
	nodeList.push(node);//�����4  �������ĵ� ��һ�����������
	console.log(nodeList);
}
generateGraph();


var flag = 0;
while (1) {
	flag++;
	//��������������
	//����ÿһ��edge����edge��ĩ�˵㣨��4�������������
	for(var i = 0; i < edgeList.length; i++){//���µ��x y����
		var xyAtt = calAttraction(edgeList[i][1], edgeList[i][0]);
		nodeList[edgeList[i][1]].add(xyAtt[0], xyAtt[1]);		
	}
	
	//���������ų���
	//�������˵�4��������е� ��nodeList�����ǵ�3
	for(var i = 0; i < N - 1; i++){//���µ��x y����
		var xyRep = calRepulsion(4, i);
		nodeList[4].add(xyRep[0], xyRep[1]);
	}
	
	if (flag>100) break;
}
drawGraph();
//}

function calRepulsion(i, j) {//�����������i��
	var dis2, xDis, yDis, fRep, dx, dy;
	xDis = nodeList[i].x - nodeList[j].x;
	yDis = nodeList[i].y - nodeList[j].y;
	dis2 = xDis * xDis + yDis * yDis;
	fRep = kk / dis2;
	dx = fRep * xDis / Math.sqrt(dis2) * step;
	dy = fRep * yDis / Math.sqrt(dis2) * step;
	return [dx, dy];//���ظ�i��� �����ŵ� �ֱ����������ϵ�λ�ơ�//��һ���﷨����������
}

function calAttraction(i, j) {//�����������i��
	var dis2, xDis, yDis, fAtt;
	xDis = nodeList[i].x - nodeList[j].x;
	yDis = nodeList[i].y - nodeList[j].y;
	dis2 = xDis * xDis + yDis * yDis;
	fAtt = ks * (Math.sqrt(dis2) - springL);
	dx = -fAtt * xDis / Math.sqrt(dis2) * step;
	dy = -fAtt * yDis / Math.sqrt(dis2) * step;
	return [dx, dy];//���ظ�i��� �����ŵ� �ֱ����������ϵ�λ�ơ�//��һ���﷨����������
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
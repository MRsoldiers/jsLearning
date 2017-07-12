var url = "http://www.w3.org/2000/svg";
drawCircle(0, 0, 200);



var nodeList = [];
var queueNodes = [];
var leafCount = 0;
var mat = [];
var relationName = [
	["Ů����", "�����"], 
	["Ů����", "������Ӱ"], 
	["Ů����", "����"], 
	["Ů����", "��Ƭ"], 
	["��Ƭ", "�ձ���Ӱ"], 
	["����", "�μ�"], 
	["����", "�����"]
];
var plate = ["blue", "red", "green", "yellow", "gray", "pink", "LawnGreen"];
var relationIndex = [];
queueNodes.unshift(root);
wideTraversal();
generateMat();
drawNode();
generateRelaIndex();
drawGraph();

function drawNode() {//����������
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
	for (var i = 0; i < relationIndex.length; i++) {//��û�п���ֱ�����ڣ��б�ķ���ʡ�ռ�
		var node1 = relationIndex[i][0];
		var node2 = relationIndex[i][1];
		//��ȡnode1�����ڵ��·��
		var node1Route = [];
		var node2Route = [];
		node1Route.push(node1);
		node2Route.push(node2);
		while (nodeList[node1].fatherIndex !== -1) {
			node1 = nodeList[node1].fatherIndex;
			node1Route.push(node1);
		}
		//���� node1�����ڵ��·���Ѿ��ҵ��������Լ��͸��ڵ㡣���ڵ��ں���
		while (nodeList[node2].fatherIndex !== -1) {
			node2 = nodeList[node2].fatherIndex;
			var ii = InList(node1Route, node2);
			//console.log(ii);
			if (ii < 0) {
				node2Route.push(node2);
			} else {
				//����ҵ������ڵ��ˣ�
				//��ʱ�ڵ�2��û�������ڵ�������飻
				//�򽫽ڵ�1 i֮ǰ������i���Ľڵ�Ӻ���ǰ��������
				for (var j = ii; j >= 0; j--) {
					node2Route.push(node1Route[j]);
				}
				//���˵õ��˽ڵ�node1-->�ڵ�node2��·��  ��node2Route��
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
	for (var k = 0; k < nodeList.length; k++) {//�ٽӾ���
		mat[k] = new Array();    
		for (var j = 0; j < nodeList.length; j++){      
			mat[k][j] = 2000;//�㹻�����       
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
	while (queueNodes.length > 0) {//������ �õ� �ڵ���+�ڵ�name+�Ƿ�ΪҶ��+�ְ�����+�ְֽڵ�ı��
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
		if (nodeInTree.children && nodeInTree.children.length > 0) { //�������Ҷ��,˵���ж���
			node.setIsLeafFalse();
			for (var i = 0; i < nodeInTree.children.length; i++) {
				nodeInTree.children[i].fatherName = node.name;
				nodeInTree.children[i].fatherIndex = node.index;
				queueNodes.unshift(nodeInTree.children[i]);
			}
		} else { //�����Ҷ�ӽڵ�
			leafCount++;
		}
	}
}

function Node(name, index) {
	var node = new Object;
	node.name = name;
	node.index = index;
	node.isLeaf = true; //Ĭ����Ҷ�ӽڵ�
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
			+ nodeList[r[1]].x + " " +��nodeList[r[1]].y��+ " " +��nodeList[r[2]].x��+ " " +��nodeList[r[2]].y;
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
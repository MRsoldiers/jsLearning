var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.rect(0, 0, 600, 400);
ctx.stroke();

var queueNodes = [];
var w = 600, h = 400, x = 0, y = 0;
root.w = w;
root.h = h;
root.x = x;
root.y = y;

queueNodes.unshift(root);
wideTraversal();


function wideTraversal() {
	var node;
	while (queueNodes.length > 0) {
		node = queueNodes.pop();
		if (node.children && node.children.length > 0) { //如果有子节点
			var areas = [];
			for (i = 0; i < node.children.length; i++) {
				areas.push(node.children[i].size);
			}
			pos = generateGraph(node.w, node.h, areas);
			
			drawGraph(node.x, node.y, areas.length, pos);
			for (var i = 0; i < node.children.length; i++) {
				node.children[i].w = pos[i][2];//[x,y,width,height]相对于其父节点的位置
				node.children[i].h = pos[i][3];
				node.children[i].x = pos[i][0] + node.x;
				node.children[i].y = pos[i][1] + node.y;
			}
			for (i = 0; i < node.children.length; i++) {//更新完位置数据后入队
				queueNodes.unshift(node.children[i]);
			}	
		} else { //如果没有子节点
			ctx.fillText(node.name, node.x + node.w / 2, node.y + node.h / 2);
		}
	}
}

function generateGraph(width, height, areas) {
	//width, height为当前框框的宽和高
	//areas为当前要被分配的面积序列
	//pos为最终分配给各个面积单元的位置信息
	var pos = new Array(areas.length);
	for (var i = 0; i < areas.length; i++) {
		pos[i] = [0, 0, 0, 0];//[x,y,width,height]	
	}
	var preI = 0, theI = 0;
	var w = width, h = height;
	do {
		if (w > h) {
			while (true) {
				if (judgeL(preI, theI, h, areas)) {
					theI++;						
				}else {
					var y = height - h;
					var wi = totalArea(preI, theI - 1, areas) / h;
					for (var i = preI; i < theI; i++) {
						var hi = areas[i] / wi; 
						pos[i] = [width - w, y, wi, hi];
						y = y + hi;
					}
					w = w - totalArea(preI, theI - 1, areas) / h;
					preI = theI;
					break;
				}
			}
		} else {
			while (true) {
				if (judgeU(preI, theI, w, areas)) {
					theI++;	
				}else {
					var x = width - w;
					var hi = totalArea(preI, theI - 1, areas) / w;
					for (var i = preI; i < theI; i++) {
						var wi = areas[i] / hi; 
						pos[i] = [x, height - h, wi, hi];
						x = x + wi;
					}
					h = h - totalArea(preI, theI - 1, areas) / w;
					preI = theI;
					break;
				}
			}
		}
	} while(theI < areas.length - 1)
	if (theI < areas.length) {
		pos[theI] = [width - w, height - h, w, h];
	}
	return pos;
}
	
function drawGraph(x, y, count, pos) {
	for (var i = 0; i < count; i++) {
		ctx.rect(x + pos[i][0] + 2, y + pos[i][1] + 2, pos[i][2] - 5, pos[i][3] - 5);
		ctx.stroke();
	}
}
	
function totalArea(preI, theI, areas) {
	var totalArea = 0;
	for (var j = preI; j <= theI; j++) {
		totalArea += areas[j];
	}
	return totalArea;
}
	
function judgeL(preI, theI, h, areas) {
	noww = totalArea(preI, theI, areas) / h;
	for (var j = preI; j <= theI; j++) {
		if ((noww * noww / areas[j]) > 2)
			return false;
	}
	return true;
}	

function judgeU(preI, theI, w, areas) {
	nowh = totalArea(preI, theI, areas) / w;
	for (var j = preI; j <= theI; j++) {
		if ((nowh * nowh / areas[j]) > 2)
			return false;
	}
	return true;
}
ctx.fillText('here is 00', 5, 5);


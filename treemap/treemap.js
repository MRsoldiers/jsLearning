var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

ctx.rect(100, 80, 600, 400);
ctx.stroke();

//var w = 600, h = 400;
var w = 1200.0/7, h = 700.0/3;
var preI = 0, theI = 0;
//var Areas = [60000, 60000, 40000, 30000, 20000, 20000, 10000];
var Areas = [30000, 10000];
var pos = new Array(Areas.length);
for (var i = 0; i < Areas.length; i++) {
	pos[i] = [0, 0, 0, 0, 0, 0];//[w,h,x,y,width,height]
}


function generateGraph(width, height, areas) {
	//width, height为当前框框的宽和高
	//areas为当前要被分配的面积序列
	do {
		
		if (w > h) {//should place in left
			while (true) { //now,placing 
				if (judgeL(preI, theI, h, areas)) {//判断在当前情况下 放了第preI到theI个(包括)area能否满足
					theI++;						
				}else { //bad
					var y = height - h;
					var wi = totalArea(preI, theI - 1, areas) / h;
					for (var i = preI; i < theI; i++) {
						var hi = areas[i] / wi; 
						pos[i] = [w, h, width - w, y, wi, hi];
						y = y + hi;
					}
					w = w - totalArea(preI, theI - 1, areas) / h;
					preI = theI;
					break;//跳出循环
					
				}
			}
		} else {//should place in up//有没有可能一开始就放不进？
			while (true) { //now,placing 
				
				if (judgeU(preI, theI, w, areas)) {//判断在当前情况下 放了第preI到theI个(包括)area能否满足
					theI++;	
				}else { //bad
					var x = width - w;
					var hi = totalArea(preI, theI - 1, areas) / w;
					for (var i = preI; i < theI; i++) {
						var wi = areas[i] / hi; 
						pos[i] = [w, h, x, height - h, wi, hi];
						x = x + wi;
					}
					h = h - totalArea(preI, theI - 1, areas) / w;
					preI = theI;
					break;//跳出循环
					
				}
			}
		}
	} while(theI < areas.length - 1)
	if (theI < areas.length) {
		pos[theI] = [w, h, width - w, height - h, w, h];
	}	
}
	
function drawGraph(x, y) {
	ctx.translate(x, y);
	for (var i = 0; i < Areas.length; i++) {
		ctx.rect(pos[i][2] + 2, pos[i][3] + 2, pos[i][4] - 5, pos[i][5] - 5);
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

generateGraph(1200.0/7, 700.0/3, Areas);
console.log(pos);
drawGraph(100, 80);
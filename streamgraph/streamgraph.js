var ctx;
var mat = new Array(); 
var L, W;
var h; //step
var color = ["#6495ED", "#87CEEB", "#4169E1", "#0000FF", "#AFEEEE"];

$.getJSON("kdd_rta2.json", function(data) { 
	W = Object.keys(data.kdd[0]).length;
	L = data.kdd.length;
	h = L / 15;
	
	for (var k = 0; k < L; k++)  {
		mat[k] = new Array(W); 
		var objKeys = Object.keys(data.kdd[k]);
		mat[k][0] = parseFloat(data.kdd[k][objKeys[0]]); 
		for (var m = 1; m < W; m++)
			mat[k][m] = parseFloat(data.kdd[k][objKeys[m]]) + mat[k][m-1];
	}
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.translate(80, 240);
	ctx.rotate(Math.PI);
	ctx.scale(-1, 1);
	
	drawGraph(2);
});

function drawGraph(options) {
	switch (options) {
		case 1:
		for (var i = W - 1; i >= 0; i--)
			draw(i, color[i]);
		break;
		
		case 2:
		for (var i = W - 1; i >= 0; i--)
			draw2(i, color[i]);
		break;
	}
}

function draw(i, color) {
	ctx.beginPath();
	ctx.moveTo(0, mat[0][i]);
	for (var j = 1; j < L; j++)
	ctx.lineTo(j * h, mat[j][i]);	
	ctx.lineTo((L - 1) * h, 0);
	ctx.lineTo(0, 0);
	ctx.fillStyle = color;
	ctx.fill();
}

function draw2(i, color) {
	ctx.beginPath();
	ctx.moveTo(0, mat[0][i] - mat[0][4] / 2);
	for (var j = 1; j < L; j++)
		ctx.lineTo(j * h, mat[j][i] - mat[j][4] / 2);
	for (var j = L - 1; j >= 0; j--)
		ctx.lineTo(j * h, -mat[j][4] / 2);
	ctx.fillStyle = color;
	ctx.fill();
}



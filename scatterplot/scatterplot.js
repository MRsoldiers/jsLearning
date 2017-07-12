var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.translate(50, 50);

var L = iris.length;
var colorPlate = [];
generateColor(3);

var Range = [[iris[0][0], 0], [iris[0][1], 0], [iris[0][2], 0], [iris[0][3], 0]];
getRange();
generateAxes();
generateGraph();

function getRange() {
	for (var k = 0; k < L; k++){
		for (var m = 0; m < 4; m++) {
			if (iris[k][m] < Range[m][0]) {
				Range[m][0] = iris[k][m];
			}
			if (iris[k][m] > Range[m][1]) {
				Range[m][1] = iris[k][m];
			}
		}
	}
}

function generateAxes() {
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			ctx.translate(i * 130, j * 130);
			ctx.rect(0, 0, 120, 120);
			ctx.translate(-i * 130, -j * 130);
		}
	}
	ctx.stroke();	
}

function generateGraph() {
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			ctx.translate(i * 130, j * 130);		
			ctx.translate(0, 120);
			ctx.rotate(Math.PI);
			ctx.scale(-1, 1);
			for (var k = 0; k < L; k++){
				var x = (iris[k][i] - Range[i][0]) * 120 / (Range[i][1] - Range[i][0]);
				var y = (iris[k][j] - Range[j][0]) * 120 / (Range[j][1] - Range[j][0]);
				drawPoint(x, y, iris[k][4]);
			}
			ctx.scale(-1, 1);
			ctx.rotate(-Math.PI);
			ctx.translate(0, -120);
			ctx.translate(-i * 130, -j * 130);			
		}
	}
}

function drawPoint(x, y, i) {
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
	ctx.fillStyle = colorPlate[i];
	ctx.fill();
}

function generateColor(n) {
	var step = 255 / n;
	var color;
	for (var i = 0; i < n; i++) {
		color = "rgb(0," + (i * step) + "," + (255 - i * step);
		colorPlate.push(color);
	}
}
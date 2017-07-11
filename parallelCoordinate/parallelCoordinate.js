var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.translate(100, 100);

var colorPlate = [];
generateColor(cars.length);

var iOrder = [2, 4, 5, 4, 6, 1, 7];

var carsKey = Object.keys(cars[0]);
var Range = [
	[0, 0],
	[cars[0].mpg, 0],
	[cars[0].cylinders, 0], 
	[cars[0].displacement, 0],
	[cars[0].horsepower, 0], 
	[cars[0].weight, 0],
	[cars[0].acceleration, 0],
	[cars[0].year, 0]
];
getRange();

var cars2 = cars.sort(compare('cylinders'));
drawCoordinate();
drawGraph();

function drawGraph() {
	for (var i = 0; i < cars2.length; i++) {
		ctx.beginPath();
		ctx.moveTo(0, - (cars2[i][carsKey[iOrder[0]]]
		- Range[iOrder[0]][1]) * 300 / (Range[iOrder[0]][1] - Range[iOrder[0]][0]));
		for (var j = 1; j < iOrder.length; j++) {
			ctx.lineTo(j * 100, -(cars2[i][carsKey[iOrder[j]]]
			- Range[iOrder[j]][1]) * 300 / (Range[iOrder[j]][1] - Range[iOrder[j]][0]));
		}
		ctx.strokeStyle = colorPlate[i];
		ctx.stroke();
	}
}

function drawCoordinate() {
	for (var i = 0; i < 7; i++) {
		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.moveTo(100 * i, 0);
		ctx.lineTo(100 * i, 300);
		ctx.stroke();
		ctx.beginPath();
		ctx.rect(100 * i - 5, 0, 10, 300);
		ctx.globalAlpha = 0.2;
		ctx.fill();
	}
}

function generateColor(n) {
	var step = 255 / n;
	var color;
	for (var i = 0; i < n; i++) {
		color = "rgb(0," + (i * step) + "," + (255 - i * step);
		colorPlate.push(color);
	}
}

function compare(property){
    return function(a, b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

function getRange() {
	var carsKey = Object.keys(cars[0]);
	for (var i = 0; i < cars.length; i++) {
		for (var j = 1; j < carsKey.length - 1; j++) {
			//console.log(j);
			if (cars[i][carsKey[j]] < Range[j][0]) {
				Range[j][0] = cars[i][carsKey[j]];
			}
			if (cars[i][carsKey[j]] > Range[j][1]) {
				Range[j][1] = cars[i][carsKey[j]];
			}
		}
	}
}

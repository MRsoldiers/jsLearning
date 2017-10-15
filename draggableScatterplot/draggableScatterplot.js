var offset = 100;
var color = d3.scaleLinear()
    .domain([0, 22])
    .range(["red", "blue"]);
var nationList = [];
for (var ni = 0; ni < nations.length; ni++) {
	var nationName = nations[ni].name;
	var income = nations[ni].income;
	var population = nations[ni].population;
	var lifeExpectancy = nations[ni].lifeExpectancy;
	var flagIncome = 0;
	var flagPopulation = 0;
	var flagLife = 0;
	var nation = Nation(nationName);
	for (var yi = 1800; yi < 2009; yi++) {//假定2008年都有数据，不然会有bug
		var incomeI = income[flagIncome][1];
		var populationI = population[flagPopulation][1];
		var lifeI = lifeExpectancy[flagLife][1];
		if (yi == income[flagIncome + 1][0]) flagIncome++;
		if (yi == population[flagPopulation + 1][0]) flagPopulation++;
		if (yi == lifeExpectancy[flagLife + 1][0]) flagLife++;
		nation.addData([yi, populationI, incomeI, lifeI]);
	}
	nationList.push(nation);
}
console.log(nationList);
var yearList = [];
for (var yi = 1800; yi < 2009; yi++) {
	var year = Year(yi);
	var data = [];
	for (var ni = 0; ni < nationList.length; ni++) {
		var dataNiyi = nationList[ni].data[yi - 1800];
		var name = nationList[ni].name;
		data.push([name, dataNiyi[1], dataNiyi[2], dataNiyi[3]]);
		//console.log(dataNiyi[3])
	}
	yearList.push(data);
}
/*
for (var i = 0; i < yearList[208].length; i++) {
	drawNation(yearList[208][i].slice(1))
}
*/
for (var i = 0; i < yearList[0].length; i++) {
	drawNation(yearList[0][i].slice(1), i)
}






//数据处理
function Nation(name) {
	var nation = new Object;
	nation.name = name;
	nation.data = [];
	nation.addData = function(data) {//data:[year, population, income,lifeExpectancy]
		this.data.push(data);
	};
	return nation;
}
function Year(year) {
	var Year = new Object;
	Year.year = year;
	Year.data = [];
	Year.addData = function(data) {//data:[name, population, income,lifeExpectancy]
		this.data.push(data);
	}
	return year;
}


//滑块拖动
var moveRectBool = false;
var moveCircleBool = false;
var hoverableBool = true;
var rect = document.getElementById("rect1");
rect.addEventListener("mousedown", function() {
	moveRectBool = true;
	document.addEventListener("mousemove", function(e) {
		if (moveRectBool) {
			var mousePos = getMousePos(e);
			var rectMove = document.getElementById("rect1");
			if (mousePos.x < 1100 && mousePos.x > 100)
				rectMove.setAttribute("x", mousePos.x - 12);
			var currentYear = Math.round(0.209 * (mousePos.x - 100)) + 1800;
			
			if (currentYear < 2009 && currentYear > 1799) {	
				$("circle").remove();
				var thisYear = yearList[currentYear - 1800];
				for (var i = 0; i < thisYear.length; i++) {
					drawNation(thisYear[i].slice(1), i);
				}
				
				$("#year").remove();
				var Text = document.createElementNS('http://www.w3.org/2000/svg','text');
				Text.setAttribute("y", 550);
				Text.setAttribute("x", 1000);
				Text.setAttribute("fill", "black");
				Text.setAttribute("id", "year");
				Text.append(currentYear);  
				var svg = document.getElementById("svg1");
				svg.appendChild(Text);
			}
		}
	});
});
document.addEventListener("mouseup", function() {
	moveRectBool = false;
	moveCircleBool = false;
	hoverableBool = true;
	$(".traj").remove();
});
function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { 'x': x, 'y': y };
}



	
function drawNation(data, i) {//data = population, income,lifeExpectancy
	var population = data[0];
	var income = data[1];
	var life = data[2];
	var r = Math.log(population / 100 + 1);
	var x = Math.sqrt(upToZero(income - 300)) * 8 + offset;
	//console.log(upToZero(income - 300));
	var y = 600 - life * 6;
	var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("r", r);
	circle.setAttribute("fill", color(i));
	circle.setAttribute("id", "circle" + i);
	
	circle.addEventListener("mouseover", function() {
		if (hoverableBool) {
			var nationId = this.id.slice(6);
			var nationData = nationList[nationId].data;
			drawTraj(nationData);
		}
	});
	circle.addEventListener("mouseout", function() {
		if (hoverableBool) $(".traj").remove();
	});
	
	
	circle.addEventListener("mousedown", function() {
		hoverableBool = false;
		moveCircleBool = true;
		var nationId = this.id.slice(6);
		var nationData = nationList[nationId].data;
		drawTraj(nationData);
		document.addEventListener("mousemove", function(e) {
			if (moveCircleBool) {
				var mousePos = getMousePos(e);//鼠标位置 
				var minDist = 1000000;
				var minYear = 30000;
				for (var i = 0; i < nationData.length; i++) {
					var income = nationData[i][2];
					var life = nationData[i][3];
					var year = nationData[i][0]
					var x1 =  Math.sqrt(upToZero(income - 300)) * 8 + offset;
					var y1 = 600 - life * 6;
					var dist = (x1 - mousePos.x) * (x1 - mousePos.x) + (y1 - mousePos.y) * (y1 - mousePos.y);
					if (dist < minDist) {
						minYear = i + 1800;
						minDist = dist;
					}
				}
				$("circle").remove();
				var thisYear = yearList[minYear - 1800];
				for (var i = 0; i < thisYear.length; i++) {
					drawNation(thisYear[i].slice(1), i)
				}
				$("#year").remove();
				var Text = document.createElementNS('http://www.w3.org/2000/svg','text');
				Text.setAttribute("y", 550);
				Text.setAttribute("x", 1000);
				Text.setAttribute("fill", "black");
				Text.setAttribute("id", "year");
				Text.append(minYear);  
				var svg = document.getElementById("svg1");
				svg.appendChild(Text);
				var rectMove = document.getElementById("rect1");
				rectMove.setAttribute("x", 1000 * (minYear - 1800) / 209 + offset);
			}
		});
			
	});
	
	var svg = document.getElementById("svg1");
	svg.appendChild(circle);
}

//画刻度
darwRuler();
function darwRuler() {
	var rulerX = [300, 500, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];
	var rulerY = [10, 20, 30, 40, 50, 60, 70];
	for (var i = 0; i < rulerX.length; i++) {
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute("x2", Math.sqrt(rulerX[i] - 300) * 8 + offset);
		line.setAttribute("x1", Math.sqrt(rulerX[i] - 300) * 8 + offset);
		line.setAttribute("y2", 590);
		line.setAttribute("y1", 610);
		line.setAttribute("style", "stroke:black;stroke-width:2");
		var Text = document.createElementNS('http://www.w3.org/2000/svg','text');
		Text.setAttribute("x", Math.sqrt(rulerX[i] - 300) * 8 - 17 + offset);
		Text.setAttribute("y", 625);
		Text.setAttribute("fill", "black");
		Text.append(rulerX[i]);  
		var svg = document.getElementById("svg1");
		svg.appendChild(line);
		svg.appendChild(Text);
	}
	for (var i = 0; i < rulerY.length; i++) {
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute("x2", 0 + offset);
		line.setAttribute("x1", -10 + offset);
		line.setAttribute("y2", 600 - rulerY[i] * 6);
		line.setAttribute("y1", 600 - rulerY[i] * 6);
		line.setAttribute("style", "stroke:black;stroke-width:2");
		var Text = document.createElementNS('http://www.w3.org/2000/svg','text');
		Text.setAttribute("y", 600 - rulerY[i] * 6 + 5);
		Text.setAttribute("x", -30 + offset);
		Text.setAttribute("fill", "black");
		Text.append(rulerY[i]);  
		var svg = document.getElementById("svg1");
		svg.appendChild(line);
		svg.appendChild(Text);
	}
}

function upToZero(a) {
	if (a < 0) return 0;
	else return a;
}

function drawTraj(data) {
	for (var i = 0; i < data.length - 1 ; i++) {
		var income1 = data[i][2];
		var life1 = data[i][3];
		var x1 =  Math.sqrt(upToZero(income1 - 300)) * 8 + offset;
		var y1 = 600 - life1 * 6;
		var income2 = data[i + 1][2];
		var life2 = data[i + 1][3];
		var x2 =  Math.sqrt(upToZero(income2 - 300)) * 8 + offset;
		var y2 = 600 - life2 * 6;
		
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute("x2", x2);
		line.setAttribute("x1", x1);
		line.setAttribute("y2", y2);
		line.setAttribute("y1", y1);
		line.setAttribute("class", "traj");
		line.setAttribute("style", "stroke:black;stroke-width:2");
		var svg = document.getElementById("svg1");
		svg.appendChild(line);
	}
}




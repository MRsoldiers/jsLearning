var changeScaleBool = false;
var moveBool = false;
var svg = document.getElementById("svg1");
var g = document.getElementById("g1");
var t1 = document.getElementById("wheelDelta");
t1.value = 1;
var globleScale = 1;
var mouseDownX;
var mouseDownY;
var moveX;
var curTransX;
var color = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'];
var commitList = [];
for (var i = -5; i < 5; i++) {//画原始刻度线
	var line = generateLine(i * 240, 200, i * 240, 208);
	line.setAttribute("id", "line" + i);
	line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:2");
	g.appendChild(line)
	for (var m = 1; m < 13; m++) {
		var line = generateLine(i * 240 + m * 20, 200, i * 240 + m * 20, 205)
		line.setAttribute("id", "line" + i + "m"+ m);
		line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:2");
		g.appendChild(line)
	}
	var Text = document.createElementNS('http://www.w3.org/2000/svg','text');
	Text.setAttribute("x", i * 240);
	Text.setAttribute("y", 190);
	Text.setAttribute("fill", "black");
	Text.setAttribute("id", "text" + i)
	Text.append(2015 + i);
	g.appendChild(Text);
}
//画分界线 + 画数据点
for (var i = 0; i < 5; i++) {
	var line = generateLine(-10000, 200 + i * 40, 10000, 200 + i * 40);
	var y = 220 + i * 40;
	line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:2");
	g.appendChild(line);
	var dataSeries = data[i];
	var commits = dataSeries.commits;
	for (var countC = 0; countC < commits.length; countC++) {
		var commit = commits[countC];
		var commitObj = Commit(commit);
		var commitDate = new Date(commit.date);
		var commitYear = commitDate.getFullYear();
		var commitMon = commitDate.getMonth();
		var commitDay = commitDate.getDate();
		var dayPassInYear = commitMon * 30 + commitDay;
		//2014年是line0，根据年份求出位置的上下限【posLow， posHigh】
		var posLow = parseFloat(document.getElementById("line" + (commitYear - 2015)).getAttribute("x1"));
		var posHigh = parseFloat(document.getElementById("line" + (commitYear - 2014)).getAttribute("x1"));
		var posX = posLow + (posHigh - posLow) * dayPassInYear / 365;
		var id = i + "c" + countC;
		commitObj.initialPos(posX, y);
		commitObj.initialId(id);
		commitObj.setColor(color[i]);
		commitObj.draw();
		commitList.push(commitObj);
	}
}

svg.addEventListener("mouseover", function() {
	changeScaleBool = true;
	$(document.body).css({
	    "overflow-x":"hidden",
		"overflow-y":"hidden"
	});
});
svg.addEventListener("mouseout", function() {
	changeScaleBool = false;
	$(document.body).css({
	    "overflow-x":"auto",
	    "overflow-y":"auto"
	});
});

svg.addEventListener("mousedown", function(e) {
	moveBool = true;
	mouseDownX = getMousePos(e).x;
	mouseDownY = getMousePos(e).y;
	//获取原来的偏离量
	var curTransStr = g.getAttribute("transform");
	if (!curTransStr) curTransX = 0;
	else {
		var trans = curTransStr.split(",");
		curTransX = parseInt(trans[0].slice(10));
	}
});

document.addEventListener("mousemove", function(e) {
	if (moveBool) {
		moveX = getMousePos(e).x;	
		g.setAttribute("transform", "translate("+ (moveX - mouseDownX + curTransX) + ",0)");
	}
});
document.addEventListener("mouseup", function() {moveBool = false;});

var scrollFunc = function(e){
	if (changeScaleBool) {
		e = e || window.event;
		var t1 = document.getElementById("wheelDelta");
		if (e.wheelDelta) {//IE/Opera/Chrome
			//获取滚动情况（向上或者向下）
			var wheelDelta = e.wheelDelta;
			if (wheelDelta < 0) wheelDelta = -1;
			else if (wheelDelta > 0) wheelDelta = 1;
			//更新滚动上下文
			if (wheelDelta > 0) {
				globleScale = globleScale * 2;
				t1.value = globleScale;
			} else if (wheelDelta < 0) {
				globleScale = globleScale / 2;
				t1.value = globleScale;
			}
			if (globleScale < 1) {
				globleScale = 1
				t1.value = globleScale;
			} else {
				var mousePosX = getMousePos(e).x;
				var g = document.getElementById("g1");
				//缩放导致刻度变换
				for (var i = -5; i < 5 ; i++) {
					var lineId = "line" + i;
					var textId = "text" + i;
					var lineObj = document.getElementById(lineId);
					var textObj = document.getElementById(textId);
					var x1 = parseFloat(lineObj.getAttribute("x1"));
					if (wheelDelta > 0) x1 = x1 + (x1 + 100 - mousePosX) / 2 * wheelDelta;
					else x1 = x1 + (x1 + 100 - mousePosX) / 3 * wheelDelta;
					lineObj.setAttribute("x1", x1);
					lineObj.setAttribute("x2", x1);
					textObj.setAttribute("x", x1);
					for (var m = 1; m < 13; m++) {
						var lineId = "line" + i + "m"+ m;
						var lineObj = document.getElementById(lineId);
						var textObj = document.getElementById(textId);
						var x1 = parseFloat(lineObj.getAttribute("x1"));
						if (wheelDelta > 0) x1 = x1 + (x1 + 100 - mousePosX) / 2 * wheelDelta;
						else x1 = x1 + (x1 + 100 - mousePosX) / 3 * wheelDelta;
						lineObj.setAttribute("x1", x1);
						lineObj.setAttribute("x2", x1);
					}
				}
				//缩放导致数据点位置变换
				for (var i = 0; i < commitList.length; i++) {
					var x = parseFloat(commitList[i].circle.getAttribute("cx"));
					if (wheelDelta > 0) x = x + (x + 100 - mousePosX) / 2 * wheelDelta;
					else x = x + (x + 100 - mousePosX) / 3 * wheelDelta;
					commitList[i].changePosX(x);
				}
			}
		}
	}
}
window.onmousewheel = scrollFunc;

function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { 'x': x, 'y': y };
}

function generateLine(x1,y1,x2,y2) {
	var line = document.createElementNS('http://www.w3.org/2000/svg','line');
	line.setAttribute("x1", x1);
	line.setAttribute("x2", x2);
	line.setAttribute("y1", y1);
	line.setAttribute("y2", y2);
	line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:2");
	return line;
}

function Commit(data) {
	var commit = new Object();
	var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	var oDiv = document.createElement("div");
	oDiv.style.border = "1px solid black";  
	oDiv.style.width = "280px";  
	oDiv.style.height = "180px";  
	oDiv.style.backgroundColor = "#E1E1E1";
	oDiv.style.position = "absolute";
	oDiv.style.display = "none";
	oDiv.id = "";
	var pName = document.createElement("p");
	var pEmail = document.createElement("p");
	var pDate = document.createElement("p");
	var pMessage = document.createElement("p");
	pName.append(data.author.name);
	pDate.append(data.date);
	pEmail.append(data.author.email);
	pMessage.append(data.message);
	oDiv.appendChild(pName);
	oDiv.appendChild(pDate);
	oDiv.appendChild(pEmail);
	oDiv.appendChild(pMessage);
	commit.sha = data.sha;
	commit.circle = circle;
	commit.div = oDiv;
	commit.color = "black";
	commit.pos = { 'x': 0, 'y': 0 };
	commit.id = "";
	commit.initialPos = function(x, y) {
		this.pos.x = x;
		this.pos.y = y;
		this.div.style.left = x + 120;
		this.div.style.top = y + 110;
	}
	commit.initialId = function(id) {
		commit.div.id = "div" + id;
		commit.circle.setAttribute("id", "circle" + id);
	};
	commit.changePosX = function(x) {
		this.circle.setAttribute("cx", x);
		this.div.style.left = x + 120;
	}
	commit.setColor = function(color) {
		this.color = color;
	}
	commit.draw = function() {
		this.circle.setAttribute("cx", this.pos.x);
		this.circle.setAttribute("cy", this.pos.y);
		this.circle.setAttribute("r", 4);
		this.circle.setAttribute("fill", this.color);
		this.circle.addEventListener("mouseover", function() {
			var div = document.getElementById("div" + this.id.slice(6));
			div.style.display = "block";
		});
		this.circle.addEventListener("mouseout", function() {
			var div = document.getElementById("div" + this.id.slice(6));
			div.style.display = "none";
		});
		var g = document.getElementById("g1");
		//console.log(this.div);
		document.body.appendChild(this.div);
		g.appendChild(this.circle);
	};
	return commit;
}

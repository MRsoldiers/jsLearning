var svg = document.getElementById("svg1");

//创建齿轮
var gear1 = generateGear(500, 260, 140, 20, 0.15, 1, "up")//x, y, r1, r2, bias, direction, id
var gear2 = generateGear(500 + 120 * Math.sqrt(3), 620, 140, 20, 0.08, 1, "right")
var gear3 = generateGear(500 - 120 * Math.sqrt(3), 620, 140, 20, 0 ,1, "left")
var gear4 = generateGear(500, 500, 80, 20, 0.35, 0, "mid")
var gear = generateGear(500, 500, 420, 400, 0.165, 1, "out")

svg.appendChild(gear);
svg.appendChild(gear1);
svg.appendChild(gear2);
svg.appendChild(gear3);
svg.appendChild(gear4);

function btnClick() {
    var ani = $("animateTransform");
    ani.remove();
    var gearIds = ["up", "right", "left"];
    var gearLocs = [[500, 260], [500 + 120 * Math.sqrt(3), 620], [500 - 120 * Math.sqrt(3), 620]];
    for (var i = 0; i < gearIds.length; i++) {
        var gear = document.getElementById("g" + gearIds[i]);
        var locX = gearLocs[i][0];
        var locY = gearLocs[i][1];
        var animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        animateTransform.setAttribute("attributeName", "transform");
        animateTransform.setAttribute("begin", "5s");
        animateTransform.setAttribute("dur", "10.765s");//10.76  70.77
        animateTransform.setAttribute("type", "rotate");
        animateTransform.setAttribute("from", "360 "+ locX +" "+ locY);
        animateTransform.setAttribute("to", "0 "+ locX +" "+ locY);
        animateTransform.setAttribute("repeatCount", "indefinite");
        gear.appendChild(animateTransform);
        //<animateMotion path="M10,80 q100,120 120,20 q140,-50 160,0" begin="0s" dur="3s" rotate="auto" repeatCount="indefinite"/>
        var animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        animateMotion.setAttribute("path", "M0 0 A 240 240 0 0 1 "+(1000-2*locX)+" "+(1000-2*locY)+" A 240 240 0 0 1 0 0");
        animateMotion.setAttribute("begin", "5s");
        animateMotion.setAttribute("dur", "20s");  
        animateMotion.setAttribute("repeatCount", "indefinite");
        gear.appendChild(animateMotion);
    }
    var animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
    animateTransform.setAttribute("attributeName", "transform");
    animateTransform.setAttribute("begin", "5s");
    animateTransform.setAttribute("dur", "3.34s");//10.76  70.77 3.33kuai 3.35man
    animateTransform.setAttribute("type", "rotate");
    animateTransform.setAttribute("from", "0 500 500");
    animateTransform.setAttribute("to", "360 500 500");
    animateTransform.setAttribute("repeatCount", "indefinite");
    var gear = document.getElementById("gmid");
    gear.appendChild(animateTransform);
}
//12.728s  20

function generateGear(x, y, r1, r2, bias, direction, id) {
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute("id","g" + id);
    var circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle1.setAttribute("cx", x);
    circle1.setAttribute("cy", y);
    circle1.setAttribute("r", r1);
    circle1.setAttribute("fill", "blue");
    circle1.setAttribute("id", id);
    g.appendChild(circle1);
    var circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle2.setAttribute("cx", x);
    circle2.setAttribute("cy", y);
    circle2.setAttribute("r", r2);
    circle2.setAttribute("fill", "white");
    circle2.setAttribute("id", id + "_small");
    g.appendChild(circle2);
    if (id === "out") r = r2;
    else r = r1;
    for (var i = 0; i < r / 5; i++) {//18个，每个20度
        var angle = bias + i  * Math.PI * 10 / r;
        var xg = x + r * Math.cos(angle) - 8;
        var yg = y + r * Math.sin(angle) - 12;
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", xg);
        rect.setAttribute("y", yg);
        rect.setAttribute("width", 16);
        rect.setAttribute("height", 24);
        rect.setAttribute("fill", "blue");
        rect.setAttribute("transform", "rotate(" + (90 + angle * 180 / Math.PI)  + " " + (xg + 8) + " " + (yg + 12) + ")");
        g.appendChild(rect);
    }
    if (direction === 1) {var from = 0; var to = 360;}
    else {var from = 360; var to = 0;}
    var animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
    animateTransform.setAttribute("attributeName", "transform");
    animateTransform.setAttribute("begin", "1s");
    animateTransform.setAttribute("dur", r / 14 + "s");
    animateTransform.setAttribute("type", "rotate");
    animateTransform.setAttribute("from", from + " "+ x +" "+ y);
    animateTransform.setAttribute("to", to + " "+ x +" "+ y);
    animateTransform.setAttribute("repeatCount", "indefinite");
    g.appendChild(animateTransform);
    return g;
}

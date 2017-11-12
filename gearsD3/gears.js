var svg = d3.select("svg"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = 80;

var offset = 0,//store the offset of the reference
    speed = 4,
    start = Date.now();

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") scale(.55)")
    .append("g");

var frame = svg.append("g")
    .datum({radius: Infinity});//default to planet

frame.append("g")
    .attr("class", "annulus")
    .datum({teeth: 80, radius: -radius * 5, annulus: true})
    .append("path")
    .attr("d", gear);

frame.append("g")
    .attr("class", "sun")
    .datum({teeth: 16, radius: radius})
    .append("path")
    .attr("d", gear);

frame.append("g")
    .attr("class", "planet")
    .attr("transform", "translate(0,-" + radius * 3 + ")")
    .datum({teeth: 32, radius: -radius * 2})
    .append("path")
    .attr("d", gear);

frame.append("g")
    .attr("class", "planet")
    .attr("transform", "translate(" + -radius * 3 * Math.sin(2 * Math.PI / 3) + "," + -radius * 3 * Math.cos(2 * Math.PI / 3) + ")")
    .datum({teeth: 32, radius: -radius * 2})
    .append("path")
    .attr("d", gear);

frame.append("g")
    .attr("class", "planet")
    .attr("transform", "translate(" + radius * 3 * Math.sin(2 * Math.PI / 3) + "," + -radius * 3 * Math.cos(2 * Math.PI / 3) + ")")
    .datum({teeth: 32, radius: -radius * 2})
    .append("path")
    .attr("d", gear);

d3.selectAll("input[name=reference]")
    .data([radius * 5, Infinity, -radius])
    .on("change", function(radius1) {
        var radius0 = frame.datum().radius
        var old = (Date.now() - start) * speed / radius0; 
        start = Date.now();
        frame.datum({radius: radius1});
        svg.attr("transform", "rotate(" + (offset += old) + ")");
        //whenever the mode is changed, the reference should store the angle changed during last mode.
    });

function gear(d) {
    var n = d.teeth,
        r2 = Math.abs(d.radius), // where the midle of the teeth locate
        r0 = r2 - 8, // where the base of the teeth loctate
        r1 = r2 + 8, // where the tip of the teeth  locate
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20, // inner or outer radius
        da = Math.PI / n,
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i = -1,
        path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
    console.log(path);
    while (++i < n) 
        path.push(
        "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
        "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
        "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),    
        "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
        "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
    path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
    return path.join("");//merge the above array into one string with ""
}

d3.timer(function() {
    var angle = (Date.now() - start) * speed,
        transform = function(d) {
             return "rotate(" + angle / d.radius + ")"; 
        };
    frame.selectAll("path").attr("transform", transform);
    frame.attr("transform", transform); // frame of reference
});

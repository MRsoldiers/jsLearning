var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var WordList = ["°Ö°Ö","ÂèÂè","¸ù","æµ","Ë¸¸ç","Íõ¿¡ÇÉ","¼ÎÁá",
	"Ôø³¬","R.X Zhong","ÀÏºÎ","ÀÏ²Ì","²Å¸ç","Áú¸ç","°¢¹ó"];

var wordList = [];
	
var Word = {
	str: "",
	level: 0,
    newObject: function(str, l) {
		var w = Object.create(Word);
		w.str = str;
		w.level = 50 - 2 * l;
        return w;
    }
}

function createWord() {
	for(var i = 0; i < WordList.length; i++){
		var word = Word.newObject(WordList[i], i);
		wordList.push(word);
	}
}

function collision(wordImageData) {
	var wdata;
    wdata = wordImageData.data;
    for (var wy = 0; wy < wdata.length; wy++){         
        if (wdata[wy]) {return true;}   
    };
    return false;
};

function getNumberInNormalDistribution(mean, std_dev) {
    return mean + (randomNormalDistribution() * std_dev);
}
function randomNormalDistribution(){
    var u = 0.0, v = 0.0, w = 0.0, c = 0.0;
    do{
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
    }while (w == 0.0 || w >= 1.0)
    // Box-Muller
    c = Math.sqrt((-2 * Math.log(w)) / w);
    return u * c;
}

function drawTitle() {
    var ctx = this.ctx;
    ctx.translate(this.canvas.width/2, this.canvas.height/2);
    function Spin(ctx) {
        if (Math.random() > 0.66) {
			ctx.rotate(-45 * Math.PI / 180); 
            return -1;
        }else if (Math.random() < 0.33){
			ctx.rotate(45 * Math.PI / 180); 
			return 1;
		}else 
			return 0;
    }
    for (var i = 0; i < WordList.length; i++) { 
        ctx.save(); 
        var isSpin = Spin(ctx); 
		var frt = wordList[i].level;
		ctx.font = frt + "px Georgia";
		var stext = wordList[i].str;
        var tWidth = ctx.measureText(stext).width;
        var tHeight = frt;
        var x, y;
        while (true) {
			x = getNumberInNormalDistribution(0, this.canvas.width / 15);
			y = getNumberInNormalDistribution(0, this.canvas.height / 15);
            var isCollision;
            if (isSpin === -1) {// -45¡ã
                var x1 = (x + y - tHeight) / Math.sqrt(2) + this.canvas.width / 2;
                var y1 = (y - x - tHeight - tWidth) / Math.sqrt(2) + this.canvas.height / 2;
                var l = (tHeight + tWidth) / Math.sqrt(2) + 3;
                isCollision = collision(ctx.getImageData(x1, y1, l, l)); 
            }else if (isSpin === 1) {// 45¡ã
                var x2 = (x - y) / Math.sqrt(2) + this.canvas.width / 2;
                var y2 = (x + y - tHeight) / Math.sqrt(2) + this.canvas.height / 2;
                var l2 = (tHeight + tWidth) / Math.sqrt(2) + 3;
                isCollision = collision(ctx.getImageData(x2, y2, l2, l2));
			} else {
				var x1 = x + this.canvas.width / 2;
                var y1 = y + this.canvas.height / 2;
                isCollision = collision(ctx.getImageData(x1, y1, tWidth, -tHeight)); 
			}
            if (!isCollision) break;
        };
        ctx.fillText(stext, x, y);
        ctx.restore();
    };
}

createWord();
drawTitle()

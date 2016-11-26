define(['hex'], function(H) {
    function colorForHex(hex) {
        // Match the color style used in the main article
        if (hex.q == 0 && hex.r == 0 && hex.s == 0) {
            return "hsl(0, 50%, 0%)";
        } else if (hex.q == 0) {
            return "hsl(90, 70%, 35%)";
        } else if (hex.r == 0) {
            return "hsl(200, 100%, 35%)";
        } else if (hex.s == 0) {
            return "hsl(300, 40%, 50%)";
        } else {
            return "hsl(0, 0%, 50%)";
        }
    }
    function cubeToOddQ(q, r, s) {
        // convert cube to odd-q offset
        var col = q - s;
        var row = r;
        return {
            x: col,
            y: row
        };
    }

    function Map(canvas, topLeft, size) {
	// Canvas to draw on
	this.canvas = canvas;
        this.topLeft = topLeft;
        this.size = size;
	this.origin = H.Point(0, 0);
	this.scale = H.Point(25, 25);
	this.mouseHex = H.Hex(0, 0, 0);

	map = this;
	canvas.addEventListener("mousemove", function(e) {map.onMove(e);});
	canvas.addEventListener("wheel", function(e) {map.onWheel(e);});
	return this;
    }
    Map.prototype.layout = function() {
	return H.Layout(H.layout_pointy, this.scale, this.origin);
    }
    Map.prototype.hexes = function() {
        var hexes = [];
        var i1 = this.topLeft.x, i2 = i1 + this.size.x;
        var j1 = this.topLeft.y, j2 = j1 + this.size.y;
        for (var j = j1; j < j2; j++) {
            var jOffset = -Math.floor(j / 2);
            for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
                hexes.push(H.Hex(i, j, -i - j));
            }
        }
        return hexes;
    }
    Map.prototype.toIndex = function(c) {
        return ( Math.floor(c.x / 2) - this.topLeft.x + (c.y - this.topLeft.y) * this.size.x) ;
    }
    Map.prototype.drawHex = function(ctx, hex) {
        var corners = H.polygon_corners(this.layout(), hex);
        ctx.beginPath();
        ctx.strokeStyle = "black";
	if (H.hex_equal(hex, this.mouseHex)) {
	    ctx.lineWidth = 2;
	} else {
            ctx.lineWidth = 1;
	}
        ctx.moveTo(corners[5].x, corners[5].y);
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.stroke();
    }
    Map.prototype.drawHexLabel = function(ctx, hex) {
        var center = H.hex_to_pixel(this.layout(), hex);
        ctx.fillStyle = colorForHex(hex);
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //ctx.fillText((hex.q == 0 && hex.r == 0 && hex.s == 0)? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y - 6);
        var coords = cubeToOddQ(hex.q, hex.r, hex.s);
        //ctx.fillText(this.toIndex(coords), center.x, center.y - 6);
        ctx.fillText(coords.x + "," + coords.y, center.x, center.y + 6);
    }
    Map.prototype.drawGrid = function(backgroundColor, withLabels) {
	var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        if (window.devicePixelRatio && window.devicePixelRatio != 1) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2);
	var map = this;
        this.hexes().forEach(function(hex) {
            map.drawHex(ctx, hex);
            if (withLabels)
                map.drawHexLabel(ctx, hex);
        });
    }
    Map.prototype.redraw = function() {
        this.drawGrid("hsl(60, 10%, 90%)", true);
    }
    Map.prototype.onMove = function(event) {
        var mapOffsetX = this.canvas.clientWidth / 2;
        var mapOffsetY = this.canvas.clientHeight / 2;

        var hex = H.hex_round(H.pixel_to_hex(this.layout(), {
            x: event.offsetX - mapOffsetX,
            y: event.offsetY - mapOffsetY
        }));
	// Empire coords
	var e = cubeToOddQ(hex.q, hex.r, hex.s);
        var Pos = e.x + "," + e.y + " || " + hex.q + "," + hex.r + "," + hex.s + " (" + event.offsetX + "/" + event.offsetY + ")";
        var msg = document.getElementById("msg");
        msg.textContent = Pos;

	this.mouseHex = hex;
	this.redraw();
        return true;
    }
    Map.prototype.onWheel = function(event) {
	delta = event.wheelDelta; // +-168
	if (delta > 0) {
	    this.scale = H.point_scale(this.scale, 1.1);
	} else {
	    this.scale = H.point_scale(this.scale, 0.9);
	}
	this.redraw();
	return true;
    }
    return Map;
})

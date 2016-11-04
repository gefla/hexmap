define(['hex'], function(H) {
    var layout = H.Layout(H.layout_pointy, H.Point(25, 25), H.Point(0, 0));

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

    function Map(topLeft, size) {
	// map -> this
        this.topLeft = topLeft;
        this.size = size;
	return this;
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
        var corners = H.polygon_corners(layout, hex);
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.moveTo(corners[5].x, corners[5].y);
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.stroke();
    }
    Map.prototype.drawHexLabel = function(ctx, hex) {
        var center = H.hex_to_pixel(layout, hex);
        ctx.fillStyle = colorForHex(hex);
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //ctx.fillText((hex.q == 0 && hex.r == 0 && hex.s == 0)? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y - 6);
        var coords = cubeToOddQ(hex.q, hex.r, hex.s);
        //ctx.fillText(this.toIndex(coords), center.x, center.y - 6);
        ctx.fillText(coords.x + "," + coords.y, center.x, center.y + 6);
    }
    Map.prototype.drawGrid = function(id, backgroundColor, withLabels) {
        var canvas = document.getElementById(id);
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
    Map.prototype.drawExample = function() {
        this.drawGrid("layout-test-orientation-pointy", "hsl(60, 10%, 90%)", true);
    }
    Map.prototype.onMove = function(el, event) {
        var hex = H.pixel_to_hex(layout, {
            x: event.offsetX,
            y: event.offsetY
        });
        var Pos = hex.q + "," + hex.r + " " + hex.s + " (" + event.offsetX + "/" + event.offsetY + ")";
        var msg = document.getElementById("msg");
        msg.textContent = Pos;
        return true;
    }
    return Map;
})

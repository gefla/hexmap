Hexmap = (function() {
    var hm = {
	scale: 2,
	transX: -100,
	transY: -200
    };

    function makeCellId(x, y)
    {
	return x + "," + y;
    }

    function onclick(event)
    {
	if (this.panning) {
	    return false;
	}
	cl = this.getAttribute("class");
	if (cl == "current") {
	    this.setAttribute("class", "hex");
	} else {
	    this.setAttribute("class", "current");
	}
	return true;
    }

    hm.createCell = function(x, y)
    {
	var drawX = x * 20;
	var drawY = y * 30;

	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute("class", "hex");
	group.onclick = onclick;
	group.empCoords = {x: x, y: y};

	var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
	use.setAttribute("x", drawX);
	use.setAttribute("y", drawY);
	use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#hex");
	group.appendChild(use);

	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", drawX + 20);
	text.setAttribute("y", drawY + 25);
	text.setAttribute("id", makeCellId(x, y));
	group.appendChild(text);
	this.mapArea.appendChild(group);

	return use;
    }

    hm.setCell = function(x, y, content)
    {
	var text = document.getElementById(makeCellId(x, y));
	if (text) {
	    text.textContent = content;
	}
    }

    hm.t1 = function()
    {
	this.mapArea = document.getElementById("mapArea");
	for (y = 0; y < 128; y++) {
	    for (x = ((y % 2) == 1 ? 1 : 0); x < 128; x += 2) {
		this.createCell(x, y);
		this.setCell(x, y, makeCellId(x, y));
	    }
	}
	this.updateTransform();
    }

    hm.updateTransform = function() {
	this.mapArea.setAttribute("transform", "translate(" +
				  this.transX + " " + this.transY +
				  ") scale(" + this.scale + ")");
    }

    hm.zoom = function(event) {
	this.scale = event.target.valueAsNumber / 25 + 0.5;
	this.updateTransform();
    }

    hm.panStart = function(event) {
	this.panning = true;
	this.panLastX = event.x;
	this.panLastY = event.y;
	return true;
    }

    hm.panMove = function(event) {
	if (!this.panning) {
	    return false;
	}
	dx = event.x - this.panLastX;
	dy = event.y - this.panLastY;
	this.panLastX = event.x;
	this.panLastY = event.y;
	this.transX += dx;
	this.transY += dy;
	this.updateTransform();
	return true;
    }

    hm.panFinish = function(event) {
	this.panning = false;
	return true;
    }
    
    return hm;
})()

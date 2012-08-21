function makeCellId(x, y)
{
  return x + "," + y;
}

function makeCurrent(event)
{
  this.setAttribute("class", "current");
}

function createCell(x, y)
{
  var cell = document.getElementById("cell");
  var mapArea = document.getElementById("mapArea");
  var drawX = x * 20;
  var drawY = y * 30;

  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "hex");
  group.onclick = makeCurrent;

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
  mapArea.appendChild(group);

  return use;
}

function setCell(x, y, content)
{
  var text = document.getElementById(makeCellId(x, y));
  if (text) {
    text.textContent = content;
  }
}

function t1()
{
  for (y = 0; y < 6; y++) {
    for (x = ((y % 2) == 1 ? 1 : 0); x < 10; x += 2) {
      createCell(x, y);
      setCell(x, y, makeCellId(x, y));
    }
  }
}

function zoom(event) {
    scale = event.target.valueAsNumber / 25 + 0.5;
    e = document.getElementById("mapArea");
    e.setAttribute("transform", "scale(" + scale + ")");
}

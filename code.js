var w = 256;
var h = 256;

var canvas;
var ctx;

var candy = {
  x : w/2,
  y : h/2,

  reset(){
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  }
}

var agent = {
  x: 20,
  y: 20,
  vx: 0,
  vy: 0,

  update(x, y){

    var dx = x - this.x;
    var dy = y - this.y;
    var norm = Math.sqrt((dx * dx) + (dy * dy));

    dx /= norm;
    dy /= norm;

    dx *= 0.01;
    dy *= 0.01;

    this.vx += dx;
    this.vy += dy;

    this.vx *= .98;
    this.vy *= .98;

    this.x += this.vx;
    this.y += this.vy;
  }
}

function setup(){

  resize();

}

function resize(){

  var canvas = document.getElementById('display');

  var offx = window.innerWidth/2-w/2;
  var offy = window.innerHeight/2-h/2;

  offx.toString();
  offy.toString();

  offx += "px";
  offy += "px";

  canvas.width = w;
  canvas.height = h;

  canvas.style.top = offy;
  canvas.style.left = offx;
  canvas.style.position = "absolute";

}

function draw(){

  agent.update(candy.x, candy.y);

  var canvas = document.getElementById('display');
  var ctx = canvas.getContext('2d');

  var ax = agent.x;
  var ay = agent.y;

  var cx = candy.x;
  var cy = candy.y;

  if ( Math.abs(cx-ax < 1) && Math.abs(cy-ay < 1)) candy.reset();

  // Background
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.fillRect(0,0,w,h);

  // Agent
  ctx.beginPath();
  ctx.arc(ax, ay, 9, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Candy
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, 2*Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();

}

setInterval(draw, 1/60);

var s = 2;
var u = 16 * s;
var xl = 9;
var yl = 9;
var w = xl * u;
var h = yl * u;
var lim = xl * yl;
var px = "px";
var data = [];
var loc = 0;
var locx;
var locy;
var su = 16;
var sheet = new Image;
var spritex = [];
var spritey = [];

function setup(){
  resize();
  data[loc] = 2;
  for ( i = 1; i < lim; i ++ ){
    var r = Math.random();
    data[i] = Math.round(r);
  }
  for ( i = 0; i < 3; i ++ ){
    spritex[i] = i * 16;
    spritey[i] = 0;
  }
  sheet.src = "sprites.png";
}

function resize(){
  var canvas = document.getElementById('display');
  var ctx = canvas.getContext('2d');
  var offx = window.innerWidth/2-w/2;
  var offy = window.innerHeight/2-h/2;

  offx.toString();
  offy.toString();

  offx += px;
  offy += px;

  canvas.width = w;
  canvas.height = h;
  canvas.style.top = offy;
  canvas.style.left = offx;
  canvas.style.position = "absolute";
  ctx.imageSmoothingEnabled = false;
  ctx.scale(s,s);
}

function draw(){

  locx = Math.floor(loc % xl);
  locy = Math.floor(loc / xl);
  var canvas = document.getElementById('display');
  var ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#5F574F';
  ctx.beginPath();
  ctx.fillRect(0,0,w,h);

  for ( i = 0; i < lim; i ++ ){
    var x = Math.floor(i % xl);
    var y = Math.floor(i / xl);
    var sx = spritex[data[i]];
    var sy = spritey[data[i]];

    ctx.drawImage(sheet,sx,sy,su,su,x*su,y*su,su,su);
  }
}
function move(dir){
  if ( dir == 1 && locy - 1 > -1 ){
    data[loc] = data[loc - xl];
    data[loc - xl] = 2;
    loc -= xl;
  }
  if ( dir == 2 && locy + 1 < yl ){
    data[loc] = data[loc + xl];
    data[loc + xl] = 2;
    loc += xl;
  }
  if ( dir == 3 && locx-1 > -1 ){
    data[loc] = data[loc - 1];
    data[loc - 1] = 2;
    loc -= 1;
  }
  if ( dir == 4 && locx+1 < xl ){
    data[loc] = data[loc + 1];
    data[loc + 1] = 2;
    loc += 1;
    }
}
// Key Controls
window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  switch (event.key) {
    case "ArrowUp":
      move(1);
    break;
    case "ArrowDown":
      move(2);
    break;
    case "ArrowLeft":
      move(3);
    break;
    case "ArrowRight":
      move(4);
    break;
    default:
    return; // Quit when this doesn't handle the key event.
  }
  event.preventDefault(); }, true);

setInterval(draw, 1/60);

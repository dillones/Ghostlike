var data = [];
var search = [];

var s = 2;
var su = 16;
var u = su * s;
var xl = 9;
var yl = 12;
var w;
var h;
var limit = xl * yl;
var px = "px";

var index = Math.floor(limit/2);
var loc;

var sheet = new Image;
var sprite = [];

var fps = (1/30)*1000
var frames = 0;
var anim = false;

var item = 0;
var select = 1;

function random(lo,hi){
  var n = Math.floor(Math.random() * (hi+1-lo) ) + lo;
  return(n);
}

function Vec( x, y ){
  this.x = x;
  this.y = y;
  this.i = x * (y+1);
}

function Loc( i ){
  this.i = i;
  this.x = Math.floor( i % xl );
  this.y = Math.floor( i / xl );

  this.set = function( i ) {
    this.x = Math.floor( i % xl );
    this.y = Math.floor( i / xl );
  }
}

function setup(){
  resize();
  for ( i = 0; i < limit; i ++ ){
    n = Math.random();
    if ( n > .95 ){
    data[i] = 2;
    }
    else if( n >.7 ){
    r = Math.floor(Math.random()*4) + 3;
    data[i] = r;
    }
    else if ( n > .4 ){
    data[i] = 6;
    }
    else {
    data[i] = 1;
    }
  }

  data[index] = 0;
  loc = new Loc(index);

  search[0] = new Vec( 0,-1);
  search[1] = new Vec( 0, 1);
  search[2] = new Vec(-1, 0);
  search[3] = new Vec( 1, 0);

  // search[4] = new Vec( 1,-1);
  // search[5] = new Vec( 1, 1);
  // search[6] = new Vec(-1, 1);
  // search[7] = new Vec( 1, 1);

  for ( i = 0; i < 16+9; i ++ ){

    var x = Math.floor(i % 16);
    var y = Math.floor(i / 16);

    sprite[i] = new Vec( x * 16, y * 16);
  }
  sheet.src = "assets/sprites.png";
}

function resize(){

  u = su * s;
  w = (xl + 2) * u;
  h = (yl + 2) * u;

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

  frames = ( frames +1 ) % 30;
  if ( frames == 10 ){
    anim = !anim;
  }

  loc.set( index );

  var canvas = document.getElementById('display');
  var ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#5F574F';
  ctx.fillRect(0,0,w,h-u);

  for ( i = 0; i < limit; i ++ ){

    var off = 0;
    if ( anim ){
       off = 4 * 16
    }

    var x = Math.floor(i % xl) + 1;
    var y = Math.floor(i / xl) + 1;

    var sx = sprite[data[i]].x;
    var sy = sprite[data[i]].y + off;

    ctx.drawImage(sheet,sx,sy,su,su,x*su,y*su,su,su);
    }

  for ( i = 0; i < 9; i ++ ){
    var sx = sprite[16+i].x;
    var sy = sprite[16+i].y;
    var x = i+1;
    y = yl+1;

    if ( i == item ){
      sy = 32;
    }
    else {
      y = yl+1;
    }

    ctx.drawImage(sheet,sx,sy,su,su,x*su,y*su,su,su);
  }
    // ctx.drawImage(sheet,0,48,144,su,16,0,144,su);
    // ctx.drawImage(sheet,0,64,su,178,0,0,su,178);
    // ctx.drawImage(sheet,16,64,su,178,160,0,su,178);

}

function check( vec, x, y ){
  var dir = 0;

  if ( y < 0 && vec.y + y > -1 ){
    dir = -xl;
  }
  if ( y > 0 && vec.y + y < yl ){
    dir = xl;
  }
  if ( x < 0 && vec.x + x > -1 ){
    dir = -1;
  }
  if ( x > 0  && vec.x + x < xl ){
    dir = 1;
  }

  return(dir);
}

function push(x, y){

  var dir = check( loc, x, y );
  var bounds = check( loc, x*2, y*2 );

  if ( data[ index + dir ] == 1 ){
    swap(x, y)
  }
  else if ( data[ index + dir * 2 ] == 1 && bounds != 0 ) {
    data[index + dir * 2] = data[index + dir];
    data[index] = 1;
    data[index + dir] = 0;
    index += dir;
  }
}

function pull(x, y){

  var bounds = check( loc, -x,-y);
  var dir = check( loc, x, y);

  if ( data[index + dir] == 1 && data[index - dir] > 1 && bounds != 0){
    data[index] = data[index - dir];
    data[index - dir] = 1;
    data[index + dir] = 0;
    index += dir;
  }
  else if (data[index + dir] == 1) {
    swap(x,y);
  }
}

function step( x, y ){
  var dir = check( loc, x, y )

  if ( data[index + dir] == 1 ){
    data[index] = 1;
    data[index + dir] = 0;
    index += dir;
  }
}

function swap( x, y ){
  var dir = check( loc, x,y );
  if ( dir != 0 ){
    data[index] = data[index + dir];
    data[index + dir] = 0;
    index += dir;
  }
}

function copy( x, y ){
  var dir = check( loc, x,y);
  if ( dir != 0 ){
    select = data[index + dir];
  }
}

function trade( x, y, n){
  var dir = check( loc, x, y );
  if ( n == 0 ){
    n = random(2,14);
  }
  data[index + dir] = n;
  if ( n == 1 ){
    swap(x,y);
  }
}

function move(x, y){
  switch( item ){
    case 0:
      step( x, y );
    break;
    case 1:
      push( x, y );
    break;
    case 2:
      pull( x, y );
    break;
    case 3:
      swap( x, y );
    break;
    case 4:
      trade( x, y, 0 );
    break;
    case 5:
      trade( x, y, 1 );
    break;
    case 6:
      trade( x, y, select );
    break;
    case 7:
      copy( x, y );
    break;
    case 8:
      //trade( x, y, 1 );
    break;
    }

    gen();
}
// Key Controls
window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  var k = event.key;
  console.log(k);

  if ( k > 0 && k < 10 ){
    item = k-1;
  }

  else switch (k) {
    case "ArrowUp":
      move(0,-1);
    break;
    case "ArrowDown":
      move(0,1);
    break;
    case "ArrowLeft":
      move(-1,0);
    break;
    case "ArrowRight":
      move(1,0);
    break;
    case " ":
      move(0,0);
    break;
    case "g":
      gen();
    break;
    default:
    return;
  }

event.preventDefault(); }, true);
setInterval(draw, fps);

function gen(){

  var field = data;

    for ( i = 0; i < field.length; i ++ ){
    var water = 0;
    var trees = 0;
    var nodes = 0;
    var black = 0;

    for( n = 0; n < search.length; n ++ ){

      var loc = new Loc ( i );
      var dir = check(loc, search[n].x, search[n].y );

      if ( dir != 0 ){

        if ( field[i + dir] == 2 ){
          nodes += 1;
        }
        if ( field[i + dir] == 5 ){
          water += 1;
        }
        if ( field[i + dir] == 6 ){
          trees += 1;
        }

      }
      }

      // Apply Rules
      if ( data[i] == 1 && water == 1 && trees < 3 && trees > 0 ){
        data[i] = 6;
      }
      if ( data[i] == 6 && (( water == 0 && trees == 0) )){
        data[i] = 1;
      }
      if ( data[i] == 1 && ( water > 0 )){
        data[i] = 5;
      }
      if ( data[i] != 0 && ( nodes == 4 )){
        data[i] = random(2,6);
        for( n = 0; n < search.length; n ++ ){
          data[i + search[n].i] = 1;
        }
      }
    }
}

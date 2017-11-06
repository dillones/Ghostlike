var data = [];
var search = [];

var s = 2;
var su = 16;
var u = su * s;
var xl = 64;
var yl = 64;
var w;
var h;
var dim;
var cam;
var limit = xl * yl;
var px = "px";

var index = Math.floor(limit/2 + xl/2) -1;
var loc;

var sheet = new Image;
var sprite = [];

var fps = (1/30)*1000
var frames = 0;
var anim = false;

var item = 3;
var items = 9;
var select = 3;

var generation = 0;
var map = false;

function random(lo,hi){
  var n = Math.floor(Math.random() * (hi+1-lo) ) + lo;
  return(n);
}

function Vec( x, y ){
  this.x = x;
  this.y = y;
  this.i = x + y*xl;
}

function Loc( i ){
  this.i = i;
  this.x = Math.floor( i % xl );
  this.y = Math.floor( i / xl );

  this.set = function( i ) {
    this.i = i;
    this.x = Math.floor( i % xl );
    this.y = Math.floor( i / xl );
  }
}

function setup(){
  generation = 0;
  resize();

  search[0] = new Vec( 0,-1);
  search[1] = new Vec( 0, 1);
  search[2] = new Vec(-1, 0);
  search[3] = new Vec( 1, 0);

  search[4] = new Vec( 1,-1);
  search[5] = new Vec( 1, 1);
  search[6] = new Vec(-1, 1);
  search[7] = new Vec(-1,-1);

  for ( i = 0; i < limit; i ++ ){
    data[i] = 1;
  }
  generate( 1, 9, .5 );
  data[index] = 0;
  loc = new Loc(index);

  for ( i = 0; i < 16+9; i ++ ){

    var x = Math.floor(i % 16);
    var y = Math.floor(i / 16);

    sprite[i] = new Vec( x * 16, y * 16);
  }
  sheet.src = "assets/sprites.png";

  draw()
}

function resize(){

  u = su * s;

  dim = new Vec( 13, 12 );
  w = (dim.x) * u;
  h = (dim.y + 2) * u;

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
  window.requestAnimationFrame(draw);
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

    var x = Math.floor(i % xl) - loc.x + Math.floor(dim.x/2);
    var y = Math.floor(i / xl) - loc.y + Math.floor(dim.y/2);

    var sx = sprite[data[i]].x;
    var sy = sprite[data[i]].y;

    if  ( data[i] == 0 ){
      sy += off;
    }

    ctx.drawImage(sheet,sx,sy,su,su,x*su,y*su,su,su);
    }

  for ( i = 0; i < 9; i ++ ){
    var sx = sprite[16+i].x;
    var sy = sprite[16+i].y;
    var x = i + Math.floor(dim.x/2) - 4;
    var y = dim.y;

    if ( i == item ){
      sy = 32;
    }
    else {
      //y = yl;
    }

    ctx.drawImage(sheet,sx,sy,su,su,x*su,y*su,su,su);
  }
    // ctx.drawImage(sheet,0,48,144,su,16,0,144,su);
    // ctx.drawImage(sheet,0,64,su,178,0,0,su,178);
    // ctx.drawImage(sheet,16,64,su,178,160,0,su,178);
  if ( map ){
    for ( i = 0; i < limit; i ++ ){

      var x = Math.floor(i % xl) + 16+4;
      var y = Math.floor(i / xl) + 16;

      if ( data[i] == 0 ){
        ctx.fillStyle = '#FFF1EB';
        ctx.fillRect(x*2, y*2, 2, 2);
      }
      else if ( data[i] == 1 ){
        ctx.fillStyle = '#5F574F';
        ctx.fillRect(x*2, y*2, 2, 2);
      }

      else if ( data[i] == 5 ){
        ctx.fillStyle = '#9ADBC7';
        ctx.fillRect(x*2, y*2, 2, 2);
      }

      else if ( data[i] == 6 ){
        ctx.fillStyle = '#76DB8A';
        ctx.fillRect(x*2, y*2, 2, 2);
      }

      else if ( data[i] == 9 ){
        ctx.fillStyle = '#392D31';
        ctx.fillRect(x*2, y*2, 2, 2);
      }
      else {
        ctx.fillStyle = '#5F574F';
        ctx.fillRect(x*2, y*2, 2, 2);
      }

  }
}
}

function check( vec, x, y ){
var dir = 0;

if ( vec.y + y > -1 && vec.y + y < yl && vec.x + x > -1 && vec.x + x < xl ){
    dir += xl * y;
    dir += x;
}
// Clamp
else if ( vec.x + x < 0 ){
  dir = xl-1;
}
else if ( vec.x + x > xl-1 ){
  dir = -xl+1;
}
else if ( vec.y + y < 0 ){
  dir = xl * (yl-1);
}
else if ( vec.y + y > yl-1){
  dir = ( xl* (yl-1) )*-1;
}

return(dir);
}

function push(x, y){

  var dir = check( loc, x, y );
  var bounds = check( loc, x*2, y*2 );

  if ( data[ index + dir ] == 1 ){
    swap(x, y)
  }
  else if ( data[ index + dir ] == 8 && bounds != 0 ) {
    data[index + dir * 2] = 8;
    data[index] = 1;
    data[index + dir] = 0;
    index += dir;
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
  if ( data[index + dir] == 7 ){
    setup()
  }
}

function swap( x, y ){
  var dir = check( loc, x,y );
  if ( data[index + dir] == 7 ){
    setup()
  }
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
    n = random(2,items);
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

    if ( generation == 5 ){
      generate(1,5,.05);
    }
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
    case "m":
      map = !map;
    break;
    default:
    return;
  }

event.preventDefault(); }, true);

// window.onmousedown = function(){
//
// var x = event.clientX-screen.width/2;     // Get the horizontal coordinate
// var y = event.clientY-screen.height/2;     // Get the vertical coordinate
//
// if ( Math.abs(x) < Math.abs(y) && Math.floor(x/Math.abs(x)) != 0){
//   move(Math.floor(x/Math.abs(x)), 0);
// }
// else if ( Math.floor(y/Math.abs(y)) != 0 ){
//   move(0,Math.floor(y/Math.abs(y)));
// }
// console.log(x + " , " + y)
// }

function gen(){

  var field = [];

  for ( i = 0; i < data.length; i ++ ){
    var n = data[i];
    field[i] = n;
  }

    for ( i = 0; i < field.length; i ++ ){
    var path = 0;
    var water = 0;
    var trees = 0;
    var nodes = 0;
    var black = 0;

    for( n = 0; n < search.length; n ++ ){

      var loc = new Loc ( i );
      var dir = check(loc, search[n].x, search[n].y );

      if ( generation > 9 ){
          g = 4;
      }
      else {
          g = 8;
      }

      if ( dir != 0 ){
        if ( field[i + dir] == 5 && n < 4 ){
          water += 1;
        }
        if ( field[i + dir] == 1 && n < g ){
          path += 1;
        }
        if ( field[i + dir] == 6 && n < 4 ){
          trees += 1;
        }
        if ( field[i + dir] == 2 && n < 4 ){
          nodes += 1;
        }
        if ( field[i + dir] == 9 && n < g){
          black += 1;
        }
      }
    }

    if  ( data[i] == 1 && ( path < 2 || path == 4) && generation < 5 ){
      data[i] = 9;
    }
    if  ( data[i] == 9 && path > 4 && generation < 5 ){
      data[i] = 1;
    }

    if  ( data[i] == 5 && black > 0 && generation == 6 ){
      data[i] = 1;
    }
    if  ( data[i] == 1 && black == 4 && generation == 10 ){
      data[i] = 9;
    }
    if  ( data[i] == 9 && path == 4 && generation == 10 ){
      data[i] = 1;
    }

    if  ( data[i] == 1 && black == 0 && water > 0 && generation == 7 ){
      data[i] = 5;
    }
    if  ( data[i] == 1 && water > 2 && generation == 8 ){
      data[i] = 5;
    }
    if  ( data[i] == 1 && water > 0 && black == 0 && generation == 9 ){
      data[i] = 6;
    }
    if  ( data[i] == 5 && (trees+water) < 4 && generation == 10 ){
      data[i] = 6;
    }
    if  ( data[i] == 1 && black == 3 && generation == 11 ){
      data[i] = random(2,9);
      if ( data[i] == 5 ){
        data[i] = 1;
      }
    }
    if  ( black == 4 && generation > 11 ){
      data[i] = 9;
    }
    if  ( data[i] == 1 && water == 1 && generation > 10 && trees > 1  ){
      data[i] = 6;
    }
    else if  ( data[i] == 1 && water > 0 && generation > 10 ){
      data[i] = 5;
    }
    if  ( nodes == 4 && generation > 10 ){
      data[i] = random(2,9);
    }
    }
    generation += 1;
}

function generate( id_check, id_swap, rate){
  for ( i = 0; i < limit; i ++ ){
    var n = Math.random();
    if ( data[i] == id_check && n < rate ){
    data[i] = id_swap;
    }
  }
}

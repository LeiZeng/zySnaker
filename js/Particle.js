/**********************************************************
Particle: base element in the stage grid
method:
  move(v || [x,y])
  moveTo(pos)
**********************************************************/
(function() {
  'use strict';
  var Particle = window.Particle = zyGame.util.extend(zyGame.mth.base);
  var pool = window.pool = new Pool(config.stage.x, config.stage.y,config.stage.width, config.stage.height, config.particleSize);
  //init;
  Particle.prototype.onInit = function(x,y,c) {
    this.enabled=1;
    this.color = c;
    this.x = x;
    this.y = y;
    this.width = this.height = config.particleSize;
    pool.add(this);
  };
  /***************************** Method *****************************/
  // moveTo
  Particle.prototype.moveTo = function(point) {
    pool.move(this,point);
    this.setLocation(point.x, point.y);
    return this;
  };
  // move
  Particle.prototype.move = function(v) {
    var x,y,
        d = {},
        newx,newy,pos;
    // different paragrams of vector or point
    if(Object.prototype.toString.call(v) == "[object Array]"){
      d.x = v[0]/(Math.abs(v[0]) || 1);
      d.y = v[1](Math.abs(v[1]) || 1);
    }else{
      d.x = v.x/(Math.abs(v.x) || 1);
      d.y = v.y/(Math.abs(v.y) || 1);
    }
    newx = this.x + d.x * this.width;
    newy = this.y + d.y * this.height;
    // put back if it out of screen with
    if(newx >= pool.width + pool.x){
      x = pool.x;
    }else if(newx < pool.x){
      x = pool.x + pool.width + d.x * this.width;
    }else{
      x = newx;
    }

    if(newy >= pool.height + pool.y){
      y = pool.y;
    }else if(newy < pool.y){
      y = pool.y + pool.height + d.y * this.height;
    }else{
      y = newy;
    }
    pos = pool.parsePos({x:x, y:y});
    // if on crash
    try{
      if(this.isTaken(pos)){
        if(this.parent.crash){
          this.parent.crash(pool.getGroup(pos));
        }
      }
    }catch(e){}
    return this.moveTo({x:x, y:y});
  };
  Particle.prototype.isTaken = function(v) {
    return pool.isTaken(v);
  };
  // distroy
  Particle.prototype.distroy = function() {
    pool.del(this);
  };

  /***************************** Event *****************************/
  // onShow
  Particle.prototype.onShow = function() {
  };
  //onDraw
  Particle.prototype.onDraw = function() {
    zyGame.draw.rect(this.color,this.x,this.y,this.width,this.height);
  };
  // onClick
  Particle.prototype.click=function(){
    if (this.enabled==1){
      if (typeof(this.onClick)=='function'){
        this.onClick();
      }
    }
  };
  return Particle;
}).call(this);
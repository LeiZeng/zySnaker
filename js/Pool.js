(function() {
  'use strict'
  window.Pool = function Pool(x, y, width, height, size) {
    this.pool = [];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.size = size;
    this.poolW = parseInt(config.stage.width/size,10);
    this.poolH = parseInt(config.stage.height/size,10);
    for (var i = 0; i < this.poolW; i++) {
      this.pool[i] = [];
      for (var j = 0; j < this.poolH; j++) {
        this.pool[i][j] = [];
      }
    }
  };
  Pool.prototype.parsePos = function(point) {
    var pos = {
      x:0,
      y:0
    };
    pos.x = parseInt((point.x-this.x)/this.size,10)%this.poolW;
    pos.y = parseInt((point.y-this.y)/this.size,10)%this.poolH;
    if(pos.x<0||pos.x>this.poolW||pos.y<0||pos.y>this.poolH){
      console.log(point,pos)
    }
    return pos;
  };
  Pool.prototype.isTaken = function(pos) {
    var here = this.pool[pos.x][pos.y];
    if(here.length>0){
      return true;
    }
    return false;
  };
  Pool.prototype.isExist = function(obj) {
    var here = this.pool[obj.pos.x][obj.pos.y];
    if(here && here.length>0 && here.indexOf(obj)>-1){
      return true;
    }else if(!here){
      console.log(obj,this)
    }
    return false;
  };
  Pool.prototype.getParticles = function(pos) {
    if(pos && pos.x && pos.y){
      return this.pool[pos.x][pos.y];
    }
  };
  Pool.prototype.getGroup = function(pos) {
    var ps = this.getParticles(pos),
        gs = [];
    
    for (var i = 0; i < ps.length; i++) {
      if(ps[i]&&ps[i].parent){
        gs.push(ps[i].parent);
      }
    }
    return gs;
  };
  // util functions
  var getGridSize = function(s) {
    return parseInt(s/config.particleSize, 10)*config.particleSize;
  };
  Pool.prototype.getRandomPosition = function() {
    var point = {
      x: this.x + getGridSize(Math.random()*(config.stage.width - config.particleSize*2) + config.particleSize),
      y: this.y + getGridSize(Math.random()*(config.stage.height - config.particleSize*2) + config.particleSize)
    };
    if(this.getGroup(this.parsePos(point)).length>0){
      return this.getRandomPosition();
    }else{
      return point;
    }
  };
  Pool.prototype.add = function(obj, point) {
    var here;
    if(!point || !(point.x || point.y)){
      point = point || {};
      point.x = obj.x;
      point.y = obj.y;
    }
    obj.pos = this.parsePos(point);
    here = this.pool[obj.pos.x][obj.pos.y];
    if(!this.isExist(obj)){
      here.push(obj);
      return true;
    }else{
      return false;
    }
  };
  // distroy
  Pool.prototype.del = function(obj) {
    var index = this.pool[obj.pos.x][obj.pos.y].indexOf(obj);
    if(index>-1){
      return this.pool[obj.pos.x][obj.pos.y].splice(index,1);
    }else{
      return null;
    }
  };
  Pool.prototype.move = function(obj, point) {
    if(obj && point && obj.x == point.x && obj.y == point.y){
      return;
    }
    this.del(obj);
    this.add(obj, point);
  };
}).call(this);
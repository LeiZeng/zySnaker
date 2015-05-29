/**********************************************************
Snake: snake in the stage

method:
  play()
  stop()
  move()
**********************************************************/
;(function() {
  'use strict';
  var Snake = window.Snake = zyGame.util.extend(Group);
  var vector = {
    left: [-1,0],
    right: [1,0],
    up: [0,-1],
    down: [0,1]
  };
  //init;
  Snake.prototype.onInit = function(x,y,c,plist) {
    this.grouptype = 'snake';
    this.loop = 1;
    this.speedLvl = 0;
    this.speed = 150;
    this.playing = 0;
    this.direction = vector.right;

    this.enabled = 1;
    this.increaseLen = 0;
    if(!plist){
      this.increase(3);
    }
  };
  /***************************** Method *****************************/
  // move
  Snake.prototype.increase = function(len) {
    this.increaseLen = len;
  };

  Snake.prototype.move = function() {
    var head,newHead;
    if(this.object.obj.length>0){
      head = this.object.obj[0];
      if(this.increaseLen > 0){
        newHead = new Particle(head.x, head.y, this.color);
        newHead.parent = this;
        newHead.visible = true;
        this.length += 1;
        this.increaseLen -= 1;
      }else{
        newHead = this.object.obj.pop();
        if(this.object.obj.length !== 1){
          newHead.moveTo({
            x: head.x,
            y: head.y
          });
        }
      }
      newHead.move({
        x: this.direction[0],
        y: this.direction[1]
      });
      this.object.obj.unshift(newHead);
    }
  };
  Snake.prototype.crash = function(targets) {
    console.log('on crash');
    if(this.onCrash){
      this.onCrash(targets);
    }
  };
  Snake.prototype.directionValid = function(vector) {
    var d = this.direction,
        p = [],
        v = toDirection(vector);
    p[0] = Math.abs(d[0]);
    p[1] = Math.abs(d[1]);
    v[0] = Math.abs(v[0]);
    v[1] = Math.abs(v[1]);
    if(p[0] === v[0] && p[1] === v[1]){
      return false;
    }else{
      return true;
    }
  };
  Snake.prototype.directionParse = function(vector) {
    var d = this.direction,
        v = toDirection(vector),
        res = [];
    if(isDirection(v)){
      return v;
    }
    res[0] = d[0] - v[0];
    res[1] = d[1] - v[1];
    for (var i = 0; i < res.length; i++) {
      if(res[i]>1||res[i]<-1){
        res[i] = 0;
      }
    }
    return res;
  };
  // turn to another direction
  for(var key in vector){
    Snake.prototype['move'+ key] = (function(v) {
      return function() {
        if(this.directionValid(vector[v])){
          this.direction = this.directionParse(vector[v]);
        }
      };
    })(key);
  }
  Snake.prototype.turn = function(vector) {
    if(this.directionValid(vector)){
      this.direction = this.directionParse(vector);
    }
  };
  //set loop
  Snake.prototype.setLoop=function(loop){
    this.loop=loop;
  };
  //set speed
  Snake.prototype.setSpeed=function(speed){
    this.speed = speed;
    if (this.playing==1){
      this.stop();
      this.play();
    }
  };
  Snake.prototype.setSpeedLvl = function(lvl) {
    var speed = 150;
    if(lvl>=0){
      this.speedLvl = lvl;
      for (var i = 0; i < lvl; i++) {
        speed = speed * 0.9;
      }
      this.setSpeed(speed);
    }
  };
  Snake.prototype.speedUp = function() {
    this.setSpeedLvl(this.speedLvl+1);
  };
  //start
  Snake.prototype.play=function(){
    var o = this;
    o.playing=1;
    o.timer=zyGame.timer.createTimer(this.speed);
    o.timer.tick=function(){
      o.move();
    };
    o.timer.on();
  };
  //stop
  Snake.prototype.stop=function(){
    this.playing=0;
    this.timer.off();
  };
  function isDirection (v) {
    if((v[0]||v[1]) && !(v[0]*v[1])){
      return true;
    }
    return false;
  }
  function toDirection (v) {
    var d = [];
    d[0] = v[0]/(Math.abs(v[0])||1);
    d[1] = v[1]/(Math.abs(v[1])||1);
    return d;
  }
  /***************************** Event *****************************/
  //onDraw
  return Snake;
}).call(this);
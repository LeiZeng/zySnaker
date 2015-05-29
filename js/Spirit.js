/**********************************************************
Spirit: spirit in the stage, group of particles
method:
  init(particleList || [head, length [, direction]])
  show()
  hide()
**********************************************************/
;(function() {
'use strict';
var Spirit = window.Spirit = zyGame.util.extend(zyGame.mth.base);
// use pool to save all the particle shown

var vector = {
  left: [-1,0],
  right: [1,0],
  up: [0,-1],
  down: [0,1]
};
//init;
Spirit.prototype.onInit = function(x,y,c,plist) {
  // this.setSrcRect(0,0,'','');
  this.loop=1;
  this.speed=100;
  this.playing=0;
  this.direction = vector.right;

  this.enabled = 1;
  this.increaseLen = 0;
  this.x = this.y = this.offsetX = this.offsetY = 0;
  this.width = zyGame.width;
  this.height = zyGame.height;
  this.color = c;
  this.object = new zyGame.cls.object();
  if(plist){
    for (var i = 0; i < plist.length; i++) {
      this.object.add(plist[i]);
    }
    this.length = plist.length || 0;
  }else{
    // place 1 particle by default, and random direction
    var head = new Particle(x,y,c);
    head.visible = true;
    this.object.add(head);
    this.length = 1;
    this.increase(3);
  }
};
/***************************** Method *****************************/
// move
Spirit.prototype.increase = function(len) {
  this.increaseLen = len;
};

Spirit.prototype.move = function() {
  var head,newHead;
  if(this.object.obj.length>0){
    head = this.object.obj[0];
    if(this.increaseLen > 0){
      newHead = new Particle(head.x, head.y, this.color);
      newHead.move({
        x: this.direction[0],
        y: this.direction[1]
      })
      newHead.visible = true;
      this.length += 1;
      this.increaseLen -= 1;
      this.object.obj.unshift(newHead);
    }else{
      if(this.object.obj.length === 1){
        head.move({
          x: this.direction[0],
          y: this.direction[1]
        });
      }else{
        newHead = this.object.obj.pop();
        newHead
        .moveTo({
          x: head.x,
          y: head.y
        })
        .move({
          x: this.direction[0],
          y: this.direction[1]
        });
        this.object.obj.unshift(newHead);
      }
    }
  }
  // this.object.draw();
};

// turn to another direction
for(var key in vector){
  Spirit.prototype['move'+ key] = (function(v) {
    return function() {
      this.direction = vector[v];
    };
  })(key);
}

//set loop
Spirit.prototype.setLoop=function(loop){
  this.loop=loop;
};
//set speed
Spirit.prototype.setSpeed=function(speed){
  this.speed=speed;
  if (this.playing==1){
    this.stop();
    this.play();
  }
};
//start
Spirit.prototype.play=function(){
  var o = this;
  o.playing=1;
  o.timer=zyGame.timer.createTimer(this.speed);
  o.timer.tick=function(){
    o.move();
  };
  o.timer.on();
};
//stop
Spirit.prototype.stop=function(){
  this.playing=0;
  this.timer.off();
};
/***************************** Event *****************************/
//onDraw
Spirit.prototype.onDraw = function() {
  this.object.draw();
};
return Spirit;
}).call(this);
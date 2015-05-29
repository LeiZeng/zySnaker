/**********************************************************
Group: spirit in the stage, group of particles
method:
  new Group(x,y,c,plist)
  show()
  hide()
  //increase(len)
  //reduce(len)
  add(group)
**********************************************************/
(function() {
  'use strict';
  var Group = window.Group = zyGame.util.extend(zyGame.mth.base);
  //init;
  Group.prototype.onInit = function(x,y,c,plist) {
    var pos;
    this.enabled = 1;
    this.x = 0;
    this.y = 0;
    this.color = c;
    this.offsetX = this.offsetY = 0;
    this.width = this.height = 0;
    this.zindex = 90;
    this.object = new zyGame.cls.object();
    if(plist){
      // push the particles list
      for (var i = 0; i < plist.length; i++) {
        this.object.add(plist[i]);
      }
      this.length = plist.length || 0;
    }else{
      // place 1 particle by default, and random direction
      pos = new Particle(x,y,c);
      pos.visible = true;
      this.object.add(pos);
      this.length = 1;
    }
  };
  // distroy
  Group.prototype.distroy = function() {
    for (var i = 0; i < this.object.obj.length; i++) {
      var p = this.object.obj[i];
      p.distroy();
      this.object.del(p);
    }
  };
  /***************************** Method *****************************/

  /***************************** Event *****************************/
  //onDraw
  // Group.prototype.onDraw = function() {
  //   this.object.draw();
  // };  

  //onClick
  Group.prototype.click=function(){
    if (this.enabled==1){
      if (typeof(this.onClick)=='function'){
        this.onClick();
      }
    }
  };
  return Group;
}).call(this);
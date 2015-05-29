/**********************************************************
Rect: Draw a rectagle on the stage
**********************************************************/
(function() {
'use strict';
var Rect = window.Rect = zyGame.util.extend(zyGame.mth.base);

//onInit;
Rect.prototype.onInit = function(x,y,w,h,c) {
  this.enabled=1;
  this.color = c;
};
/***************************** Method *****************************/


/***************************** Event *****************************/
//onDraw
Rect.prototype.onDraw = function() {
  zyGame.draw.rect(this.color,this.x,this.y,this.width,this.height);
};
// click event
Rect.prototype.click=function(){
  if (this.enabled==1){
    if (typeof(this.onClick)=='function'){
      this.onClick.apply(this, arguments);
    }
  }
};
return Rect;
}).call(this);
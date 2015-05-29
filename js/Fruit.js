/**********************************************************
Fruit: base element in the stage grid
**********************************************************/
(function() {
  'use strict';
  var Fruit = window.Fruit = zyGame.util.extend(Group);

  //init;
  Fruit.prototype.onInit = function(x,y,c) {
    this.grouptype = 'fruit';
    this.enabled=1;
  };
  /***************************** Method *****************************/

  /***************************** Event *****************************/
  // click event
  // Fruit.prototype.click=function(){
  //   if (this.enabled==1){
  //     if (typeof(this.onClick)=='function'){
  //       this.onClick();
  //     }
  //   }
  // };
  return Fruit;
}).call(this);
;(function() {
  'use strict';

  //game start
  function start () {
    stage.fps = stage.fps || new zyGame.plg.fps(10,8);
    stage.fps.zindex = 999;
    stage.fps.show();

    stage.home();
  };

  zyGame.setConfig({start: start});
  // event listener
  window.onkeydown = function(e) {
    var keyCode = e.keyCode,
        snake = stage.spirits.snake;
    if(stage.on){
      if(keyCode == 87 || keyCode == 38){
          snake.moveup();
      }else if(keyCode == 83 || keyCode == 40){
          snake.movedown();      
      }else if(keyCode == 65 || keyCode == 37){
          snake.moveleft();      
      }else if(keyCode == 68 || keyCode == 39){
          snake.moveright();      
      }
    }
  };
}).call(this);
/**********************************************************
Stage: spirit in the stage, base behavior
**********************************************************/
;(function() {
  'use strict';
  // stage cacha
  var stage = window.stage = {
    name: 'stage 1',
    index: 0,
    score: 0,
    timeline: new zyGame.cls.timer(),
    spirits: {}
  };

  // draw background
  var Background = zyGame.util.extend(Rect);
  Background.prototype.onInit = function() {
    this.zindex = 10;
  };
  Background.prototype.onClick = function(x,y) {
    var snake,snakeHeadPos,
        subx,suby;
    try{
      snake = stage.spirits.snake;
      snakeHeadPos = snake.object.obj[0];
      subx = snakeHeadPos.x - x;
      suby = snakeHeadPos.y -y;
      snake.turn([subx,suby]);
    } catch(err){
      console.log(err)
    }
  };
  // add click event handler
  // Fruit.prototype.onClick = function() {
  //   stage.spirits.createFruit();
  //   stage.spirits.removeFruit(this);
  // };

  // util functions
  stage.spirits.getGridSize = function(s) {
    return parseInt(s/config.particleSize, 10)*config.particleSize;
  };
  stage.spirits.randomPosition = function() {
    return pool.getRandomPosition();
  };
  stage.spirits.createAFruit = function() {
    var pos = this.randomPosition(),
        newFruit = new Fruit(pos.x, pos.y, config.fruitColor);
    this.fruits = this.fruits || [];
    newFruit.show();
    this.fruits.push(newFruit);
  };
  // public functions
  stage.spirits.createFruit = function(n) {
    if(n){
      for (var i = 0; i < n; i++) {
        this.createAFruit()
      }
    }else{
      this.createAFruit();
    }
  };
  stage.spirits.removeFruit = function(fruit) {
    delete stage.spirits.fruits.splice(stage.spirits.fruits.indexOf(fruit),1);
    fruit.distroy();
    zyGame.object.del(fruit);
  };
  stage.spirits.removeAllFruit = function() {
    for (var i = 0; i < this.fruits.length; i++) {
      this.removeFruit(this.fruits[i])
    }
  };
  stage.spirits.createSnake = function() {
    var pos = {
          x: this.getGridSize(zyGame.width/2),
          y: this.getGridSize(zyGame.height/2)
        };
    this.snake = new Snake(pos.x, pos.y, '#000000');
    this.snake.show();
    stage.spirits.snake.onCrash = function(targets) {
      for (var i = 0; i < targets.length; i++) {
        if(targets[i]){
          if(targets[i].grouptype=='fruit'){
            // gain on the fruit
            stage.score += 1;
            stage.spirits.removeFruit(targets[i]);
            stage.spirits.createFruit();
            stage.spirits.snake.increase(1);
            stage.spirits.snake.speedUp();
            stage.GradeScore.setText('SCORE:'+stage.score);
            stage.GradeScore.show();
            // win the game
            // if(stage.spirits.snake.length>=stage.snakeMaxLength){
            //   stage.stop('You Win! Your Score:' + stage.score + '!');
            // }
          }else if(targets[i].grouptype=='snake'){
            // crash on snake itself
            stage.stop();
          }else if(targets[i].grouptype=='wall'){
            // crash on the wall
            stage.stop();
          }else{
            // unknown crash
          }
        }
      };
    };
  };
  stage.spirits.init = function() {
    stage.startBtn = stage.startBtn || new zyGame.cls.button(120,300,100,50);
    stage.startBtn.text.setText('Start');
    stage.startBtn.src = [''];
    stage.startBtn.onClick = function() {
      stage.startBtn.hide();
      stage.start(true);
    };
    stage.GradeShow = stage.GradeShow || new zyGame.cls.text(80,8);
    stage.GradeShow.setText('TIME:'+stage.time);
    stage.GradeShow.zindex = 100;

    stage.GradeScore = stage.GradeScore || new zyGame.cls.text(160,8);
    stage.GradeScore.setText('SCORE:'+stage.score);
    stage.GradeScore.zindex = 100;

    stage.helpText = stage.helpText || new zyGame.cls.text(2,456);
    stage.helpText.setText('use your mouse or "w/a/s/d" and "↑↓→←" on the keyboard!');
    stage.helpText.zindex = 100;
  };
  stage.stop = function(msg) {
    stage.on = false;
    stage.popup.setText(msg || ('Game Over! Your Score:' + stage.score + '!'));
    stage.popup.show();
    stage.startBtn.show();
    stage.spirits.snake.stop();
    config.timeline.trim.off();
  };
  stage.gameOver = function() {

  };
  stage.gradeUp = function() {

  };
  config.timeline.trim.tick = function() {
    stage.time+=1;
    stage.GradeShow.setText('TIME:'+stage.time);
    stage.GradeShow.show();
    // if(stage.time<=0){
    //   stage.stop('Time\'s up, Your Score:' + stage.score + '!');
    // }
  };
  stage.init = function() {
    // background for whole game
    stage.globalbackground = stage.globalbackground ||new Rect(0,0,zyGame.width,zyGame.height,config.bgColor);
    stage.globalbackground.show();
    // background for the stage
    stage.background = stage.background ||new Background(config.stage.x,config.stage.y,config.stage.width,config.stage.height,config.stage.color);

    stage.popup = stage.popup || new zyGame.cls.text(100,200);
    stage.popup.setText('Enjoy This Snaker!');
    stage.popup.zindex = 100;

    stage.startBtn = stage.startBtn || new zyGame.cls.button(140,300,100,50);
    stage.startBtn.src = [''];
    stage.startBtn.state = 0;
    stage.startBtn.text.setText('Start');
    stage.startBtn.zindex = 200;
    stage.startBtn.onClick = function() {
      stage.startBtn.hide();
      stage.start(true);
    };
  };
  stage.getSprites = function() {
    var res = [];
    for (var i = 0; i < zyGame.object.obj.length; i++) {
      var g = zyGame.object.obj[i];
      if(g.grouptype){
        res.push(g);
      }
    }
    return res;
  };
  stage.clear = function() {
    for (var i = 0; i < zyGame.object.obj.length; i++) {
      var g = zyGame.object.obj[i];
      if(g.grouptype){
        g.distroy();
        zyGame.object.del(g);
      }
    }
    stage.spirits.snake = null;
    stage.spirits.fruits = [];
    stage.score = 0;
    stage.time = config.timeline.time;
    if(stage.getSprites().length>0){
      stage.clear();
    }
  };
  stage.home = function() {
    stage.init();
    stage.background.show();
    stage.popup.show();
    stage.startBtn.show();
  };
  stage.start = function(newGame) {
    stage.on = true;
    if(newGame){
      stage.clear();
      stage.spirits.init();
      stage.startBtn.hide();
      stage.popup.hide();
    }
    stage.snakeMaxLength = 8;

    stage.spirits.createFruit();
    stage.spirits.createSnake();
    stage.GradeShow.show();
    stage.GradeScore.show();
    stage.helpText.show();
    config.timeline.trim.on();

    stage.spirits.snake.play();
  };
  // Event
  return stage;
}).call(this);

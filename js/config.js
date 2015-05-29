;(function() {
  'use strict';

  //zyGame configuration
  zyGame.config={
    title: 
      //游戏标题
      '贪吃蛇',
    width: 
      //游戏区域宽(若全屏显示,则为最小宽度)
      320,
    height: 
      //游戏区域高(若全屏显示,则为最小高度)
      480,
    fullscreen: 
      //0为非全屏，1为全屏
      0,
    fpslimit: 
      //最高刷新上限(建议使用默认值)
      60,
    src:
      /*
      需预先加载的资源文件
        图片文件支持jpg,png格式,放在目录img下
        声音文件支持mp3格式,放在目录aud下
        视频文件支持mp4格式,放在目录vid下
        如果有子目录,写上相对路径即可
      */
      [],
    start:
      //引擎加载完成,调用该函数开始游戏
      function() {}
  };

  zyGame.setConfig(zyGame.config);

  //global configuration
  window.config = {
    //背景色
    bgColor: '#008800',
    gridOn: true,
    particleSize: 10,
    //创建时间记录对象
    timeline:{
      time: 0,  //初始显示时间为0
      trim:zyGame.timer.createTimer(1000)//创建记录时间轴
    },
    stage: {
      x: 0,
      y: 30,
      width: zyGame.config.width,
      height: zyGame.config.height - 60,
      color: '#5BFC6E'
    },
    fruitColor: '#008888'
  };
}).call(this);
/*******************************************************************************************
# zyGame引擎 #
  * 声明:
    * 不得擅自修改本引擎代码、注释等内容
    * 非经书面许可，不得使用本引擎开发商业化产品
  * 适合游戏类型：基于html5-canvas的2d、2.5d贴图游戏
  * 引擎设计目标：为游戏开发者提供，一种面向控件编写游戏的框架，提供丰富的控件类及通用方法
  * 网址: 17h5.com
  * 信箱: 176206@qq.com
  * QQ群: 194563450
*******************************************************************************************/

//声明
var zyGame={
	//DOM
	doc:{},//window.document
	body:{},//window.document.body
	cvs:{},//window.document.getElementsByTagName('canvas')[0];
	ctx:{},//window.document.getElementsByTagName('canvas')[0].getContext('2d');

	//对象库
	mth:{},//方法库(method)
	cls:{},//基础类(class)
	plg:{},//插件类(plug-in)
	src:{img:{},aud:{},vid:{},dat:{}},//资源对象

	//专用对象
	env:{},//环境变量(envionment variables)
	con:{}//用户设置(config)
};
/************************** 环境变量 **************************/
zyGame.env={
	'name':'zyGame',
	'version':'1.0.0a',
	'thisStack':[],//用于创建对象时，暂存父对象的引用，以便于设置子对象的parent属性
	'eventList':['onInit','onInited','onShow','onHide','beforeDraw','onDraw','afterDraw'],//事件列表
	'device':{'clientWidth':0,'clientHeight':0},//设备信息
};
/************************** 配置信息 **************************/
zyGame.con={
	'server':'',//服务器地址
	'title':zyGame.env.name+'_'+zyGame.env.version,//标题
	'width':640,//宽
	'height':640,//高
	'scaleX':1,//缩放比例-宽
	'scaleY':1,//缩放比例-高
	'fullscreen':0,//是否全屏显示
	'fpslimit':60,//刷新率(fps)上限值
	'src':[],//预加载资源列表
	'start':''//加载完成回调，即游戏开始
};
/************************** 可调方法 **************************/
//默认游戏入口，用于显示引擎状态是否正常
zyGame.onStart=function(){
	zyGame.txtTip=new zyGame.cls.text(320,295);
	zyGame.txtTip.align='center';
	zyGame.txtTip.setText('Powered by zyGame.js');
	zyGame.txtTip.setFont('黑体','50px','#ffffff');
	zyGame.txtTip.show();
};
//设置配置信息
zyGame.setConfig=function(config){
	this.util.copy(this.con,config);
};
//设置标题
zyGame.setTitle=function(t){
	this.doc.title=t;
};
//设置位置(左,上)
zyGame.setLocation=function(x,y){
	this.x=x;
	this.y=y;
};
//满屏显示
zyGame.fullscreen={fs:0};
zyGame.fullscreen.on=function(){
	this.fs=1;
	zyGame.resize();
};
zyGame.fullscreen.off=function(){
	zyGame.setSize(zyGame.config.width,zyGame.config.height);
};
//设置最小尺寸(宽,高)
zyGame.setMinSize=function(w,h){
	this.minWidth=w;
	this.minHeight=h;
};
//设置游戏尺寸(宽,高)
zyGame.setSize=function(w,h){
	this.width=w;
	this.height=h;
	this.fullscreen.fs=0;
	this.resize();
};
//重置游戏尺寸(宽,高)
zyGame.resize=function(){
	if (this.fullscreen.fs==1){
		this.body.style.margin=0;
		//这里this.body.clientWidth存在浏览器的兼容问题
		this.width=(this.body.clientWidth<this.minWidth ? this.minWidth : this.body.clientWidth);
		this.height=(this.body.clientHeight<this.minHeight ? this.minHeight : this.body.clientHeight);
	}else{
		this.body.style.margin=this.con.bodymargin;
	}
	this.object.resize(this.cvs.width,this.cvs.height,this.width,this.height);
 	this.cvs.width=this.width;
	this.cvs.height=this.height;
};
//对canvas进行css定义缩放
zyGame.scale=function(w,h){
	this.cvs.style.width=w+'px';
	this.cvs.style.height=h+'px';
	this.con.scaleX=w/this.con.width;
	this.con.scaleY=h/this.con.height;
};
//设置fps上限
zyGame.setFpsLimit=function(fpslimit){
	if (arguments.length==0){
		fpslimit=zyGame.con.fpslimit;
	}
	zyGame.timer.interval=Math.ceil(1000/fpslimit);
};
//得到游戏运行时长(返回格式化的时间)
zyGame.getRunTime=function(){
	return zyGame.util.formatTime(Date.now()-zyGame.timer.startTime);
};
//得到游戏大小(返回一个数组[宽,高])
zyGame.getSize=function(){
	return [zyGame.width,zyGame.height];
};
/************************** 触屏相关 **************************/
/*
//viewport设置
zyGame.setViewport=function(){
	if (this.con.width/(this.con.height)<this.doc.documentElement.clientWidth/this.doc.documentElement.clientHeight){
		var viewportWidth=(this.con.height)*this.doc.documentElement.clientWidth/this.doc.documentElement.clientHeight;
	}else{
		var viewportWidth=this.con.width;
	}
	if (this.doc.documentElement.clientWidth!=this.env.device['clientWidth']){
		viewportWidth=this.env.device['clientWidth']*this.env.device['screenWidth']/this.env.device['screenHeight'];
	}
	alert(
		this.doc.documentElement.clientWidth+','+this.doc.documentElement.clientHeight+'-'+viewportWidth+'\n\r'+
		this.env.device['screenWidth']+','+this.env.device['screenHeight']
	);
	this.doc.getElementsByName('viewport')[0].content='width='+viewportWidth+',user-scalable=0';
};
*/




/**********************************************************
类型模块
**********************************************************/

zyGame.type={};

//坐标点类型
zyGame.type.point=function(x,y){
	this.x = x;
	this.y = y;
};
//字体类型
zyGame.type.font=function(){
	this.style   = 'normal';
	this.variant = 'normal';
	this.weight  = 'normal';
	this.size    = '12px';
	this.family  = 'Sans-serif';
};
//线框类型
zyGame.type.stroke=function(){
};
//阴影类型
zyGame.type.shadow=function(){
};
//矩形区域
zyGame.type.rect=function(){};
zyGame.type.rect.prototype.test=function(){
};
//矩阵
zyGame.type.matrix=function(){
	this.value=[];
};










/**********************************************************
通用计算模块
**********************************************************/

zyGame.util={};

//继承(父类)
zyGame.util.extend=function(parent){
	var child=function(){
		this.init.apply(this,arguments);
	};
	var proto=(typeof(parent)=='function'?parent.prototype:parent);
	for (var i in proto){
		child.prototype[i]=proto[i];
	}
	child.prototype.classList=child.prototype.classList.concat();
	child.prototype.classList.push(child);
 	for (var i in zyGame.env.eventList){//删除事件(事件不能承继)
		delete child.prototype[zyGame.env.eventList[i]];
	}
	return child;
};

//复制(目标对象,源对象)-仅是表层复制，深层则是引用
zyGame.util.copy=function(target,src){
	for (var i in src){
		if (typeof(src)=='function'){
			if (typeof(target)=='function'){
				target.prototype[i]=src.prototype[i];
			}else{
				target[i]=src.prototype[i];
			}
		}else{
			if (typeof(target)=='function'){
				target.prototype[i]=src[i];
			}else{
				target[i]=src[i];
			}
		}
	}
};
/******************************************* 用户可调用 ************************************/
//判断一点是否在矩形区域内
zyGame.util.isInRect=function(a,b,x,y,w,h){
	if (a>=x && b>=y && a<=(x+w) && b<=(y+h)){
		return 1;
	}
	return 0;
};

//返回用指定分隔符将对象元素连接成的字符串
zyGame.util.join=function(o,s){
	var a=[];
	var i=0;

	for (var e in o){
		a[i]=o[e];
		i++;
	}
	return a.join(s);
};

//返回一对象数组中指定元素组成的数组(对象数组,指定元素)
zyGame.util.valueArray=function(list,key){
	var a=[];
	for (var i in list){
		a.push(list[i][key]);
	}
	return a;
};

//返回由毫秒数，格式化得到的形如[天,小时,分钟,秒,毫秒]的数组
zyGame.util.formatTime=function(t){
	var a=[0,0,0,0,0];

	a[4]=t%1000;
	a[3]=parseInt(t/1000);
	if (a[3]>=60){
		a[2]=parseInt(a[3]/60);
		a[3]=a[3]%60;
		if (a[2]>=60){
			a[1]=parseInt(a[2]/60);
			a[2]=a[2]%60;
			if (a[1]>=24){
				a[0]=parseInt(a[1]/24);
				a[1]=a[1]%24;
			}
		}
	}
	return a;
};

//得到一个随机整数(下限，上限)
zyGame.util.rnd=function(floor,ceil){
	if (typeof(ceil)=='undefined'){
		var ceil=floor;
		floor=0;
	}
	return floor+Math.floor(Math.random()*(ceil-floor+1));
};

//判断元素是否在数组中，如果存在返回元素位置，不存返回-1,参数(array,value)
zyGame.util.inArray=function(arr,value){
	for (var i in arr){
		if (value==arr[i]){
			return i;
		}
	}
	return -1;
};

//返回指定长度字符串(数字,长度,补截[0-前 1-后],补充用符)
zyGame.util.fixLength=function(i,length,b,s){
	i=i+'';
	if (arguments.length<3){
		b=0;
	}
	if (arguments.length<4){
		s='0';
	}
	while (i.length<length){
		if (b==0){
			i=s+i;
		}else{
			i=i+s;
		}
	}
	if (i.length>length){
		if (b==0){
			i=i.slice(-length);
		}else{
			i=i.slice(0,length);
		}
	}
	return i;
};

//把数字格式化为千分符表示方式(数字,千分符[0-没有,1-有],小数长度)
zyGame.util.formatNumber=function(number,s,decimal){
	if (arguments.length<2){
		s=1;
	}
	if (arguments.length<3){
		decimal=-1;
	}

	if (decimal>-1){
		number=parseFloat(number).toFixed(decimal);
	}
	if (s==1){
		var a=number.toString().split('.');
		var n=a[0];//整数部分
		var d='';//小数部分
		if (typeof(a[1])!='undefined'){
			d='.'+a[1];
		}
		a=[];
		while (n.length>3){
			a.unshift(n.slice(-3));
			n=n.slice(0,n.length-3);
		}
		if (n.length>0){
			a.unshift(n);
		}
		number=a.join()+d;
	}
	return number;
};


//一维数组转成二维数组(数组,第n个元素开始,长度,保留尾部[0-不保留,1-保留])
zyGame.util.twoArray=function(arr,n,len,s){
	if (arguments.length<4){
		s=0;
	}
	var a=[];
	var l=parseInt((arr.length-n)/len)+s;
	for (var i=0;i<l;i++){
		a.push(arr.slice(i*len+n,(i+1)*len+n));
	}
	return a;
};

//把一个值四舍五入为范围内的整数(值,下限,上限)
zyGame.util.fixValue=function(value,floor,ceil){
	value=Math.round(value);
	if (value<floor){
		value=floor;
	}else if (value>ceil){
		value=ceil;
	}
	return value;
};

//返回对象中第一个等于给定值的key(不存在，则返回undefined)
zyGame.util.getKey=function(obj,value){
	for (var i in obj){
		if (obj[i]==value){
			return i;
		}
	}
};

//得到一个网格坐标数组(行数,列数,[行值,列值])
zyGame.util.getGrid=function(rows,cols,rowValue,colValue){
	if (typeof(rowValue)=='undefined'){
		var rowValue=1;
		var colValue=1;
	}
	if (typeof(colValue)=='undefined'){
		var colValue=rowValue;
	}
	var grid=[];
	for (var i=0;i<rows;i++){
		for (var j=0;j<cols;j++){
			grid[i*cols+j]={};
			grid[i*cols+j].y=i*rowValue;
			grid[i*cols+j].x=j*colValue;
		}
	}
	return grid;
};

//得到给定字符串的字节长度
zyGame.util.getByteLen=function(str){
	var byteLen=0;
	for (var i=0;i<str.length;i++){
		if (str.charCodeAt(i)>255){
			byteLen+=2;
		}else{
			byteLen++;
		}
	}
	return byteLen;
};

//得到给定数组中的最小值
zyGame.util.getMin=function(arr){
	if (typeof(arr)!='object'){
		var min=arguments[0];
		for (var i=1;i<arguments.length;i++){
			if (arguments[i]<min){
				min=arguments[i];
			}
		}
	}else{
		var min=arr[0];
		for (var i=1;i<arr.length;i++){
			if (arr[i]<min){
				min=arr[i];
			}
		}
	}
	return min;
};

//得到给定数组中的最大值
zyGame.util.getMax=function(arr){
	if (typeof(arr)!='object'){
		var max=arguments[0];
		for (var i=1;i<arguments.length;i++){
			if (arguments[i]>max){
				max=arguments[i];
			}
		}
	}else{
		var max=arr[0];
		for (var i=1;i<arr.length;i++){
			if (arr[i]>max){
				max=arr[i];
			}
		}
	}
	return max;
};









/**********************************************************
绘制(draw)模块
**********************************************************/

zyGame.draw={};

//保存绘图上下文
zyGame.draw.save=function(){
	zyGame.ctx.save();
};

//恢复绘图上下文
zyGame.draw.restore=function(){
	zyGame.ctx.restore();
};

//得到文本宽度
zyGame.draw.getTextWidth=function(t){
	return zyGame.ctx.measureText(t).width;
};

//得到一个填充对象
zyGame.draw.getPattern=function(src,r){
	return zyGame.ctx.createPattern(zyGame.src.img[src],r);
};

//设置文本样式
zyGame.draw.setTextStyle=function(font,align,valign,color){
	zyGame.ctx.font=zyGame.util.join(font,' ');
	zyGame.ctx.textAlign=align;
	zyGame.ctx.textBaseline=valign;
	zyGame.ctx.fillStyle=color;
};

//设置阴影样式
zyGame.draw.setShadowStyle=function(x,y,b,c){
	zyGame.ctx.shadowOffsetX=x;
	zyGame.ctx.shadowOffsetY=y;
	zyGame.ctx.shadowBlur=b;
	zyGame.ctx.shadowColor=c;
};

//设置线样式
zyGame.draw.setLineStyle=function(c,lw,lc){
	zyGame.ctx.strokeStyle=c;
	zyGame.ctx.lineWidth=lw;
	zyGame.ctx.lineCap=lc;
};

//清除矩形区域
zyGame.draw.clear=function(x,y,w,h){
	if (arguments.length==4){
		zyGame.ctx.clearRect(x,y,w,h);
	}else{
		zyGame.ctx.clearRect(0,0,zyGame.width,zyGame.height);
	}
};

//绘制一个图像
zyGame.draw.image=function(src,a1,a2,a3,a4,a5,a6,a7,a8){
	if (zyGame.src.img[src] instanceof Image){
		switch (arguments.length){
		case 3:
			zyGame.ctx.drawImage(zyGame.src.img[src],a1,a2);
			break;
		case 5:
			zyGame.ctx.drawImage(zyGame.src.img[src],a1,a2,a3,a4);
			break;
		case 9:
			zyGame.ctx.drawImage(zyGame.src.img[src],a1,a2,a3,a4,a5,a6,a7,a8);
			break;
		}
	}else{
		// console.log(src+' not Image');
	}
};

//绘制一个文本
zyGame.draw.text=function(t,x,y){
	zyGame.ctx.fillText(t,x,y);
};

//绘制一条线
zyGame.draw.line=function(x,y,w,h){
	zyGame.ctx.beginPath();
	zyGame.ctx.moveTo(x,y);
	zyGame.ctx.lineTo(x+w,y+h);
	zyGame.ctx.stroke();
};

//绘制一个矩形
zyGame.draw.rect=function(c,x,y,w,h){
	zyGame.ctx.fillStyle=c;
	zyGame.ctx.fillRect(x,y,w,h);
};

//绘制一个矩形边框
zyGame.draw.border=function(x,y,w,h){
	zyGame.ctx.strokeRect(x,y,w,h);
};

//绘制一个圆形
zyGame.draw.circle=function(x,y,r,c){
	zyGame.ctx.save();
	zyGame.ctx.beginPath();
	zyGame.ctx.arc(x,y,r,0,Math.PI*2,false);
	zyGame.ctx.fillStyle='rgb('+c+')';
	zyGame.ctx.fill();
	zyGame.ctx.restore();
};

//旋转
zyGame.draw.rotate=function(x,y,a){
	zyGame.ctx.translate(x,y);
	zyGame.ctx.rotate(a);
};








/**********************************************************
事件模块
**********************************************************/

zyGame.event={
	'mouseDown':[],	//鼠标down事件的对象存储栈
	'mouseDrap':{	//鼠标拖拽信息存储对象
		'sx':0,		//对象初始x值
		'sy':0,		//对象初始y值
		'mx':0,		//鼠标初始x值
		'my':0,		//鼠标初始y值
		'dx':0,		//鼠标拖拽后x值
		'dy':0,		//鼠标拖拽后y值
		'isDraped':0//是否发生了拖拽
	},
	'touchPoint':{'x':0,'y':0}//存储当前touch坐标点,用于mouseup事件中的返回值
};

//添加事件
zyGame.event.add=function(e){
	switch (e){
	case 'mousedown':
		zyGame.doc.onmousedown=this.onMousedown;
		break;
	case 'mouseup':
		zyGame.doc.onmouseup=this.onMouseup;
		break;
	case 'mousemove':
		zyGame.doc.onmousemove=this.onMousemove;
		break;
	case 'resize':
		zyGame.body.onresize=this.onResize;
		break;
 	case 'contextmenu':
		zyGame.doc.oncontextmenu=this.onContextmenu;
		break;
	case 'keydown':
		zyGame.doc.onkeydown=this.onKeydown;
		break;
	case 'keypress':
		zyGame.doc.onkeypress=this.onKeypress;
		break;
	//触屏事件
	case 'touchstart':
		zyGame.doc.ontouchstart=this.onTouchstart;
		break;
	case 'touchend':
		zyGame.doc.ontouchend=this.onTouchend;
		break;
	case 'touchmove':
		zyGame.doc.ontouchmove=this.onTouchmove;
		break;
	case 'touchcancel':
		zyGame.doc.ontouchcancel=this.onTouchcancel;
		break;
	case 'orientationchange':
		window.onorientationchange=this.onOrientationchange;
		break;
	}
};
//删除事件
zyGame.event.del=function(e){
	switch (e){
	case 'mousedown':
		zyGame.doc.onmousedown=null;
		break;
	case 'mouseup':
		zyGame.doc.onmouseup=null;
		break;
	case 'mousemove':
		zyGame.doc.onmousemove=null;
		break;
	case 'resize':
		zyGame.body.onresize=null;
		break;
	}
};
//屏蔽事件
zyGame.event.disable=function(e){
	switch (e){
	case 'contextmenu'://屏蔽右键菜单
		zyGame.doc.oncontextmenu=function(){return false;};
		break;
	case 'selectstart'://屏蔽选中功能
		zyGame.doc.onselectstart=function(){return false;};
		break;
	case 'touchstart'://屏蔽触屏事件
		zyGame.doc.ontouchstart=function(){return false;};
		break;
	case 'touchend'://屏蔽触屏事件
		zyGame.doc.ontouchend=function(){return false;};
		break;
	case 'touchmove'://屏蔽触屏事件
		zyGame.doc.ontouchmove=function(){return false;};
		break;
	}
};

/****************************** 通用事件 **************************************/
//重置大小
zyGame.event.onResize=function(){
	window.scrollTo(0,0);//滚动条置顶
	zyGame.resize();
};
//得到以cvs为基础的坐标
zyGame.event.mousePoint=function(event){
	if (event.hasOwnProperty('clientX')){
		var x=event.clientX-zyGame.cvs.getBoundingClientRect().left;
		var y=event.clientY-zyGame.cvs.getBoundingClientRect().top;
	}else{
		var x=event.pageX-zyGame.cvs.getBoundingClientRect().left;
		var y=event.pageY-zyGame.cvs.getBoundingClientRect().top;
	}
	x=x/zyGame.con.scaleX;
	y=y/zyGame.con.scaleY;
	return {'x':x,'y':y};
};
/****************************** 鼠标事件 **************************************/
//鼠标按下
zyGame.event.onMousedown=function(){
 	if (event.button==0){//0-左键，1-滚轮，2-右键
		var mouse=zyGame.event.mousePoint(event);
		zyGame.object.mousedown(mouse.x,mouse.y);
	}
};
//鼠标抬起
zyGame.event.onMouseup=function(){
	if (event.button==0){//0-左键，1-滚轮，2-右键
		var mouse=zyGame.event.mousePoint(event);
		zyGame.object.mouseup(mouse.x,mouse.y);
	}
};
//鼠标移动(拖拽事件)
zyGame.event.onMousemove=function(){
	for (var i=zyGame.event.mouseDown.length-1;i>=0;i--){
		var o=zyGame.event.mouseDown[i];
		var funcDrap='';
		if (typeof(o.drap)=='function'){
			funcDrap=o.drap;
		}else if (typeof(o.onDrap)=='function'){
			funcDrap=o.onDrap;
		}
		if (funcDrap!=''){
			var mouse=zyGame.event.mousePoint(event);
			var ox=mouse.x-o.x;
			var oy=mouse.y-o.y;
			//参数为(控件原x,控件原y,鼠标累计x,鼠标累计y,鼠标增量x,鼠标增量y)
			funcDrap.call(o,
				zyGame.event.mouseDrap['sx'],
				zyGame.event.mouseDrap['sy'],
				ox-zyGame.event.mouseDrap['mx'],
				oy-zyGame.event.mouseDrap['my'],
				ox-zyGame.event.mouseDrap['dx'],
				oy-zyGame.event.mouseDrap['dy']
			);
			zyGame.event.mouseDrap['dx']=ox;
			zyGame.event.mouseDrap['dy']=oy;
			zyGame.event.mouseDrap['isDraped']=1;
			break;
		}
	}
};
/************************** 触屏事件 **************************/
//触摸开始
zyGame.event.onTouchstart=function(){
	event.preventDefault();
	var mouse=zyGame.event.mousePoint(event);
	zyGame.event.touchPoint['x']=mouse.x;
	zyGame.event.touchPoint['y']=mouse.y;
	zyGame.object.mousedown(mouse.x,mouse.y);
};
//触摸结束
zyGame.event.onTouchend=function(){
	event.preventDefault();
	zyGame.object.mouseup(zyGame.event.touchPoint.x,zyGame.event.touchPoint.y);
};
//触摸取消
zyGame.event.onTouchcancel=function(){
	event.preventDefault();
	zyGame.event.mouseDown=[];
	zyGame.event.mouseDrap['isDraped']=0;
};
//触摸移动(拖拽事件)
zyGame.event.onTouchmove=function(){
	event.preventDefault();
	var mouse=zyGame.event.mousePoint(event);
	zyGame.event.touchPoint['x']=mouse.x;
	zyGame.event.touchPoint['y']=mouse.y;
	for (var i=zyGame.event.mouseDown.length-1;i>=0;i--){
		var o=zyGame.event.mouseDown[i];
		var funcDrap='';
		if (typeof(o.drap)=='function'){
			funcDrap=o.drap;
		}else if (typeof(o.onDrap)=='function'){
			funcDrap=o.onDrap;
		}
		if (funcDrap!=''){
			var ox=mouse.x-o.x;
			var oy=mouse.y-o.y;
			//参数为(控件原x,控件原y,鼠标累计x,鼠标累计y,鼠标增量x,鼠标增量y)
			funcDrap.call(o,
				zyGame.event.mouseDrap['sx'],
				zyGame.event.mouseDrap['sy'],
				ox-zyGame.event.mouseDrap['mx'],
				oy-zyGame.event.mouseDrap['my'],
				ox-zyGame.event.mouseDrap['dx'],
				oy-zyGame.event.mouseDrap['dy']
			);
			zyGame.event.mouseDrap['dx']=ox;
			zyGame.event.mouseDrap['dy']=oy;
			zyGame.event.mouseDrap['isDraped']=1;
			break;
		}
	}
};
//屏幕旋转
zyGame.event.onOrientationchange=function(){
	var sw=zyGame.con.width;
	var sh=zyGame.con.height;
	var cw=zyGame.doc.documentElement.clientWidth;
	var ch=zyGame.doc.documentElement.clientHeight;

	if (sw/sh<cw/ch){
		zyGame.scale(sw*ch/sh,ch);
	}else{
		zyGame.scale(cw,sh*cw/sw);
	}
};










/**********************************************************
定时器模块
**********************************************************/

zyGame.timer={
	obj : [],
	pool : [], //cls.timer池,省去其创建、销毁的开销，以提高性能
	interval : 17, //间隔单位毫秒，以控制fps的上限
	startTime : 0, //游戏开始时间
	enabled : 0
};

//开始
zyGame.timer.on=function(){
	if (this.enabled==0){
		this.enabled=1;
		if (this.startTime==0){
			this.startTime=Date.now();
		}
		this.tick();
	}
};

//停止
zyGame.timer.off=function(){
	if (this.enabled==1){
		this.enabled=0;
		clearTimeout(this.handle);
	}
};

//定时器函数
zyGame.timer.tick=function(){
	var _now=Date.now();

	//执行定时器tick
	for (var i in zyGame.timer.obj){
		var now=Date.now();
		var passTime=now-zyGame.timer.obj[i].lastTime;
		if (zyGame.timer.obj[i].model==0){//时间轴(跳帧)模式:保证在尽可能正确的时间,执行相应的变化效果
			if (passTime>=(zyGame.timer.obj[i].times+1)*zyGame.timer.obj[i].interval){
				zyGame.timer.obj[i].times=Math.round(passTime/zyGame.timer.obj[i].interval);
				zyGame.timer.obj[i].tick();
			}
		}else{//定时器(逐帧)模式:保证每一次变化都被执行,间隔时间尽可能相同
			if (passTime>=zyGame.timer.obj[i].interval){
				zyGame.timer.obj[i].lastTime=now;
				zyGame.timer.obj[i].times++;
				zyGame.timer.obj[i].tick();
			}
		}
	}

	//绘制对象
	zyGame.draw.clear();//清屏
	zyGame.object.draw();

	if (zyGame.timer.enabled==1){
		zyGame.timer.handle=setTimeout(zyGame.timer.tick,zyGame.timer.interval+_now-Date.now());//应延时长=间隔时长-代码执行时长
	}
};

/****************************** cls.timer池 *************************************/
zyGame.timer.createTimer=function(){
	if (this.pool.length>0){
		var timer=this.pool.pop();
		timer.released=0;
	}else{
		var timer=new zyGame.cls.timer();
	}
	if (arguments.length>0){
		timer.interval=arguments[0];
		if (arguments.length>1){
			timer.model=arguments[1];
		}
	}
	return timer;
};












/**********************************************************
加载模块
**********************************************************/

zyGame.load={
	'src':[],//要加载的资源列表
	'onLoad':function(){},//完成单个回调
	'onLoaded':function(){}//完成全部回调
};

//加载回调
zyGame.load.loaded=function(o){
	o.src.pop();
	o.onLoad();
	if (o.src.length==0){//加载完成
		o.onLoaded();
	}
};
//加载资源
zyGame.load.load=function(s,f){
	this.src=s;
	if (typeof(f)=='function'){
		this.onLoaded=f;
	}
	for (var i in s){
		switch (s[i].slice(-4)){
		case '.jpg':
		case '.png':
			this.loadimg(s[i]);
			break;
		case '.ogg':
		case '.mp3':
		case '.wav':
			this.loadaud(s[i]);
			break;
		case '.mp4':
			this.loadvid(s[i]);
			break;
		case '.dat':
			this.loaddat(s[i]);
		}
	}
/* 	//用于轮询音频/视频资源是否加载完成
	this.timer=zyGame.timer.createTimer(100);
	this.timer.owner=this;
	this.timer.tick=function(){//轮询音频/视频资源是否加载完成
		var o=this.owner;
		for (var i in o.aud){
			alert(o.aud[i].readyState);
			if (o.aud[i].readyState==4){
				o.aud.splice(i,1);
				o.loaded(o);
			}
		}
		for (var i in o.vid){
			if (o.vid[i].buffered.length>0){
				o.vid.splice(i,1);
				o.loaded(o);
			}
		}
		if (o.aud.length==0 && o.vid.length==0){
			this.off();
		}
	};
	this.timer.on(); */
};
//加载图像
zyGame.load.loadimg=function(s){
	var o=this;
	zyGame.src.img[s]=new Image();
	zyGame.src.img[s].onload=function(){
		o.loaded(o);
	};
	zyGame.src.img[s].src='img/'+s;
};
//加载声音
zyGame.load.loadaud=function(s){
	var o=this;
	zyGame.src.aud[s]=new Audio();
	zyGame.src.aud[s].addEventListener('canplaythrough', function(){//Win32利用canplaythrough事件，返回加载回调
		o.loaded(o);
	});
	if (zyGame.env.device['platform']=='iPad'){//iPad直接返回加载回调
		o.loaded(o);
	}
	zyGame.src.aud[s].src='aud/'+s;
};
//加载视频
zyGame.load.loadvid=function(s){
	var o=this;
	zyGame.src.vid[s]=new Video();
 	zyGame.src.vid[s].addEventListener('canplaythrough', function(){//Win32利用canplaythrough事件，返回加载回调
		o.loaded(o);
	});
	if (zyGame.env.device['platform']=='iPad'){//iPad直接返回加载回调
		o.loaded(o);
	}
	zyGame.src.vid[s].src='vid/'+s;
};
//加载数据
zyGame.load.loaddat=function(s){
	var o=this;
	var xmlhttp=new window.XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4){
			if (xmlhttp.status==200){
				zyGame.src.dat[s]=xmlhttp.responseText;
				o.loaded(o);
			}else{
				alert('连接服务器失败!');
			}
		}
	};
	xmlhttp.open('GET','dat/'+s,true);//true为异步，false为同步
	xmlhttp.send(null);
};






/**********************************************************
基础(base)方法
	出现在onInit里的子类创建，将自动设定其父类，其他位置的创建注意手动设定parent属性
**********************************************************/

zyGame.mth.base={};

//类承继序列
zyGame.mth.base.classList=[zyGame.mth.base];

//初始化
zyGame.mth.base.init=function(){
	zyGame.env.thisStack.push(this);//将控件对象压入栈，以被用于设定子控件的parent属性
	this.doEvent.call(this,'onInit',arguments);//初始化事件
	zyGame.env.thisStack.pop();
	if (zyGame.env.thisStack.length>0){//自动设定其父类
		this.setParent(zyGame.env.thisStack[zyGame.env.thisStack.length-1]);//栈顶为父控件引用
	}
	this.doEvent.call(this,'onInited');//初始化完成回调
};

//初始化回调(可见类基础初始化)
zyGame.mth.base.onInit=function(x,y,w,h){
	this.x=x;//显示在canvas上的绝对x坐标
	this.y=y;//显示在canvas上的绝对y坐标
	this.offsetX=x;//相对parent的x坐标
	this.offsetY=y;//相对parent的y坐标
	this.width=w;//宽
	this.height=h;//高
	this.anchor=[1,0,1,0];//锚定定位数组[上,下,左,右]
	this.autoResize=0;//是否自动改变大小

	this.angle=0;//旋转角度

	this.visible=0;//是否可见
	this.zindex=0;//层序
	this.parent=zyGame;//默认都是zyGame的子类

	//动画
	this.animate={};
	this.animate.owner=this;
	this.animate.name={};	//用于保存自义定方法名
	this.animate.add=zyGame.mth.animate.add;	//添加动画
	this.animate.del=zyGame.mth.animate.del;	//删除动画
	this.animate.stop=zyGame.mth.animate.stop;	//停止动画(不发生回调)
	this.animate.end=zyGame.mth.animate.end;	//停止动画(发生回调)
	this.animate.onEnd=function(){};			//完成回调
};

//执行事件序列
zyGame.mth.base.doEvent=function(e,a){//e=event a=arguments
	if (typeof(a)=='undefined'){
		var a=[];
	}
	for (var i in this.classList){
		var proto=(typeof(this.classList[i])=='function'?this.classList[i].prototype:this.classList[i]);
		if (typeof(proto[e])=='function'){
			proto[e].apply(this,a);
		}
	}
 	if (this.hasOwnProperty(e)){//仅当实例自身定义了事件才执行，其原型链上的事件，已在上面父类链中执行过了。
		this[e].apply(this,a);
	}
};

//设置容器
zyGame.mth.base.setParent=function(p){
	if (typeof(p.object)=='undefined'){
		p.object=new zyGame.cls.object();
	}
	var w=this.parent.width;
	var h=this.parent.height;
	if (this.visible==1){
		this.parent.object.del(this);
		this.parent=p;
		this.resize(w,h,p.width,p.height);
		this.parent.object.add(this);
	}else{
		this.parent=p;
		this.resize(w,h,p.width,p.height);
	}
};

//设置位置(左,上)
zyGame.mth.base.setLocation=function(x,y){
	if (x===''){
		x=this.offsetX;
	}
	if (y===''){
		y=this.offsetY;
	}
	this.offsetX=x;
	this.offsetY=y;
	this.x=x+this.parent.x;
	this.y=y+this.parent.y;
	if (typeof(this.object)=='object'){
		this.object.setLocation();
	}
	if (typeof(this._setLocation)=='function'){
		this._setLocation.apply(this,arguments);
	}
};

//设置大小(宽,高)
zyGame.mth.base.setSize=function(w,h){
	if (w===''){
		w=this.width;
	}
	if (h===''){
		h=this.height;
	}
	if (typeof(this.object)=='object'){
		this.object.resize(this.width,this.height,w,h);
	}
	var offsetX=this.offsetX;
	var offsetY=this.offsetY;
	if (this.anchor[2]==0){
		if (this.anchor[3]==0){//两边变
			offsetX+=Math.round((this.width-w)*offsetX/(this.parent.width-this.width));
		}else{//左边变，右边不变
			offsetX+=this.width-w;
		}
	}else{
		if (this.anchor[3]==1){//两边变
			offsetX+=Math.round((this.width-w)*offsetX/(this.parent.width-this.width));
		}
	}
	if (this.anchor[0]==0){
		if (this.anchor[1]==0){//上下变
			offsetY+=Math.round((this.height-h)*offsetY/(this.parent.height-this.height));
		}else{//上边变，下边不变
			offsetY+=this.height-h;
		}
	}else{
		if (this.anchor[1]==1){//上下变
			offsetY+=Math.round((this.height-h)*offsetY/(this.parent.height-this.height));
		}
	}
	this.setLocation(offsetX,offsetY);
	this.width=w;
	this.height=h;
	if (typeof(this._setSize)=='function'){
		this._setSize.apply(this,arguments);
	}
};

//设置锚锁(上,下,左,右)
zyGame.mth.base.setAnchor=function(t,b,l,r){
	this.anchor=[t,b,l,r];
};

//设置自动重置大小
zyGame.mth.base.setAutoResize=function(){
	if (arguments[0]==0){
		this.autoResize=0;
	}else{
		this.autoResize=1;
	}
};

//定位(方向,偏移)
zyGame.mth.base.position=function(){
	var offset=(arguments.length>1 ? arguments[1] : 0);
	switch (arguments[0]){
		case 'left'://靠左
			this.setLocation(offset,this.offsetY);
			this.anchor[2]=1;
			this.anchor[3]=0;
			break;
		case 'center'://水平居中
			this.setLocation(offset+Math.round((this.parent.width-this.width)/2),this.offsetY);
			this.anchor[2]=0;
			this.anchor[3]=0;
			break;
		case 'right'://靠右
			this.setLocation(-offset+Math.round(this.parent.width-this.width),this.offsetY);
			this.anchor[2]=0;
			this.anchor[3]=1;
			break;
		case 'fullx'://水平拉伸
			var offset2=(arguments.length>2 ? arguments[2] : 0);
			this.setLocation(offset,this.offsetY);
			this.setSize(this.parent.width-offset-offset2,this.height);
			this.anchor[2]=1;
			this.anchor[3]=1;
			break;
		case 'top'://靠上
			this.setLocation(this.offsetX,offset);
			this.anchor[0]=1;
			this.anchor[1]=0;
			break;
		case 'middle'://垂直居中
			this.setLocation(this.offsetX,offset+Math.round((this.parent.height-this.height)/2));
			this.anchor[0]=0;
			this.anchor[1]=0;
			break;
		case 'bottom'://靠下
			this.setLocation(this.offsetX,-offset+Math.round(this.parent.height-this.height));
			this.anchor[0]=0;
			this.anchor[1]=1;
			break;
		case 'fully'://垂直拉伸
			var offset2=(arguments.length>2 ? arguments[2] : 0);
			this.setLocation(this.offsetX,offset);
			this.setSize(this.width,this.parent.height-offset-offset2);
			this.anchor[0]=1;
			this.anchor[1]=1;
			break;
	}
};

//重置大小(原宽，原高，新宽，新高)
zyGame.mth.base.resize=function(w,h,nw,nh){
	var offsetX=this.offsetX;
	var offsetY=this.offsetY;
	var width=this.width;
	var height=this.height;
	var dw=nw-w;
	var dh=nh-h;
	if (this.anchor[2]==0){
		if (this.anchor[3]==0){
			if (this.autoResize==1){//两边,大小都变
				var dx=Math.round(dw*offsetX/w);
				var ds=Math.round(dw*width/w);
				offsetX+=dx;
				width+=ds;
			}else{//两边变,大小不变
				var dx=Math.round(dw*offsetX/(w-width));
				offsetX+=dx;
			}
		}else{
			if (this.autoResize==1){//左边,大小变,右边不变
				var ds=Math.round(dw*width/(offsetX+width));
				offsetX+=dw-ds;
				width+=ds;
			}else{//左边变,右边,大小不变
				offsetX+=dw;
			}
		}
	}else{
		if (this.anchor[3]==0){
			if (this.autoResize==1){//左边不变,右边,大小变
				var ds=Math.round(dw*width/(w-offsetX));
				width+=ds;
			}
		}else{//两边不变,大小变
			width+=dw;
		}
	}
	if (this.anchor[0]==0){
		if (this.anchor[1]==0){
			if (this.autoResize==1){//两边,大小都变
				var dy=Math.round(dh*offsetY/h);
				var ds=Math.round(dh*height/h);
				offsetY+=dy;
				height+=ds;
			}else{//两边变,大小不变
				var dy=Math.round(dh*offsetY/(h-height));
				offsetY+=dy;
			}
		}else{
			if (this.autoResize==1){//上边,大小变,下边不变
				var ds=Math.round(dh*height/(offsetY+height));
				offsetY+=dh-ds;
				height+=ds;
			}else{//上边变,下边,大小不变
				offsetY+=dh;
			}
		}
	}else{
		if (this.anchor[1]==0){
			if (this.autoResize==1){//上边不变,下边,大小变
				var ds=Math.round(dh*height/(h-offsetY));
				height+=ds;
			}
		}else{//两边不变,大小变
			height+=dh;
		}
	}
	this.setLocation(offsetX,offsetY);
	this.setSize(width,height);
	if (typeof(this._resize)=='function'){
		this._resize.apply(this,arguments);
	}
};

//是否可见
zyGame.mth.base.isVisible=function(){
	var p=this;
	while (p!=zyGame){
		if (p.visible==0){
			return 0;
		}
		p=p.parent;
	}
	return 1;
};

//显示
zyGame.mth.base.show=function(){
	if (this.visible==0){
		this.visible=1;
		this.setLocation(this.offsetX,this.offsetY);
		this.parent.object.add(this);
	}
	if (this.isVisible()==1){
		if (typeof(this.object)=='object'){//判断是否含有子控件
			this.object.onShow();
		}
		this.doEvent.call(this,'onShow');
	}
};

//隐藏
zyGame.mth.base.hide=function(){
	if (this.visible==1){
		this.visible=0;
		this.parent.object.del(this);
	}
	if (typeof(this.object)=='object'){//判断是否含有子控件
		this.object.onHide();
	}
	this.doEvent.call(this,'onHide');
};

//绘制
zyGame.mth.base.draw=function(){
	zyGame.draw.save();
	this.doEvent.call(this,'beforeDraw');
	if (this.angle!=0){
		zyGame.draw.rotate(this.rotateX,this.rotateY,this.angle);
		this.x=this.x-this.rotateX;
		this.y=this.y-this.rotateY;
	}
	this.doEvent.call(this,'onDraw');
	if (this.angle!=0){
		zyGame.draw.rotate(this.rotateX,this.rotateY,this.angle);
		this.x=this.x+this.rotateX;
		this.y=this.y+this.rotateY;
	}
	this.doEvent.call(this,'afterDraw');
	zyGame.draw.restore();
};

/*
控件旋转方法
	.rotate(a)
		a-旋转角度
	.rotate(a,o)
		a-旋转角度
		o-旋转中心
			0-对象中心
			1-对象左上角
			2-对象右上角
			3-对象左下角
			4-对象右下角
	.rotate(a,x,y)
		a-为旋转角度
		x-旋转中心相对于对象的x坐标
		y-旋转中心相对于对象的y坐标
*/
zyGame.mth.base.rotate=function(){
	var a=arguments[0];
	var x=this.width/2;
	var y=this.height/2;

	if (arguments.length==2){
		switch (arguments[1]){
		case 1:
			x=0;
			y=0;
			break;
		case 2:
			x=this.width;
			y=0;
			break;
		case 3:
			x=0;
			y=this.height;
			break;
		case 4:
			x=this.width;
			y=this.height;
		}
	}else if (arguments.length==3){
		x=arguments[1];
		y=arguments[2];
	}
	this.rotateX=this.x+x;
	this.rotateY=this.y+y;
	this.angle=a;
};





/**********************************************************
动画(animate)方法
**********************************************************/

zyGame.mth.animate={};

//向类或实例中添加一个动画效果(方法名,重命名)，在动画完成前再次调用动画，则上次动画将停止
zyGame.mth.animate.add=function(m,n){
	if (arguments.length==1){
		this.owner.animate.name[m]=m;		//保存方法名
		this.owner.animate[m]={};			//创建一个命名空间
		this.owner[m]=zyGame.mth.animate[m];
	}else{
		this.owner.animate.name[m]=n;
		this.owner.animate[n]={};
		this.owner[n]=zyGame.mth.animate[m];
	}
};

//删除类或实例中的一个动画效果(方法名)
zyGame.mth.animate.del=function(m){
	delete this.owner.animate.name[m];
	delete this.owner.animate[m];
	delete this.owner[m];
};

//停止实例中的一个动画效果(方法名)
zyGame.mth.animate.stop=function(m){
	if (typeof(this.owner.animate[m].timer)=='object'){
		this.owner.animate[m].timer.release();
		delete this.owner.animate[m].timer
	}
};

//动画完成(方法名)
zyGame.mth.animate.end=function(m){
	this.owner.animate.stop(m);
	this.owner.animate.onEnd(m);
};


/***********************动画方法**************************/
//移动(新x,新y,毫秒)，只支持直线路径
zyGame.mth.animate.move=function(x,y,ms){
	var animateName=this.animate.name['move'];
	this.animate.stop(animateName);
	var dx=x-this.offsetX;
	var dy=y-this.offsetY;
	if (dx!=0 || dy!=0){
		var _this=this;//this为控件自身
		var o=this.animate[animateName];
		o.times=(Math.abs(dx)>Math.abs(dy) ? Math.abs(dx) : Math.abs(dy));
		o.dx=dx/o.times;
		o.dy=dy/o.times;
		o.x=this.offsetX;//启动时
		o.y=this.offsetY;//启动时
		o.timer=zyGame.timer.createTimer(ms/o.times);
		o.timer.tick=function(){
			if (this.times<o.times){
				_this.setLocation(o.x+Math.round(this.times*o.dx),o.y+Math.round(this.times*o.dy));
			}else{//完成动画
				_this.setLocation(o.x+Math.round(o.times*o.dx),o.y+Math.round(o.times*o.dy));
				_this.animate.end(animateName);
			}
		};
		o.timer.on();
	}
};


//帧式动画(帧数,毫秒,[循环],回调)
zyGame.mth.animate.frame=function(frame,ms){
	var animateName=this.animate.name['frame'];
	this.animate.stop(animateName);
	var _this=this;//this为控件自身
	var o=this.animate[animateName];
	o.frame=frame;
	if (arguments.length==3){
		o.loop=0;
		o.callback=arguments[2];
	}else{
		o.loop=arguments[2];
		o.callback=arguments[3];
	}
	o.timer=zyGame.timer.createTimer(ms/frame);
	o.timer.tick=function(){
		if (this.times<o.frame){
			o.callback.call(_this,this.times);
		}else{
			o.callback.call(_this,o.frame);
			if (o.loop==0){
				_this.animate.end(animateName);
			}else{
				this.times=0;
				this.lastTime=Date.now();
			}
		}
	};
	o.timer.on();
};

//出现一定时间消失(停留时间)
zyGame.mth.animate.disappear=function(ms){
	var animateName=this.animate.name['disappear'];
	this.animate.stop(animateName);
	var _this=this;//this为控件自身
	var o=this.animate[animateName];
	o.timer=zyGame.timer.createTimer(ms);
	o.timer.tick=function(){
		_this.hide();
		_this.animate.end(animateName);
	};
	o.timer.on();
};

//闪烁(间隔时间)
zyGame.mth.animate.flash=function(ms){
	var animateName=this.animate.name['flash'];
	this.animate.stop(animateName);
	var _this=this;//this为控件自身
	var o=this.animate[animateName];
	o.timer=zyGame.timer.createTimer(ms);
	o.timer.tick=function(){
		if (_this.visible==1){
			_this.hide();
		}else{
			_this.show();
		}
	};
	o.timer.on();
};

/*
攻击式旋转
	说明：
		为对象左上角为中心，a为初始角度，经过ms毫秒，回到原位。
	调用：
		.attackRotate(a,ms)
	参数：
		a-初始角度
		ms-动画时长
	事例：
		myObj.addAnimate('attackRotate');
		myObj.animate.attackRotate(-0.3,100);
*/
zyGame.mth.animate.attackRotate=function(a,ms){
	var p=this.parent;
	var o=this['rotate'];
	o.timer=zyGame.timer.createTimer(ms);
	o.angle=a/f;
	p.rotate(a,1);
	o.timer.tick=function(){
		p.rotate(0);
	};
	o.timer.on();
};








/**********************************************************
数据存取(storage)模块
**********************************************************/

zyGame.cls.storage=function(){
	if (arguments[0]=='local'){
		this.ws=window.localStorage;
	}else{
		this.ws=window.sessionStorage;
	}
	this.length=this.ws.length;
};


//保存
zyGame.cls.storage.prototype.save=function(key,value){
	this.ws.setItem(key,value);
	this.length=this.ws.length;
};

//获取
zyGame.cls.storage.prototype.get=function(key){
	return this.ws.getItem(key);
};

//移除
zyGame.cls.storage.prototype.del=function(key){
	this.ws.removeItem(key);
	this.length=this.ws.length;
};

//清除
zyGame.cls.storage.prototype.clear=function(){
	this.ws.clear();
	this.length=this.ws.length;
};/**********************************************************
通信(socket)类
**********************************************************/

zyGame.cls.socket=function(url){
	this.url=url;

	//事件回调
	this.onOpen=function(){};
	this.onMessage=function(){};
	this.onClose=function(){};
	this.onError=function(){};
};

//创建连接
zyGame.cls.socket.prototype.connect=function(){
	this.ws=new WebSocket(this.url);
	this.ws.onopen=this.onOpen;
	this.ws.onmessage=this.onMessage;
	this.ws.onclose=this.onClose;
	this.ws.onerror=this.onError;
};

//发送数据
zyGame.cls.socket.prototype.send=function(data){
	this.ws.send(data);
};

//关闭连接
zyGame.cls.socket.prototype.end=function(){
	this.ws.close();
};



/**********************************************************
时间轴/定时器类(cls.timer)
**********************************************************/

zyGame.cls.timer=function(){
	this.interval=1000;//执行间隔
	this.enabled=0;
	this.released=0;
	this.model=0;//0-时间轴(跳帧)模式,1-定时器(逐帧)模式,默认0)
	this.tick=function(){};
};

//设置模式
zyGame.cls.timer.prototype.setModel=function(m){
	this.model=m;
};
//设置间隔
zyGame.cls.timer.prototype.setInterval=function(i){
	this.interval=i;
};
//开
zyGame.cls.timer.prototype.on=function(){
	if (this.enabled==0){
		this.enabled=1;
		this.times=0;//单回第times次执行
		this.lastTime=Date.now();//上次执行时间/开始执行时间
		zyGame.timer.obj.push(this);
	}
};
//关
zyGame.cls.timer.prototype.off=function(){
	if (this.enabled==1){
		this.enabled=0;
		for (var i in zyGame.timer.obj){
			if (this===zyGame.timer.obj[i]){
				zyGame.timer.obj.splice(i,1);
				break;
			}
		}
	}
};
//释放
zyGame.cls.timer.prototype.release=function(){
	if (this.released==0){
		this.off();
		this.interval=1000;
		this.model=0;
		this.released=1;
		zyGame.timer.pool.push(this);
	}
};
//销毁(未测试可行性，不开放使用)
zyGame.cls.timer.prototype.destroy=function(){
	this.off();
	delete this;
};














/**********************************************************
计器时(clock)类
**********************************************************/

zyGame.cls.clock=function(){
	this.lastTime=Date.now();
};

/***************************** 控件方法 *****************************/
//返回以过去的毫秒数(0/1是否格式化时间，默认0)
zyGame.cls.clock.prototype.get=function(){
	var passTime=Date.now()-this.lastTime;
	if (arguments[0]==1){
		var passTime=zyGame.util.formatTime(passTime);
	}
	return passTime;
};
//设置开始计时点
zyGame.cls.clock.prototype.set=function(){
	if (arguments.length==0){
		this.lastTime=Date.now();
	}else{
		this.lastTime=arguments[0];
	}
};














/**********************************************************
对象容器(object)类
**********************************************************/

zyGame.cls.object=function(){
	this.obj=[];
};

//绘制
zyGame.cls.object.prototype.draw=function(){
	for (var i in this.obj){
		var o=this.obj[i];
		o.draw();
		if (typeof(o.object)=='object'){//判断是否含有子控件
			o.object.draw();//绘制子控件
		}
	}
};

//显示事件
zyGame.cls.object.prototype.onShow=function(){
	for (var i in this.obj){
		var o=this.obj[i];
		if (o.visible==1){
			o.doEvent.call(o,'onShow');
			if (typeof(o.object)=='object'){//判断是否含有子控件
				o.object.onShow();//调用子控件显示事件
			}
		}
	}
};

//隐藏事件
zyGame.cls.object.prototype.onHide=function(){
	for (var i in this.obj){
		var o=this.obj[i];
		o.doEvent.call(o,'onHide');
		if (typeof(o.object)=='object'){//判断是否含有子控件
			o.object.onHide();//调用子控件隐藏事件
		}
	}
};

//添加
zyGame.cls.object.prototype.add=function(o){
	if (this.obj.length==0){
		this.obj.push(o);
	}else{
		for (var i in this.obj){
			if (o.zindex<this.obj[i].zindex){
				return this.obj.splice(i,0,o);
			}
		}
		this.obj.push(o);
	}
};

//删除
zyGame.cls.object.prototype.del=function(o){
	for (var i in this.obj){
		if (o===this.obj[i]){
			return this.obj.splice(i,1);
		}
	}
};

//设置位置
zyGame.cls.object.prototype.setLocation=function(){
	for (var i in this.obj){
		this.obj[i].setLocation(this.obj[i].offsetX,this.obj[i].offsetY);
	}
};

//大小重置
zyGame.cls.object.prototype.resize=function(w,h,dw,dh){
	for (var i in this.obj){
		this.obj[i].resize(w,h,dw,dh);
	}
};

//鼠标按下
zyGame.cls.object.prototype.mousedown=function(x,y){
	for (var i=this.obj.length-1;i>=0;i--){
		var o=this.obj[i];
		var ox=x-o.offsetX;
		var oy=y-o.offsetY;
		if (zyGame.util.isInRect(ox,oy,0,0,o.width,o.height)==1){//判断是否点中控件
			var len=zyGame.event.mouseDown.length;
			if (typeof(o.object)=='object'){//判断是否含有子控件
				o.object.mousedown(ox,oy);//向子控件传递鼠标事件
			}
			if (typeof(o.mousedown)=='function' || typeof(o.onMousedown)=='function' ||
				typeof(o.mouseup)=='function' || typeof(o.onMouseup)=='function' ||
				typeof(o.click)=='function' || typeof(o.onClick)=='function' ||
				typeof(o.drap)=='function' || typeof(o.onDrap)=='function'){//判断控件是否有相应事件的监听
				var isValid=1;//默认点击有效
				//可以在鼠标按下事件里写一个判断函数，如果点击位置无效，可以通过返回false值，使鼠标事件穿透该控件
				if (typeof(o.mousedown)=='function'){//判断鼠标按下事件返回值，确定是否点击有效
					var ret=o.mousedown(ox,oy);
					isValid=(typeof(ret)=='undefined'?1:ret);
				}else if (typeof(o.onMousedown)=='function'){
					var ret=o.onMousedown(ox,oy);
					isValid=(typeof(ret)=='undefined'?1:ret);
				}
				if (isValid!=0){//如果点击有效
					if (typeof(o.drap)=='function' || typeof(o.onDrap)=='function'){//设定拖拽事件相关参数
						zyGame.event.mouseDrap['sx']=o.offsetX;
						zyGame.event.mouseDrap['sy']=o.offsetY;
						zyGame.event.mouseDrap['mx']=ox;
						zyGame.event.mouseDrap['my']=oy;
						zyGame.event.mouseDrap['dx']=ox;
						zyGame.event.mouseDrap['dy']=oy;
					}
					zyGame.event.mouseDown.push(o);//事件压入栈
				}
			}
			if (len<zyGame.event.mouseDown.length){//如控件响应事件，则中止遍历本层控件
				break;
			}
		}
	}
};

//鼠标抬起
zyGame.cls.object.prototype.mouseup=function(x,y){
	while (zyGame.event.mouseDown.length>0){//直到mousedown目标栈为空
		var o=zyGame.event.mouseDown.pop();//从栈顶取出一个控件
		var ox=x-o.x;
		var oy=y-o.y;
		if (typeof(o.mouseup)=='function'){//执行mouseup事件
			o.mouseup(ox,oy);
		}else if(typeof(o.onMouseup)=='function'){
			o.onMouseup(ox,oy);
		}
		if (zyGame.event.mouseDrap['isDraped']==0){//若未发生drap,再判断是否要执行click事件
			if (zyGame.util.isInRect(ox,oy,0,0,o.width,o.height)==1){//若up位置在该控件范围内，则执行click事件
				if (typeof(o.click)=='function'){
					o.click(ox,oy);
				}else if(typeof(o.onClick)=='function'){
					o.onClick(ox,oy);
				}
			}
		}
	}
	zyGame.event.mouseDrap['isDraped']=0;//重置drap状态
};








/**********************************************************
文本(text)类
**********************************************************/

zyGame.cls.text=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.text.prototype.onInit=function(x,y,w,h){
	this.text='';
	this.font=new zyGame.type.font();

	this.align='left';//可取值: left,right,center
	this.valign='top';//可取值: top,bottom,middle
	this.color='rgb(0,0,0)';

	this.shadowOffsetX=0;
	this.shadowOffsetY=0;
	this.shadowBlur=0;
	this.shadowColor='#000000';

	this.bgStyle=0;//0-没有背景,1-纯色背景,2-渐变背景,3-图片背景
	this.bgColor='#000000';
	this.bgImage='';
};
/***************************** 控件方法 *****************************/
//刷新控件宽高
zyGame.cls.text.prototype._refreshSize=function(){
	zyGame.draw.setTextStyle(this.font,this.align,this.valign,this.color);
	this.width=zyGame.draw.getTextWidth(this.text);
	this.height=parseInt(this.font.size);
};
//设置文本
zyGame.cls.text.prototype.setText=function(t){
	this.text=t;
	this._refreshSize();
};
//设置左右对齐
zyGame.cls.text.prototype.setAlign=function(a){
	switch (a){
		case 'right':
		case 'center':
			this.align=a;
			break;
		default:
			this.align='left';
	}
};
//设置字体
zyGame.cls.text.prototype.setFontFamily=function(f){
	this.font.family=f;
	this._refreshSize();
};
//设置字体大小
zyGame.cls.text.prototype.setFontSize=function(s){
	this.font.size=s;
	this._refreshSize();
};
//设置字体粗细
zyGame.cls.text.prototype.setFontWeight=function(w){
	this.font.weight=w;
	this._refreshSize();
};
//设置字体颜色
zyGame.cls.text.prototype.setFontColor=function(c){
	this.color=c;
};
//设置字体
zyGame.cls.text.prototype.setFont=function(f,s,c,w){
	if (f!==''){
		this.font.family=f;
	}
	if (s!==''){
		this.font.size=s;
	}
	if (typeof(c)!='undefined'){
		if (c!==''){
			this.color=c;
		}
	}
	if (typeof(w)!='undefined'){
		if (w!==''){
			this.font.weight=w;
		}
	}
	this._refreshSize();
};
//设置阴影
zyGame.cls.text.prototype.setShadow=function(x,y,b,c){
	if (x!==''){
		this.shadowOffsetX=x;
	}
	if (y!==''){
		this.shadowOffsetY=y;
	}
	if (b!==''){
		this.shadowBlur=b;
	}
	if (c!==''){
		this.shadowColor=c;
	}
};
//设置背景
zyGame.cls.text.prototype.setBgColor=function(c){
	this.bgColor=c;
	this.bgStyle=1;
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.text.prototype.onDraw=function(){
	switch (this.bgStyle){
		case 1:
			zyGame.draw.rect(this.bgColor,this.x,this.y,this.width,this.height);
		case 2:

		case 3:
	}
	zyGame.draw.setTextStyle(this.font,this.align,this.valign,this.color);
	zyGame.draw.setShadowStyle(this.shadowOffsetX,this.shadowOffsetY,this.shadowBlur,this.shadowColor);
	zyGame.draw.text(this.text,this.x,this.y);
};









/**********************************************************
图像(image)类
**********************************************************/

zyGame.cls.image=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.image.prototype.onInit=function(x,y,w,h){
	if (arguments.length==2){
		this.model=1;
	}else{
		this.model=0;
	}
};
/***************************** 控件方法 *****************************/
//设置图源截取区域(x,y,wh,size[0-不改变控件大小,1-控件大小与截取区域一致])
zyGame.cls.image.prototype.setSrcRect=function(sx,sy,sw,sh,size){
	if (typeof(size)=='undefined'){
		var size=0;
	}
	if (sw===''){
		sw=this.width;
	}
	if (sh===''){
		sh=this.height;
	}
	this.srcX=sx;
	this.srcY=sy;
	this.srcWidth=sw;
	this.srcHeight=sh;
	if (size==1){
		this.setSize(sw,sh);
	}
	this.model=2;
};
//设置图像源
zyGame.cls.image.prototype.setSrc=function(s){
	this.src=s;

	if (this.model==1){
		this.setSize(zyGame.src.img[this.src].width,zyGame.src.img[this.src].height);
	}
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.image.prototype.onDraw=function(){
	switch (this.model){
	case 0:
	case 1:
		zyGame.draw.image(this.src,this.x,this.y,this.width,this.height);
		break;
	case 2:
		zyGame.draw.image(this.src,this.srcX,this.srcY,this.srcWidth,this.srcHeight,this.x,this.y,this.width,this.height);
		break;
	}
};




/**********************************************************
层(layer)类
	原则上不使用层响应鼠标点击事件，层用专用于响应拖拽事件。
	而背景点击事件，应该添加一个背景控件来响应。
	如果给层加一个鼠标点击事件，则点中控件与层会先后响应事件。
	出现在onLoad回调里的子控件创建，将自动设定其parent为本层，其他位置的创建注意手动设定parent属性
**********************************************************/

zyGame.cls.layer=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.layer.prototype.onInit=function(x,y,w,h){
	this.loaded=0;
	this.onLoad=function(){};
	this.onLoaded=function(){};
};
/***************************** 控件方法 *****************************/
//加载层
zyGame.cls.layer.prototype.load=function(){
	if (this.loaded==0){
		zyGame.env.thisStack.push(this);//将控件对象压入栈，以被用于设定子控件的parent属性
		this.onLoad();
		zyGame.env.thisStack.pop();
		this.loaded=1;
		this.onLoaded();
	}
};
//创建一组子控件(控件数组)
zyGame.cls.layer.prototype.createClasses=function(cls){
	for (var i in cls){
		this.createClass(cls[i]);
	}
};
//创建一个子控件(属性数组)
zyGame.cls.layer.prototype.createClass=function(data){
	switch (data[0]){
	case 'img':
		this[data[1]]=new zyGame.cls.image(data[2],data[3],data[4],data[5]);
		this[data[1]].setSrc(data[6]);
		this[data[1]].show();
		break;
	case 'txt':
		this[data[1]]=new zyGame.cls.text(data[2],data[3]);
		this[data[1]].setAlign(data[4]);
		this[data[1]].setText(data[5]);
		this[data[1]].setFont(data[6],data[7],data[8],data[9]);
		this[data[1]].setShadow(data[10],data[11],data[12],data[13]);
		this[data[1]].show();
		break;
	case 'lab':
		this[data[1]]=new zyGame.cls.label(data[2],data[3],data[4],data[5]);
		this[data[1]].setText(data[6]);
		this[data[1]].setFont(data[7],data[8],data[9],data[10]);
		this[data[1]].setShadow(data[11],data[12],data[13],data[14]);
		this[data[1]].show();
		break;
	}
};
/***************************** 控件事件 *****************************/
zyGame.cls.layer.prototype.onShow=function(data){
	this.load();
};







/**********************************************************
按钮(button)类
**********************************************************/

zyGame.cls.button=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.button.prototype.onInit=function(x,y,w,h){
	this.enabled=1;
	this.src=[];

	this.text=new zyGame.cls.text(0,0);
	this.text.setText('button');
	this.text.show();
};
/***************************** 控件方法 *****************************/
//使控件失效
zyGame.cls.button.prototype.disable=function(){
	this.enabled=0;
	this.state=this.src.length-1;
};
//使控件生效
zyGame.cls.button.prototype.enable=function(){
	this.enabled=1;
	this.state=0;
};
//设置图像源([正常,按下,无效])
zyGame.cls.button.prototype.setSrc=function(){
	this.src=arguments;
	if (this.enabled==0){
		this.state=this.src.length-1;
	}else{
		this.state=0;
	}
};
/***************************** 控件事件 *****************************/
//点击事件
zyGame.cls.button.prototype.click=function(){
	if (this.enabled==1){
		if (typeof(this.onClick)=='function'){
			this.onClick();
		}
	}
};
//鼠标按下事件
zyGame.cls.button.prototype.mousedown=function(){
	if (this.enabled==1){
		if (this.src.length==3){
			this.state=1;
		}
		if (typeof(this.onMousedown)=='function'){
			this.onMousedown();
		}
	}
};
//鼠标抬起事件
zyGame.cls.button.prototype.mouseup=function(){
	if (this.enabled==1){
		if (this.src.length==3){
			this.state=0;
		}
		if (typeof(this.onMouseup)=='function'){
			this.onMouseup();
		}
	}
};
//绘制控件
zyGame.cls.button.prototype.onDraw=function(){
	zyGame.draw.image(this.src[this.state],this.x,this.y,this.width,this.height);
};


/**********************************************************
条(bar)类
**********************************************************/


zyGame.cls.bar=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.bar.prototype.onInit=function(x,y,w,h){
	this.ceil=100;
	this.value=0;
	this.padding=3;
	this.model=0;//0-颜色模式,1-图像模式
	this.backgroundColor='rgb(0,0,0)';
	this.foreColor='rgb(255,0,0)';
};
/***************************** 控件方法 *****************************/
//设置图像源
zyGame.cls.bar.prototype.setSrc=function(b,f){
	this.backgroundImage=b;
	this.foreImage=f;
	this.model=1;
};
//设置颜色源
zyGame.cls.bar.prototype.setColor=function(b,f){
	this.backgroundColor=b;
	this.foreColor=f;
	this.model=0;
};
//设置内边距(背景边框和前景条之间的空隙大小)
zyGame.cls.bar.prototype.setPadding=function(p){
	this.padding=p;
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.bar.prototype.onDraw=function(){
	if (this.model==0){
		zyGame.draw.rect(this.x,this.y,this.width,this.height,this.backgroundColor);
		zyGame.draw.rect(this.x+this.padding,this.y+this.padding,Math.floor((this.width-2*this.padding)*this.value/this.ceil),this.height-2*this.padding,this.foreColor);
	}else{
		if (this.backgroundImage){
			zyGame.draw.image(this.backgroundImage,this.x,this.y,this.width,this.height);
		}
		zyGame.draw.image(this.foreImage,0,0,Math.floor(zyGame.src.img[this.foreImage].width*this.value/this.ceil),zyGame.src.img[this.foreImage].height,this.x+this.padding,this.y+this.padding,Math.floor((this.width-2*this.padding)*this.value/this.ceil),this.height-2*this.padding);
	}
};







/**********************************************************
输入框(input)类
**********************************************************/

zyGame.cls.input=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.input.prototype.onInit=function(x,y,w,h){
	this.input=zyGame.doc.createElement('input');
	this.input.type="text";
	this.input.value="test";
	this.input.style['width']=w+'px';
	this.input.style['height']=h+'px';
	this.input.style['position']='absolute';
	this.input.style['outline']='none';
	this.input.style['display']='none';
	this.input.style['border']='0px';
	this.input.style['color']='#000000';
	this.input.style['background']='none';
	this.input.style['font-size']='20px';
	this.input.style['font-family']='宋体';
	this.input.style['font-weight']='normal';
	//this.input.setAttribute('maxlength',8);
	zyGame.body.appendChild(this.input);
};
/***************************** 控件方法 *****************************/
//设置图像源
zyGame.cls.input.prototype.setSrc=function(s){
	this.src=s;
};
//设置文本
zyGame.cls.input.prototype.setText=function(t){
	this.input.value=t;
};
//得到文本
zyGame.cls.input.prototype.getText=function(){
	return this.input.value;
};
//设置风格
zyGame.cls.input.prototype.setStyle=function(style){
	zyGame.util.copy(this.input.style,style);
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.input.prototype.onDraw=function(){
	this.input.style['left']=zyGame.cvs.offsetLeft+this.x+'px';
	this.input.style['top']=zyGame.cvs.offsetTop+this.y+'px';
	this.input.style['display']='';
	//zyGame.draw.image(this.src,this.x,this.y,this.width,this.height);
};
//显示事件
zyGame.cls.input.prototype.onShow=function(){
	var p=this.parent;
	while (p!=zyGame){
		if (p.visible==0){
			return this.input.style['display']='none';
		}
		p=p.parent;
	}
	this.input.style['display']='';
};
//隐藏事件
zyGame.cls.input.prototype.onHide=function(){
	this.input.style['display']='none';
};



/**********************************************************
单选(radio)类
**********************************************************/

zyGame.cls.radio=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.radio.prototype.onInit=function(x,y,w,h){
	this.model=0;//模式0-图像，1-文本
	this.option=[];//元素
	this.selected=0;//选中的元素序号
	this.onSelect=function(){};//选中回调
};
/***************************** 控件方法 *****************************/
//设置模式
zyGame.cls.radio.prototype.setModel=function(model){
	this.model=parseInt(model);
};
//加添一个元素
zyGame.cls.radio.prototype.add=function(v1,v2,x,y,w,h){
	var i=this.option.length;

	switch (this.model){
	case 0:
		this.option[i]=new zyGame.cls.image(x,y,w,h);
		this.option[i].srcList=[v1,v2];
		break;
	case 1:
		break;
	}
	this.option[i].i=i;
	this.option[i].setParent(this);
	this.option[i].show();
	this.option[i].onClick=function(){
		this.parent.check(this.i);
	};
	this.refresh();
};
//选中一个元素
zyGame.cls.radio.prototype.check=function(i){
	this.selected=i;
	this.refresh();
	this.onSelect(i);
};
//刷新控件
zyGame.cls.radio.prototype.refresh=function(){
	var checked=0;

	for (var i in this.option){
		checked=(i==this.selected?1:0);
		switch (this.model){
		case 0:
			this.option[i].setSrc(this.option[i].srcList[checked]);
			break;
		case 1:
			break;
		}
	}
};
/***************************** 控件事件 *****************************/


/**********************************************************
滚动条(scroll)类
**********************************************************/

zyGame.cls.scroll=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.scroll.prototype.onInit=function(x,y,w,h){
	//箭头
	this.imgArrow=[];
	for (var i=0;i<2;i++){
		this.imgArrow[i]=new zyGame.cls.image(0,0,0,0);
		this.imgArrow[i].i=i;
		this.imgArrow[i].zindex=2;
		this.imgArrow[i].onClick=function(){
			var p=this.parent;
			p.setValue(p.value+(this.i==0?-1:1)*p.tinyChange);
		};
	}
	//滚动块
	this.imgBlock=new zyGame.cls.image(0,0,0,0);
	this.imgBlock.zindex=2;
	//背景条
	this.imgBar=new zyGame.cls.image(0,0,0,0);
	this.imgBar.onClick=function(x,y){
		var p=this.parent;
		var dx=x-p.padding;
		var w=p.imgBar.width-2*p.padding;
		p.setValue(dx/w*(p.ceil-p.floor)+p.floor);
	};
 	//前景条(位置大小需与背景条一致)
	this.imgFore=new zyGame.cls.image(0,0,0,0);
	this.imgFore.zindex=1;

	this.padding=0;//按背景条位置大小，甩出padding的空白区，做为滚动块有效区
	this.fore=0;//前景条方位[0-左/上,1-右/下]
	this.value=0;//当前值
	this.floor=0;//上限
	this.ceil=100;//下限
	this.slipChange=1;//滑动权重(鼠标滑动一个有效区间，value增减: 变化区间/slipChange)
	this.tinyChange=1;//微调单位(点击一次箭头，value增减：tinyChange)
	this.onScroll=function(){};//滚动回调
};
/***************************** 控件方法 *****************************/
//设置箭头
zyGame.cls.scroll.prototype.setArrow=function(s1,s2,w,h){
	this.imgArrow[0].setLocation(0,0);
	this.imgArrow[0].setSize(w,h);
	this.imgArrow[0].setSrc(s1);
	this.imgArrow[0].show();
	this.imgArrow[1].setLocation(this.width-w,0);
	this.imgArrow[1].setSize(w,h);
	this.imgArrow[1].setSrc(s2);
	this.imgArrow[1].show();
};
//设置背景条
zyGame.cls.scroll.prototype.setBar=function(s,x,y,w,h){
	this.imgBar.setLocation(x,y);
	this.imgBar.setSize(w,h);
	this.imgBar.setSrc(s);
	this.imgBar.show();
};
//设置前景条
zyGame.cls.scroll.prototype.setFore=function(s){
	this.imgFore.setLocation(this.imgBar.offsetX,this.imgBar.offsetY);
	this.imgFore.setSize(this.imgBar.width,this.imgBar.height);
	this.imgFore.setSrc(s);
	this.imgFore.show();
};
//设置滚动块
zyGame.cls.scroll.prototype.setBlock=function(s,w,h){
	this.imgBlock.setSize(w,h);
	this.imgBlock.setSrc(s);
	this.imgBlock.show();
};
//设置值
zyGame.cls.scroll.prototype.setValue=function(value){
	var oldValue=this.value;
	this.value=zyGame.util.fixValue(value,this.floor,this.ceil);
	var change=this.value-oldValue;

	var l=this.imgBar.offsetX+this.padding;//起点
	var w=this.imgBar.width-2*this.padding-this.imgBlock.width;//有效宽度
	var p=(this.value-this.floor)/(this.ceil-this.floor);//比例
	var x=l+w*p;
	this.imgBlock.setLocation(x,'');
	this.imgFore.setSrcRect(0,0,this.padding+w*p+this.imgBlock.width/2,'',1);

	this.onScroll(this.value,change);
};
/***************************** 控件事件 *****************************/
//拖拽事件
zyGame.cls.scroll.prototype.onDrap=function(sx,sy,tx,ty,dx,dy){
	var w=this.imgBar.width-2*this.padding-this.imgBlock.width;
	this.setValue(this.value+dx/w*(this.ceil-this.floor)/this.slipChange);
};


/**********************************************************
标签(label)类
**********************************************************/

zyGame.cls.label=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.label.prototype.onInit=function(x,y,w,h){
	this.text='';
	this.multiText=[];
	this.font=new zyGame.type.font();
	this.align='left';//可取值: left,right,center
	this.valign='top';//可取值: top,bottom,middle
	this.color='rgb(0,0,0)';
	this.lineHeight=h;

	this.shadowOffsetX=0;
	this.shadowOffsetY=0;
	this.shadowBlur=0;
	this.shadowColor='#000000';
};
/***************************** 控件方法 *****************************/
//设置行高
zyGame.cls.label.prototype.setlineHeight=function(h){
	this.lineHeight=h;
	this.height=h*this.multiText.length;
};
//设置文本
zyGame.cls.label.prototype.fixText=function(){
	var t=this.text;
	this.multiText=[];
	zyGame.draw.save();
	zyGame.draw.setTextStyle(this.font,this.align,this.valign,this.color);
	do{
		var tmpText=t;
		var i=0;
		while (zyGame.ctx.measureText(tmpText).width>this.width){
			i++;
			tmpText=t.substr(0,t.length-i);
		}
		t=t.substr(t.length-i,i);
		this.multiText.push(tmpText);
	}while(i>0);
	this.setlineHeight(this.lineHeight);
	zyGame.draw.restore();
};
//设置文本
zyGame.cls.label.prototype.setText=function(t){
	this.text=t;
	this.fixText();
};
//设置字体
zyGame.cls.label.prototype.setFontFamily=function(f){
	this.font.family=f;
	this.fixText();
};
//设置字体大小
zyGame.cls.label.prototype.setFontSize=function(s){
	this.font.size=s;
	this.fixText();
};
//设置字体粗细
zyGame.cls.label.prototype.setFontWeight=function(w){
	this.font.weight=w;
	this.fixText();
};
//设置字体颜色
zyGame.cls.label.prototype.setFontColor=function(c){
	this.color=c;
};
//设置字体
zyGame.cls.label.prototype.setFont=function(f,s,c,w){
	if (f!=''){
		this.font.family=f;
	}
	if (s!=''){
		this.font.size=s;
	}
	if (typeof(c)!='undefined'){
		if (c!=''){
			this.color=c;
		}
	}
	if (typeof(w)!='undefined'){
		if (w!=''){
			this.font.weight=w;
		}
	}
	this.fixText();
};
//设置阴影
zyGame.cls.label.prototype.setShadow=function(x,y,b,c){
	if (x!=''){
		this.shadowOffsetX=x;
	}
	if (y!=''){
		this.shadowOffsetY=y;
	}
	if (b!=''){
		this.shadowBlur=b;
	}
	if (c!=''){
		this.shadowColor=c;
	}
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.label.prototype.onDraw=function(){
	zyGame.draw.save();
	zyGame.draw.setTextStyle(this.font,this.align,this.valign,this.color);
	zyGame.draw.setShadowStyle(this.shadowOffsetX,this.shadowOffsetY,this.shadowBlur,this.shadowColor);
	for (var i in this.multiText){
		zyGame.draw.text(this.multiText[i],this.x,this.y+this.lineHeight*i);
	}
	zyGame.draw.restore();
};









/**********************************************************
线(line)类
**********************************************************/

zyGame.cls.line=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.line.prototype.onInit=function(x,y,w,h){
	this.strokeStyle='#000000';
	this.lineWidth=1;
	this.lineCap='butt';//butt,round,square
};
/***************************** 控件方法 *****************************/
//设置风格
zyGame.cls.line.prototype.setStyle=function(c,lw,lc){
	this.strokeStyle=c;
	this.lineWidth=lw;
	this.lineCap=lc;
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.line.prototype.onDraw=function(){
	zyGame.draw.setLineStyle(this.strokeStyle,this.lineWidth,this.lineCap);
	zyGame.draw.line(this.x,this.y,this.width,this.height);
};


/**********************************************************
矩形(rect)类
**********************************************************/

zyGame.cls.rect=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.cls.rect.prototype.onInit=function(x,y,w,h){
	this.fillStyle='#ffffff';
	this.rectShowed=0;//设置不显示背景

	this.strokeStyle='#000000';
	this.lineWidth=1;
	this.lineCap='butt';//butt,round,square
	this.borderShowed=0;//设置不显示边框
};
/***************************** 控件方法 *****************************/
//设置背景颜色
zyGame.cls.rect.prototype.setColor=function(c){
	this.fillStyle=c;
	this.rectShowed=1;
};
//设置背景填充(r可取值:repeat,repeat-x,repeat-y,no-repeat)
zyGame.cls.rect.prototype.setPattern=function(src,r){
	this.fillStyle=zyGame.draw.getPattern(src,r);
	this.rectShowed=1;
};
//设置边框
zyGame.cls.rect.prototype.setBorder=function(c,lw,lc){
	if (c!==''){
		this.strokeStyle=c;
	}
	if (typeof(lw)!='undefined'){
		if (lw!==''){
			this.lineWidth=lw;
		}
	}
	if (typeof(lc)!='undefined'){
		if (lc!==''){
			this.lineCap=lc;
		}
	}
	this.borderShowed=1;
};
/***************************** 控件事件 *****************************/
//绘制控件
zyGame.cls.rect.prototype.onDraw=function(){
	if (this.rectShowed==1){
		zyGame.draw.rect(this.fillStyle,this.x,this.y,this.width,this.height);
	}
	if (this.borderShowed==1){
		zyGame.draw.setLineStyle(this.strokeStyle,this.lineWidth,this.lineCap);
		zyGame.draw.border(this.x,this.y,this.width,this.height);
	}
};


/**********************************************************
刷新率(fps)类
**********************************************************/

zyGame.plg.fps=zyGame.util.extend(zyGame.mth.base);

//初始化
zyGame.plg.fps.prototype.onInit=function(x,y,w,h){
	this.fps=0;
	this.frame=0;
	this.lastTime=Date.now();

	this.text=new zyGame.cls.text(0,0);
	this.text.setText('');
	this.text.show();
};
/***************************** 控件方法 *****************************/
//fps显示格式
zyGame.plg.fps.prototype.onSetText=function(){
	this.text.setText('fps:'+this.fps);
};
//绘制控件
zyGame.plg.fps.prototype.onDraw=function(){
	this.frame++;

 	var now=Date.now();
	if ((now-this.lastTime)>=1000){
		this.lastTime=now;
		this.fps=this.frame;
		this.frame=0;
		this.onSetText();
	}
};






/**********************************************************
帧式动画(gif)类
**********************************************************/

zyGame.plg.gif=zyGame.util.extend(zyGame.cls.image);

//初始化
zyGame.plg.gif.prototype.onInit=function(x,y,w,h){
	this.setSrcRect(0,0,'','');
	this.loop=1;
	this.speed=100;
	this.playing=0;
	this.animate.add('frame');
};
/***************************** 控件方法 *****************************/
//设置图源
zyGame.plg.gif.prototype.setSrc=function(src){
	this.src=src;
	this.frames=Math.ceil(zyGame.src.img[src].width/this.width);//根据源图的宽度计算出帧数
};
//设置循环(0-不循环，1循环)
zyGame.plg.gif.prototype.setLoop=function(loop){
	this.loop=loop;
};
//设置速度(每帧间隔时长，单位毫秒)
zyGame.plg.gif.prototype.setSpeed=function(speed){
	this.speed=speed;
	if (this.playing==1){
		this.stop();
		this.play();
	}
};
//开始播放
zyGame.plg.gif.prototype.play=function(){
	this.playing=1;
	this.frame(this.frames,this.speed*this.frames,this.loop,this.onPlay);
};
//停止播放
zyGame.plg.gif.prototype.stop=function(){
	this.animate.stop('frame');
	this.playing=0;
	this.showFrame(0);//恢复到第一帧
};
//显示指定帧
zyGame.plg.gif.prototype.showFrame=function(i){
	this.setSrcRect(this.width*i,0,'','');
};
/***************************** 控件事件 *****************************/
//播放
zyGame.plg.gif.prototype.onPlay=function(i){
	this.showFrame(i%this.frames);
};
//显示
zyGame.plg.gif.prototype.onShow=function(){
	this.play();
};
//隐藏
zyGame.plg.gif.prototype.onHide=function(){
	this.stop();
};





/**********************************************************
初始化模块
**********************************************************/

zyGame.object=new zyGame.cls.object();

window.onload=function(){
	zyGame.init();
};

//初始化
zyGame.init=function(){
	//继承dom
	this.doc=document;
	this.body=this.doc.body;
	this.cvs=this.doc.getElementsByTagName('canvas')[0];
	this.ctx=this.cvs.getContext('2d');
	this.debug=this.doc.getElementById('debug');

	//加载设备信息
	this.env.device['clientWidth']=this.doc.documentElement.clientWidth;
	this.env.device['clientHeight']=this.doc.documentElement.clientHeight;
	this.env.device['screenWidth']=screen.width;
	this.env.device['screenHeight']=screen.height;
	this.env.device['platform']=navigator.platform;

	//初始设置
	if (typeof(this.con['start'])!='function'){
		this.setConfig({'start':this.onStart});
	}
	this.con.bodymargin=this.body.style.margin;
	this.setTitle(this.con.title);
	this.setLocation(0,0);
	this.setMinSize(this.con.width,this.con.height);
	if (this.con.fullscreen==1){
		this.fullscreen.on();
	}else{
		zyGame.setSize(this.con.width,this.con.height);
	}
	this.setFpsLimit();
	this.timer.on();
	if (this.con.src.length==0){
		this.con.start();
	}else{
		this.load.load(this.con.src,this.con.start);
	}

	//[添加/屏蔽]事件监听
	if (!document.ontouchstart){
		this.event.add('mousedown');
		this.event.add('mouseup');
		this.event.add('mousemove');
		this.event.disable('contextmenu');
		this.event.disable('selectstart');
	}else{
		this.event.add('touchstart');
		this.event.add('touchend');
		this.event.add('touchmove');
		this.event.add('touchcancel');
		this.event.add('orientationchange');
		this.event.onOrientationchange();
	}
	this.event.add('resize');
};

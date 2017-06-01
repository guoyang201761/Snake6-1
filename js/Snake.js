//**********************设置项目所需参数**********************//
//蛇头向上
var topImg = new Image();
topImg.src = "";
//蛇头向左
var leftImg = new Image();
leftImg.src = "";
//蛇头向右
var rightImg = new Image();
rightImg.src = "";
//蛇头向下
var bottomImg = new Image();
bottomImg.src = "";
//蛇身图片
var bodyImg = new Image();
bodyImg.src = "";
//食物图片
var foodImg = new Image();
foodImg.src = "";
//背景1图片
var bgImg1 = new Image();
bgImg1.src = "";
//背景2图片
var bgImg2 = new Image();
bgImg2.src = "";
//背景3图片
var bgImg3 = new Image();
bgImg3.src = "";
//游戏开始图片
var startImg = new Image();
startImg.src = "";
//开始图片放在最后加载，这样可以无需判断onload加载

//**********************创建蛇的函数**********************//
function Snake(){
	//*************创建画布及内部各项参数及数值*************//
	this.canvas = $("#gameview")[0];		//创建canvas画布对象
	this.ctx = this.canvas.getContext("2d");//创建画笔
	this.width = 500;						//游戏屏幕的宽度
	this.height = 500;						//游戏屏幕的高度
	this.step = 25;							//设定蛇每移动一次的长度
	this.stepX = Math.floor(this.width / this.step);//X轴步数
	this.stepY = Math.floor(this.height / this.step);//Y轴步数
	this.snakeBodyList = [];				//创建蛇身数组
	this.foodList = [];						//创建食物数组
	this.timer = null;						//蛇动的定时器，每动一步的时间间隔
	this.score = 0;							//每吃一次所加的分数
	
	//*************画蛇*************//
	//算法：循环生成一个snakeBodyList数组(默认蛇在中间，蛇头向左)[{x:横坐标,y:纵坐标,img:图片,direct:方向},......]
	this.drawSnake = function(){
		if(this.snakeBodyList.length<5){
			for(var i=0;i<5;i++){
				//{x:横坐标,y:纵坐标，img:图片,direct:运动方向}蛇的节点设计
					this.snakeBodyList.push({
					x: Math.floor(this.stepX / 2) + i - 2, //注意：x不是px像素坐标点，而是x轴步数
					y: Math.floor(this.stepY / 2), //注意：这是y轴步数
					img: bodyImg,
					direct: "left"
				});
			}	
			//替换snakeBodyList数组第一个元素的img，替换成westImg蛇头图片
		this.snakeBodyList[0].img = westImg;
		}
		//遍历snakeBodyList数组，并画出蛇的初始状态
		for(var i = 0; i < this.snakeBodyList.length; i++) {
			var snode = this.snakeBodyList[i];
			this.ctx.drawImage(snode.img, snode.x * this.step,
				snode.y * this.step, this.step, this.step);
		}
		}
	
	this.drawFood = function(){//画食物
	//当食物已经存在的时候，画面刷新时，食物在原有位置重绘；
	if(this.foodList.length > 0){
		var fnode = this.foodList[0];
		this.ctx.drawImage(fnode.img,fnode.x * this.step, fnode.y * this.step, this.step, this.step);
		return;
	}
	//如果食物没有（食物没有或者刚开始的时候），生成X,Y随机坐标，判断是否与蛇身重复
	//如果重复，重绘，调用this.drawFood(),否则，按照随机生成的点push到数组中，绘制图案
	var foodX = Math.floor(Math.random()*this.stepX);
	var foodY = Math.floor(Math.random()*this.stepY);
	var foodFlag = false;
	//此处判断食物与蛇身是否重复标识位，true=>重复； false=>不重复；
	for(var i = 0;i < this.snakeBodyList.length; i++){
		var snode1 = this.snakeBodyList[0];
		if(foodX == snode1.x && foodY == snode1.y){
			foodFlag = true;
		}
	}
	if(foodFlag){
		this.drawFood();//如果重复就重绘
	}else{
		this.foodList.push({
			x: foodX,
			y: foodY,
			img: foodImg
		})//新生成一个食物
		var fnode = this.foodList[0];
		this.ctx.drawImage(fnode.img, fnode.x * this.step, fnode.y * this.step, this.step, this.step)
	}
	
}
	}
	
	
	
	
	

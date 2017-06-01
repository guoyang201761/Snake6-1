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
function Snake() {
	//*************创建画布及内部各项参数及数值*************//
	this.canvas = $("#gameview")[0]; //创建canvas画布对象
	this.ctx = this.canvas.getContext("2d"); //创建画笔
	this.width = 500; //游戏屏幕的宽度
	this.height = 500; //游戏屏幕的高度
	this.step = 25; //设定蛇每移动一次的长度
	this.stepX = Math.floor(this.width / this.step); //X轴步数
	this.stepY = Math.floor(this.height / this.step); //Y轴步数
	this.snakeBodyList = []; //创建蛇身数组
	this.foodList = []; //创建食物数组
	this.timer = null; //蛇动的定时器，每动一步的时间间隔
	this.score = 0; //每吃一次所加的分数

	//*************画蛇*************//
	//算法：循环生成一个snakeBodyList数组(默认蛇在中间，蛇头向左)[{x:横坐标,y:纵坐标,img:图片,direct:方向},......]
	this.drawSnake = function() {
		if(this.snakeBodyList.length < 5) {
			for(var i = 0; i < 5; i++) {
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

	this.drawFood = function() { //画食物
		//当食物已经存在的时候，画面刷新时，食物在原有位置重绘；
		if(this.foodList.length > 0) {
			var fnode = this.foodList[0];
			this.ctx.drawImage(fnode.img, fnode.x * this.step, fnode.y * this.step, this.step, this.step);
			return;
		}
		//如果食物没有（食物没有或者刚开始的时候），生成X,Y随机坐标，判断是否与蛇身重复
		//如果重复，重绘，调用this.drawFood(),否则，按照随机生成的点push到数组中，绘制图案
		var foodX = Math.floor(Math.random() * this.stepX);
		var foodY = Math.floor(Math.random() * this.stepY);
		var foodFlag = false;
		//此处判断食物与蛇身是否重复标识位，true=>重复； false=>不重复；
		for(var i = 0; i < this.snakeBodyList.length; i++) {
			var snode1 = this.snakeBodyList[0];
			if(foodX == snode1.x && foodY == snode1.y) {
				foodFlag = true;
			}
		}
		if(foodFlag) {
			this.drawFood(); //如果重复就重绘
		} else {
			this.foodList.push({
				x: foodX,
				y: foodY,
				img: foodImg
			}) //新生成一个食物
			var fnode = this.foodList[0];
			this.ctx.drawImage(fnode.img, fnode.x * this.step, fnode.y * this.step, this.step, this.step)
		}

	}
	
	
	
	 // 蛇死（碰到边界或碰到自身--dead 弹出得分界面）
	 
	this.dead = function() {
		const LEFT_END = 0;//左边界
		const RIGHT_END = this.stepX;//右边界
		const NORTH_END = 0;//上边界
		const SOUTH_END = this.stepY;//下边界
		const headX = this.snakeBodyList[0].x;//蛇头横坐标x
		const headY = this.snakeBodyList[0].y;//蛇头纵坐标y
		//判断边界
		if(headX < LEFT_END-1 || headY < NORTH_END-1 || headX > RIGHT_END || headY > SOUTH_END){
			this.isDead = true;
			$("#snakeDead").prop("src","../music/gameover.mp3"); //播放死亡时的音乐声音
			return;//精简判断过程
		}
		//判断是否撞到自身
		for(var k = this.snakeBodyList.length-1;k>0;k--){
			if(this.snakeBodyList[k].x == headX && this.snakeBodyList[k].y == headY){
				this.isDead = true;
				$("#player").prop("src","../music/gameover.mp3"); //播放死亡时的音乐声音
			}			
		}
	}
	

	/*
	 *蛇动（事件改变蛇移动方向，判断蛇是否死掉，然后判断蛇是否吃了食物，之后蛇移动）
	 *判断设备如果是pc，响应键盘事件，否则，响应触屏事件
	 *生成键盘事件处理器this.keyHandler()，和触屏事件处理器this.touchHandler()
	 */
	this.keyHandler = function() { //键盘事件处理器
		//事件处理是异步的，无法传递this对象
		var _this = this;
		document.onkeydown = function(ev) {
			var ev = ev || window.event;
			//			console.log(ev.key+":"+ev.keyCode);
			switch(ev.keyCode) {
				case 37: //向左
					_this.snakeBodyList[0].img = leftImg;
					_this.snakeBodyList[0].direct = 'left';
					break;
				case 38: //向上
					_this.snakeBodyList[0].img = topImg;
					_this.snakeBodyList[0].direct = 'top';
					break;
				case 39: //向右
					_this.snakeBodyList[0].img = rightImg;
					_this.snakeBodyList[0].direct = 'right';
					break;
				case 40: //向下
					_this.snakeBodyList[0].img = bottomImg;
					_this.snakeBodyList[0].direct = 'bottom';
					break;
			}
		}
	}

	this.touchHandler = function() { //触屏事件处理器
		var _this = this;
		document.addEventListener("touchstart", function(ev) {
			var ev = ev || window.event;
			//			console.log(ev);
			var touchX = ev.changedTouches[0].clientX;
			var touchY = ev.changedTouches[0].clientY;
			console.log(touchX + ":" + touchY);
			var head = _this.snakeBodyList[0];
			var headX = head.x * _this.step; //注意蛇头x坐标值与px的转换  乘以_this.step
			var headY = head.y * _this.step; //注意蛇头x坐标值与px的转换  乘以_this.step
			if(head.direct == "top" || head.direct == "bottom") {
				if(touchX < headX) {
					head.direct = "left";
					head.img = westImg;
				} else {
					head.direct = "right";
					head.img = eastImg;
				}
			} else if(head.direct == "left" || head.direct == "right") {
				if(touchY < headY) {
					head.direct = "top";
					head.img = northImg;
				} else {
					head.direct = "bottom";
					head.img = southImg;
				}
			}

		})

	}

	this.move = function() {

		if(!this.isPhone) {
			this.keyHandler();
		} else {
			this.touchHandler();
		}
		//运用定时器，每隔0.2秒移动蛇
		var _this = this;
		this.timer = setInterval(function() {
			//解决蛇身跟随的问题
			for(var i = _this.snakeBodyList.length - 1; i > 0; i--) {
				_this.snakeBodyList[i].x = _this.snakeBodyList[i - 1].x;
				_this.snakeBodyList[i].y = _this.snakeBodyList[i - 1].y;
			}
			//其次，根据方向及坐标，处理蛇头的移动新坐标
			var shead = _this.snakeBodyList[0];
			switch(shead.direct) {
				case 'top':
					shead.y--;
					break;
				case 'bottom':
					shead.y++;
					break;
				case 'left':
					shead.x--;
					break;
				case 'right':
					shead.x++;
					break;
			}
			// 判断，蛇移动后新位置是否已经触边界，或触自身  true--dead
			_this.dead(); //判断蛇生死，isDead
			if(_this.isDead) {
				//alert你的最终分数
				console.log("分数为:" + _this.score);
				//重新开始游戏restart（）方法
				clearInterval(_this.timer); //如果不清除定时器，则速度会不断加快
				_this.isDead = false; //改变isDead状态，否则，每次直接死掉
				_this.snakeBodyList = []; //清除蛇身，便于重新开始游戏，重绘初始界面
				$(_this.canvas).hide(2000);
			} else {
				//false：若蛇活着，判断蛇头是否与食物的坐标点一致，如果一致，清空食物数组（多个食物时，可以使用标识位）
				_this.eat(); //判断食物是否被吃掉
				if(_this.isEaten) {
					_this.isEaten = false;
					//清空食物数组
					_this.foodList = [];
					//加分
					_this.score += 10;
					//蛇身长一节
					var lastNodeIndex = _this.snakeBodyList.length;
					_this.snakeBodyList[lastNodeIndex] = {
						x: -2,
						y: -2,
						img: bodyImg,
						direct: _this.snakeBodyList[lastNodeIndex - 1].direct
					};
				}
				//否则重绘
				_this.paint(); //重绘游戏画面
			}
		}, 200);
	}
	
	
	 //蛇吃食物（蛇头坐标与食物坐标一致）
	 
	this.eat = function(){
		const HEAD_X = this.snakeBodyList[0].x;//蛇头横坐标x
		const HEAD_Y = this.snakeBodyList[0].y;//蛇头纵坐标y
		const FOOD_X = this.foodList[0].x;//食物横坐标x
		const FOOD_Y = this.foodList[0].y;//食物纵坐标y
		if(HEAD_X == FOOD_X && HEAD_Y == FOOD_Y){
			this.isEaten = true;
			$("#snakeEat").prop("src","../music/eat.mp3"); //播放声音
		}
	}
}
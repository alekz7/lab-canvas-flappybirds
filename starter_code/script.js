window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // Classes

  function Cloud(){
  	this.x = canvas.width;
  	this.y = 0;
  	//this.width = canvas.width;
  	//this.height = canvas.height;
  	this.width = 50;
  	this.height = 50;
  	this.img = new Image();
  	this.img.src = 'images/cloud.png';

  	this.img.onload = function(){
  		this.draw();
  	}.bind(this); // cambiar el apuntador de img a Board

  	this.move = function(){
  		this.x--;
  		if(this.x < -canvas.width) this.x = 0;
  	}

  	this.draw = function(){
  		console.log("pintando cloud");
  		this.move();
  		ctx.drawImage(this.img, this.x, this. y, this.width, this.height);
  		ctx.drawImage(this.img, (this.x + this.width), this. y, this.width, this.height);
  	}
  }

  function Board(){
  	this.x = 0;
  	this.y = 0;
  	this.width = canvas.width;
  	this.height = canvas.height;
  	this.score = 0;
  	this.img = new Image();
  	this.img.src = 'images/bg.png';
  	this.sound = new Audio();
  	this.sound.src = "sound/mario.mp3";
  	this.sound2 = new Audio();
  	this.sound2.src = "sound/mario-gameover.mp3"

  	this.img.onload = function(){
  		this.draw();
  	}.bind(this); // cambiar el apuntador de img a Board

  	this.move = function(){
  		this.x--;
  		if(this.x < -canvas.width) this.x = 0;
  	}

  	this.draw = function(){  		
  		this.move();
  		ctx.drawImage(this.img, this.x, this. y, this.width, this.height);
  		ctx.drawImage(this.img, (this.x + this.width), this. y, this.width, this.height);
  	}

  	this.drawScore = function(){
  		this.score = Math.floor(frames/60);
  		ctx.font = "50px Avenir";
  		ctx.fillStyle = "orange";
  		ctx.fillText("Puntos: " + this.score, this.width/2, this.y + 50);
  	}

  }

  function Flappy(){
  	this.x = 150;
  	this.y = 150;
  	this.width = 50;
  	this.height = 50;
  	this.img = new Image();
  	this.img.src = "images/flappy.png"; //punto y coma  		
  	this.sound = new Audio();
  	this.sound.src = "sound/mario-jump.wav";
  	this.sound.currentTime = 1;

  	this.img.onload = function(){
  		this.draw();  		
  	}.bind(this);

  	this.draw = function(){
  		this.y += 1;
  		ctx.drawImage(this.img, this.x, this.y,this.width, this.height);
  		if (this.y < 0 || this.y > canvas.height - this.height) gameOver();
  	}

  	this.move = function(){
  		this.sound.currentTime = 1;
  		this.sound.play();
  		this.y -= 50;
  	}

  	this.isTouching = function(pipe){
  		return 	(this.x < pipe.x + pipe.width) && 
  				(this.x + this.width > pipe.x) &&
  				(this.y < pipe.y + pipe.height) &&
  				(this.y + this.height > pipe.y);
  	}

  }  

  function Pipe(y,height, type){
  	this.x = canvas.width;
  	this.y = y;
  	this.width = 50;
  	this.height = height;
  	this.img = new Image();
  	this.img2 = new Image();
  	this.img.src = "images/obstacle_top.png";
  	this.img2.src = "images/obstacle_bottom.png";

  	this.draw = function(){  		
  		this.x--;  		
  		if (type) ctx.drawImage(this.img, this.x, this.y,this.width, this.height);
  		else ctx.drawImage(this.img2, this.x, this.y,this.width, this.height);
  		// ctx.fillStyle = 'green';
  		// ctx.fillRect(this.x,this.y,this.width,this.height);		
  	}
  }

  // listeners
  addEventListener('keydown', function(e){
  	if (e.keyCode === 32){
  		flappy.move();
  	}
  });

  // Declaraciones - Instancia
  var intervalo;
  var frames = 0;
  var board = new Board();
  var flappy = new Flappy();
  var cloud = new Cloud();
  var pipes = [];

  // aux
  function gameOver(){
  	stop();
  	ctx.font = "120px courier";
  	ctx.strokeStyle = 'red';
  	ctx.lineWidth = 8;
  	ctx.strokeText("Game Over",50,200);  
  	board.sound.pause();
  	board.sound2.play();
  }

  function generatePipes(){
  	let cadaCuantosFramesApareceOtroPipe;
  	// cadaCuantosFramesApareceOtroPipe = ((Math.floor(Math.random() * 3)) * 75) + 40;
  	cadaCuantosFramesApareceOtroPipe = (Math.floor(Math.random() * 6) + 2) * 50;
  	cadaCuantosFramesApareceOtroPipe = 300;
  	console.log(cadaCuantosFramesApareceOtroPipe);
  	if(!(frames%cadaCuantosFramesApareceOtroPipe ===0)) return;
  	var ventanita = 150;
  	var randomHeight = Math.floor(Math.random() * 200) + 50;
  	var pipe = new Pipe(0, randomHeight, true);
  	var pipe2 = new Pipe(randomHeight + ventanita, canvas.height - (randomHeight + ventanita), false);
  	pipes.push(pipe);
  	pipes.push(pipe2);
  }

  function drawPipes(){  	
  	pipes.forEach(function(pipe){
  		pipe.draw();
  	});
  }

  function checkColition(){
  	pipes.forEach(function(pipe){
  		if(flappy.isTouching(pipe)) gameOver();
  	})
  }

  // Main - Core
  function update(){
  	frames ++;
  	console.log(frames);
  	ctx.clearRect(0,0,canvas.width,canvas.height);
  	console.log("board");
  	board.draw();  	
  	drawPipes();
  	flappy.draw();
  	cloud.draw();
  	generatePipes();
  	board.drawScore();  	
  	checkColition();  	
  }

  function stop(){
  	clearInterval(intervalo);
  	intervalo = 0;
  }

  function startGame() {
  	console.log("startGame");
  	if (intervalo>0) return;
  	else {
  		intervalo=setInterval( function(){
  			update();
  		}, 1000/60)
  	}
  	board.sound.play();
  }
};

/*Main program*/

/*Canvas*/
var canvas;

/*Context*/
var context;

/*CONSTANTS*/
var pixPerCell = 32;

/*Variables*/
var maze;
var byteman;
var gGhost;
var bGhost;
var rGhost;
var yGhost;
var apple;
var cherry;
var cabbage;
var potato;
var powerSprite;
var score = 0;
var win = false;
var gameOver = false;

/*Loading(!!)*/
var spriteLoaded = new Array();

/*Sound
*RETURN: Key array with byteman sounds
*/
function playSound(duration, freq){
    var audioContext= new webkitAudioContext();
    var osc = audioContext.createOscillator();
    osc.frequency.value = freq;
    osc.connect(audioContext.destination);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);
}

/*Functions that don't quite fit into any objects*/

/*Check if the byteman has collided with any objects and react accordingly*/
function checkCollisions(){
	/*If the byteman collides with a ghost consider if he is powered up or not
		If he is powered up, he eats the ghost and scored a point and loses the power up*/
	if(byteman.getXPos() == gGhost.getXPos() && byteman.getYPos() == gGhost.getYPos()){
		if(byteman.isPowered()){
			gGhost.setPos(gGhost.getInitialX(), gGhost.getInitialY());
			byteman.togglePowered();
			score++;
		}
		/*If he isn't, game over*/
		else
			gameOver = true;
	}
	else if(byteman.getXPos() == bGhost.getXPos() && byteman.getYPos() == bGhost.getYPos()){
		if(byteman.isPowered()){
			bGhost.setPos(bGhost.getInitialX(), bGhost.getInitialY());
			byteman.togglePowered();
			score++;
		}
		else
			gameOver = true;
	}
	else if(byteman.getXPos() == rGhost.getXPos() && byteman.getYPos() == rGhost.getYPos()){
		if(byteman.isPowered()){
			rGhost.setPos(rGhost.getInitialX(), rGhost.getInitialY());
			byteman.togglePowered();
			score++;
		}
		else
			gameOver = true;
	}
	else if(byteman.getXPos() == yGhost.getXPos() && byteman.getYPos() == yGhost.getYPos()){
		if(byteman.isPowered()){
			yGhost.setPos(yGhost.getInitialX(), yGhost.getInitialY());
			byteman.togglePowered();
			score++;
		}
		else
			gameOver = true;
	}
	
	/*Check if byteman collides with any of the power ups and it isn't already eaten
		If so, set it to eaten and increase the score, byteman is now powered up*/
	if(byteman.getXPos() == apple.getXPos() && byteman.getYPos() == apple.getYPos() && !apple.isEaten() && !byteman.isPowered()){
		apple.toggleEaten();
		byteman.powerUp();
		score++;
	}
	else if(byteman.getXPos() == cherry.getXPos() && byteman.getYPos() == cherry.getYPos() && !cherry.isEaten() && !byteman.isPowered()){
		cherry.toggleEaten();
		byteman.powerUp();
		score++;
	}	
	else if(byteman.getXPos() == potato.getXPos() && byteman.getYPos() == potato.getYPos() && !potato.isEaten() && !byteman.isPowered()){
		potato.toggleEaten();
		byteman.powerUp();
		score++;
	}
	else if(byteman.getXPos() == cabbage.getXPos() && byteman.getYPos() == cabbage.getYPos() && !cabbage.isEaten() && !byteman.isPowered()){
		cabbage.toggleEaten();
		byteman.powerUp();
		score++;
	}
}

/*Set whether the ghosts run away from byteman or not*/
function checkPowered(){
	if(byteman.isPowered())
		Ghost.running = true;
	else
		Ghost.running = false;
}

/*Reset all game variables to their initial positions*/
function resetGame(){
		score = 0;
		timeElapsed = 0;
		byteman.direction = 3;
		apple.setPos(0, 0);
		apple.setEaten(false);
		cherry.setPos(0, 9);
		cherry.setEaten(false);
		cabbage.setPos(9, 0);
		cabbage.setEaten(false);
		potato.setPos(9, 9);
		potato.setEaten(false);
		byteman.setPos(4, 3);
		rGhost.setPos(4, 4);
		bGhost.setPos(5, 4);
		yGhost.setPos(4, 5);
		gGhost.setPos(5, 5);
		gameOver = false;
}

/*key handler*/
function onKeyDown(event){
	switch(event.which){
		//West
		case 37:
			byteman.queueDirection(3);
			break;
		//East
		case 39:
			byteman.queueDirection(1);
			break;
		//North
		case 38:
			byteman.queueDirection(0);
			break;
		//South
		case 40:
			byteman.queueDirection(2);
			break;
	}	
	event.preventDefault();
}

/*Initialise all variables, load all required sprites and set starting positions*/
function initByteman(){
	canvas = $('#game');
	context = $('#game')[0].getContext("2d");
	
	$(document).keydown(onKeyDown);
	
	/*Create objects*/
	maze = new Maze();
	byteman = new Byteman(maze);
	gGhost = new Ghost(byteman);
	bGhost = new Ghost(byteman);
	rGhost = new Ghost(byteman);
	yGhost = new Ghost(byteman);
	apple = new PowerUp();
	cherry = new PowerUp();
	cabbage = new PowerUp();
	potato = new PowerUp();
	powerSprite = new Image();
	
	/*Load sprites*/
	rGhost.setSprite("images/rGhost.gif");
	bGhost.setSprite("images/bGhost.gif");
	yGhost.setSprite("images/yGhost.gif");
	gGhost.setSprite("images/gGhost.gif");
	apple.setSprite("images/apple.gif");
	cherry.setSprite("images/cherry.gif");
	cabbage.setSprite("images/cabbage.gif");
	potato.setSprite("images/potato.gif");
	byteman.setSprite(spriteURL);
	powerSprite.src = "images/poweredup.png";
	/*byteman.setPoweredSprite("images/byteman3.gif");*/

	/*Set initial positions*/
	apple.setPos(0, 0);
	cherry.setPos(0, 9);
	cabbage.setPos(9, 0);
	potato.setPos(9, 9);
	byteman.setPos(4, 3);
	rGhost.setPos(4, 4);
	bGhost.setPos(5, 4);
	yGhost.setPos(4, 5);
	gGhost.setPos(5, 5);
	
	var intervalID = setInterval(function(){ 
            //playSound(300, 1);
            logicByteman();
            logicGeneral();
            drawByteman(); 
            logicGhost();
            logicGeneral();
            drawByteman();
	}, 500);
}

/*Computer all logical functions*/
function logicByteman(){
	checkPowered();
	checkCollisions();
	byteman.updatePos();   	
}

function logicGhost(){
    checkCollisions();
	rGhost.updatePos();
	gGhost.updatePos();
	bGhost.updatePos();
	yGhost.updatePos();
}

function logicGeneral(){
	if(score == 8){
		win = true;
	}
	if(gameOver){
		resetGame();
		gameOver = false;
	}
}

/*Call all drawing methods*/
function drawByteman(){
	if(!win){
		context.drawImage(maze.getSprite(), 0, 0);
		/*entity getX/getY functions return a cell number 0-9, not pixel coordinates, hence are multiplied by the pixels in a cell(32)
			Do not draw powerups if they have been eaten!*/
		if(!apple.isEaten())	
			context.drawImage(apple.getSprite(), apple.getXPos()*pixPerCell, apple.getYPos()*pixPerCell);
		if(!cherry.isEaten())	
			context.drawImage(cherry.getSprite(), cherry.getXPos()*pixPerCell, cherry.getYPos()*pixPerCell);
		if(!cabbage.isEaten())	
			context.drawImage(cabbage.getSprite(), cabbage.getXPos()*pixPerCell, cabbage.getYPos()*pixPerCell);
		if(!potato.isEaten())	
			context.drawImage(potato.getSprite(), potato.getXPos()*pixPerCell, potato.getYPos()*pixPerCell);
	
		/*Dynamic things have to be drawn last*/
		context.drawImage(rGhost.getSprite(), rGhost.getXPos()*pixPerCell, rGhost.getYPos()*pixPerCell);
		context.drawImage(bGhost.getSprite(), bGhost.getXPos()*pixPerCell, bGhost.getYPos()*pixPerCell);
		context.drawImage(gGhost.getSprite(), gGhost.getXPos()*pixPerCell, gGhost.getYPos()*pixPerCell);
		context.drawImage(yGhost.getSprite(), yGhost.getXPos()*pixPerCell, yGhost.getYPos()*pixPerCell);
		context.drawImage(byteman.getSprite(), byteman.getXPos()*pixPerCell, byteman.getYPos()*pixPerCell, 32, 32);
		if(byteman.isPowered())
			context.drawImage(powerSprite, byteman.getXPos()*pixPerCell, byteman.getYPos()*pixPerCell);
        context.fillText("Score: " + score, 10, 20);
	}
	else{
		context.font="40px serif"
        context.fillText("YOU WIN!", 65, 150);
	} 
}	


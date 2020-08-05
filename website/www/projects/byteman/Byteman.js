//Requires Maze.js

/*A class for the main controlled character*/
function Byteman(aMaze){
	this.sprite = new Image();
	/*this.poweredSprite = new Image();*/
	this.xPosition = 0;
	this.yPosition = 0;
	this.powered = false;
	this.direction = 3;
	this.maze = aMaze;
	/*Uses a queue so actions can be executed after they have been input*/
	this.directionQueue = new Array();
}

/*Move functions*/
Byteman.prototype.moveNorth = function(){
	this.yPosition -= 32;
}
Byteman.prototype.moveSouth = function(){
	this.yPosition += 32;
}
Byteman.prototype.moveEast = function(){
	this.xPosition += 32;
}
Byteman.prototype.moveWest = function(){
	this.xPosition -= 32;
}

/*Set whether pacman can eat ghosts*/
Byteman.prototype.togglePowered = function(){
	if(this.powered == false){
	 this.powered = true;
	}
	else{
		this.powered = false;
	}
}

Byteman.prototype.powerUp = function(){
    this.powered = true;
}

Byteman.prototype.powerDown = function(){
    this.powered = false;
}

/*Update position*/
Byteman.prototype.updatePos = function(){
	/*Get the most recent value from the queue*/
	var qDirection = this.directionQueue.shift()
	/*Check if you can go in the direction requested*/
	if(maze.canGoX(this.getXPos(), this.getYPos(), qDirection)){
		/*If you can, set it as the current direction*/
		this.direction = qDirection;
	}
	else
		/*if you can't, shift it back to the front of the queue and continue in the current direction*/
		this.directionQueue.unshift(qDirection);
	
	/*Execute a move in the current direction*/
	switch(this.direction){
		//North
		case 0:
			if(maze.canMoveNorth(this.getXPos(),this.getYPos())){
				this.moveNorth();
			}
			break;
		//East
		case 1:
			if(maze.canMoveEast(this.getXPos(),this.getYPos())){
				this.moveEast();
			}
			break;
		//South
		case 2:
			if(maze.canMoveSouth(this.getXPos(),this.getYPos())){
				this.moveSouth();
			}
			break;
		//West
		case 3:
			if(maze.canMoveWest(this.getXPos(),this.getYPos())){
				this.moveWest();
			}
			break;
	}
}

/*Function for adding a direction to the queue*/
Byteman.prototype.queueDirection = function(directionNum){
	if(this.directionQueue.length == 0){
		this.directionQueue.push(directionNum);
	}
	else{
		this.directionQueue.shift();
		this.directionQueue.push(directionNum);
	}
}

/*Set functions*/
Byteman.prototype.setPos = function(newXPos, newYPos){
	this.xPosition = newXPos*32;
	this.yPosition = newYPos*32;
}

Byteman.prototype.setXPos = function(newXPos){
	this.xPosition = newXPos*32;
}

Byteman.prototype.setYPos = function(newYPos){
	this.yPosition = newYPos*32;
}

Byteman.prototype.setSprite = function(imageURL){
	this.sprite.src = imageURL;
}

Byteman.prototype.setPoweredSprite = function(imageURL){
	this.poweredSprite.src = imageURL;
}

/*Get functions*/
Byteman.prototype.getXPos = function(){
	return this.xPosition/32;
}

Byteman.prototype.getYPos = function(){
	return this.yPosition/32;
}

Byteman.prototype.isPowered = function(){
	return this.powered;
}

Byteman.prototype.getSprite = function(){
	return this.sprite;
}

Byteman.prototype.getDirectionQueue = function(){
	return this.directionQueue;
}

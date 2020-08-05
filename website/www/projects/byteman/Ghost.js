
/*A class to house the basic functions of the ghosts*/
function Ghost(aByteman){
	this.xPosition = 0;
	this.yPosition = 0;
	this.initialX = 0;
	this.initialY = 0;
	this.sprite = new Image();
	this.byteman = aByteman;
}

/*Class variable so I can set all of the ghosts to run with a single change*/
Ghost.running = false;

/*Move functions*/
Ghost.prototype.moveNorth = function(){
	this.yPosition -= 32;
}

Ghost.prototype.moveSouth = function(){
	this.yPosition += 32;
}

Ghost.prototype.moveWest = function(){
	this.xPosition -= 32;
}

Ghost.prototype.moveEast = function(){
	this.xPosition += 32;
}


/*How do I into pathfinding hurr - an attempt at the A* algorithm*/
/*ToDo: Add difficulty scaler to modify the % choice error?*/
Ghost.prototype.updatePos = function(){
	/*Try to find the direction that will close the most distance*/
	var bestChoice = 0;
	var moveChoices = new Array();
	var moveDistances = new Array();
	/*Introduced so I have some way of connecting the original choices with the decisions*/
	var sortedMoveDistances = new Array();
	/*Used multiple times in the following comparisons*/
	var xDistance = this.getXPos() - this.byteman.getXPos();
	var yDistance = this.getYPos() - this.byteman.getYPos();
	
	/*Get a list of viable moves*/
	for(var i = 0; i < 4; i++){
		if(maze.canGoX(this.getXPos(), this.getYPos(), i)){
			moveChoices.push(i);
		}
	}
	
	/*Test each choice to see which has the least sum of squares distance*/
	for(var i = 0; i < moveChoices.length; i++){
		switch(moveChoices[i]){
			//North
			case 0:
				moveDistances.push(Math.pow(xDistance, 2) + Math.pow(((this.getYPos()-1) - this.byteman.getYPos()), 2));
				break;
			//East
			case 1:
				moveDistances.push(Math.pow(yDistance, 2) + Math.pow(((this.getXPos()+1) - this.byteman.getXPos()), 2));
				break;
			//South
			case 2:
				moveDistances.push(Math.pow(xDistance, 2) + Math.pow(((this.getYPos()+1) - this.byteman.getYPos()), 2));
				break;
			//West
			case 3:
				moveDistances.push(Math.pow(yDistance, 2) + Math.pow(((this.getXPos()-1) - this.byteman.getXPos()), 2));
				break;
		}
	}
	/*Copy the distances to a new array*/
	sortedMoveDistances = moveDistances.slice(0);
	/*Sort into numerical order, ascending*/
	sortedMoveDistances.sort(function(a, b){return a-b});
	/*Get the choice corresponding to the shortest distance via the trail of arrays*/
	bestChoice = moveChoices[moveDistances.indexOf(sortedMoveDistances[0])];
	//Make a wrong choice 25% of the time*/
	if(Math.random()*1 > 0.75){
		bestChoice = moveChoices[moveDistances.indexOf(sortedMoveDistances[1])];
	}
	/*Make a wrong choice 75% of the time if running away*/
	if(Ghost.running == true && Math.random()*1 > 0.25){
		bestChoice = moveChoices[moveDistances.indexOf(sortedMoveDistances[1])];
	}

	/*Execute the choice*/
	switch(bestChoice){
		//North
		case 0:
			this.moveNorth();
			break;
		//East
		case 1:
			this.moveEast();
			break;
		//South
		case 2:
			this.moveSouth();
			break;
		//West
		case 3:
			this.moveWest();
			break;
	}
	
}

/*Set functions*/
Ghost.prototype.setXPos = function(newXPos){
	this.xPosition = newXPos*32;
	this.initialX = newXPos*32;
}

Ghost.prototype.setYPos = function(newYPos){
	this.yPosition = newYPos*32;
	this.initialY = newYPos*32;
}

Ghost.prototype.setPos = function(newXPos, newYPos){
	this.xPosition = newXPos*32;
	this.initialX = newXPos*32;
	this.yPosition = newYPos*32;
	this.initialY = newYPos*32;
}

Ghost.prototype.setSprite = function(imageURL){
	this.sprite.src = imageURL;
}

/*Get functions*/
Ghost.prototype.getXPos = function(){
	return this.xPosition/32;
}

Ghost.prototype.getYPos = function(){
	return this.yPosition/32;
}

Ghost.prototype.getInitialX = function(){
	return this.initialX/32;
}

Ghost.prototype.getInitialY = function(){
	return this.initialY/32;
}

Ghost.prototype.isRunning = function(){
	return this.running;
}

Ghost.prototype.isEaten = function(){
	return this.eaten;
}

Ghost.prototype.getSprite = function(){
	return this.sprite;
}

/*A class for different powerup items*/
function PowerUp(aSprite){
	this.sprite = new Image();
	this.xPosition = 0;
	this.yPosition = 0;
	this.eaten = false;
}

/*Functions for setting positional variables*/
PowerUp.prototype.setXPos = function(newXPos){
	this.xPosition = newXPos*32;
}
PowerUp.prototype.setYPos = function(newYPos){
	this.yPosition = newYPos*32;
}

PowerUp.prototype.setPos = function(newXPos, newYPos){
	this.xPosition = newXPos*32;
	this.yPosition = newYPos*32;
}

/*Toggle whether the powerup has been eaten or not*/
PowerUp.prototype.toggleEaten = function(){
	if(this.eaten == false){
		this.eaten = true;
	}
	else{
		this.eaten = false;
	}
}
/*Set eaten rather than toggling*/
PowerUp.prototype.setEaten = function(aState){
	this.eaten = aState;
}
/*Set the image source of the sprite*/
PowerUp.prototype.setSprite = function(imageURL){
	this.sprite.src = imageURL;
}

/*Return functions*/
PowerUp.prototype.getXPos = function(){
	return this.xPosition/32;
}

PowerUp.prototype.getYPos = function(){
	return this.yPosition/32;
}

PowerUp.prototype.isEaten = function(){
	return this.eaten;
}

PowerUp.prototype.getSprite = function(){
	return this.sprite;
}
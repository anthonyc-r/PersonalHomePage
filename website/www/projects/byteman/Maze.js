
/*Maze class, contains information and methods relating to the game maze*/
function Maze(){
	this.sprite = new Image();
	this.sprite.src = "images/maze2.png";
	
	/*Wall info is stored as a 3d array, [x][y][z] returns whether you can go in the z direction from position (x, y).
		From 0, to 3, z stands from direction: N->E->S->W*/
	this.walls = [
					[[false,true,true,false],[true,false,true,false],[true,false,true,false],[true,true,true,false],[true,false,true,false],[true,false,true,false],[true,true,true,false],[true,false,true,false],[true,false,true,false],[true,true,false,false]],
					[[false,true,false,true],[false,true,true,false],[true,false,true,false],[true,false,true,true],[true,false,true,false],[true,false,true,false],[true,false,true,true],[true,false,true,false],[true,true,false,false],[false,true,false,true]],
					[[false,true,false,true],[false,true,true,true],[true,true,true,false],[true,true,true,false],[true,false,true,false],[true,false,true,false],[true,true,true,false],[true,true,true,false],[true,true,false,true],[false,true,false,true]],
					[[false,true,true,true],[true,true,false,true],[false,true,false,true],[false,true,true,true],[true,true,true,false],[true,true,true,false],[true,true,false,true],[false,true,false,true],[false,true,true,true],[true,true,false,true]],
					[[false,true,false,true],[false,true,false,true],[false,true,false,true],[false,true,false,true],[false,false,true,true],[true,false,false,true],[false,true,false,true],[false,true,false,true],[false,true,false,true],[false,true,false,true]],
					[[false,true,false,true],[false,true,false,true],[false,true,false,true],[false,true,false,true],[false,true,true,false],[true,true,false,false],[false,true,false,true],[false,true,false,true],[false,true,false,true],[false,true,false,true]],
					[[false,true,true,true],[true,true,false,true],[false,true,false,true],[false,true,true,true],[true,false,true,true],[true,false,true,true],[true,true,false,true],[false,true,false,true],[false,true,true,true],[true,true,false,true]],
					[[false,true,false,true],[false,true,true,true],[true,false,true,true],[true,false,true,true],[true,false,true,false],[true,false,true,false],[true,false,true,true],[true,false,true,true],[true,true,false,true],[false,true,false,true]],
					[[false,true,false,true],[false,false,true,true],[true,false,true,false],[true,true,true,false],[true,false,true,false],[true,false,true,false],[true,true,true,false],[true,false,true,false],[true,false,false,true],[false,true,false,true]],
					[[false,false,true,true],[true,false,true,false],[true,false,true,false],[true,false,true,true],[true,false,true,false],[true,false,true,false],[true,false,true,true],[true,false,true,false],[true,false,true,false],[true,false,false,true]],
					];;
}

/*Check if it's possible to move N, E, S , W from point (x, y)*/
Maze.prototype.canMoveNorth = function(x, y){
	return this.walls[x][y][0];
}

Maze.prototype.canMoveEast = function(x, y){
	return this.walls[x][y][1];
}

Maze.prototype.canMoveSouth = function(x, y){
	return this.walls[x][y][2];
}

Maze.prototype.canMoveWest = function(x, y){
	return this.walls[x][y][3];
}

/*Check if you can go in direction, d, from point(x, y)*/
Maze.prototype.canGoX = function(x, y, d){
	return this.walls[x][y][d];
}

/*For drawing the image of the maze*/
Maze.prototype.setSprite = function(aSprite){
	this.sprite = aSprite;
}

Maze.prototype.getSprite = function(){
	return this.sprite;
}
/*program variables*/
var context;
var mouseX=0;
var mouseY=0;
var oldX=0;
var oldY=0;

var pacman = new Image();

/*Check if doc is ready then initialise and run*/
$(document).ready(function() {
	init();
	run();
});

/*Get all initial variables ready*/
function init(){
	context = $('#game')[0].getContext("2d");
	$(document).keydown(onKeyDown);
	$(document).mousemove(onMouseMove);
	
	pacman.src = "images/maze.bmp";
}

/*main loop*/
function run(){
	var intervalID = setInterval(function(){
		render();
		logic();
	}, 10);
}

/*Update positions etc*/
function logic(){

}

/*Update what is drawn to the canvas*/
function render(){
	context.drawImage(pacman, 0, 0);
}

/*Called when a key is pressed*/
function onKeyDown(event){
	switch(event.which){
		case 37:
		break;
	}	
	event.preventDefault();
}

/*Called whenever the mouse is moved*/
function onMouseMove(event){
	mouseX = event.pageX - $('#game').offset().left;
	mouseY = event.pageY - $('#game').offset().top;
}

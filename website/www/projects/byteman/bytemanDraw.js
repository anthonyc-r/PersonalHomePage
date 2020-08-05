/*Canvas context*/
var context;
var canvas;
var draw = false;
var mouseX = 0;
var mouseY = 0;
var mouseXY = 0;
var prevMouseX = 0;
var prevMouseY = 0;

var drawIntervalID;
var spriteURL;

var finished = false;

/*CONSTANT*/
var pixPerCell = 32;

/*functions*/
/*getMouseXY was taken from the lecture examples*/
function getMouseXY(event) {
    var x = event.pageX - $('#game').offset().left;
    var y = event.pageY - $('#game').offset().top;
    return [x,y];
}
/*round co-ordinates down to their nearest multiple of 10*/
function convertXY(aValue){
	var remainder = aValue%10;
	return (aValue - remainder);
}

/*mouse handlers*/
function onMouseDown(event){
	mouseXY = getMouseXY(event);
	mouseX = mouseXY[0];
	mouseY = mouseXY[1];
	draw = true;
}
function onMouseUp(event){
	draw = false;
}
function onMouseMove(event) {
	mouseXY = getMouseXY(event);
	mouseX = mouseXY[0];
	mouseY = mouseXY[1];
	if(!draw){
		prevMouseX = mouseX;
		prevMouseY = mouseY;
	}
}

/*save the image drawn for use as byteman's sprite
	Then initialise the next stage, the Byteman game*/
function save(){
	spriteURL = canvas.toDataURL();
	clearInterval(drawIntervalID);
	finished = true;
	initByteman();
}

/*clear the canvas*/
function clear(){
	context.clearRect( 0, 0, 320, 320);
}

function initDraw(){
	canvas = $('#game')[0];
	context = canvas.getContext("2d");
	$('#game').mousemove(onMouseMove);
	$('#game').mouseup(onMouseUp);
	$('#game').mousedown(onMouseDown);
	$('#save').click(save);
	$('#clear').click(clear);
	
	drawIntervalID = setInterval(function(){
			drawDraw();
	}, 10);
	
}

/*draw rectangles instead of pixels to emulate a smaller resolution*/
function drawDraw(){
	if(draw){
		context.fillRect(convertXY(mouseX), convertXY(mouseY), 10, 10);
	    context.stroke();	
	}
}

/*Begin the game when the page has loaded*/
$(document).ready(initDraw);

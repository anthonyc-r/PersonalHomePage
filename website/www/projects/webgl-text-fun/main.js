var FPS = 30; //silky smooth
var CHAR_WIDTH = 27;
var CHAR_HEIGHT = 30;

var canvas;
var gl;
var glex;
var time;
var fontAtlas;
var quad;
var axesVertexBuffer;

var atlasWidth;
var charPcWidth;
var charPcHeight;

function start() {
	resizeHandler();
	window.addEventListener('resize', this.resizeHandler.bind(this), false);
	
	canvas = document.getElementById("canvas");
	gl = initGL(canvas);
	glex = new GLEx(gl);
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.enable(gl.BLEND);
	
	glex.disable(GLEx.LIGHTING);
	glex.disable(GLEx.TEXTURING);
	
	glex.color3fv(GLEx.MATERIAL_COLOR, [1.0, 1.0, 1.0]);
	glex.color3fv(GLEx.AMBIENT_COLOR, [0.1, 0.1, 0.1]);
	glex.color3fv(GLEx.LIGHT_COLOR, [1.0, 1.0, 1.0]);
	glex.color3fv(GLEx.POSITION, [5.0, 5.0, 5.0]);

	time = 0;
	loadAssets();
}

function loadAssets() {
	fontAtlas = new FontAtlas("25pt fsex", CHAR_WIDTH, CHAR_HEIGHT, loaded);
	quad = new Quad(gl, loaded);
}

function loaded() {
	if(quad.isLoaded() && fontAtlas.isLoaded()) {
		console.log("loaded assets");
		atlasWidth = fontAtlas.getWidth();
		charPcWidth = CHAR_WIDTH / atlasWidth;
		charPcHeight = CHAR_HEIGHT / atlasWidth;
		
		quad.setTexCoords([0.0, charPcHeight+0.0065],
						  [0.0, 0.004],
						  [charPcWidth, 0.004],
						  [charPcWidth, charPcHeight+0.0065]);
		//bind tex
		var img = fontAtlas.getImage();
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		//gl.activeTexture(gl.TEXTURE0);
		
		initAxisBuffer();
		
		setInterval(draw, 1000/FPS);
	}
}

function initGL(canvas) {
	try {
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.unitsWidth = canvas.width / 100;
		gl.unitsHeight = canvas.width / 100;
		gl.aspectRatio = canvas.width / canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL");
	}
	
	return gl;
}

function draw() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	  glex.setViewFrustrum(45.0, gl.aspectRatio, 0.1, 100.0);
	glex.loadIdentity();
		
	glex.setActive(GLEx.PERSPECTIVE);
	  glex.translate3fv([0.0, -gl.unitsHeight/0.5, -90.0]);
	glex.setActive(GLEx.TRANSFORM);
	
	var shaderProgram = glex.getProgram();
	
	/*glex.pushMatrix()
		glex.disable(GLEx.LIGHTING);
		glex.disable(GLEx.TEXTURING);
		glex.loadIdentity();
		glex.scale3fv([20.0, 20.0, 20.0]);
		gl.bindBuffer(gl.ARRAY_BUFFER, axesVertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0);
		gl.lineWidth(20);
		//red x axis
		glex.color3fv(GLEx.MATERIAL, [1.0, 0.0, 0.0]);
		gl.drawArrays(gl.LINES, 0, 2);
		//green y axis
		glex.color3fv(GLEx.MATERIAL, [0.0, 1.0, 0.0]);
		gl.drawArrays(gl.LINES, 2, 2);
		//blue z axis
		glex.color3fv(GLEx.MATERIAL, [0.0, 0.0, 1.0]);
		gl.drawArrays(gl.LINES, 4, 2);
		//reset it back
		glex.color3fv(GLEx.MATERIAL, [1.0, 1.0, 1.0]);
		glex.enable(GLEx.LIGHTING);
	glex.popMatrix();
	*/
	var jOffset = 0;
	glex.enable(GLEx.LIGHTING);
	glex.enable(GLEx.TEXTURING);
	for(var i=0; i<chins.length; i++) {
		for(var j=0; j<chins.lineWidth; j++){
			var coords = fontAtlas.getCharCoords(chins[i][j]);
			glex.setActive(GLEx.TEXTURE);
			glex.loadIdentity();
			glex.translate3fv([coords[0]*charPcWidth, coords[1]*charPcHeight]);
			glex.setActive(GLEx.TRANSFORM);
			glex.loadIdentity();
			glex.translate3fv([-0.5*chins.lineWidth, 0.0, 0.0]);
			glex.translate3fv([j, (30-i)*1.0, 0.0]);
			quad.draw(gl, glex, shaderProgram.vertexPosition, shaderProgram.vertexNormal, shaderProgram.textureCoordinate);
		}
	}
	
	time++;
	glex.setTimeUniform(time);
	/*glex.setActive(GLEx.TEXTURE);
	glex.pushMatrix();
	  glex.loadIdentity();
	  glex.translate3fv([13*charPcWidth, 3*charPcHeight]);
	glex.popMatrix();
	glex.setActive(GLEx.TRANSFORM);
	
	glex.scale3fv([1, 1, 1]);
	quad.draw(gl, glex, shaderProgram.vertexPosition, shaderProgram.vertexNormal, shaderProgram.textureCoordinate);
*/
}

function initAxisBuffer() {
	//Axes to indicate world coordinate system
	axesVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axesVertexBuffer);
	vertices = [
		0.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 1.0
	];
	//Allocate server memory, clear memory associated with currently bound obj
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}


function resizeHandler(e){
	console.log('window resized');
	//un*#! everything
	var smallest = Math.min(window.innerHeight, window.innerWidth);
	
	winHeight = smallest;
	winWidth = smallest;


	document.getElementById('canvas').setAttribute('width', winWidth);
	document.getElementById('canvas').setAttribute('height', winHeight);
	
	if(gl){
		gl.viewportWidth = winWidth;
		gl.viewportHeight = winHeight;
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	}
}


/**ascii data**/
var chins = [" @@@@@@@@   @@@@@@   @@@@@@@@@@   @@@@@@@@  ",
"@@@@@@@@@  @@@@@@@@  @@@@@@@@@@@  @@@@@@@@  ",
"!@@        @@!  @@@  @@! @@! @@!  @@!       ",
"!@!        !@!  @!@  !@! !@! !@!  !@!       ",
"!@! @!@!@  @!@!@!@!  @!! !!@ @!@  @!!!:!    ",
"!!! !!@!!  !!!@!!!!  !@!   ! !@!  !!!!!:    ",
":!!   !!:  !!:  !!!  !!:     !!:  !!:       ",
":!:   !::  :!:  !:!  :!:     :!:  :!:       ",
" ::: ::::  ::   :::  :::     ::    :: ::::  ",
" :: :: :    :   : :   :      :    : :: ::   ",
"   @@@@@@   @@@  @@@  @@@@@@@@  @@@@@@@     ",
"  @@@@@@@@  @@@  @@@  @@@@@@@@  @@@@@@@@    ",
"  @@!  @@@  @@!  @@@  @@!       @@!  @@@    ",
"  !@!  @!@  !@!  @!@  !@!       !@!  @!@    ",
"  @!@  !@!  @!@  !@!  @!!!:!    @!@!!@!     ",
"  !@!  !!!  !@!  !!!  !!!!!:    !!@!@!      ",
"  !!:  !!!  :!:  !!:  !!:       !!: :!!     ",
"  :!:  !:!   ::!!:!   :!:       :!:  !:!    ",
"  ::::: ::    ::::     :: ::::  ::   :::    ",
"   : :  :      :      : :: ::    :   : :    ",];
chins.lineWidth = chins[0].length;
chins.bBox = [0.0, 0.0, 0.0, 0.0];
chins.active = false;
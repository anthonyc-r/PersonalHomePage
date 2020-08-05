/*author: Anthony Cohn-Richardby
* info	: A GL Extension library designed to introduce some
*			functionality similar to fixed function OGL 1.0.
*/
/*requires gl-matrix 1.3*/
var GLEx = function(gl) {
	this.activeMatrix = GLEx.TRANSFORM;
	
	console.log("initting");
	this.gl = gl;
	this.shaderProgram = gl.createProgram();
	
	//modelView matrix stack
	this.modelViewMatrix = mat4.create();
	mat4.identity(this.modelViewMatrix);
	this.modelViewMatrixStack = [];
	//normalMatrix
	this.normalMatrix = mat3.create();
	//Perspective matrix
	this.perspectiveMatrix = mat4.create();
	mat4.identity(this.perspectiveMatrix);
	//texture matrix
	this.textureMatrix = mat3.create();
	mat3.identity(this.textureMatrix);
	//model view perspective matrix
	this.mvpMatrix = mat4.create();
	//Init shaders
	this.initShaders();
	this.initUniforms();
}
//Constants
GLEx.PERSPECTIVE = 1;
GLEx.TRANSFORM = 2;
GLEx.TEXTURE = 10;

GLEx.MATERIAL = 3;
GLEx.AMBIENT = 4;
GLEx.LIGHT = 5;
GLEx.DIRECTION = 6;
GLEx.POSITION = 7;

GLEx.LIGHTING = 8;
GLEx.TEXTURING = 9;
/*
* Transformations
*/
//must be either perspective or transform
GLEx.prototype.setActive = function(matrix) {
	this.activeMatrix = matrix;
}
GLEx.prototype.custom = function(matrix) {
	switch(this.activeMatrix) {
		case GLEx.TRANSFORM:
			mat4.multiply(matrix, this.modelViewMatrix, this.modelViewMatrix);
			break;
		case GLEx.PERSPECTIVE:
			mat4.multiply(matrix, this.perspectiveMatrix, this.perspectiveMatrix);
			break;
		case GLEx.TEXTURE:
			mat3.multiply(matrix, this.textureMatrix, this.textureMatrix);
			break;
	}
	this.setUniforms();
}
GLEx.prototype.rotate4fv = function(rad, vec3f) {
	switch(this.activeMatrix) {
		case GLEx.TRANSFORM:
			mat4.rotate(this.modelViewMatrix, rad, vec3f);
			break;
		case GLEx.PERSPECTIVE:
			mat4.rotate(this.perspectiveMatrix, rad, vec3f);
			break;
		case GLEx.TEXTURE:
			mat3.rotate(this.textureMatrix, rad, vec3f);
			break;
	}
	this.setUniforms();
}
GLEx.prototype.translate3fv = function(vec3f) {
	switch(this.activeMatrix) {
		case GLEx.TRANSFORM:
			mat4.translate(this.modelViewMatrix, vec3f);
			break;
		case GLEx.PERSPECTIVE:
			mat4.translate(this.perspectiveMatrix, vec3f);
			break;
		case GLEx.TEXTURE:
			mat3.multiply([1, 0, vec3f[0], 0, 1, vec3f[1], 0, 0, 1], this.textureMatrix, this.textureMatrix);
			//console.log(this.textureMatrix);
			break;
	}
	this.setUniforms();
}
GLEx.prototype.scale3fv = function(vec3f) {
	switch(this.activeMatrix) {
		case GLEx.TRANSFORM:
			mat4.scale(this.modelViewMatrix, vec3f);
			break;
		case GLEx.PERSPECTIVE:
			mat4.scale(this.perspectiveMatrix, vec3f);
			break;
		case GLEx.TEXTURE:
			mat3.scale(this.textureMatrix, vec3f);
			break;
	}
	this.setUniforms();
}
GLEx.prototype.loadIdentity = function() {
	switch(this.activeMatrix) {
		case GLEx.TRANSFORM:
			mat4.identity(this.modelViewMatrix);
			break;
		case GLEx.PERSPECTIVE:
			mat4.identity(this.perspectiveMatrix);
			break;
		case GLEx.TEXTURE:
			mat3.identity(this.textureMatrix);
			break;
	}
	this.setUniforms();
}

/*
* Get current modelView matrix
*/
GLEx.prototype.getModelViewMatrix = function() {
	return this.modelViewMatrix;
}
GLEx.prototype.getNormalMatrix = function() {
	return this.normalMatrix;
}
GLEx.prototype.getTextureMatrix = function() {
	return this.textureMatrix;
}

/*
* Push/Pop
*/
GLEx.prototype.pushMatrix = function() {
	var copy = mat4.create();
	mat4.set(this.modelViewMatrix, copy);
	this.modelViewMatrixStack.push(copy);
}
GLEx.prototype.popMatrix = function() {
	this.modelViewMatrix = this.modelViewMatrixStack.pop();
	this.setUniforms();
}

/*
* Perspective
*/
GLEx.prototype.setViewFrustrum = function(fov, ratio, nearclip, farclip) {
	mat4.perspective(fov, ratio, nearclip, farclip, this.perspectiveMatrix);
}
GLEx.prototype.setOrtho = function(left, right, bottom, top, near, far, dest) {
	mat4.ortho(left, right, bottom, top, near, far, this.perspectiveMatrix);
}

/*
* Color
*/
GLEx.prototype.color3fv = function(type, vec) {
	switch(type) {
		case GLEx.MATERIAL:
			gl.uniform3fv(this.shaderProgram.materialColorUniform, vec);
			break;
		case GLEx.AMBIENT:
			gl.uniform3fv(this.shaderProgram.ambientColorUniform, vec);
			break;
			
		case GLEx.LIGHT:
			gl.uniform3fv(this.shaderProgram.lightColorUniform, vec);
			break;
		case GLEx.POSITION:
			gl.uniform3fv(this.shaderProgram.lightPositionUniform, vec);
			break;
		case GLEx.DIRECTION:
			gl.uniform3fv(this.shaderProgram.lightDirectionUniform, vec);
			break;
	}
}
/*
* Shader plumbing
*/
GLEx.prototype.setUniforms = function() {
	//glUniform{1234}{fdi ui}(location, value)
	//glUniformMatrix{234}{fd}v(location, transpose?, values)
	mat4.multiply(this.perspectiveMatrix, this.modelViewMatrix, this.mvpMatrix);
	mat4.toMat3(this.modelViewMatrix, this.normalMatrix);
	//model view
	gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
	//perspective matrix
	gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.perspectiveMatrix);
	//set norm uniform
	gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, this.normalMatrix);
	//tex uniform
	gl.uniformMatrix3fv(this.shaderProgram.textureMatrixUniform, false, this.textureMatrix);
}
GLEx.prototype.setTimeUniform = function(time) {
	gl.uniform1i(this.shaderProgram.timeUniform, time);
}
GLEx.prototype.disable = function(thing) {
	switch(thing) {
		case GLEx.LIGHTING:
			gl.uniform1i(this.shaderProgram.lightingEnabledUniform, 0);
			gl.disableVertexAttribArray(this.shaderProgram.vertexNormal);
		case GLEx.TEXTURING:
			gl.uniform1i(this.shaderProgram.textureEnabledUniform, 0);
			gl.disableVertexAttribArray(this.shaderProgram.textureCoordinate);
	}
}
GLEx.prototype.enable = function(thing) {
	switch(thing) {
		case GLEx.LIGHTING:
			gl.uniform1i(this.shaderProgram.lightingEnabledUniform, 1);
			gl.enableVertexAttribArray(this.shaderProgram.vertexNormal);
		case GLEx.TEXTURING:
			gl.uniform1i(this.shaderProgram.textureEnabledUniform, 1);
			gl.enableVertexAttribArray(this.shaderProgram.textureCoordinate);
	}
}
GLEx.prototype.getShader = function(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}
GLEx.prototype.initShaders = function() {
	var fragmentShader = this.getShader(gl, "shader-fs");
	var vertexShader = this.getShader(gl, "shader-vs");

	gl.attachShader(this.shaderProgram, vertexShader);
	gl.attachShader(this.shaderProgram, fragmentShader);
	gl.linkProgram(this.shaderProgram);

	if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(this.shaderProgram);

	this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "VertexPosition");
	this.shaderProgram.vertexNormal = gl.getAttribLocation(this.shaderProgram, "VertexNormal");
	this.shaderProgram.textureCoordinate = gl.getAttribLocation(this.shaderProgram, "TextureCoordinate");
	
	gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
	gl.enableVertexAttribArray(this.shaderProgram.vertexNormal);
	gl.enableVertexAttribArray(this.shaderProgram.textureCoordinate);

	this.shaderProgram.timeUniform = gl.getUniformLocation(this.shaderProgram, "time");
	
	this.shaderProgram.normalMatrixUniform = gl.getUniformLocation(this.shaderProgram, "NormalMatrix");
	this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "MVMatrix");
	this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "PMatrix");
	this.shaderProgram.textureMatrixUniform = gl.getUniformLocation(this.shaderProgram, "TextureMatrix");
	
	this.shaderProgram.materialColorUniform = gl.getUniformLocation(this.shaderProgram, "MaterialColor");
	this.shaderProgram.ambientColorUniform = gl.getUniformLocation(this.shaderProgram, "AmbientColor");
	
	this.shaderProgram.lightColorUniform = gl.getUniformLocation(this.shaderProgram, "LightColor");
	this.shaderProgram.lightPositionUniform = gl.getUniformLocation(this.shaderProgram, "LightPosition");
	this.shaderProgram.lightDirectionUniform = gl.getUniformLocation(this.shaderProgram, "LightDirection");
	this.shaderProgram.lightingEnabledUniform = gl.getUniformLocation(this.shaderProgram, "LightingEnabled");
	
	this.shaderProgram.textureEnabledUniform = gl.getUniformLocation(this.shaderProgram, "TextureEnabled");
	this.shaderProgram.textureSamplerUniform = gl.getUniformLocation(this.shaderProgram, "TextureSampler");
}
GLEx.prototype.initUniforms = function() {
	//Set uniforms to some default value
	gl.uniform1i(this.shaderProgram.timeUniform, 0);
	gl.uniform1i(this.shaderProgram.lightingEnabledUniform, 0);
	gl.uniform1i(this.shaderProgram.textureEnabledUniform, 0);
	gl.uniform1i(this.shaderProgram.textureSamplerUniform, 0);
	gl.uniform3fv(this.shaderProgram.materialColorUniform, [1.0, 1.0, 1.0]);
	gl.uniform3fv(this.shaderProgram.ambientColorUniform, [0.1, 0.1, 0.1]);
	gl.uniform3fv(this.shaderProgram.lightColorUniform, [1.0, 1.0, 1.0]);
	gl.uniform3fv(this.shaderProgram.lightDirectionUniform, [0.0, 0.0, 0.0]);
	gl.uniform3fv(this.shaderProgram.lightPositionUniform, [1.0, 1.0, 1.0]);

	gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
	gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.perspectiveMatrix);
	gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, this.normalMatrix);
	gl.uniformMatrix3fv(this.shaderProgram.textureMatrixUniform, false, this.textureMatrix);
}
GLEx.prototype.getProgram = function() {
	return this.shaderProgram;
}
var Quad = function(gl, loaded) {
	this.quadVertexBuffer = null;
	this.quadNormalBuffer = null;
	this.quadTexCoordBuffer = null;
	this.loaded = false;
	
	setTimeout(function(){
		this.initBuffer(gl, loaded)
	}.bind(this), 0);
}

Quad.prototype.draw = function(gl, glex, vertAttribP, normAttribP, texAttribP) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertexBuffer);
	gl.vertexAttribPointer(vertAttribP, this.quadVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadNormalBuffer);
	gl.vertexAttribPointer(normAttribP, this.quadNormalBuffer.itemSize, gl.FLOAT, false, 0, 0)
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadTexCoordBuffer);
	gl.vertexAttribPointer(texAttribP, this.quadTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//One half
	gl.drawArrays(gl.TRIANGLES, 0, this.quadVertexBuffer.numItems);
}

Quad.prototype.initBuffer = function(gl, loaded) {
	this.quadVertexBuffer = gl.createBuffer();
	this.quadNormalBuffer = gl.createBuffer();
	this.quadTexCoordBuffer = gl.createBuffer();
	
	this.vertices = [
		 0.0,  0.0,  0.0,
		 0.0,  1.0,  0.0,
		 1.0,  1.0,  0.0,	//tri1fac1 c
		 
		 0.0,  0.0,  0.0,
		 1.0,  1.0,  0.0,	
		 1.0,  0.0,  0.0,  //tri2fac1 c
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	this.quadVertexBuffer.itemSize = 3;
	this.quadVertexBuffer.numItems = 6;
	
	this.normals = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
	this.quadNormalBuffer.itemSize = 3;
	this.quadNormalBuffer.numItems = 6;
	
	this.uvs = [
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0, 
		
		0.0, 0.0,
		1.0, 1.0,
		1.0, 0.0,
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
	this.quadTexCoordBuffer.itemSize = 2;
	this.quadTexCoordBuffer.numItems = 6;
	
	this.loaded = true;
	loaded();
}

Quad.drawToBuffer = function(glex, vbuffer, nbuffer, tbuffer) {
	var currentModelView = glex.getModelViewMatrix();
	var currentNormalMatrix = glex.getNormalMatrix();
	
	for(var i = 0; i < vertices.length; i += 3) {
		var transformedVert = vec3.create();
		var transformedNormal = vec3.create();
		var vertex = [this.vertices[i], this.vertices[i+1], this.vertices[i+2]];
		var normal = [this.normals[i], this.normals[i+1], this.normals[i+2]];
		mat4.multiplyVec3(currentModelView, vertex, transformedVert);
		mat3.multiplyVec3(currentNormalMatrix, normal, transformedNormal);
		//console.log(transformedVert);
		vbuffer.push(transformedVert[0]);
		vbuffer.push(transformedVert[1]);
		vbuffer.push(transformedVert[2]);
		nbuffer.push(transformedNormal[0]);
		nbuffer.push(transformedNormal[1]);
		nbuffer.push(transformedNormal[2]);
		tbuffer.push(this.uvs[i]);
		tbuffer.push(this.uvs[i+1]);
		tbuffer.push(this.uvs[i+2]);
	}
}

Quad.prototype.setTexCoords = function(uv1, uv2, uv3, uv4) {
	this.uvs = [
		uv1[0], uv1[1],
		uv2[0], uv2[1],
		uv3[0], uv3[1], 
		
		uv1[0], uv1[1],
		uv3[0], uv3[1],
		uv4[0], uv4[1],
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, this.quadTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
	this.quadTexCoordBuffer.itemSize = 2;
	this.quadTexCoordBuffer.numItems = 6;
}

Quad.prototype.isLoaded = function() {
	return this.loaded;
}
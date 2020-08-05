var NUM_CHARS = 32;

var FontAtlas = function(font, charWidth, charHeight, onloaded) {
	document.fonts.ready.then(function(fontFaceSet) {
		this.init(font, charWidth, charHeight, onloaded);
	}.bind(this));
}

FontAtlas.prototype.init = function(font, charWidth, charHeight, onloaded) {
	this.loaded = false;
	this.charWidth = charWidth;
	this.charHeight = charHeight;
	this.atlasWidth = nextPowerOfTwo(NUM_CHARS*Math.max(charWidth, charHeight));
	
	this.canvas = document.createElement("canvas");
	this.canvas.setAttribute("width", this.atlasWidth.toString());
	this.canvas.setAttribute("height", this.atlasWidth.toString());
	
	this.context = this.canvas.getContext("2d");
	this.context.font = font;
	for(var i = 0; i < NUM_CHARS; i++) {
		for(var j = 0; j < NUM_CHARS; j++) {
			this.context.fillText(String.fromCharCode((i*NUM_CHARS)+j), j*this.charWidth, (i+1)*this.charHeight);
		}
	}
	
	this.dataURL = this.canvas.toDataURL();
	this.texture = new Image(this.atlasWidth, this.atlasWidth);
	this.texture.src = this.dataURL;
	//window.open(this.dataURL);
	this.texture.onload = function() {
		this.loaded = true; 
		onloaded();
	}.bind(this);
}

//returns top left
FontAtlas.prototype.getCharCoords = function(aChar) {
	var charCode = aChar.charCodeAt(0);
	var u = (charCode % NUM_CHARS);
	var v = (Math.floor(charCode / NUM_CHARS));
	
	return [u, v];
}

FontAtlas.prototype.getCharWidth = function() {
	return this.charWidth;
}
FontAtlas.prototype.getCharHeight = function() {
	return this.charHeight;
}
FontAtlas.prototype.getWidth = function() {
	return this.atlasWidth;
}
FontAtlas.prototype.isLoaded = function() {
	return this.loaded;
}

FontAtlas.prototype.getImage = function() {
	return this.texture;
}

var nextPowerOfTwo = function(n) {
	var x = Math.ceil(Math.log(n)/Math.log(2));
	return Math.pow(2, x);
}

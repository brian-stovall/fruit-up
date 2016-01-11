document.addEventListener('DOMContentLoaded', function() {
	//spriteSheet entries have the form [startX, startY, width, height]
	const spriteSheet = { 'strawberry': [0, 0],
												'apple': [-32, 0],
												'banana': [-64, 0],
												'pear': [-96, 0],
												'cherry':[0, -32], 
												'lemon':[-32, -32], 
												'peach':[-64, -32], 
												'grape':[-96, -32], 
												'pineapple':[0, -64]};
	var sprites = [];
	var viewport = document.getElementById('viewport');
	const spriteWidth = 32;  //the actual width of the fruit sprites											
	const sheetSize = {'width':128, 'height':96}
	//the scaling factor for the fruits: viewwidth*desired percentage/spriteWidth
	const spriteScale = viewport.offsetWidth * .10 / spriteWidth; 

	function skinSprite(skinName) {
		if (!this) { console.log('this error - switchSprite'); return;}
		this.style.backgroundPosition = (spriteSheet[skinName][0] * spriteScale) + 'px ' +
			(spriteSheet[skinName][1] * spriteScale) + 'px ';
		this.style['background-size'] = sheetSize.width * spriteScale + 'px ' + sheetSize.height * spriteScale + 'px';
		this.style.width = (spriteWidth * spriteScale) + 'px ';
		this.style.height = (spriteWidth * spriteScale) + 'px ';
	}

	function destroySprite() {
		if (!this) { console.log('this error - destroySprite'); return;}
		this.parent.removeChild(this.element);
	}

	//x and y arguments are optional
	function blitSprite(x, y) {
		if (!this) { console.log('this error - blitSprite'); return;}
		if (x) this.xPos = x;
		if (y) this.yPos = y;
		this.style.left = this.xPos + 'px';
		this.style.top = this.yPos + 'px';
		this.parent.appendChild(this.element);
	}
	// causes a sprite to move according to it's dx and dy
	function update(gravity, drag) {
		if (!this) { console.log('this error - update'); return;}
		//console.log('update called');
		var dt = viewport.getDt();
		if (gravity || this.dx || this.dy ) {
			drag = drag * (this.dt > 0) ? 1 : -1;
			this.dx += drag; 
			this.xPos += this.dx * dt;
			this.yPos += (this.dy + gravity) * dt;
			//console.log(this.yPos);
		}
	}

	//returns elapsed time in seconds since last call to calcDt
	function calcDt() {
		var lastTime = (Date.now());
		//use a closure to store lastTime
		return function () {
			result = (Date.now() - lastTime) / 1000;
			lastTime = Date.now();
			return result;
		}
	}

	//sprites will have a xPos, yPos, dx, dy?
	function Sprite(name, x, y) {
		this.blit = blitSprite;
		this.skin = skinSprite;
		this.destroy = destroySprite;
		this.update = update;
		this.parent = viewport;
		this.element = document.createElement('div');
		this.element.className = 'sprite';
		this.style = this.element.style;
		this.xPos = x;
		this.yPos = y;
		this.dx = 0;
		this.dy = 0;
		this.skin(name);
		this.blit();
	}
	
	function animate(gravity, drag) {
		var dieList = [];
		if (sprites.length){
			//console.log(sprites.length + ' sprites.length');
			window.requestAnimationFrame(animate);
			for (var i = 0; i < sprites.length; i++) {
				sprites[i].update(gravity, drag);
				sprites[i].blit();
				if (sprites[i].yPos >= viewport.offsetHeight){
					//console.log(sprites[i].name + ' offscreen!');
					sprites[i].destroy();
					dieList.push(i);
				}
			}
		}
		for (var n = 0; n < dieList.length; n++)
			sprites.splice(dieList[n], 1);
	}

	function test() {
		//this is where the blender is
		var blenderMouth = [.48 * viewport.offsetWidth, .55 * viewport.offsetHeight];
		var gravity = .1; //gravity in pixels/s - FIX this should be a %screen /s and get scaled!
		var drag = .1; //left-right drag in pixels/s - FIX this should be a %screen /s and get scaled!
		//sprites.push(new Sprite('cherry', blenderMouth[0], blenderMouth[1]));
		sprites.push(new Sprite('pear', 380, 0));
		sprites[0].dx = 2;
		//start our timer
		viewport.getDt = calcDt();
		animate(gravity, drag);
	}

	
	test();
});

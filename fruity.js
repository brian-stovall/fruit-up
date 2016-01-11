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
	const fruitNames = Object.keys(spriteSheet);
	var sprites = [];
	var viewport = document.getElementById('viewport');
	//two functions for returning px from %vw/vh
	var widthPct = pctToPx.bind(undefined, viewport.offsetWidth);
	var heightPct = pctToPx.bind(undefined, viewport.offsetHeight);

	const blenderMouth = [widthPct(.48), heightPct(.55)];
	const gravity = heightPct(.10); //additive gravity in pixels/s - FIX should have a 'terminal velocity'?
	const drag = 0; //left-right drag coefficient, mutates dx per sec ie .75, dx loses 1/4 speed/sec
	const spriteWidth = 32;  //the actual width of the fruit sprites											
	const sheetSize = {'width':128, 'height':96}
	//the scaling factor for the fruits: viewwidth*desired percentage/spriteWidth
	const spriteScale = widthPct(.1) / spriteWidth; 
	const TERMINAL_VELOCITY = 300; 

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
	function update(gravity, drag, dt) {
		if (!this) { console.log('this error - update'); return;}
		//console.log('update called');
		if (gravity || this.dx || this.dy ) {
			this.dx *= drag; 
			this.dy += gravity;
			if (this.dy > TERMINAL_VELOCITY) this.dy = TERMINAL_VELOCITY;
			this.xPos += this.dx * dt;
			this.yPos += this.dy * dt;
			//console.log(this.yPos, this.dy, gravity);
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
		var dt = viewport.getDt();
		var dieList = [];
		if (sprites.length){
			//console.log(sprites.length + ' sprites.length');
			window.requestAnimationFrame(function() {animate(gravity, drag)});
			for (var i = 0; i < sprites.length; i++) {
				sprites[i].update(gravity, drag, dt);
				sprites[i].blit();
				if (sprites[i].yPos + spriteWidth * spriteScale >= viewport.offsetHeight){
					//console.log(sprites[i].name + ' offscreen!');
					sprites[i].destroy();
					dieList.push(i);
				}
			}
		}
		for (var n = 0; n < dieList.length; n++)
			sprites.splice(dieList[n], 1);
	}

	//function that converts a % to px for rendering, etc
	function pctToPx(dimension, percent) {
		return dimension * percent;
	}

	//call with one arg for 0 - arg or 2 for arg2 - arg1
	function randRange(end, begin) {
		begin = (begin || 0);
		return Math.floor(Math.random() * (end - begin + 1)) + begin;
	}

	//throws out n random fruits within a random range
	function throwFruit(n) {
		var name, up, out; //holders for the random initializers
		for (var i = 0; i < n; i++) {
			//console.log(randRange(fruitNames.length - 1));
			name = fruitNames[randRange(fruitNames.length - 1)];
			up = randRange(heightPct(.9), heightPct(.7));
			out = randRange(widthPct(.7));
			out *= (randRange(1)) ? 1 : -1;
			console.log('up :' + up + ' out:' + out);
			sprites.push(new Sprite(name, blenderMouth[0], blenderMouth[1]));
			sprites[sprites.length - 1].dx = out;
			sprites[sprites.length - 1].dy = up;
		}
	}

	function test() {
		throwFruit(1);
		//start our timer
		viewport.getDt = calcDt();
		animate(gravity, drag);
	}

	//window.rand = randRange;
	test();
});

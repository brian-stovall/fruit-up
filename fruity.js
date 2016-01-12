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
	const gravity = heightPct(.09); //additive gravity in %vh/s 
	const drag = 1; //left-right drag coefficient, mutates dx per sec ie .75, dx loses 1/4 speed/sec
	const spriteWidth = 32;  //the actual width of the fruit sprites											
	const sheetSize = {'width':128, 'height':96}
	//the scaling factor for the fruits: viewwidth*desired percentage/spriteWidth
	const spriteScale = widthPct(.1) / spriteWidth; 
	const TERMINAL_VELOCITY = heightPct(.75); 

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

	function blitSprite() {
		if (!this) { console.log('this error - blitSprite'); return;}
		this.style.left = this.xPos + 'px';
		this.style.top = this.yPos + 'px';
		this.parent.appendChild(this.element);
	}
	// causes a sprite to move according to it's dx and dy
	function update(dt) {
		if (!this) { console.log('this error - update'); return;}
		this.dx *= drag; 
		this.dy += gravity;
		if (this.dy > TERMINAL_VELOCITY) this.dy = TERMINAL_VELOCITY;
		this.xPos += this.dx * dt;
		this.yPos += this.dy * dt;
		//console.log(this.yPos, this.dy, gravity);
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
	}
	
	function animate() {
		var dt = viewport.getDt();
		if (sprites.length){
			window.requestAnimationFrame(function() {animate()});
			for (var i = 0; i < sprites.length; i++) {
				sprites[i].update(dt);
				sprites[i].blit();
				if (sprites[i].yPos + spriteWidth * spriteScale >= viewport.offsetHeight){
					//console.log(sprites[i].name + ' offscreen!');
					sprites[i].destroy();
					sprites[i].dead = true;
				}
			}
		}
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

	function removeDead(arr) {
		return arr.filter(function (entry){
			return !entry.dead;});
	}
		

	//throws out n random fruits within a random range
	function throwFruit(n) {
		var name, up, out; //holders for the random initializers
		var curSprite; //holder for the current Sprite
		for (var i = 0; i < n; i++) {
			name = fruitNames[randRange(fruitNames.length - 1)];
			up = -randRange(heightPct(2), heightPct(1.7));
			out = randRange(widthPct(.45));
			out *= (randRange(1)) ? 1 : -1;
			//console.log('up :' + up + ' out:' + out);
			curSprite = new Sprite(name, blenderMouth[0], blenderMouth[1]);
			curSprite.dx = out;
			curSprite.dy = up;
			sprites = removeDead(sprites);
			sprites.push(curSprite);
		}
	}

	//makes randomized setTimeout calls to throwFruit
	function fruitFountain() {
		throwFruit(randRange(5,1));
		window.setTimeout(fruitFountain, randRange(800, 200));
	}


	function test() {
		fruitFountain();
		//start our timer
		viewport.getDt = calcDt();
		animate();
	}

	test();
});

document.addEventListener('DOMContentLoaded', function() {
	//spriteSheet entries have the form [startX, startY, width, height]
	const spriteSheet = { 'strawberry': [0, 0, 32, 32],
												'apple': [-32, 0, 32, 32],
												'banana': [-64, 0, 32, 32],
												'pear': [-96, 0, 32, 32],
												'cherry':[0, -32, 32, 32], 
												'lemon':[-32, -32, 32, 32], 
												'peach':[-64, -32, 32, 32], 
												'grape':[-96, -32, 32, 32], 
												'pineapple':[0, -64, 32, 32]};
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
	function update() {
		if (!this) { console.log('this error - update'); return;}
		console.log('update called');
		if (this.dx || this.dy ) {
			this.xPos += this.dx;
			this.yPos += this.dy;
			this.blit();
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
	
	function animate() {
		window.requestAnimationFrame(animate);
		for (var i = 0; i < sprites.length; i++)
			sprites[i].update();
	}

	function test() {
		sprites.push(new Sprite('cherry', 250, 450));
		sprites.push(new Sprite('pear', 380, 450));
		sprites[0].dy = -3.2;
		sprites[1].dy = -3;
		animate();
	}

	test();
});

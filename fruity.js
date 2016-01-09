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
	const spriteWidth = 35;  //the actual width of the fruit sprites											
	//the scaling factor for the fruits: viewwidth*desired percentage/spriteWidth
	const spriteScale = viewport.offsetWidth * .15 / spriteWidth; 

	function skinSprite(skinName) {
		if (!this) { console.log('this error - switchSprite'); return;}
		this.style.backgroundPosition = (spriteSheet[skinName][0] * spriteScale) + 'px ' +
			(spriteSheet[skinName][1] * spriteScale) + 'px ';
		this.style.width = (spriteSheet[skinName][2] * spriteScale) + 'px ';
		this.style.height = (spriteSheet[skinName][3] * spriteScale) + 'px ';
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

	//sprites will have a xPos, yPos, dx, dy?
	function Sprite(name, x, y) {
		this.blit = blitSprite;
		this.skin = skinSprite;
		this.destroy = destroySprite;
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

	function test() {
		sprites.push(new Sprite('apple', 50, 50));
		sprites.push(new Sprite('banana', 150, 150));
		sprites.push(new Sprite('pear', 350, 50));
		sprites.push(new Sprite('strawberry', 50, 10));
		sprites.push(new Sprite('grape', 90, 50));
		sprites.push(new Sprite('peach', 50, 90));
		sprites.push(new Sprite('pineapple', 80, 80));
		sprites.push(new Sprite('lemon', 250, 250));
		sprites.push(new Sprite('cherry', 25, 25));

	}

	test();
});

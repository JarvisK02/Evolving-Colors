class Animat {
	/*
	 *Create a new animat.
	 *The animat's automata is based on the given automata.
	 *The animat's hue and position is based on the given plant's hue and position.
	 *The animat's energy starts at 50.
	 */
	constructor(other, automata) {
		this.automata = automata;
		this.hue = other.hue;
		this.x = other.x;
		this.y = other.y;
		this.energy = 50;
	}

	//Ensure the given value stays between 0 and the given maximum.
	normalize(value, max) { 
		if (value >= max) {
			value = max - 1;
		} else if (value < 0) {
			value = 0;
		}
		return value;
	}

	/*
	 *Determine where this animat will move.
	 *Check every position adjacent to this animat for a plant (ensure that said position is within the board).
	 *If there is a plant in a position, check the difference between this animat's hue and the plant's hue.
	 *Given that this difference is the lowest recorded among the adjacent positions, update this animat's position to the location of the plant.
	 *If there is no plant in a position, add that position to the list of empty spaces.
	 */
	move() {
		let lowestDiff = Infinity,
			diff = Infinity,
			x = this.x,
			y = this.y,
			emptySpace = [];
		for (let i = x - 1; i <= x + 1; i++) {
			let xM = this.normalize(i, params.dimension);
			for (let j = y - 1; j <= y + 1; j++) {
				let yM = this.normalize(j, params.dimension),
					plant = this.automata.plants[xM][yM];
				if (plant) {
					diff = Math.abs(this.hue - plant.hue);
					if (diff < lowestDiff) {
						lowestDiff = diff;
						x = xM;
						y = yM;
					}
				} else {
					emptySpace.push({x : xM, y : yM});
				}
			}
		}
		this.x = x;
		this.y = y;
	}

	/*
	 *Find the difference between this animat's food selectivity and the given plant's hue.
	 *The difference starts at 180 by default.
	 *If the given plant exists, check the difference between this animat's hue and the plant's hue.
	 *Then, if the difference is greater than 180, it becomes 360 - [hue difference].
	 *The final hue difference is determined by (90 - [hue difference]) / 90.
	 */
	hueDifference(plant) {
		let diff = 180;
		if (plant) {
			diff = Math.abs(this.hue - plant.hue);
			if (diff > 180) {
				diff = 360 - diff;
			}
		}
		return (90 - diff) / 90;
	}

	/*
	 *Determine if this animat can eat the plant it is sitting on.
	 *If there is a plant at this animat's current position, and the hue difference at least reaches the food selectivity, then eat the plant.
	 *Remove the plant at the current position, then gain energy points.
	 *The number of energy points gained is determined by 80 / [animat growth] * [hue difference].
	 */
	eat() {
		let animatGrowth = parseInt(document.getElementById("animatgrowth").value),
			animatSelection = parseInt(document.getElementById("animatselection").value),
			plant = this.automata.plants[this.x][this.y],
			diff = this.hueDifference(plant);
		if (plant && diff >= animatSelection) {
			this.automata.plants[this.x][this.y] = null;
			this.energy += 80 / animatGrowth * diff;
		}
	}

	/*
	 *Determine if the animat can reproduce.
	 *If this animat's energy is greater than 80, start reproduction.
	 *To reproduce, add a new animat to the automata with mutations.
	 *Then, remove 80 energy points.
	 */
	reproduce() {
		if (this.energy > 80) {
			gameEngine.addEntity(new Animat(this.mutate(), this.automata));
			this.energy -= 80;
		}
	}

	//Remove this animat from the game.
	die() {
		this.removeFromWorld = true;
	}

	/*
	 *Add mutations to the new animat.
	 *The new animat's hue is determined by [this animat's hue] + [random value between 0 and 21] - 10.
	 *This hue value are kept between 0 and 360.
	 *The new animat's position is determined by [this animat's position] + [random value between 0 and 3] - 1.
	 *These position values are kept between 0 and the global dimension parameter.
	 */
	mutate() {
		let hue = this.normalize(this.hue + randomInt(21) - 10, 360),
			x = this.normalize(this.x + randomInt(3) - 1, params.dimension),
			y = this.normalize(this.y + randomInt(3) - 1, params.dimension);
		return {hue : hue, x : x, y : y};
	}

	/*
	 *Check for movement, eating, and reproduction.
	 *If this animat has less than 1 energy, it dies.
	 *Also, the animat has a 1% chance of randomly dying, regardless of its energy level.
	 */
	update() {
		this.move();
		this.eat();
		this.reproduce();
		if (this.energy < 1 || Math.random() < 0.01) {
			this.die();
		}
	}

	//Draw this animat.
	draw(ctx) {
		ctx.fillStyle = hsl(this.hue,75,50);
		ctx.strokeStyle = "light gray";
		ctx.beginPath();
		ctx.arc((this.x + 1/2)*params.size, (this.y + 1/2)*params.size, params.size/2 - 1, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
};
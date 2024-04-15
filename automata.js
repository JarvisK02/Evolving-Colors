class Automata {
	//Create an empty (2D) array of plants.
	constructor() {
		this.plants = [];
		for (let i = 0; i < params.dimension; i++) {
			this.plants.push([]);
			for (let j = 0; j < params.dimension; j++) {
				this.plants[i][j] = null;
			}
		}
	}	

	//Empty out the array of plants.
	clearPlants() {
		for (let i = 0; i < params.dimension; i++) {
			for (let j = 0; j < params.dimension; j++) {
				this.plants[i][j] = null;
			}
		}
	}

	/*
	 *Adds a new plant to the array of plants.
	 *The plant's hue is a random integer between 0 and 360.
	 *The plant's position is a random integer between 0 and the global dimension parameter. 
	 */
	addPlant() {
		let hue = randomInt(360),
			x = randomInt(params.dimension),
			y = randomInt(params.dimension),
			other = {hue : hue, x : x, y : y};
		this.plants[x][y] = new Plant(other, this);
	}

	/*
	 *Update each plant in the array of plants.
	 *Every plant has less than a 0.1% chance of randomly dying.
	 */
	update() {
		for (let i = 0; i < params.dimension; i++) {
			for (let j = 0; j < params.dimension; j++) {
				if (this.plants[i][j]) {
					this.plants[i][j].update();
					if (Math.random() < 0.001) {
						this.plants[i][j] = null;
					}
				}
			}
		}

	}

	//Draw each plant in the array of plants.
	draw(ctx) {
		for (let i = 0; i < params.dimension; i++) {
			for (let j = 0; j < params.dimension; j++) {
				if (this.plants[i][j]) {
					this.plants[i][j].draw(ctx);
				}
			}
		}
	}
};
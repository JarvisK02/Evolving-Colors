class Plant {
	/*
	 *Create a new plant.
	 *The plant's automata is based on the given automata.
	 *The plant's hue and position is based on the given plant's hue and position.
	 *The plant's growth starts at 0.
	 */
	constructor(other, automata) {
		this.automata = automata;
		this.hue = other.hue;
		this.x = other.x;
		this.y = other.y;
		this.growth = 0;
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
	 *Determine if the plant can reproduce.
	 *If the plant's growth is less than 80, add 80 divided by given plant growth to the plant's growth.
	 *Then, if the plant's growth is at least 80, begin reproduction.
	 *First, create a new plant with mutations based on this plant.
	 *Then, if the automata does not already contain a plant at the new plant's position, place the new plant there and remove 80 growth points.
	 */
	reproduce() {
		let plantGrowth = parseInt(document.getElementById("plantgrowth").value);
		if (this.growth < 80) {
			this.growth += 80 / plantGrowth;
		}
		if (this.growth >= 80) {
			let other = this.mutate();
			if (!this.automata.plants[other.x][other.y]) {
				this.automata.plants[other.x][other.y] = new Plant(other, this.automata)
				this.growth -= 80;
			} 
		}
	}

	/*
	 *Add mutations to the new plant.
	 *The new plant's hue is determined by [this plant's hue] + [random value between 0 and 21] - 10.
	 *This hue value are kept between 0 and 360.
	 *The new plant's position is determined by [this plant's position] + [random value between 0 and 3] - 1.
	 *These position values are kept between 0 and the global dimension parameter.
	 */
	mutate() {
		let hue = this.normalize(this.hue + randomInt(21) - 10, 360),
			x = this.normalize(this.x + randomInt(3) - 1, params.dimension),
			y = this.normalize(this.y + randomInt(3) - 1, params.dimension);
		return {hue : hue, x : x, y : y};
	}

	//Check for reproduction.
	update() {
		this.reproduce();
	}

	//Draw this plant.
	draw(ctx) {
		ctx.fillStyle = hsl(this.hue,20 + this.growth,50);
		ctx.strokeStyle = "dark gray";
		ctx.fillRect(this.x*params.size, this.y*params.size, params.size, params.size);
		ctx.strokeRect(this.x*params.size, this.y*params.size, params.size, params.size);
	}
};
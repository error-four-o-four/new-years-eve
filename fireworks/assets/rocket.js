class Rocket {
	static get velocityX() {
		return 0.005;
	}
	static get velocityY() {
		return 0.025;
	}
	static setGravity(g = -0.0004) {
	// static setGravity(g = 0.00035 * height) {
		if (!this._g) this._g = g;
	}
	static get gravity() {
		return this._g;
	}
	static getRandomPosition() {
		return [random(-0.25, 0.25), -0.5];
		// return [random(0.25, 0.75) * width, height];
	}
	static getRandomVelocity() {
		return [random(-1, 1) * this.velocityX, random(0.9, 1.1) * this.velocityY];
		// return [random(-1, 1) * this.velocityX * width, random(0.9, 1.1) * this.velocityY * height];
	}
	static getRandomAirtime(vy) {
		// let py = height;
		let py = -0.5;
		let f = 0;
		while (vy > -random(0.001, 0.01)) {
		// while (vy < random(0, 2)) {
			vy += this.gravity;
			py += vy;
			f++
		}
		return f * 100 / 6;
	}
	static getRandomExplosiontime() {
		const average = 750;
		const offset = 250;
		return average + floor(random(-offset, offset));
	}
	constructor() {
		this.seed = 0;

		this.start = 0;
		this.delta = 0;
		this.explosion = 0;

		this.lifetime = 0;
		this.airtime = 0;
		this.explosiontime = 0;

		this.ignited = false;
		this.exploded = false;

		this.pos = new p5.Vector();
		this.vel = new p5.Vector();
	}
	spawn(time) {
		this.pos.set(...this.constructor.getRandomPosition());
		this.vel.set(...this.constructor.getRandomVelocity());

		this.airtime = this.constructor.getRandomAirtime(this.vel.y);
		this.explosiontime = this.constructor.getRandomExplosiontime();
		this.lifetime = this.airtime + this.explosiontime;

		this.ignited = true;
		this.start = time;
		this.seed = random();
	}
	update(time) {
		if (!this.ignited) return;

		let delta = time - this.start;
		this.delta = delta / this.lifetime;
		this.exploded = (delta / this.airtime) >= 1;

		if (!this.exploded) {
			this.vel.y += this.constructor.gravity;
		}
		else {
			this.vel.y += this.constructor.gravity;

			this.vel.x *= 0.95;
			this.vel.y *= 0.95;

			this.explosion = (delta - this.airtime) / this.explosiontime;
		}
		this.pos.add(this.vel);

		if (this.delta < 1) return;

		this.ignited = false;
		this.exploded = false;

		this.lifetime = 0;
		this.airtime = 0;
		this.explosiontime = 0;

		this.delta = 0;
		this.explosion = 0;

		this.vel.set(0, 0);
		this.pos.set(0, 0);
	}
	serialize() {
		return {
			position: this.pos,
			delta: this.explosion,
		}
	}
}
class Rocket {
	static bindInstances(p, s) {
		this._p = p;
		this._s = s;
		this.random = p.random;
	}
	static initDefaults() {
		if (!this._c) this._c = {
			randomize: true,
			hue: 0,
			gravity: -0.0004,
			velocityX: 0.005,
			velocityY: 0.025,
		}
	}
	static set randomize(value) {
		this._c.randomize = value;
	}
	static get randomize() {
		return this._c.randomize;
	}
	static set hue(value) {
		this._c.hue = value;
	}
	static get hue() {
		return (this.randomize)
		? Math.floor(Math.random() * 360)
		: this._c.hue;
	}
	static set gravity(value) {
		this._c.gravity = value;
	}
	static get gravity() {
		return this._c.gravity;
	}

	static getLaunchValues() {
		const seed = this.random();
		const hue = this.hue;
		const position = this.getRandomPosition();
		const velocity = this.getRandomVelocity();
		const airtime = this.getRandomAirtime(velocity[1]);
		const explosiontime = this.getRandomExplosiontime();
		const lifetime = airtime + explosiontime;

		return {
			seed,
			hue,
			position,
			velocity,
			lifetime,
			airtime,
			explosiontime,
		}
	}
	static getRandomPosition() {
		return [
			this.random(-0.25, 0.25),
			-0.5
		];
	}
	static getRandomVelocity() {
		return [
			this.random(-1, 1) * this._c.velocityX,
			this.random(0.9, 1.1) * this._c.velocityY
		];
	}
	static getRandomAirtime(vy) {
		let py = -0.5;
		let f = 0;
		while (vy > this.random(-0.05, 0.01)) {
			vy += this.gravity;
			py += vy;
			f++
		}
		return Math.floor(f * 100 / 6);
	}
	static getRandomExplosiontime() {
		const average = 1000;
		const offset = 250;
		return average + Math.floor(this.random(-offset, offset));
	}
	static playSound() {
		if (this._p.config.mute) return;

		this._s.triggerAttackRelease(
			this.random(['C2', 'D2','E2', 'F2']),
			0.1
		);
	}

	constructor() {
		this.seed = 0;
		this.hue = 0;

		this.start = 0;
		this.delta = 0;
		this.explosion = 0;

		this.lifetime = 0;
		this.airtime = 0;
		this.explosiontime = 0;

		this.launched = false;
		this.exploded = false;
		this.sound = false;

		this.pos = new p5.Vector();
		this.vel = new p5.Vector();
	}
	launch(time, options = {}) {
		options = Object.assign(
			this.constructor.getLaunchValues(),
			options
		)

		this.start = time;
		this.launched = true;

		this.pos.set(options.position);
		this.vel.set(options.velocity);

		for (const key of ['seed', 'hue', 'lifetime', 'airtime', 'explosiontime']) this[key] = options[key];

		// console.log(this);
	}
	update(time) {
		if (!this.launched) return;

		let delta = time - this.start;
		this.delta = delta / this.lifetime;
		this.exploded = (delta / this.airtime) >= 1;

		if (!this.exploded) {
			this.vel.y += this.constructor.gravity;
		}
		else {
			this.vel.y += this.constructor.gravity * 0.5;

			this.vel.x *= 0.95;
			this.vel.y *= 0.95;

			this.explosion = (delta - this.airtime) / this.explosiontime;
		}
		this.pos.add(this.vel);

		if (this.exploded && !this.played) {
			this.played = true;
			this.constructor.playSound();
		}

		if (this.delta < 1) return;

		this.launched = false;
		this.exploded = false;
		this.played = false;

		this.lifetime = 0;
		this.airtime = 0;
		this.explosiontime = 0;

		this.delta = 0;
		this.explosion = 0;

		this.vel.set(0, 0);
		this.pos.set(0, 0);
	}
}
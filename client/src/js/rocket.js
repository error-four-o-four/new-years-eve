import {
	GRAVITY,
	VELOCITYX,
	VELOCITYY
} from './config.js';

import { pInst } from './sketch.js';

import { playAudio } from './audio.js';

export class Rocket {
	static getRandomPosition() {
		return [
			pInst.random(-0.25, 0.25),
			-0.5
		];
	}

	static getRandomVelocity() {
		return [
			pInst.random(-1, 1) * VELOCITYX,
			pInst.random(0.9, 1.1) * VELOCITYY
		];
	}

	static getRandomAirtime(vy) {
		let py = -0.5;
		let f = 0;
		while (vy > pInst.random(-0.05, 0.01)) {
			vy += GRAVITY;
			py += vy;
			f++;
		}
		return Math.floor(f * 100 / 6);
	};

	static getRandomExplosiontime() {
		const average = 1000;
		const offset = 250;
		return average + Math.floor(pInst.random(-offset, offset));
	};


	constructor () {
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

	launch(time, data) {
		this.start = time;
		this.launched = true;

		this.pos.set(data.position);
		this.vel.set(data.velocity);

		for (const key of ['seed', 'hue', 'airtime', 'explosiontime', 'lifetime']) this[key] = data[key];
	}

	update(time) {
		if (!this.launched) return;

		let delta = time - this.start;
		this.delta = delta / this.lifetime;
		this.exploded = (delta / this.airtime) >= 1;

		if (!this.exploded) {
			this.vel.y += GRAVITY;
		}
		else {
			this.vel.y += GRAVITY * 0.5;

			this.vel.x *= 0.95;
			this.vel.y *= 0.95;

			this.explosion = (delta - this.airtime) / this.explosiontime;
		}
		this.pos.add(this.vel);

		if (this.exploded && !this.played) {
			this.played = true;
			playAudio();
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
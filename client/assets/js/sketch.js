import {
	rockets,
	createRocketIcons
} from './rockets.js';

import {
	audioReady
} from './audio.js'

import { updateTimer } from './timer.js';

let loadedShader = false;
let loadingError = false;

let fancyShader;
let fancyGraphics;

// defined in setup
let radius = 0;

// serialised uniforms passed to the shader
let count = 0;
let seeds = [];
let colors = [];
let positions = [];
let velocities = [];
let explosions = [];

// client settings
export const settings = {
	useCustomColor: false,
	customColorHue: 0,
	useFancyGraphics: true,
};

export let pInstReady = false;

export const pInst = new p5(sketch, document.getElementById('canvas-wrap'));

function sketch(p) {
	p.preload = () => {
		fancyShader = p.loadShader(
			'assets/glsl/basic.vert',
			'assets/glsl/basic.frag',
			() => loadedShader = true,
			() => loadingError = true,
		);
	};

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight);

		p.pixelDensity(1);
		p.colorMode(p.HSL, 359, 1, 1, 1);

		fancyGraphics = p.createGraphics(p.width, p.height, p.WEBGL);
		fancyGraphics.pixelDensity(1);

		setMeasurements(p);
	};

	p.draw = () => {
		if (loadingError) {
			p.noStroke();
			p.fill(0, 0, 1);
			p.clear();
			p.push();
			p.text('An error occured loading the assets! Please refresh the page.', 0.5 * p.width, 0.5 * p.height);
			p.pop();
			p.noLoop();
			return;
		}

		if (loadedShader && audioReady && !pInstReady) {
			createRocketIcons();
			pInstReady = true;
		}

		if (!pInstReady) return;

		updateTimer();

		const millis = p.millis();
		for (const rocket of rockets) rocket.update(millis);

		if (settings.useFancyGraphics) {
			serialize();

			fancyShader.setUniform('u_resolution', [p.width, p.height]);
			fancyShader.setUniform('u_time', millis / 1000);

			fancyShader.setUniform('count', count);
			fancyShader.setUniform('seeds', seeds);
			fancyShader.setUniform('colors', colors);
			fancyShader.setUniform('positions', positions);
			fancyShader.setUniform('velocities', velocities);
			fancyShader.setUniform('explosions', explosions);

			fancyGraphics.shader(fancyShader);
			fancyGraphics.rect(0, 0, p.width, p.height);

			p.image(fancyGraphics, 0, 0);

			return;
		}

		p.clear();

		for (const rocket of rockets) {
			if (!rocket.launched) continue;

			const x = (rocket.pos.x + 0.5) * p.width;
			const y = p.height - (rocket.pos.y + 0.5) * p.height;
			p.noStroke();
			p.fill(rocket.hue, 1, .5);
			p.ellipse(x, y, 8);
			if (rocket.explosion > 0) {
				p.stroke(rocket.hue, 1, .5);
				p.noFill();
				p.ellipse(x, y, radius * rocket.explosion);
			}
		}
	};
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		fancyGraphics.resizeCanvas(p.width, p.height);

		setMeasurements(p);
	};
}

function setMeasurements(inst) {
	radius = Math.min(inst.width, inst.height) * 0.25;
}

function serialize() {
	count = 0;
	seeds = [];
	colors = [];
	positions = [];
	velocities = [];
	explosions = [];

	for (const rocket of rockets) {
		if (!rocket.launched) continue;
		count += 1;
		seeds.push(rocket.seed);
		colors.push(...hue2rgb(rocket.hue));
		positions.push(rocket.pos.x, rocket.pos.y);
		velocities.push(rocket.vel.x, rocket.vel.y);
		explosions.push(rocket.explosion);
	}
}

function hue2rgb(h) {
	h /= 60;
	const f = (n) => {
		n = (n < 0) ? n + 6 : (n >= 6) ? n - 6 : n;
		return (n < 1) ? n : (n < 3) ? 1 : (n < 4) ? 4 - n : 0;
	};
	return [
		f(h + 2),
		f(h),
		f(h - 2),
	];
}
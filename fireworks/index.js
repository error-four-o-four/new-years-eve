// https://openprocessing.org/sketch/835887
// https://www.youtube.com/watch?v=xDxAnguEOn8

const MAX_NUM = 30;
const DEBUG = false;

let o;
let s;

let rockets = Array.from({ length: MAX_NUM }, () => new Rocket());
let data;
let time;

function preload() {
	s = loadShader('assets/basic.vert', 'assets/basic.frag');
}

function setup() {
	let cnv = createCanvas(windowWidth, windowHeight);
	cnv.parent('canvas-wrap');
	pixelDensity(1);

	o = createGraphics(width, height, WEBGL);
	o.pixelDensity(1);

	Rocket.setGravity();
}

function draw() {
	clear();

	time = millis();
	for (const rocket of rockets) rocket.update(time);

	data = serialize();

	o.shader(s);

	s.setUniform('u_resolution', [width, height]);
	s.setUniform('u_time', time / 1000);
	s.setUniform('count', data.count);
	s.setUniform('positions', data.positions);
	s.setUniform('explosions', data.explosions);
	s.setUniform('seeds', data.seeds);

	o.rect(0, 0, width, height);

	image(o, 0, 0);

	if (DEBUG) {
		let w = min(width, height) * 0.25;
		noStroke();
		fill(255);
		text(data.count, 20, 20);

		for (let i = 0; i < data.count; i += 1) {
			let x = data.positions[i * 2];
			let y = data.positions[i * 2 + 1];

			text(nf(x, 1, 2), 20, 40 + i * 20);
			text(nf(y, 1, 2), 80, 40 + i * 20);

			push();
			translate(0.5 * width, 0.5 * height);
			noStroke();
			fill(255);
			ellipse(x * width, y * -height, 8);
			if (data.explosions[i] > 0) {
				stroke(255);
				noFill();
				ellipse(x * width, y * -height, w * data.explosions[i]);
			}
			pop();
		}
	}
}

function serialize() {
	let data = {
		count: 0,
		positions: [],
		explosions: [],
		seeds: [],
	}
	for (const rocket of rockets.filter(r => r.ignited)) {
		data.positions.push(rocket.pos.x, rocket.pos.y);
		data.explosions.push(rocket.explosion);
		data.seeds.push(rocket.seed);
		data.count += 1;
	}
	return data;
	// return rockets.filter((rocket) => rocket.ignited).reduce((result, rocket) => [...result, rocket.pos.x, rocket.pos.y], []);
}

function mousePressed() {
	const rocket = rockets.find((rocket) => !rocket.ignited);
	if (rocket) rocket.spawn(time);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	o.resizeCanvas(width, height);
	Rocket.setGravity();
}
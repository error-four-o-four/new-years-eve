const sketch = (p) => {
	let sampler;
	let output;
	let fancy;

	let loadedShader = false;
	let loadedSampler = false;

	// defined in setup
	let fontSize = 0;
	let radius = 0;

	// updated in draw
	let timer;
	let millis = 0;

	// uniforms
	let count = 0;
	let seeds = [];
	let colors = [];
	let positions = [];
	let velocities = [];
	let explosions = [];

	p.config = {
		loaded: false,
		fancy: true,
		mute: false,
	}

	p.launch = (data) => {
		const rocket = rockets.find((rocket) => !rocket.launched);
		if (rocket) rocket.launch(millis, data);
	}

	p.preload = () => {
		// sampler.triggerAttackRelease(['C1'], 0.5);
		sampler = new Tone.Sampler({
			urls: {
				A2: 'explode_03.mp3',
			},
			baseUrl: 'assets/sounds/',
			onload: () => {
				loadedSampler = true;
			}
		}).toDestination();

		fancy = p.loadShader('assets/glsl/basic.vert', 'assets/glsl/basic.frag', () => loadedShader = true);
	}

	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.id('canvas');

		p.pixelDensity(1);
		p.colorMode(p.HSL, 359, 1, 1, 1);

		p.textAlign(p.CENTER);
		p.textStyle(p.BOLD);

		output = p.createGraphics(p.width, p.height, p.WEBGL);
		output.pixelDensity(1);

		// adjust font size & explosion radius
		setMeasurements();

		Rocket.bindInstances(p, sampler);
		Rocket.initDefaults();

		console.log(touchDevice);
	}

	p.draw = () => {
		if (!p.config.loaded) {
			p.push();
			p.noStroke();
			p.fill(0, 0, 1);
			p.textSize(24);
			p.text('Loading ...', 0.5 * p.width, 0.5 * p.height);
			p.pop();

			if (loadedShader && loadedSampler) p.config.loaded = true;
			return;
		};

		setTimer();
		updateRockets();

		if (p.config.fancy) {
			serialize();

			fancy.setUniform('u_resolution', [p.width, p.height]);
			fancy.setUniform('u_time', p.millis() / 1000);

			fancy.setUniform('count', count);
			fancy.setUniform('seeds', seeds);
			fancy.setUniform('colors', colors);
			fancy.setUniform('positions', positions);
			fancy.setUniform('velocities', velocities);
			fancy.setUniform('explosions', explosions);

			output.shader(fancy);
			output.rect(0, 0, p.width, p.height);

			p.image(output, 0, 0);
		}
		else {
			p.clear();

			for (const rocket of rockets.filter((r) => r.launched)) {
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
		}

		p.stroke(0, 0, .75, .1);
		p.fill(0, 0, .5, .1);
		p.text(timer, .5 * p.width, .5 * p.height);
	}
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		output.resizeCanvas(p.width, p.height);

		setMeasurements();
	}

	function setMeasurements() {
		fontSize = Math.floor(p.min(p.width, p.height) * 0.2);
		radius = p.min(p.width, p.height) * 0.25;

		p.textSize(fontSize);
	}

	function setTimer() {
		millis = p.millis();
		timer = [p.hour, p.minute, p.second].reduce((time, value, index) => {
			time += `${value()}`.padStart(2, '0');
			return (index < 2) ? time + ':' : time;
		}, '');
	}

	function updateRockets() {
		for (const rocket of rockets) rocket.update(millis);
	}

	function serialize() {
		count = 0;
		seeds = [];
		colors = [];
		positions = [];
		velocities = [];
		explosions = [];

		for (const rocket of rockets.filter(r => r.launched)) {
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
			return	(n < 1) ? n : (n < 3) ? 1 : (n < 4) ? 4 - n : 0;
		}
		return [
			f(h + 2),
			f(h),
			f(h - 2),
		];
	}
}
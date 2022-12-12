import {
	MAX_NUM,
	MAX_AVAILABLE,
	TIMEOUT
} from './config.js';

import {
	settings,
	pInst
} from './sketch.js';

import { Rocket } from './rocket.js';

export const rockets = Array.from({ length: MAX_NUM }, () => new Rocket());

const rocketsAvailableWrap = document.getElementById('rockets-available-wrap');
let rocketsAvailable = MAX_AVAILABLE;

const rocketIconKeyframes = [
	{ opacity: 0.125 },
	{ opacity: 0.625 }
]

const rocketIconOptions = {
	duration: TIMEOUT,
	fill: 'none',
	easing: 'ease-in-out',
	iterations: 1,
}

export function createRocketIcons() {
	rocketsAvailableWrap.textContent = '';

	for (let i = 0; i < MAX_AVAILABLE; i += 1) {
		const elt = document.createElement('span');
		elt.innerHTML = '&#128640;';
		rocketsAvailableWrap.appendChild(elt);
	}
};

export function getRocketValues() {
	if (rocketsAvailable <= 0) return null;

	const hue = (settings.useCustomColor)
		? settings.customColorHue
		: Math.floor(Math.random() * 360);
	const position = Rocket.getRandomPosition();
	const velocity = Rocket.getRandomVelocity();
	const airtime = Rocket.getRandomAirtime(velocity[1]);
	const explosiontime = Rocket.getRandomExplosiontime();

	return {
		seed: Math.random(),
		hue,
		position,
		velocity,
		airtime,
		explosiontime,
		lifetime: airtime + explosiontime,
	};
};

export function launchRocket(values) {
	const rocket = rockets.find((rocket) => !rocket.launched);

	if (rocket === undefined) return;

	const rocketIcon = [...rocketsAvailableWrap.children].find((rocketIcon) => !rocketIcon.classList.contains('launched'));
	rocketIcon.classList.add('launched');
	rocketIcon.animate(rocketIconKeyframes, rocketIconOptions);

	rocketsAvailable -= 1;
	rocket.launch(pInst.millis(), values);

	setTimeout(() => {
		rocketIcon.classList.remove('launched');
		rocketsAvailable += 1;
	}, TIMEOUT);
};
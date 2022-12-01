const socket = io();

const touchDevice = ('ontouchstart' in window || navigator.maxTouchPoints) ? true : false;
const clickEvent = (touchDevice) ? 'touchend' : 'mouseup';

const MAX_NUM = 50;
// const rockets = Array.from({ length: MAX_NUM }, () => new Rocket());

const MAX_AVAILABLE = 5;
const TIMEOUT = 2000;

let available = Array.from({ length: MAX_AVAILABLE }, () => true);

let instance;

const elements = {
	modal: document.getElementById('modal-content'),
	modalWrap: document.getElementById('modal-wrap'),
	modalButton: document.getElementById('modal-button'),
	rocketsAvailableInfo: document.getElementById('rockets-available-info'),
};

const form = document.forms['rocket-config'];

for (let i = 0; i < MAX_AVAILABLE; i += 1) {
	const elt = document.createElement('span');
	elt.innerHTML = '&#128640;';
	elements.rocketsAvailableInfo.appendChild(elt);
}

// set default values
document.querySelector('label[for=range-hue]').classList.add('disabled');
form.elements['check-random-color'].checked = true;
form.elements['check-mute'].checked = false;
form.elements['check-glsl'].checked = true;

function init() {
	// instance = new p5(sketch, document.getElementById('canvas-wrap'));


	// elements.checkRandom.checked = true;
	// elements.slider.disabled = true;
	// elements.slider.parentElement.classList.add('disabled');
	// elements.checkPlayer.checked = false;
	// elements.checkShader.checked = true;

	// elements.modalButton.addEventListener(clickEvent, () => {
	// 	elements.modal.classList.toggle('visible');
	// })

	// elements.checkRandom.addEventListener('change', () => {
	// 	elements.slider.disabled = !elements.slider.disabled;
	// 	elements.slider.parentElement.classList.toggle('disabled');
	// 	Rocket.randomize = elements.checkRandom.checked;
	// 	Rocket.hue = elements.slider.value;
	// })
	// elements.checkPlayer.addEventListener('change', () => {
	// 	instance.config.mute = elements.checkPlayer.checked;
	// })

	// elements.checkShader.addEventListener('change', () => {
	// 	instance.config.fancy = elements.checkShader.checked;
	// })
	// elements.slider.addEventListener('input', () => {
	// 	Rocket.hue = elements.slider.value;
	// })

	// window.addEventListener('keyup', launchRocket);
	// window.addEventListener(clickEvent, launchRocket);

	// socket.on('data', (data) => {
	// 	instance.launch(data);
	// })


	// function launchRocket(e) {
	// 	if (
	// 		(e.type === 'keyup' && e.keyCode !== 32) ||
	// 		(e.target.id !== 'canvas') ||
	// 		(!instance.config.loaded)
	// 		) return;

	// 	let index = available.reduce((result, value, index) => (value) ? index : result, -1);
	// 	if (index === -1) return;

	// 	animateRocketIcon(index);
	// 	updateAvailable(index);
	// 	socket.emit('launch', Rocket.getLaunchValues());
	// }
	// function updateAvailable(index) {
	// 	available[index] = false;
	// }

	// function animateTo(elt, keyframes, options) {
	// 	const animation = elt.animate(
	// 		keyframes, {
	// 			...options,
	// 			fill: 'forwards'
	// 		},
	// 	);
	// 	animation.addEventListener('finish', () => {
	// 		animation.commitStyles();
	// 		animation.cancel();
	// 	})
	// 	return animation;
	// }

	// function animateRocketIcon(index) {
	// 	const item = elements.available.children[index];
	// 	const reset = () => {
	// 		item.style.opacity = 1;
	// 		available[index] = true;
	// 	}
	// 	item.style.opacity = .05;
	// 	animateTo(item, {opacity: 0.4}, {duration: 0.75 * TIMEOUT});
	// 	setTimeout(reset, TIMEOUT);
	// }
}
import './css/default.css';
import './css/style.css';

import {
	clickEvent
} from './js/config.js';

import {
	settings as sketchSettings,
	pInstReady
} from './js/sketch.js';

import {
	settings as audioSettings,
	audioReady
} from './js/audio.js';

import {
	getRocketValues,
	launchRocket
} from './js/rockets.js';

const socket = io();

const elements = {
	modal: document.getElementById('modal-content'),
	modalWrap: document.getElementById('modal-wrap'),
	modalButton: document.getElementById('modal-button'),
	countdownWrap: document.getElementById('countdown-wrap'),
	colorPreview: document.getElementById('color-preview'),
};

const form = document.forms['rocket-config'];

// set default values
document.querySelector('label[for=range-hue]').classList.add('disabled');
form.elements['range-hue'].setAttribute('disabled', '');
form.elements['range-hue'].value = 0;

form.elements['check-custom-color'].checked = sketchSettings.useCustomColor;
form.elements['check-fancy-graphics'].checked = sketchSettings.useFancyGraphics;
form.elements['check-mute'].checked = audioSettings.mutedAudio;

// set events
elements.modalButton.addEventListener(clickEvent, toggleModal);
form.elements['range-hue'].addEventListener('input', changeCustomColorHue);
form.elements['check-custom-color'].addEventListener('change', toggleCustomColor);
form.elements['check-fancy-graphics'].addEventListener('change', toggleFancyGraphics);
form.elements['check-mute'].addEventListener('change', toggleAudio);

socket.on('data', (data) => launchRocket(data));

window.addEventListener('keyup', emitRocketLaunch);
elements.countdownWrap.addEventListener(clickEvent, emitRocketLaunch);

// UI INTERACTION
function toggleModal() {
	elements.modal.classList.toggle('visible');
}

function toggleCustomColor(ev) {
	sketchSettings.useCustomColor = ev.target.checked;

	if (sketchSettings.useCustomColor) {
		document.querySelector('label[for=range-hue]').classList.remove('disabled');
		elements.colorPreview.style.setProperty('background', `hsl(${sketchSettings.customColorHue}, 100%, 50%)`);
		form.elements['range-hue'].removeAttribute('disabled');
	}
	else {
		document.querySelector('label[for=range-hue]').classList.add('disabled');
		elements.colorPreview.style.removeProperty('background');
		form.elements['range-hue'].setAttribute('disabled', '');
	}
}

function changeCustomColorHue(ev) {
	sketchSettings.customColorHue = ev.target.value;
	elements.colorPreview.style.setProperty('background', `hsl(${sketchSettings.customColorHue}, 100%, 50%)`);
}

function toggleFancyGraphics(ev) {
	sketchSettings.useFancyGraphics = ev.target.checked;
}

function toggleAudio(ev) {
	audioSettings.mutedAudio = ev.target.checked;
}

function emitRocketLaunch(e) {
	if (
		(e.type === 'keyup' && e.keyCode !== 32) ||
		(!pInstReady) ||
		(!audioReady)
	) return;

	const values = getRocketValues();

	values && socket.emit('launch', values);
}
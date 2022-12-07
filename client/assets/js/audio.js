import { clickEvent } from './config.js';
import { pInst } from './sketch.js';

export let audioReady = false;

export const settings = {
	mutedAudio: false,
};

await Tone.loaded();

const audio = new Tone.Sampler({
	urls: {
		C1: 'firework_b.mp3',
	},
	baseUrl: 'assets/sounds/',
	onload: () => {
		audioReady = true;
	}
}).toDestination();

window.addEventListener('keyup', initAudio);
window.addEventListener(clickEvent, initAudio);


async function initAudio() {
	Tone.context.resume();

	window.removeEventListener('keyup', initAudio);
	window.removeEventListener(clickEvent, initAudio);
}

const freqs = ['C1', 'G1', 'C2', 'G2'];

export function playAudio() {
	if (settings.mutedAudio) return;

	const freq = pInst.random(freqs)
	audio.triggerAttackRelease(freq, 0.875);
}
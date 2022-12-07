const countdownWrap = document.getElementById('countdown-wrap');
const dateNewYear = new Date();

let timestamp;
let timestampUpdated = Date.now();
let timeNewYear;

// testing
// dateNewYear.setSeconds(dateNewYear.getSeconds() - 86350);
// dateNewYear.setSeconds(dateNewYear.getSeconds() + 10);
// timeNewYear = dateNewYear.getTime();

setNewYearDate();

let deltaTime;
let deltas = [];

const thresholds = [
	1000 * 60 * 60 * 24,	// 1 day
	1000 * 60 * 60,				// 1 hour
	1000 * 60,						// 1 minute
	1000
];

export function updateTimer() {
	timestamp = Date.now();

	if (toSeconds(timestamp) === toSeconds(timestampUpdated)) return;

	timestampUpdated = Date.now();
	deltaTime = timeNewYear - timestamp;

	const [d, h, m, s] = time2dhms(deltaTime);

	if (deltaTime >= thresholds[0] && d === deltas[0]) return;

	if (deltaTime >= thresholds[1] && h === deltas[1] && m === deltas[2]) return;

	deltas = [d, h, m, s];

	countdownWrap.innerHTML = (s > 10)
		? `<div>${dhms2string(...deltas)}<br>left until ${dateNewYear.getFullYear()}</div>`
		: (s > 3)
			? `<span class='less-than-ten'>${s}</span>`
			: (s > 0)
				?	`<span class='less-than-three'>${s}</span>`
				: `Happy New Year!<br>${dateNewYear.getFullYear()}`;

	if (s < -86400) setNewYearDate();
}

function setNewYearDate() {
	dateNewYear.setFullYear(dateNewYear.getFullYear() + 1, 0, 1);
	dateNewYear.setHours(0, 0, 0, 0);

	timeNewYear = dateNewYear.getTime();
}

function toSeconds(time) {
	return Math.floor(time / 1000);
}

function time2dhms(stamp) {
	return thresholds.map((threshold) => Math.floor(stamp / threshold));
}

function dhms2string(d, h, m, s) {
	if (d > 0) {
		return `${d} day${pluralString(d)}`;
	}

	if (h > 0) {
		return `${digitString(h)} hour${pluralString(h)}<br>${digitString(m % 60)} minute${pluralString(m)}`;
	}

	if (m > 0) {
		return `${digitString(m)} minute${pluralString(m)}<br>${digitString(s % 60)} second${pluralString(s)}`;
	}

	if (s > 10) {
		return `${digitString(s)} second${pluralString(s)}`;
	}

	return `${s}`;
}

function digitString(v) {
	return `<span class="digits">${v}</span>`
}

function pluralString(v) {
	return (v > 1) ? 's' : '';
}
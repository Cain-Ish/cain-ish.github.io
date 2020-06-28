const setTimeoutSecondsLeft = new Date().getSeconds() * 1000;
let deSyncMinutes = -50; //Minutes to add/take to have full hour like 20:00
let timeRestartStarted;
let hourPart = 0;
let desyncTime = new Date();

const dayTimeline = {
	0: { name: 'Nad ranem', gate: true }, //0:00
	24: { shop_slums: true }, //0:24
	27: { shop_city: true }, //0:27
	31: { name: 'Poranek' }, //0:31
	61: { name: 'Południe' }, //1:01
	68: { name: 'Wczesne popołudnie' }, //1:08
	84: { resupply_slums: true }, //1:24
	87: { resupply_city: true }, //1:27
	98: { name: 'Późne popołudnie' }, //1:31
	121: { name: 'Późny wieczór' }, //2:01
	136: { shop_slums: false, shop_city: false, gate: false }, //2:16
	151: { name: 'Połnoc' }, //2:31
	157: { name: 'Środek nocy' }, //2:37
};

function fillText(id, text) {
	document.getElementById(id).innerHTML = text;
}

function fillList(text, passed) {
	let li = document.createElement('li');
	li.innerHTML = passed ? `${text} <small>(nowy dzień)</small>` : `<b>${text}</b>`;
	document.getElementById('timeline').appendChild(li);
}

document.getElementById('deSyncMinutes').value = deSyncMinutes;
function deSyncMinutesManual() {
	deSyncMinutes = Number(document.getElementById('deSyncMinutes').value);
	dayCycle();
}

function calcHours(date) {
	return ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2);
}

function calcTimelineHours(minutes) {
	let countDate = new Date(desyncTime.getTime());
	// countDate.setHours(countDate.getHours() - Number(hourPart));
	countDate.setMinutes(countDate.getMinutes() + Number(minutes));
	return calcHours(countDate);
}

function dayCycle() {
	const currentTime = new Date();
	desyncTime = new Date();
	desyncTime.setMinutes(desyncTime.getMinutes() - deSyncMinutes);
	const currentHour = desyncTime.getHours();
	const currentMintes = desyncTime.getMinutes();
	const ingameDate = Math.floor(desyncTime.getHours() / 3) + 1;
	let ingameDayPart = 'Nad ranem';
	hourPart = currentHour % 3;
	const timeCheck = hourPart * 60 + currentMintes;

	timeRestartStarted = new Date();
	timeRestartStarted = desyncTime;
	timeRestartStarted.setMinutes(0 - hourPart * 60 + deSyncMinutes);

	//clear list
	const ul = document.getElementById('timeline');
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}

	for (const [ key, value ] of Object.entries(dayTimeline)) {
		let check = timeCheck > Number(key);
		let time = Number(key) + (check ? 180 : 0);
		if (check && value.name) ingameDayPart = value.name;
		if (value.name) fillList(`<i>${value.name}: ${calcTimelineHours(time)}</i>`, check);
		if (value.gate !== undefined && value.gate) fillList(`Brama otwarta: ${calcTimelineHours(time)}`, check);
		if (value.gate !== undefined && !value.gate) fillList(`Brama zamknięta: ${calcTimelineHours(time)}`, check);
		if (value.shop_slums !== undefined && value.shop_slums)
			fillList(`Sklepy (slumsy) otwarte: ${calcTimelineHours(time)}`, check);
		if (value.shop_slums !== undefined && !value.shop_slums)
			fillList(`Sklepy (slumsy) zamknięte: ${calcTimelineHours(time)}`, check);
		if (value.shop_city !== undefined && value.shop_city)
			fillList(`Sklepy (miasto) otwarte: ${calcTimelineHours(time)}`, check);
		if (value.shop_city !== undefined && !value.shop_city)
			fillList(`Sklepy (miasto) zamknięte: ${calcTimelineHours(time)}`, check);
		if (value.resupply_slums) fillList(`Sklepy(slumsy) dostawa: ${calcTimelineHours(time)}`, check);
		if (value.resupply_city) fillList(`Sklepy(miasto) dostawa: ${calcTimelineHours(time)}`, check);
	}

	fillText('currentTime', `<b>Godzina: ${calcHours(currentTime)}</b>`);
	fillText('timeRestartStarted', `<b>Nad ranem było o ${calcHours(timeRestartStarted)}</b>`);
	fillText('ingameDate', `<b>Dzień:</b> ${ingameDate}`);
	fillText('name', `<b>Pora:</b> ${ingameDayPart}`);
}

function TimerInvterval() {
	setInterval(dayCycle, 60000);
}

// Run script every full minute pass
setTimeout(function() {
	TimerInvterval();
}, 60000 - setTimeoutSecondsLeft);

dayCycle();

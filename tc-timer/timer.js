const setTimeoutSecondsLeft = new Date().getSeconds() * 1000;
let deSyncMinutes = -50; //Minutes to add/take to have full hour like 20:00
let timeRestartStarted;

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

function fillList(text) {
	let li = document.createElement('li');
	li.innerHTML = text;
	document.getElementById('timeline').appendChild(li);
}

document.getElementById('deSyncMinutes').value = deSyncMinutes;
function deSyncMinutesManual() {
	deSyncMinutes = Number(document.getElementById('deSyncMinutes').value);
	dayCycle();
}

function calcHours(date, hourPast, minutes) {
	let countDate = new Date(date.getTime());
	countDate.setHours(countDate.getHours() - Number(hourPast));
	countDate.setMinutes(countDate.getMinutes() + Number(minutes));
	return ('00' + countDate.getHours()).slice(-2) + ':' + ('00' + countDate.getMinutes()).slice(-2);
}

function dayCycle() {
	const currentTime = new Date();
	let desyncTime = new Date();
	timeRestartStarted = new Date();
	desyncTime.setMinutes(desyncTime.getMinutes() - deSyncMinutes);
	const currentHour = desyncTime.getHours();
	const currentMintes = desyncTime.getMinutes();
	const ingameDate = Math.floor(desyncTime.getHours() / 3) + 1;
	let ingameDayPart = 'Nad ranem';
	const hourPart = currentHour % 3;
	const timeCheck = hourPart * 60 + currentMintes;

	timeRestartStarted = desyncTime;
	timeRestartStarted.setMinutes(0 - hourPart * 60 + deSyncMinutes);

	//clear list
	const ul = document.getElementById('timeline');
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}

	for (const [ key, value ] of Object.entries(dayTimeline)) {
		if (timeCheck > Number(key)) {
			if (value.name) {
				ingameDayPart = value.name;
				fillList(`<i>${value.name}: ${calcHours(desyncTime, hourPart, Number(key) + 180)}</i>`);
			}
			if (value.gate !== undefined && value.gate)
				fillList(`Brama otwarta: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.gate !== undefined && !value.gate)
				fillList(`Brama zamknięta: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.shop_slums !== undefined && value.shop_slums)
				fillList(`Sklepy (slumsy) otwarte: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.shop_slums !== undefined && !value.shop_slums)
				fillList(`Sklepy (slumsy) zamknięte: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.shop_city !== undefined && value.shop_city)
				fillList(`Sklepy (miasto) otwarte: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.shop_city !== undefined && !value.shop_city)
				fillList(`Sklepy (miasto) zamknięte: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.resupply_slums)
				fillList(`Sklepy(slumsy) dostawa: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
			if (value.resupply_city)
				fillList(`Sklepy(miasto) dostawa: ${calcHours(desyncTime, hourPart, Number(key) + 180)}`);
		} else {
			if (value.name) fillList(`<b><i>${value.name}: ${calcHours(desyncTime, hourPart, key)}</i></b>`);
			if (value.gate !== undefined && value.gate)
				fillList(`<b>Brama otwarta: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.gate !== undefined && !value.gate)
				fillList(`<b>Brama zamknięta: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.shop_slums !== undefined && value.shop_slums)
				fillList(`<b>Sklepy (slumsy) otwarte: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.shop_slums !== undefined && !value.shop_slums)
				fillList(`<b>Sklepy (slumsy) zamknięte: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.shop_city !== undefined && value.shop_city)
				fillList(`<b>Sklepy (miasto) otwarte: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.shop_city !== undefined && !value.shop_city)
				fillList(`<b>Sklepy (miasto) zamknięte: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.resupply_slums)
				fillList(`<b>Sklepy(slumsy) dostawa: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
			if (value.resupply_city)
				fillList(`<b>Sklepy(miasto) dostawa: ${calcHours(desyncTime, hourPart, Number(key))}</b>`);
		}
	}

	fillText(
		'currentTime',
		`<b>Godzina: ${('00' + currentTime.getHours()).slice(-2)}:${('00' + currentTime.getMinutes()).slice(-2)}</b>`,
	);

	fillText(
		'timeRestartStarted',
		`<b>Nad ranem było o ${('00' + timeRestartStarted.getHours()).slice(-2)}:${('00' +
			timeRestartStarted.getMinutes()).slice(-2)}</b>`,
	);
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

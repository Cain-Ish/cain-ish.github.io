const setTimeoutSecondsLeft = new Date().getSeconds() * 1000;
const deSyncMinutes = 40; //Minutes to add/take to have full hour like 20:00

const dayState = {
	name: '---',
	shop_slums: true,
	shop_city: true,
	gate: true,
	resupply: false,
};

const dayTimeline = {
	0: { name: 'Nad ranem', gate: true }, //0:00
	24: { shop_slums: true }, //0:24
	27: { shop_city: true }, //0:27
	31: { name: 'Poranek' }, //0:31
	61: { name: 'Południe' }, //1:01
	68: { name: 'Wczesne popołudnie' }, //1:08
	88: { resupply: true }, //1:28
	98: { name: 'Późne popołudnie' }, //1:31
	121: { name: 'Późny wieczór' }, //2:01
	136: { shop_slums: false, shop_city: false, gate: false }, //2:16
	151: { name: 'Połnoc' }, //2:31
	157: { name: 'Środek nocy' }, //2:37
};

function calcHours(hourPast, minutes) {
	let countDate = new Date();
	countDate.setHours(countDate.getHours() - hourPast);
	countDate.setMinutes(minutes);
	return ('00' + countDate.getHours()).slice(-2) + ':' + ('00' + countDate.getMinutes()).slice(-2);
}

function dayCycle() {
	const currentTime = new Date();
	let desyncTime = new Date();
	desyncTime.setMinutes(desyncTime.getMinutes() + deSyncMinutes);
	const currentHour = desyncTime.getHours();
	const currentMintes = desyncTime.getMinutes();
	const ingameDate = Math.floor(desyncTime.getHours() / 3) + 1;
	const hourPart = currentHour % 3;
	const timeCheck = hourPart * 60 + currentMintes;

	let currentTimeline = { ...dayState };

	for (const [ key, value ] of Object.entries(dayTimeline)) {
		if (timeCheck >= key) {
			currentTimeline = { ...currentTimeline, ...value };
		}
	}

	document.getElementById('currentTime').innerHTML = `<b>Godzina: ${('00' + currentTime.getHours()).slice(
		-2,
	)}:${('00' + currentTime.getMinutes()).slice(-2)}</b>`;
	document.getElementById('ingameDate').innerHTML = `<b>Dzień:</b> ${ingameDate}`;
	document.getElementById('name').innerHTML = `<b>Pora:</b> ${currentTimeline.name}`;
	document.getElementById('shop_slums').innerHTML = `<b>Sklepy w slumsach:</b> ${currentTimeline.shop_slums
		? `Otwarte (Zamknięcie o ${calcHours(hourPart, 136)})`
		: `Zamknięte (Otwarcie o ${calcHours(hourPart, 3 * 60 + 24)})`}`;
	document.getElementById('shop_city').innerHTML = `<b>Sklepy w mieście:</b> ${currentTimeline.shop_city
		? `Otwarte (Zamknięcie o ${calcHours(hourPart, 136)})`
		: `Zamknięte (Otwarcie o ${calcHours(hourPart, 3 * 60 + 27)})`}`;
	document.getElementById('resupply').innerHTML = `<b>Dzienna dostawa do sklepów:</b> ${currentTimeline.resupply
		? 'Była'
		: 'Będzie'} o ${calcHours(hourPart, 88)}`;
	document.getElementById('gate').innerHTML = `<b>Brama wschodnia:</b> ${currentTimeline.gate
		? `Otwarta (Zamknięcie o ${calcHours(hourPart, 136)})`
		: `Zamknięta (Otwarcie o ${calcHours(hourPart, 3 * 60)})`}`;
}

function TimerInvterval() {
	setInterval(dayCycle, 60000);
}

// Run script every full minute pass
setTimeout(function() {
	TimerInvterval();
}, 60000 - setTimeoutSecondsLeft);

dayCycle();

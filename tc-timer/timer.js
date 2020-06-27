// Ranek - 15 minut, powolne rozjaśnianie się (sklepy otwarte)
// Dzień - 105 minut (sklepy otwarte)
// Wieczór - 15 minut - powolne ściemnianie się (sklepy otwarte)
// Noc - 45 minute (sklepy zamknięte)
// Dobra łacznie: 3 godziny

// 16:40 - późny wieczór
// 16:50 - połnoc

let hour, minutes;
let myDate = new Date();
const seconds = myDate.getSeconds();

const dayState = {
	morning: 'morning',
	day: 'day',
	dawn: 'dawn',
	night: 'night',
};

let dayPart = dayState.morning;

const dayNames = {
	morning: 'Ranek (sklepy otwarte)',
	day: 'Dzień (sklepy otwarte)',
	dawn: 'Wieczór (sklepy otwarte)',
	night: 'Noc (sklepy zamkniete)',
};

function timer() {
	console.log('timer');
	myDate = new Date();
	hour = myDate.getHours();
	minutes = myDate.getMinutes();

	let hourPart = hour % 3;
	let day = Math.floor(hour / 3);

	if (hourPart == 0) dayPart = minutes <= 15 ? dayState.morning : dayState.day;
	else if (hourPart == 1) dayPart = dayState.day;
	else if (hourPart == 2) dayPart = minutes <= 15 ? dayState.dawn : dayState.night;

	let tillNight =
		dayPart === dayState.night
			? 'Noc trwa'
			: 'Noc za: ' + (60 - minutes - 45 < 0) ? `${1 - hourPart}h` : `${120 - minutes - 45}min`;
	let tillNewDay = `${2 - hourPart}h ${60 - minutes}min`;

	document.getElementById('date').innerHTML = `Dzień ${day} - ${dayNames[
		dayPart
	]}<br/>${tillNight}<br/>Nowy dzień za: ${tillNewDay}`;
}

function TimerInvterval() {
	setInterval(timer, 60000);
}

// Run script every full minute pass
setTimeout(function() {
	TimerInvterval();
}, 10000 - seconds * 1000);

timer();

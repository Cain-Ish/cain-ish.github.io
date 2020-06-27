// Ranek - 15 minut, powolne rozjaśnianie się (sklepy otwarte)
// Dzień - 105 minut (sklepy otwarte)
// Wieczór - 15 minut - powolne ściemnianie się (sklepy otwarte)
// Noc - 45 minute (sklepy zamknięte)
// Dobra łacznie: 3 godziny

let hour, minutes;
let myDate = new Date();
const seconds = myDate.getSeconds();

const dayParts = {
	morning: 'Ranek (sklepy otwarte)',
	day: 'Dzień (sklepy otwarte)',
	dawn: 'Wieczór (sklepy otwarte)',
	night: 'Noc (sklepy zamkniete)',
};

function timer() {
	myDate = new Date();
	hour = myDate.getHours();
	minutes = myDate.getMinutes();

	let hourPart = hour % 3;
	let day = Math.floor(hour / 3);
	let tillNight = `${2 - hourPart}h ${60 - minutes}min`;
	let tillNewDay = `${2 - hourPart}h ${60 - minutes}min`;
	let msg;

	if (hourPart == 0) msg = minutes <= 15 ? dayParts.morning : dayParts.day;
	else if (hourPart == 1) msg = dayParts.day;
	else if (hourPart == 2) msg = minutes <= 15 ? dayParts.dawn : dayParts.night;

	document.getElementById(
		'date',
	).innerHTML = `Dzień ${day} - ${msg}<br/>Noc za: ${tillNight}<br/>Nowy dzień za: ${tillNewDay}`;
}

// Run script every full minute pass
setTimeout(function() {
	setInterval(timer(), 60000);
}, 60000 - seconds * 1000);

timer();

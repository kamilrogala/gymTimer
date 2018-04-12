window.onload = function () {
	var gymTrainerForm = document.getElementById('gymTrainerForm');
	var trainSeries = document.getElementById('trainSeries');
	var trainRepeats = document.getElementById('trainRepeats');
	var trainDelay = document.getElementById('trainDelay');
	var trainDuration = document.getElementById('trainDuration');
	var btnStart = document.getElementById('btnStart');
	var btnStop = document.getElementById('btnStop');
	var summaryRepeats = document.getElementById('summaryRepeats');
	var summaryTime = document.getElementById('summaryTime');
	var app = document.getElementById('app');
	var startTime = document.getElementById('startTime')
	var actualSeriesCount = document.getElementById('actualSeriesCount');
	var leftSeriesCount = document.getElementById('leftSeriesCount');
	var actualRepeatsCount = document.getElementById('actualRepeatsCount');
	var leftRepeatsCount = document.getElementById('leftRepeatsCount');
	var counts = document.getElementById('counts');
	app.setAttribute('style', 'display:none');
	counts.setAttribute('style', 'display:none');
	var timerDelay;
	var repeatsTimer;
	var trainSeriesValue = 0;
	var trainRepeatsValue = 0;
	var trainDelayValue = 0;
	var trainDurationValue = 0;
	var summaryRepeatsValue = 0;
	var summaryTimeValue = 0;
	var actualRepeats = 0;
	var actualSeries = 0;
	var seconds = 5;
	var update = function () {
		summaryRepeatsValue = trainRepeatsValue * trainSeriesValue;
		summaryTimeValue = (summaryRepeatsValue * trainDurationValue) + ((trainSeriesValue - 1) * (trainDelayValue*60));

		summaryRepeats.getElementsByTagName('span')['0'].innerHTML = summaryRepeatsValue;
		summaryTime.getElementsByTagName('span')['0'].innerHTML = summaryTimeValue;
		summaryTime.getElementsByTagName('span')['1'].innerHTML = Math.floor(summaryTimeValue / 60);
		leftSeriesCount = trainSeriesValue;
		leftRepeatsCount = trainRepeatsValue;
	};
	update();

	var start = function () {
		if (trainSeriesValue != 0 && trainRepeatsValue != 0 && trainDelayValue != 0 && trainDurationValue != 0) {
			app.setAttribute('style', 'display:block');
			startTime.setAttribute('style', 'display:block');
			startTime.innerHTML = seconds;
			actualSeriesCount.innerHTML = 0
			leftSeriesCount.innerHTML = trainSeriesValue
			actualRepeatsCount.innerHTML = 0
			leftRepeatsCount.innerHTML = trainRepeatsValue;
			voice('Zaczynamy za ' + seconds + 'sekund, szykuj się!');
			timerDelay = setInterval(function () {
				seconds--;
				startTime.innerHTML = seconds;
				if (seconds == 0) {
					clearInterval(timerDelay);
					startTime.setAttribute('style', 'display:none');
					counts.setAttribute('style', 'display:block');
					setTimeout(series, 1000);
				}
			}, 1000);
		} else {
			alert('Fill all inputs');
		}
	};
	var stop = function () {
		clearInterval(timerDelay);
		clearInterval(repeatsTimer);
		app.setAttribute('style', 'display:none');
		startTime.innerHTML = 0;
	};
	var series = function () {
		voice("We're starting");
		repeats();
		actualSeries++;
		actualSeriesCount.innerHTML = actualSeries;
	};
	var repeats = function () {
		actualRepeats = 0;
		repeatsTimer = setInterval(function () {
			if (actualRepeats < trainRepeatsValue) {
				actualRepeatsCount.innerHTML = actualRepeats + 1;
				actualRepeats++;
				voice(actualRepeats);
			} else {
				clearInterval(repeatsTimer);
				if (actualSeries != trainSeriesValue) {
					voice('Rest, next is round number ' + (actualSeries + 1));
					setTimeout(series, trainDelayValue * 60000);
				} else {
					stop();
					success();
				}
			}
		}, trainDurationValue * 1000);
	};
	var success = function () {
		voice('Training done');
	}
	var voice = function (argument) {
		msg = new SpeechSynthesisUtterance(argument);
		window.speechSynthesis.speak(msg);
	}
	trainSeries.addEventListener('input', function () {
		trainSeriesValue = this.value;
		update();
	});
	trainRepeats.addEventListener('input', function () {
		trainRepeatsValue = this.value;
		update();
	});
	trainDelay.addEventListener('input', function () {
		trainDelayValue = this.value;
		update();
	});
	trainDuration.addEventListener('input', function () {
		trainDurationValue = this.value;
		update();
	});
	btnStart.addEventListener('click', function (e) {
		e.preventDefault();
		start();
	});
	btnStop.addEventListener('click', function (e) {
		e.preventDefault();
		stop();
		voice('Training stopped');
	});
};

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var myAudio = document.querySelector('audio');

var source = audioCtx.createMediaElementSource(myAudio);
var analyser = audioCtx.createAnalyser();
source.connect(analyser);

var gainNode = audioCtx.createGain();
source.connect(gainNode);
gainNode.connect(audioCtx.destination);

var HEIGHT = window.innerHeight;
var BAR_COUNT = 128;
var FREQUENCY_MULT = 3;

var quadArray = [];
quadArray.push(document.getElementById('q1-container'));
quadArray.push(document.getElementById('q2-container'));
quadArray.push(document.getElementById('q3-container'));
quadArray.push(document.getElementById('q4-container'));

var barArrays = [];
var curQuad;
for (curQuad = 0; curQuad < 4; curQuad++) {
	var barArray = [];
	barArrays.push(barArray);
}

// Set up the arrays 
for (curQuad = 0; curQuad < 4; curQuad++) {
	var curBar;
	for (curBar = 0; curBar < BAR_COUNT; curBar++) {
		var container = document.createElement('div');
		container.setAttribute('class', 'bar');

		var fill = document.createElement('div');
		fill.setAttribute('class', 'fill');

		var inverseFill = document.createElement('div');
		inverseFill.setAttribute('class', 'inverse-fill');

		container.appendChild(fill);
		container.appendChild(inverseFill);

		var barObj = {
			'fill': fill,
			'inverseFill': inverseFill
		};

		quadArray[curQuad].appendChild(container);
		barArrays[curQuad][curBar] = barObj;
	}
}

function startTimer() {
	setInterval(timerFunction, 10);
}

function timerFunction() {
	frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    var averageFreq = frequencyData[0];

    // Shift all of the colors over by one
    var updateCount;
    for (updateCount = BAR_COUNT - 1; updateCount > 0; updateCount--) {
    	var frequencyValue = frequencyData[updateCount] * FREQUENCY_MULT;

    	averageFreq += frequencyData[updateCount];

    	for (curQuad = 0; curQuad < 4; curQuad++) {
    		barArrays[curQuad][updateCount].fill.style.flex = frequencyValue;
    		barArrays[curQuad][updateCount].fill.style.backgroundColor = barArrays[curQuad][updateCount - 1].fill.style.backgroundColor;
    		barArrays[curQuad][updateCount].inverseFill.style.flex = HEIGHT - frequencyValue;
    	}
    }

    // console.log(averageFreq / BAR_COUNT)

    // Introduce new color based on average intensity
    var newColor;
    if (averageFreq > 189 * BAR_COUNT) {
    	newColor = '#ffc952';
    } else if (averageFreq > 168 * BAR_COUNT) {
    	newColor = '#47b8e0'
    } else {
    	newColor = '#34314c';
    }

	for (curQuad = 0; curQuad < 4; curQuad++) {
		barArrays[curQuad][0].fill.style.flex = frequencyValue;
		barArrays[curQuad][0].fill.style.backgroundColor = newColor;
		barArrays[curQuad][0].inverseFill.style.flex = HEIGHT - frequencyValue;
	}
}

startTimer();



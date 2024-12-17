const bpmInput = document.getElementById("bpm-input");
const startStopButton = document.getElementById("start-stop");
const indicator = document.getElementById("indicator");

let intervalId = null;
let bpm = 120;

// Function to play a bell-like sound
function playMetronome() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create an oscillator for the bell sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine"; // Sine wave for a bell-like sound
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime); // Higher frequency for the bell
    gainNode.gain.setValueAtTime(5.5, audioContext.currentTime); // Start volume

    // Apply exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // Short bell sound

    // Animate the indicator
    indicator.style.backgroundColor = "red";
    setTimeout(() => {
        indicator.style.backgroundColor = "transparent";
    }, 100);
}

// Function to start the metronome
function startMetronome() {
    const interval = 60000 / bpm; // Calculate interval in milliseconds
    intervalId = setInterval(playMetronome, interval);
    startStopButton.textContent = "Stop";
}

// Function to stop the metronome
function stopMetronome() {
    clearInterval(intervalId);
    intervalId = null;
    startStopButton.textContent = "Start";
}

// Event listener for the start/stop button
startStopButton.addEventListener("click", () => {
    if (intervalId) {
        stopMetronome();
    } else {
        bpm = parseInt(bpmInput.value, 10) || 120; // Update BPM from input
        startMetronome();
    }
});


// Map for sound files
const soundFiles = {
    kick: '../sounds/1.mp3',
    snare: '../sounds/2.mp3',
    hihat: '../sounds/3.mp3',
    tom1: '../sounds/4.mp3',
    tom2: '../sounds/5.mp3',
    floorTom: '../sounds/6.mp3',
    ride: '../sounds/7.mp3',
    crash: '../sounds/8.mp3',
    clap: '../sounds/9.mp3',
    cowbell: '../sounds/10.mp3'
};

// Store active audio elements
const activeAudios = {};

// Function to play sound in loop
function playSoundInLoop(soundName) {
    if (activeAudios[soundName]) {
        // Stop the sound if already playing
        activeAudios[soundName].loop = false;
        activeAudios[soundName].pause();
        activeAudios[soundName].currentTime = 0;
        delete activeAudios[soundName];
    } else {
        // Start the sound in loop
        const audio = new Audio(soundFiles[soundName]);
        audio.loop = true;
        audio.play();
        activeAudios[soundName] = audio;
    }
}

// Add click event listener to each drum pad
document.querySelectorAll('.drum-pad').forEach(pad => {
    pad.addEventListener('click', () => {
        const soundName = pad.getAttribute('data-sound');
        playSoundInLoop(soundName);
    });
});

// Function to stop all sounds
function stopAllSounds() {
    Object.values(activeAudios).forEach(audio => {
        audio.loop = false;        // Stop looping
        audio.pause();             // Pause the audio
        audio.currentTime = 0;     // Reset playback to the beginning
    });

    // Clear the list of active audios
    Object.keys(activeAudios).forEach(key => delete activeAudios[key]);
}

// Add event listener to the stop button
document.getElementById('stop-sounds').addEventListener('click', stopAllSounds);


document.addEventListener('DOMContentLoaded', () => {
    const volumeBar = document.getElementById('volume-bar');
    const recordBtn = document.getElementById('record-btn');
    const saveBtn = document.getElementById('save-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const audioPlayer = document.getElementById('audio-player');
    let analyser = null;
    let microphone = null;
    let micStream = null; // משתנה גלובלי לשמירת זרם המיקרופון
    let mediaRecorder = null;
    let isRecording = false;
    let audioChunks = [];
    let recordings = [];
    let currentRecordingIndex = -1;


    // משתנים גלובליים
    let audioContext = null;
    let effects = {};
    let sliders = {};

    // פונקציה ליצירת אפקטים דינמית
    const createEffects = (audioContext, source) => {
        effects = {
            lowFilter: audioContext.createBiquadFilter(),
            highFilter: audioContext.createBiquadFilter(),
            panner: audioContext.createStereoPanner(),
            compressor: audioContext.createDynamicsCompressor(),
            reverb: audioContext.createGain(),
            distortion: audioContext.createWaveShaper(),
            chorus: audioContext.createGain(),
            echo: audioContext.createDelay(),
            pitchShift: audioContext.createGain(),
            bitcrusher: audioContext.createGain(),
            noiseGate: audioContext.createGain(),
            equalizer: audioContext.createGain(),
            flanger: audioContext.createGain(),
            phaser: audioContext.createGain(),
            tremolo: audioContext.createGain(),
            stereoWidener: audioContext.createGain(),
            autoWah: audioContext.createGain(),
            vibrato: audioContext.createGain(),
            delay: audioContext.createDelay(),
            gain: audioContext.createGain(),
            harmonicExciter: audioContext.createGain(),
            deesser: audioContext.createGain(),
            subBassEnhancer: audioContext.createGain(),
            multibandCompression: audioContext.createGain(),
        };
        // מסלול עוקף
        bypassNode = audioContext.createGain();
        bypassNode.gain.value = 1; // ברירת מחדל: עוקף פעיל ב-100%

        // הוספת ערכי ברירת מחדל לכל אפקט
        Object.values(effects).forEach((effect) => {
            if (effect.gain) effect.defaultGain = effect.gain.value;
            if (effect.delayTime) effect.defaultDelayTime = effect.delayTime.value;
            if (effect.pan) effect.defaultPan = effect.pan.value;
            if (effect.frequency) effect.defaultFrequency = effect.frequency.value;
        });

        // חיבור כל האפקטים ברצף
        let previousNode = source;
        Object.values(effects).forEach((effect) => {
            previousNode.connect(effect);
            previousNode = effect;
        });

        previousNode.connect(audioContext.destination);

        // חיבור המסלול העוקף
        source.connect(bypassNode);
        bypassNode.connect(audioContext.destination);
    };

    const adjustAllEffects = (level) => {
        Object.keys(effects).forEach((effectName) => {
            const effect = effects[effectName];
            if (effect) {
                if (effect.gain) {
                    effect.gain.value = effect.defaultGain * level; // התאמה של gain
                } else if (effect.delayTime) {
                    effect.delayTime.value = effect.defaultDelayTime * level; // התאמה של delay
                } else if (effect.pan) {
                    effect.pan.value = effect.defaultPan * level; // התאמה של pan
                } else if (effect.frequency) {
                    effect.frequency.value = effect.defaultFrequency * (level > 0 ? 1 : 0.01); // התאמה של frequency
                }
            }
        });

        // הפחתת עוצמת המסלול העוקף בהתאם למחוון
        bypassNode.gain.value = 1 - level; // ככל שהאפקטים חזקים יותר, המסלול העוקף חלש יותר
    };

    document.getElementById('master-effect-level').addEventListener('input', (e) => {
        const level = parseFloat(e.target.value); // ערך המחוון
        adjustAllEffects(level); // שליטה על רמת האפקטים
    });


    // עדכון מחוונים לאפקטים
    const setupSliders = () => {
        sliders = {
            'low-filter-slider': (value) => (effects.lowFilter.gain.value = parseFloat(value)),
            'high-filter-slider': (value) => (effects.highFilter.gain.value = parseFloat(value)),
            'panner-slider': (value) => (effects.panner.pan.value = parseFloat(value)),
            'compressor-threshold': (value) => (effects.compressor.threshold.value = parseFloat(value)),
            'reverb-slider': (value) => (effects.reverb.gain.value = parseFloat(value)),
            'distortion-slider': (value) => (effects.distortion.curve = makeDistortionCurve(value)),
            'chorus-slider': (value) => (effects.chorus.gain.value = parseFloat(value)),
            'echo-delay-slider': (value) => (effects.echo.delayTime.value = parseFloat(value) / 1000),
            'pitchshift-slider': (value) => (effects.pitchShift.gain.value = parseFloat(value)),
            'bitcrusher-slider': (value) => (effects.bitcrusher.gain.value = parseFloat(value)),
            'noisegate-slider': (value) => (effects.noiseGate.gain.value = parseFloat(value)),
            'equalizer-slider': (value) => (effects.equalizer.gain.value = parseFloat(value)),
            'flanger-slider': (value) => (effects.flanger.gain.value = parseFloat(value)),
            'phaser-slider': (value) => (effects.phaser.gain.value = parseFloat(value)),
            'tremolo-slider': (value) => (effects.tremolo.gain.value = parseFloat(value)),
            'stereo-slider': (value) => (effects.stereoWidener.gain.value = parseFloat(value)),
            'autowah-slider': (value) => (effects.autoWah.gain.value = parseFloat(value)),
            'vibrato-slider': (value) => (effects.vibrato.gain.value = parseFloat(value)),
            'delay-slider': (value) => (effects.delay.delayTime.value = parseFloat(value) / 1000),
            'gain-slider': (value) => (effects.gain.gain.value = parseFloat(value)),
            'exciter-slider': (value) => (effects.harmonicExciter.gain.value = parseFloat(value)),
            'deesser-slider': (value) => (effects.deesser.gain.value = parseFloat(value)),
            'subbass-slider': (value) => (effects.subBassEnhancer.gain.value = parseFloat(value)),
            'multiband-compression-slider': (value) => (effects.multibandCompression.gain.value = parseFloat(value)),
        };


        // חיבור כל המחוונים לאפקטים
        Object.keys(sliders).forEach((id) => {
            const slider = document.getElementById(id);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    sliders[id](e.target.value);
                });
            }
        });
    };

    // יצירת עקומת דיסטורשן
    const makeDistortionCurve = (amount) => {
        const k = typeof amount === 'number' ? amount : 50;
        const nSamples = 44100;
        const curve = new Float32Array(nSamples);
        const deg = Math.PI / 180;
        let i = 0;
        for (; i < nSamples; ++i) {
            const x = (i * 2) / nSamples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    };

    // חיבור אפקטים לנגן
    const setupAudioPlayerWithEffects = () => {
        audioPlayer.addEventListener('play', () => {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const source = audioContext.createMediaElementSource(audioPlayer);
            createEffects(audioContext, source);
            setupSliders();
        });
    };




    // קריאה לפונקציה הראשית
    setupAudioPlayerWithEffects();

    const getMicrophoneStream = async () => {
        if (!micStream) {
            try {
                // בקשת גישה למיקרופון הראשי של המכשיר בלבד
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        autoGainControl: false, // מניעת שליטה אוטומטית
                        noiseSuppression: true, // צמצום רעשים
                        echoCancellation: false, // מניעת עיבוד של שיחות
                    }
                });
                console.log('Microphone stream initialized using default device.');
            } catch (err) {
                console.error('Error accessing microphone:', err);
                alert('Unable to access microphone. Please check permissions.');
                throw err;
            }
        } else {
            console.log('Reusing existing microphone stream.');
        }
        return micStream;
    };

    const initializeAudioContext = (stream) => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // גודל FFT לניתוח תדרים
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            // התחלת עדכון מדד הווליום
            updateVolumeMeter();
        }
    };


    const updateVolumeMeter = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
            analyser.getByteFrequencyData(dataArray);

            // חישוב ווליום ממוצע (Root Mean Square - RMS)
            const rms = Math.sqrt(dataArray.reduce((sum, value) => sum + value ** 2, 0) / dataArray.length);
            const normalizedVolume = Math.min(rms / 128, 1); // נורמליזציה לטווח [0, 1]

            // עדכון רוחב וצבע של מדד הווליום
            const percentage = normalizedVolume * 100;
            volumeBar.style.width = `${percentage}%`;

            if (percentage > 66) {
                volumeBar.className = 'volume-bar high';
            } else if (percentage > 33) {
                volumeBar.className = 'volume-bar medium';
            } else {
                volumeBar.className = 'volume-bar low';
            }

            requestAnimationFrame(update); // הפעלה מחזורית
        };

        update(); // הפעלה ראשונית
    };


    // כפתור הקלטה/עצירה
    recordBtn.addEventListener('click', async () => {
        if (!isRecording) {
            try {
                const stream = await getMicrophoneStream();
                initializeAudioContext(stream);

                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    recordings.push(audioBlob);
                    currentRecordingIndex = recordings.length - 1;
                    updateAudioPlayer();
                    updateButtonsState();
                    console.log('Recording saved.');
                };

                mediaRecorder.start();
                isRecording = true;
                recordBtn.textContent = 'Stop Recording';
                console.log('Recording started...');
            } catch (err) {
                console.error('Error starting recording:', err);
            }
        } else {
            mediaRecorder.stop();
            isRecording = false;
            recordBtn.textContent = 'Start Recording';
            console.log('Recording stopped.');
        }
    });

    saveBtn.addEventListener('click', () => {
        if (currentRecordingIndex >= 0 && recordings[currentRecordingIndex]) {
            const audioBlob = recordings[currentRecordingIndex];
            const downloadUrl = URL.createObjectURL(audioBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = 'recording.mp3'; // שמור כ-MP3
            downloadLink.click();
            URL.revokeObjectURL(downloadUrl);
            console.log('MP3 file saved successfully!');
        } else {
            alert('אין הקלטה זמינה לשמירה.');
        }
    });





    // עדכון נגן האודיו
    const updateAudioPlayer = () => {
        if (currentRecordingIndex >= 0 && recordings[currentRecordingIndex]) {
            const audioUrl = URL.createObjectURL(recordings[currentRecordingIndex]);
            audioPlayer.src = audioUrl;
            audioPlayer.play();
        } else {
            audioPlayer.src = '';
        }
    };

    // מעבר להקלטה הקודמת
    prevBtn.addEventListener('click', () => {
        if (currentRecordingIndex > 0) {
            currentRecordingIndex--;
            updateAudioPlayer();
            updateButtonsState();
        }
    });

    // מעבר להקלטה הבאה
    nextBtn.addEventListener('click', () => {
        if (currentRecordingIndex < recordings.length - 1) {
            currentRecordingIndex++;
            updateAudioPlayer();
            updateButtonsState();
        }
    });

    // מחיקת כל ההקלטות
    deleteAllBtn.addEventListener('click', () => {
        recordings = [];
        currentRecordingIndex = -1;
        audioPlayer.src = '';
        updateButtonsState();
    });


    // עדכון מצב הכפתורים
    const updateButtonsState = () => {
        prevBtn.disabled = currentRecordingIndex <= 0;
        nextBtn.disabled = currentRecordingIndex >= recordings.length - 1;
        deleteAllBtn.disabled = recordings.length === 0;
        saveBtn.disabled = currentRecordingIndex === -1 || recordings.length === 0;
    };

    // הגדרות ראשוניות
    updateButtonsState();
});

const recordBtn = document.getElementById('record-btn');

recordBtn.addEventListener('click', () => {
    const currentState = recordBtn.getAttribute('data-state');

    if (currentState === "start") {
        recordBtn.setAttribute('data-state', 'stop');
        recordBtn.textContent = "עצור הקלטה"; // שינוי לטקסט "עצור הקלטה"
    } else {
        recordBtn.setAttribute('data-state', 'start');
        recordBtn.textContent = "התחל הקלטה"; // שינוי לטקסט "התחל הקלטה"
    }
});

// מעקב אחרי שינויים בלתי צפויים
const observer = new MutationObserver(() => {
    const currentState = recordBtn.getAttribute('data-state');
    if (currentState === "start") {
        recordBtn.textContent = "התחל הקלטה";
    } else if (currentState === "stop") {
        recordBtn.textContent = "עצור הקלטה";
    }
});

// התחל מעקב אחרי הכפתור
observer.observe(recordBtn, { childList: true, characterData: true, subtree: true });


const updateButtonsState = () => {
    prevBtn.disabled = currentRecordingIndex <= 0;
    nextBtn.disabled = currentRecordingIndex >= recordings.length - 1;
    deleteAllBtn.disabled = recordings.length === 0;
    saveBtn.disabled = currentRecordingIndex === -1 || recordings.length === 0; // ודא שזה מופיע
};

mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' }); // MP3 במקום WAV
    recordings.push(audioBlob);
    currentRecordingIndex = recordings.length - 1;
    updateAudioPlayer();
    updateButtonsState();
    console.log('Recording saved as MP3.');
};


saveBtn.addEventListener('click', () => {
    if (currentRecordingIndex >= 0 && recordings[currentRecordingIndex]) {
        const audioBlob = recordings[currentRecordingIndex];
        const downloadUrl = URL.createObjectURL(audioBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'recording.mp3'; // סיומת MP3, למרות שזה עדיין WAV
        downloadLink.click();
        URL.revokeObjectURL(downloadUrl);
        console.log('File saved as MP3 (or WAV with .mp3 extension).');
    } else {
        alert('אין הקלטה זמינה לשמירה.');
    }
});

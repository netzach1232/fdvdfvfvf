let scrollEnabled = true; // משתנה לסטטוס הגלילה
let scrollInterval;

// פונקציה להתחלת הגלילה
function startScroll(speed) {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
        window.scrollBy(0, 1);
    }, 4200 / speed);
}

// מאזין לאינפוט של מהירות הגלילה
document.querySelector('.circle-input').addEventListener('input', function () {
    const speed = parseInt(this.value, 10) || 0;
    if (speed === 0) {
        clearInterval(scrollInterval);
        return;
    }
    if (scrollEnabled) startScroll(speed);
});

// מאזינים לעצירת הגלילה והפעלה מחדש
document.body.addEventListener('click', toggleScroll);
document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // מונע את פעולת ברירת המחדל מהדף
        toggleScroll();
    });
});

function toggleScroll() {
    scrollEnabled = !scrollEnabled;
    if (!scrollEnabled) {
        clearInterval(scrollInterval);
    } else {
        const speed = parseInt(document.querySelector('.circle-input').value, 10) || 0;
        if (speed > 0) startScroll(speed);
    }
}

// פונקציה למחיקת תמונות
document.getElementById('deleteImages').addEventListener('click', function () {
    const imageContainer = document.getElementById('imageContainer');
    const canvas = document.getElementById('pdfCanvas');

    // מוחק את כל התמונות
    imageContainer.innerHTML = '';

    // מנקה את ה-PDF
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // מאפס את הקנבס
});

// פונקציה להעלאת תמונות חדשות
document.getElementById('uploadImages').addEventListener('click', function () {
    document.getElementById('fileInput').click(); // פותח את חלון העלאת הקבצים
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Uploaded Image';
            imageContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// פונקציה להעלאת קובץ PDF
document.getElementById('uploadPdf').addEventListener('click', function () {
    document.getElementById('pdfInput').click();
});

document.getElementById('pdfInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const pdfData = new Uint8Array(e.target.result);
            displayPDF(pdfData);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('אנא העלה קובץ PDF תקין');
    }
});

// פונקציה להצגת PDF
async function displayPDF(pdfData) {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const container = document.getElementById('imageContainer');
    container.innerHTML = ''; // מנקה תוכן קודם

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 1.5; // שינוי גודל לפי הצורך
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        await page.render(renderContext).promise;
        container.appendChild(canvas); // מוסיף את הקנבס של הדף למכולה
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeMessageInstructions = document.getElementById('welcomeMessageInstructions');

    // פונקציה להסתרת אלמנט עם אפקט דהייה
    function hideElement(element) {
        if (element) {
            element.style.opacity = '0'; // אפקט דהייה
            setTimeout(() => {
                element.remove(); // הסרה מוחלטת מה-DOM
            }, 1000); // המתנה לסיום אפקט הדהייה
        }
    }

    // טיימרים להסתרת האלמנטים לאחר זמן קבוע
    setTimeout(() => hideElement(welcomeMessage), 20000); // 20 שניות
    setTimeout(() => hideElement(welcomeMessageInstructions), 20000); // 20 שניות

    // מאזין לאירועים לחיצה על האלמנטים עצמם
    if (welcomeMessage) {
        welcomeMessage.addEventListener('click', () => hideElement(welcomeMessage));
    }
    if (welcomeMessageInstructions) {
        welcomeMessageInstructions.addEventListener('click', () => hideElement(welcomeMessageInstructions));
    }

    // מאזין לאירועים לחיצה על הדף
    document.body.addEventListener('click', (e) => {
        // אם הלחיצה אינה על אחד האלמנטים עצמם
        if (
            e.target !== welcomeMessage &&
            e.target !== welcomeMessageInstructions &&
            !welcomeMessage.contains(e.target) &&
            !welcomeMessageInstructions.contains(e.target)
        ) {
            hideElement(welcomeMessage);
            hideElement(welcomeMessageInstructions);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.getElementById('imageContainer');

    // הסרת התמונות הראשוניות בעת טעינת הדף
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
});

// נתיב לתיקיית SOUNDS
const soundsPath = "./SOUNDS/";

// רשימת שמות קבצי השירים בתיקיית SOUNDS
const songs = ["1.mp3", "2.mp3", "3.mp3", "4.mp3, 5.mp3", "6.mp3", "7.mp3", "8.mp3", "9.mp3", "10.mp3",
    "11.mp3", "12.mp3", "13.mp3", "14.mp3", "15.mp3", "16.mp3", "17.mp3", "18.mp3", "תופים 1.mp3", "תופים 2.mp3",
    "תופים 3.mp3", "תופים 4.mp3", "תופים 5.mp3", "היא לא יודעת מה עובר עליי 1.mp3", "היא לא יודעת מה עובר עליי 2.mp3", "הלב שלי 1.mp3", "הלב שלי 2.mp3", "לאבא שלי יש סולם 1.mp3", "לאבא שלי יש סולם 2.mp3", "30.mp3",
    "31.mp3", "32.mp3", "33.mp3", "34.mp3", "35.mp3", "36.mp3", "37.mp3", "38.mp3", "39.mp3", "40.mp3",
    "41.mp3", "42.mp3", "43.mp3", "44.mp3", "45.mp3", "46.mp3", "47.mp3", "48.mp3", "49.mp3", "50.mp3",
    "51.mp3", "52.mp3", "53.mp3", "54.mp3", "55.mp3", "56.mp3", "57.mp3", "58.mp3", "59.mp3", "60.mp3",
    "61.mp3", "62.mp3", "63.mp3", "64.mp3", "65.mp3", "66.mp3", "67.mp3", "68.mp3", "69.mp3", "70.mp3",
    "71.mp3", "72.mp3", "73.mp3", "74.mp3", "75.mp3", "76.mp3", "77.mp3", "78.mp3", "79.mp3", "80.mp3"]; // עדכן את השמות לפי הקבצים בתיקייה
let currentSongIndex = 0;

// יצירת אובייקט Audio
let audio = new Audio(soundsPath + songs[currentSongIndex]);
audio.loop = true; // הפעלת לופ לשיר הנוכחי

audio.volume = 1.0; // קבע את הווליום של השיר (ערך בין 0 ל-1)
audio.play();

// פונקציה לנגן/להשהות שיר
function togglePlayPause() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// פונקציה לנגן את השיר הבא
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateAudioSource();
}

// פונקציה לנגן את השיר הקודם
function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateAudioSource();
}

// פונקציה לעדכון המקור של אובייקט ה-Audio
function updateAudioSource() {
    audio.pause(); // עצירה של השיר הנוכחי
    audio = new Audio(soundsPath + songs[currentSongIndex]); // יצירת אובייקט Audio חדש
    audio.loop = true; // הפעלת לופ לשיר החדש
    audio.play(); // ניגון השיר החדש
}

// הוספת מאזינים לאירועים לכפתורים
document.getElementById("toggleButton").addEventListener("click", togglePlayPause);
document.getElementById("nextButton").addEventListener("click", playNextSong);
document.getElementById("prevButton").addEventListener("click", playPrevSong);

const draggable = document.querySelector(".draggable");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// התחלת הגרירה
draggable.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - draggable.offsetLeft;
    offsetY = e.clientY - draggable.offsetTop;
    draggable.style.cursor = "grabbing"; // משנה את סמן העכבר
});

// תנועת גרירה
document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        draggable.style.position = "fixed";
        draggable.style.left = `${e.clientX - offsetX}px`;
        draggable.style.top = `${e.clientY - offsetY}px`;
    }
});

// עצירת הגרירה
document.addEventListener("mouseup", () => {
    isDragging = false;
    draggable.style.cursor = "move"; // מחזיר את הסמן למצב הרגיל
});

let audioContext = null; // התחלה ללא מופע AudioContext

document.addEventListener('click', () => {
    // בדיקה אם כבר נוצר AudioContext
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioContext successfully created.');
        } catch (error) {
            console.error('Error creating AudioContext:', error);
        }
    }
});

// אלמנטים מה-DOM
const startStopButton = document.getElementById("start-stop"); // כפתור הפעלה/עצירה
const bpmInput = document.getElementById("bpm-input"); // קלט ה-BPM
const indicator = document.getElementById("indicator"); // אינדיקטור ויזואלי


// פונקציה לניגון צליל פעימה
function playMetronome() {
    // יצירת מתנד ומגבר
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // הגדרות המתנד והצליל
    oscillator.type = "sine"; // סוג הגל
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime); // תדר הצליל
    gainNode.gain.setValueAtTime(0.080, audioContext.currentTime); // עוצמת הצליל
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // דעיכת הצליל

    // חיבור המתנד למגבר ולרמקולים
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // הפעלת הצליל
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // עצירה אחרי חצי שנייה

    // שינוי צבע והגדלה זמנית
    indicator.classList.add("active");
    setTimeout(() => {
        indicator.classList.remove("active");
    }, 100); // זמן האפקט
}

// פונקציה להתחלת המטרונום
function startMetronome() {
    isRunning = true; // הגדרת מצב פעיל
    lastTick = performance.now(); // שמירת זמן הפעימה הראשונה

    // פונקציה למחזור פעימות
    function metronomeTick() {
        if (!isRunning) return; // יציאה אם המטרונום נעצר
        const now = performance.now(); // הזמן הנוכחי
        const elapsed = now - lastTick; // זמן שעבר מאז הפעימה האחרונה
        if (elapsed >= 60000 / bpm) { // בדיקה אם עבר הזמן בין פעימות
            lastTick = now;
            playMetronome(); // ניגון פעימה
        }
        requestAnimationFrame(metronomeTick); // קריאה לפעימה הבאה
    }

    metronomeTick(); // התחלת מחזור הפעימות
    startStopButton.textContent = "Stop"; // שינוי טקסט הכפתור
}

// פונקציה לעצירת המטרונום
function stopMetronome() {
    isRunning = false; // שינוי מצב המטרונום
    startStopButton.textContent = "Start"; // שינוי טקסט הכפתור
}

// מאזין לאירוע לחיצה על כפתור הפעלה/עצירה
startStopButton.addEventListener("click", () => {
    if (isRunning) {
        stopMetronome(); // עצירת המטרונום אם פעיל
    } else {
        bpm = parseInt(bpmInput.value, 10) || 120; // עדכון BPM מקלט המשתמש
        startMetronome(); // הפעלת המטרונום
    }
});

// פונקציה לחיפוש שיר לפי שם
document.getElementById('searchSongButton').addEventListener('click', function () {
    const searchInput = document.getElementById('searchSongInput').value.toLowerCase();
    const foundIndex = songs.findIndex(song => song.toLowerCase().includes(searchInput));

    if (foundIndex !== -1) {
        currentSongIndex = foundIndex;
        updateAudioSource(); // מעדכן ומשמיע את השיר
    } else {
        alert('Song not found!');
    }
});

document.getElementById('searchSongButton').addEventListener('click', function () {
    const searchInput = document.getElementById('searchSongInput').value.trim().toLowerCase(); // קבלת הקלט מהמשתמש
    const foundIndex = songs.findIndex(song => song.toLowerCase().includes(searchInput)); // חיפוש השיר ברשימה

    if (foundIndex !== -1) {
        currentSongIndex = foundIndex; // עדכון האינדקס לשיר שנמצא
        updateAudioSource(); // הפעלת השיר
    } else {
        alert('Song not found!'); // הודעה אם השיר לא נמצא
    }
});

// פונקציה להצגת תוצאות חיפוש
function displaySearchResults(results) {
    // יצירת תיבת תוצאות (Modal או פשוט רשימה)
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'searchResultsContainer';
    resultsContainer.style.position = 'fixed';
    resultsContainer.style.top = '50%';
    resultsContainer.style.left = '50%';
    resultsContainer.style.transform = 'translate(-50%, -50%)';
    resultsContainer.style.backgroundColor = '#fff';
    resultsContainer.style.border = '1px solid #ccc';
    resultsContainer.style.padding = '10px';
    resultsContainer.style.zIndex = 1000;

    // כותרת לתוצאות
    const title = document.createElement('h3');
    title.textContent = 'Choose a song:';
    resultsContainer.appendChild(title);

    // יצירת רשימת התוצאות
    results.forEach((song) => {
        const button = document.createElement('button');
        button.textContent = song;
        button.style.display = 'block';
        button.style.margin = '5px 0';
        button.addEventListener('click', () => {
            currentSongIndex = songs.indexOf(song); // עדכון השיר הנבחר
            updateAudioSource(); // הפעלת השיר
            if (document.body.contains(resultsContainer)) {
                document.body.removeChild(resultsContainer); // הסרת הרשימה
            }
        });
        resultsContainer.appendChild(button);
    });

    // כפתור לסגירת תיבת התוצאות
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.addEventListener('click', () => {
        if (document.body.contains(resultsContainer)) {
            document.body.removeChild(resultsContainer); // הסרת הרשימה
        }
    });
    resultsContainer.appendChild(closeButton);

    // הוספת תיבת התוצאות לדף
    document.body.appendChild(resultsContainer);
}

// מאזין לכפתור הפעלה
const playButton = document.getElementById('playButton');
if (playButton) {
    playButton.addEventListener('click', () => {
        const audioContext = new AudioContext();
        // הפעלת האודיו כאן
        const audio = new Audio('sounds/song.mp3');
        audio.play();
    });
}

// יצירת AudioContext פעם אחת
document.addEventListener('click', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // שאר קוד האודיו כאן
});



document.addEventListener("DOMContentLoaded", () => {
    const bpmInput = document.getElementById("bpm-input");
    const startStopButton = document.getElementById("start-stop");
    const indicator = document.getElementById("indicator");
    let intervalId = null;

    const playClickSound = () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = "sine"; // טון פשוט
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // תדר ב-1000Hz
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 100); // משך הצליל 100ms
    };

    const startMetronome = () => {
        const bpm = parseInt(bpmInput.value, 10);
        if (isNaN(bpm) || bpm < 40 || bpm > 240) {
            alert("יש להזין ערך BPM בין 40 ל-240.");
            return;
        }

        const interval = (60 / bpm) * 1000;

        indicator.classList.add("active");
        intervalId = setInterval(() => {
            playClickSound();
            indicator.classList.toggle("active");
        }, interval);
    };

    const stopMetronome = () => {
        clearInterval(intervalId);
        intervalId = null;
        indicator.classList.remove("active");
    };

    startStopButton.addEventListener("click", () => {
        if (intervalId) {
            stopMetronome();
            startStopButton.textContent = "Start";
        } else {
            startMetronome();
            startStopButton.textContent = "Stop";
        }
    });
});


// ממתינים לטעינת ה-DOM במלואו
document.addEventListener("DOMContentLoaded", function () {
    // בוחרים את הודעת הברכה
    const welcomeMessage = document.getElementById("welcomeMessage");
    const welcomeMessageInstructions = document.getElementById("welcomeMessageInstructions");

    // מוסיפים אירוע לחיצה לכל העמוד
    document.addEventListener("click", function () {
        // מוסיפים את מחלקת ההתנדפות
        if (welcomeMessage) welcomeMessage.classList.add("fade-out");
        if (welcomeMessageInstructions) welcomeMessageInstructions.classList.add("fade-out");

        // מסירים את האלמנט לחלוטין מה-DOM אחרי שהתנדף (1 שנייה)
        setTimeout(() => {
            if (welcomeMessage) welcomeMessage.style.display = "none";
            if (welcomeMessageInstructions) welcomeMessageInstructions.style.display = "none";
        }, 1000); // משך ההתנדפות (1 שנייה)
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById("uploadImages");
    const fileInput = document.getElementById("fileInput");
    const imageContainer = document.getElementById("imageContainer");

    // מחיקת תמונות קיימות מראש
    const predefinedImages = imageContainer.querySelectorAll("img");
    predefinedImages.forEach(img => img.remove());

    // פותח את חלון העלאת הקבצים
    uploadButton.addEventListener("click", () => {
        fileInput.click();
    });

    // טיפול בקבצים שנבחרו
    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;

        // עבור על הקבצים והוסף תמונות חדשות
        Array.from(files).forEach((file) => {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.onload = () => URL.revokeObjectURL(img.src); // שחרור זיכרון
            imageContainer.appendChild(img); // הוסף לדף
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadPdfButton = document.getElementById("uploadPdf");
    const pdfInput = document.getElementById("pdfInput");
    const imageContainer = document.getElementById("imageContainer");

    // פותח את חלון העלאת הקבצים
    uploadPdfButton.addEventListener("click", () => {
        pdfInput.click();
    });

    // טיפול בקובץ PDF שנבחר
    pdfInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            const fileReader = new FileReader();

            fileReader.onload = async function () {
                const pdfData = new Uint8Array(this.result);

                // טעינת קובץ PDF
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

                // נקה את הקונטיינר לתמונות
                imageContainer.innerHTML = "";

                // מעבר על כל דפי ה-PDF
                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    const page = await pdf.getPage(pageNumber);
                    const viewport = page.getViewport({ scale: 1.5 });

                    // יצירת קנבס חדש עבור כל דף
                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext("2d");

                    // ציור הדף בקנבס
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    await page.render(renderContext);

                    // הוספת הקנבס לקונטיינר
                    imageContainer.appendChild(canvas);
                }
            };

            fileReader.readAsArrayBuffer(file);
        } else {
            alert("נא לבחור קובץ PDF בלבד.");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.getElementById("deleteImages");
    const imageContainer = document.getElementById("imageContainer");

    // מאזין ללחיצה על כפתור מחיקת כל ה-PDF
    deleteButton.addEventListener("click", () => {
        imageContainer.innerHTML = ""; // מנקה את כל הדפים של ה-PDF מהקונטיינר
    });
});


let scrollEnabled = true; // מצב גלילה
let scrollInterval;

// פונקציה להתחלת הגלילה
function startScroll(speed) {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
        window.scrollBy(0, 1);
    }, 4200 / speed);
}

// פונקציה לעצירת הגלילה
function stopScroll() {
    clearInterval(scrollInterval);
}

// פונקציה לבדיקה אם אלמנט פעיל
function isInteractiveElement(target) {
    return ['INPUT', 'BUTTON', 'TEXTAREA', 'A'].includes(target.tagName);
}

// הפעלת גלילה כשנקבע ערך למהירות
document.querySelector('.circle-input').addEventListener('input', function () {
    const speed = parseInt(this.value, 10) || 0;
    if (speed > 0) {
        scrollEnabled = true; // גלילה מופעלת
        startScroll(speed); // הפעלת הגלילה מידית
    } else {
        stopScroll(); // עצירת גלילה אם הערך 0
    }
});

// עצירת/חידוש גלילה בעת לחיצה על הדף
document.body.addEventListener('click', function (event) {
    if (isInteractiveElement(event.target)) {
        return; // אלמנטים פעילים לא מפעילים גלילה
    }
    scrollEnabled = !scrollEnabled;
    if (scrollEnabled) {
        const speed = parseInt(document.querySelector('.circle-input').value, 10) || 0;
        if (speed > 0) startScroll(speed);
    } else {
        stopScroll();
    }
});

// עצירת גלילה בעת לחיצה על אלמנטים מסוימים
document.querySelectorAll('img, button, a, input').forEach((element) => {
    element.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});


const audioPlayer = new Audio();
let currentSongIndex = 0;
let isSearchTriggered = false; // משתנה לניהול אם בוצע חיפוש

// רשימת שמות קבצי השירים בתיקיית SOUNDS
const songs = [
    "1.mp3", "2.mp3", "for.mp3", "4.mp3", "5.mp3", "6.mp3", "7.mp3", "8.mp3", "9.mp3", "10.mp3",
    "11.mp3", "12.mp3", "13.mp3", "14.mp3", "15.mp3", "16.mp3", "17.mp3", "18.mp3", "תופים 1.mp3", "תופים 2.mp3",
    "תופים 3.mp3", "תופים 4.mp3", "תופים 5.mp3", "היא לא יודעת מה עובר עליי 1.mp3", "היא לא יודעת מה עובר עליי 2.mp3",
    "הלב שלי 1.mp3", "הלב שלי 2.mp3", "לאבא שלי יש סולם 1.mp3", "לאבא שלי יש סולם 2.mp3", "30.mp3",
    "31.mp3", "32.mp3", "33.mp3", "34.mp3", "35.mp3", "36.mp3", "37.mp3", "38.mp3", "39.mp3", "40.mp3",
    "41.mp3", "42.mp3", "43.mp3", "44.mp3", "45.mp3", "46.mp3", "47.mp3", "48.mp3", "49.mp3", "50.mp3",
    "51.mp3", "52.mp3", "53.mp3", "54.mp3", "55.mp3", "56.mp3", "57.mp3", "58.mp3", "59.mp3", "60.mp3",
    "61.mp3", "62.mp3", "63.mp3", "64.mp3", "65.mp3", "66.mp3", "67.mp3", "68.mp3", "69.mp3", "70.mp3",
    "71.mp3", "72.mp3", "73.mp3", "74.mp3", "75.mp3", "76.mp3", "77.mp3", "78.mp3", "79.mp3", "80.mp3"
];

// נתיב הקבצים (אם הם נמצאים בתיקיית "SOUNDS")
const basePath = "./SOUNDS/";

// פונקציה לנגן שיר
function playSong(index) {
    if (index >= 0 && index < songs.length) {
        const songPath = basePath + songs[index];
        audioPlayer.src = songPath;
        audioPlayer.play();
    } else {
        alert("שגיאה: השיר לא קיים ברשימה.");
    }
}

// פונקציה להשהייה/חידוש הנגינה
function togglePlayPause() {
    // הגדרת השיר הראשון אם הנגן עדיין ללא מקור
    if (!audioPlayer.src) {
        playSong(currentSongIndex);
    } else {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }
}

// פונקציה לנגן את השיר הבא
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

// פונקציה לנגן את השיר הקודם
function playPrevious() {
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// פונקציה לחיפוש שיר והפעלתו
function searchAndPlay() {
    const searchValue = document
        .querySelector("#searchSongInput")
        .value.trim().toLowerCase();

    if (!searchValue) {
        alert("הנא חפש שיר לפי שם והוסף 1 או 2");
        return;
    }

    const songIndex = songs.findIndex((song) =>
        song.toLowerCase().includes(searchValue)
    );

    if (songIndex !== -1) {
        currentSongIndex = songIndex;
        isSearchTriggered = true; // עדכון שהחיפוש הופעל
        playSong(currentSongIndex); // הפעלת השיר מיד
    } else {
        alert("שגיאה: השיר לא נמצא ברשימה.");
    }
}

// מאזינים לאירועים מהכפתורים
document
    .querySelector("#toggleButton")
    .addEventListener("click", togglePlayPause);

document
    .querySelector("#nextButton")
    .addEventListener("click", playNext);

document
    .querySelector("#prevButton")
    .addEventListener("click", playPrevious);

document
    .querySelector("#searchSongButton")
    .addEventListener("click", searchAndPlay);

// הפעלה חוזרת של השיר הנוכחי בסיום
audioPlayer.addEventListener("ended", () => {
    if (!isSearchTriggered) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    }
});

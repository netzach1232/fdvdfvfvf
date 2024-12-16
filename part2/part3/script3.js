// List of images (names as provided)
const images = [
    "A.png",
    "am.png",
    "B7.png",
    "C.png",
    "D.jpg",
    "Dm.png",
    "E.png",
    "EM.png",
    "G.png"
];

let searchTimeout; // Variable to store the timeout ID
let savedImages = []; // Array to store saved images
let currentIndex = 0; // Index for the current saved image

// Function to display all images in the gallery
function displayImages(imageList) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // Clear existing images

    if (imageList.length === 0) {
        gallery.innerHTML = "<p>No images found.</p>";
        return;
    }

    gallery.style.visibility = "visible";

    imageList.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = `images/${image}`;
        imgElement.alt = image;

        // Add click event to save the image
        imgElement.addEventListener("click", () => saveImage(image));

        gallery.appendChild(imgElement);
    });
}

// Function to filter images based on search query with a delay
function filterImages() {
    const query = document.getElementById("search-input").value.toLowerCase().trim();
    const gallery = document.getElementById("gallery");

    clearTimeout(searchTimeout); // Clear previous timeout

    // Set a new timeout for 500ms
    searchTimeout = setTimeout(() => {
        if (query === "") {
            gallery.innerHTML = "";
            gallery.style.visibility = "hidden";
            return;
        }

        // Filter images based on exact match (without extension)
        const filteredImages = images.filter((image) => {
            const imageName = image.toLowerCase().split(".")[0]; // Remove the file extension
            return imageName === query; // Exact match only
        });

        displayImages(filteredImages);
    }, 600); // 500ms delay
}

// Function to save an image
function saveImage(image) {
    if (!savedImages.includes(image)) {
        savedImages.push(image);
        currentIndex = savedImages.length - 1; // Set to the most recently added image
        alert(`Image "${image}" saved!`);
        showSavedImage(currentIndex);
    } else {
        alert(`Image "${image}" is already saved.`);
    }
}

// Function to show the current saved image
function showSavedImage(index) {
    const savedImageElement = document.getElementById("saved-image");
    if (savedImages.length > 0) {
        savedImageElement.src = `images/${savedImages[index]}`;
        savedImageElement.style.display = "block";
    } else {
        savedImageElement.style.display = "none";
    }
}

// Function to navigate to the previous image
function prevImage() {
    if (savedImages.length > 0) {
        currentIndex = (currentIndex - 1 + savedImages.length) % savedImages.length;
        showSavedImage(currentIndex);
    }
}

// Function to navigate to the next image
function nextImage() {
    if (savedImages.length > 0) {
        currentIndex = (currentIndex + 1) % savedImages.length;
        showSavedImage(currentIndex);
    }
}

// Initial state: hide the gallery
document.getElementById("gallery").style.visibility = "hidden";


document.querySelector('.button2').addEventListener('click', () => {
    window.location.href = '../page2.html';
});

// שמירת תמונות שמורות
function saveImagesState() {
    localStorage.setItem('savedImages', JSON.stringify(savedImages));
}

// טעינת תמונות שמורות
function loadImagesState() {
    const savedImagesState = JSON.parse(localStorage.getItem('savedImages')) || [];
    savedImages = savedImagesState;
    if (savedImages.length > 0) {
        showSavedImage(0); // הצג את התמונה הראשונה ברשימה
    }
}

// שמור מצב לפני עזיבת הדף
window.addEventListener('beforeunload', saveImagesState);
// טען מצב כשהדף נטען
document.addEventListener('DOMContentLoaded', loadImagesState);


const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
let currentSearch;

// !Addition
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
const loader = document.getElementById("loader");
// Unsplash API
let count = 5;
// const apiKey = "ZRDkQSccYIVxcZ-nJecEH6kjkzikJUIDPmvEK0uFUus";
// Second key in case it goes over the daily limit
const apiKey = "MqkKRywFd-VUBkKytJ1j3r52xkQnEexJ7Avq84lEMMw";
let apiUrl;

// Check if all images were loaded
function imageLoaded() {
    console.log("firing!");
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        count = 30;
    }
}

// Get photos from Unsplash API
async function getRandomPhotos() {
    try {
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
        const data = await fetchApi(apiUrl);
        displayPhotos(data);
    } catch (error) {
        // Catch error here
        console.log(error);
    }
}

// Helper Function to set attributes on DOM elements
function setAttributes(element, attr) {
    for (const key in attr) {
        element.setAttribute(key, attr[key]);
    }
}

// Create Elements for links & photos, Add to DOM
function displayPhotos(photosArray) {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    // Run function for each object in photosArray
    photosArray.forEach((photo) => {
        // Create <a> to link to Unsplash
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target: "_blank",
        });
        // Create <div> for photo
        const galleryImg = document.createElement("div");
        galleryImg.classList.add("gallery-img");
        galleryImg.innerHTML = `
        <div class='gallery-info'>
            <p>${photo.user.name}</p>
            <a href=${photo.urls.regular} target="_blank"> Download </a>
        </div>
        `;
        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
        });
        // Event Listener, check when each is finished loading
        img.addEventListener("load", imageLoaded);
        galleryImg.appendChild(img);
        // Put <div> inside <a>, then put both inside gallery element
        item.appendChild(galleryImg);
        gallery.appendChild(item);
    });
}

async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: apiKey,
        },
    });
    const data = await dataFetch.json();
    return data;
}

// Check to see if scrolling near bottom of page, Load more photos
window.addEventListener("scroll", async function scroll() {
    if (
        window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 1000 &&
        ready
    ) {
        ready = false;
        if (currentSearch) {
            apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${searchValue}`;
            const data = await fetchApi(apiUrl);
            displayPhotos(data);
        } else {
            getRandomPhotos();
        }
    }
});

//! ********* Search Funcionality *********
// Event Listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
});

function updateInput(e) {
    searchValue = e.target.value;
}

async function searchPhotos(query) {
    clear();
    // The top 10 most relevant pictures for a query are displayed (default count is 10)
    apiUrl = `https://api.unsplash.com/search/photos/?client_id=${apiKey}&query=${query}`;
    const data = await fetchApi(apiUrl);
    displayPhotos(data.results);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

// On Load
getRandomPhotos();

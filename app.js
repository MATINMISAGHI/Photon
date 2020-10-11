const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
// const more = document.querySelector(".more");
// let page = 1;

let currentSearch;

/* // Event Listeners
// todo older lines
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
    apiUrl = `https://api.unsplash.com/search/photos/?client_id=${apiKey}&count=${count}&query=${query}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    generatePictures(data);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}
async function loadMore() {
    page++;
    if (currentSearch) {
        apiUrl = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
    } else {
        apiUrl = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await fetchApi(apiUrl);
    generatePictures(data);
} 
*/

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
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function raiseTheCount() {}
// Check if all images were loaded
function imageLoaded() {
    console.log("firing!");
    imagesLoaded++;
    console.log(imagesLoaded);
    console.log(totalImages);
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        count = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
    }
}

// Helper Function to set attributes on DOM elements
function setAttributes(element, attr) {
    for (const key in attr) {
        element.setAttribute(key, attr[key]);
    }
}

// Create Elements for links & photos, Add to DOM
function displayPhotos() {
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
        // !Experimental
        // const galleryImg = document.createElement("div");
        // setAttributes(galleryImg, {
        //     class: "gallery-info",
        // });
        // const div = document.createElement("div");
        // setAttributes(div, {
        //     class: "gallery-info",
        // });
        // galleryImg.appendChild(div);
        // ! //
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

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        // Catch error here
        console.log(error);
    }
}

// Check to see if scrolling near bottom of page, Load more photos
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 1000 &&
        ready
    ) {
        ready = false;
        getPhotos();
    }
});

// On Load
getPhotos();

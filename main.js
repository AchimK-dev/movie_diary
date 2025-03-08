// Define API endpoints
const POPULAR_MOVIES_URL =
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
const SEARCH_MOVIES_URL =
  "https://api.themoviedb.org/3/search/movie?language=en-US&page=1&query=";

// Define Authorization Token (Replace with your actual token)
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMDRmMDZmMDBhMjRhN2ViNTk1Yjg2ODUyN2IwN2FlZCIsIm5iZiI6MTc0MDgxNzg5Ni43MzEsInN1YiI6IjY3YzJjNWU4Yjg2Yzc5MDNkMzNmNTcyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SyMw7tE016kRmbE55wp2POP03YZgU8adbESuWDQoWr0";

// Define headers for fetch requests
const HEADERS = {
  Authorization: AUTH_TOKEN,
  "Content-Type": "application/json",
};

// Function to fetch and display movies (popular or searched)
async function fetchMovies(query = "") {
  try {
    let apiUrl =
      query.trim() === ""
        ? POPULAR_MOVIES_URL
        : `${SEARCH_MOVIES_URL}${encodeURIComponent(query)}`;

    const response = await fetch(apiUrl, { headers: HEADERS });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const movies = data.results;

    displayMovies(data.results);
    updateSlider(movies.slice(0, 5)); // Function to display movies on the slider muathsCode
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
}

// Function to display movies on the webpage
function displayMovies(movies) {
  const movieContainer = document.getElementById("movie-list");
  movieContainer.innerHTML = "";

  if (movies.length === 0) {
    movieContainer.innerHTML =
      "<p class='text-white text-xl'>No results found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add(
      "movie",
      "bg-gray-800",
      "p-2",
      "rounded",
      "text-center"
    );

    movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="rounded">
            <h3 class="text-white mt-2">${movie.title}</h3>
        `;

    movieContainer.appendChild(movieElement);
  });
}


// Debounce function to limit API calls
function debounce(callback, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

// Function to handle search input with debounce
const handleSearchInput = debounce((event) => {
  const query = event.target.value;
  fetchMovies(query);
}, 500); // 500ms delay

// Event listener for the search input box
document
  .getElementById("search-box")
  .addEventListener("input", handleSearchInput);

// Fetch popular movies on page load
window.onload = () => fetchMovies();


// Function to display movies on the slider muathsCode
function updateSlider(movies) {
  const slides = document.querySelectorAll(".slide");

  movies.forEach((movie, index) => {
    if (slides[index]) {
      slides[index].style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;

      let titleElement = slides[index].querySelector(".movie-title");
      let descriptionElement = slides[index].querySelector("p");

      if (titleElement) titleElement.textContent = movie.title;
      if (descriptionElement) descriptionElement.textContent = movie.overview;
    }
  });
}

// Navigation Dots - muathsCode
let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("opacity-100", i === index);
        slide.classList.toggle("opacity-0", i !== index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("opacity-100", i === index);
        dot.classList.toggle("opacity-50", i !== index);
    });

    currentIndex = index; }

function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex); }

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));});

searchBar.addEventListener("input", () => {
    let query = searchBar.value.toLowerCase();
    let found = false;
    slides.forEach((slide, index) => {
        let title = slide.querySelector(".movie-title").textContent.toLowerCase();
        if (title.includes(query)) {
            showSlide(index);
            found = true;}});

    if (!found) showSlide(0);});

    function startSlider() {
      setInterval(() => { nextSlide(); }, 3000);}

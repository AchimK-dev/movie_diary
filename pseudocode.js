// Define API endpoint for fetching popular movies
const POPULAR_MOVIES_URL =
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
const SEARCH_MOVIES_URL =
  "https://api.themoviedb.org/3/search/movie?language=en-US&page=1&query=";

// Define Authorization Token
const AUTH_TOKEN =
  "Bearer eyJhdWQiOiIzMDRmMDZmMDBhMjRhN2ViNTk1Yjg2ODUyN2IwN2FlZCIsIm5iZiI6MTc0MDgxNzg5Ni43MzEsInN1YiI6IjY3YzJjNWU4Yjg2Yzc5MDNkMzNmNTcyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SyMw7tE016kRmbE55wp2POP03YZgU8adbESuWDQoWr0";

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
    displayMovies(data.results);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
}

// Function to display movies on the webpage
function displayMovies(movies) {
  const movieContainer = document.getElementById("movie-list");
  movieContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
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

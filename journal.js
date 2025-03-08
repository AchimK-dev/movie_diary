// Define API endpoints
const MOVIE_DETAILS_URL = "https://api.themoviedb.org/3/movie/";

// Define Authorization Token
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMDRmMDZmMDBhMjRhN2ViNTk1Yjg2ODUyN2IwN2FlZCIsIm5iZiI6MTc0MDgxNzg5Ni43MzEsInN1YiI6IjY3YzJjNWU4Yjg2Yzc5MDNkMzNmNTcyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SyMw7tE016kRmbE55wp2POP03YZgU8adbESuWDQoWr0";

// Define headers for fetch requests
const HEADERS = {
  Authorization: AUTH_TOKEN,
  "Content-Type": "application/json",
};

// Function to add movie to favorites in local storage
function addToFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Function to get favorite movies from local storage
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Function to check if a movie is in favorites
function isMovieFavorite(movieId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(movieId);
}

// Function to toggle movie in favorites
function toggleFavorite(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.includes(movieId)) {
    favorites = favorites.filter((id) => id !== movieId);
  } else {
    favorites.push(movieId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to update favorite button icon
function updateFavoriteButton(button, movieId) {
  const isFavorite = isMovieFavorite(movieId);
  const favoriteIcon = isFavorite ? "favorite-full.png" : "favorite.png";
  button.querySelector("img").src = favoriteIcon;
}

// Function to fetch and display favorite movies
async function displayFavorites() {
  const favoriteMovies = getFavorites();
  const favoriteContainer = document.getElementById("favorite-list");
  favoriteContainer.innerHTML = "";

  if (favoriteMovies.length === 0) {
    favoriteContainer.innerHTML =
      "<p class='text-white text-xl'>No favorite movies found.</p>";
    return;
  }

  for (const movieId of favoriteMovies) {
    try {
      const response = await fetch(`${MOVIE_DETAILS_URL}${movieId}`, { headers: HEADERS });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const movie = await response.json();
      const isFavorite = isMovieFavorite(movie.id);
      const favoriteIcon = isFavorite ? "favorite-full.png" : "favorite.png";

      const movieElement = document.createElement("div");
      movieElement.classList.add(
        "movie",
        "bg-gray-800",
        "p-2",
        "rounded",
        "text-center",
        "relative"
      );

      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="rounded mx-auto block">
        <h3 class="text-white mt-2">${movie.title}</h3>
        <button class="absolute bottom-2 left-2 favorite-button" data-movie-id="${movie.id}">
          <img src="${favoriteIcon}" alt="Favorite" class="h-6 w-6">
        </button>
      `;

      favoriteContainer.appendChild(movieElement);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  }

  // Add event listeners to favorite buttons
  const favoriteButtons = document.querySelectorAll(".favorite-button");
  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const movieId = event.currentTarget.getAttribute("data-movie-id");
      toggleFavorite(movieId);
      updateFavoriteButton(event.currentTarget, movieId);
    });
  });
}

// Call displayFavorites if on the favorites page
if (document.getElementById("favorite-list")) {
  displayFavorites();
}

// Continuously update the favorite icons
setInterval(() => {
    const favoriteButtons = document.querySelectorAll(".favorite-button");
    favoriteButtons.forEach((button) => {
      const movieId = button.getAttribute("data-movie-id");
      updateFavoriteButton(button, movieId);
    });
  }, 1000); // Update every 1 second
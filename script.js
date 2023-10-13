const apiKey = "5658e2e4";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const filmList = document.getElementById("film-list");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalRelease = document.getElementById("modal-release");
const modalPlot = document.getElementById("modal-plot");
const closeBtn = document.querySelector(".close");

let currentPage = 1;
let isLoading = false;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  filmList.innerHTML = "";
  searchFilms();
});

function searchFilms() {
  const searchTerm = searchInput.value;
  const apiUrl = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}&page=${currentPage}`;

  if (searchTerm && !isLoading) {
    isLoading = true;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.Search) {
          data.Search.forEach((film) => {
            createFilmCard(film);
          });
          isLoading = false;
        } else {
          // Aucun film trouvé, afficher un message
          filmList.innerHTML = "<p>Aucun film trouvé.</p>";
          isLoading = false;
        }
      })
      .catch((error) => {
        isLoading = false;
        console.error("Erreur de recherche de films :", error);
      });
  }
}

function createFilmCard(film) {
  const filmCard = document.createElement("div");
  filmCard.classList.add("film-card");
  filmCard.innerHTML = `
        <img class="cardimage" src="${film.Poster}" alt="${film.Title}" />
        <h3>${film.Title}</h3>
        <p>Date de sortie : ${film.Year}</p>
        <button class="button">Read More</button>
    `;
  filmList.appendChild(filmCard);

  const readMoreBtn = filmCard.querySelector(".button");
  readMoreBtn.addEventListener("click", () => {
    modalTitle.textContent = film.Title;
    modalRelease.textContent = `Date de sortie : ${film.Year}`;
    getFilmDetails(film.imdbID);
    modal.style.display = "block";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateX(0)";
      }
    });
  });

  observer.observe(filmCard);
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modalTitle.textContent = "";
  modalRelease.textContent = "";
  modalPlot.textContent = "";
});

function getFilmDetails(imdbID) {
  const apiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      modalPlot.textContent = data.Plot;
    })
    .catch((error) => {
      console.error("Erreur de récupération des détails du film :", error);
    });
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollY + windowHeight >= documentHeight - 100) {
    currentPage++;
    searchFilms();
  }
});

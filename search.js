// Get DOM elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const content = document.getElementById("content");

// Define search function
function search() {
  // Get search term and reset previous highlights
  const searchTerm = searchInput.value;
  const highlights = content.querySelectorAll(".highlight");
  for (let i = 0; i < highlights.length; i++) {
    highlights[i].classList.remove("highlight");
  }
  // If search term is blank, do nothing
  if (!searchTerm) {
    clearSearch();
    return;
  }
  // Search for and highlight matching content
  const regex = new RegExp(searchTerm, "gi");
  const matches = content.innerHTML.match(regex);
  if (matches) {
    content.innerHTML = content.innerHTML.replace(
      regex,
      '<span class="highlight">$&</span>'
    );
  }
}

// Define clear search function
function clearSearch() {
  // Reset search input and remove highlights
  searchInput.value = "";
  const highlights = content.querySelectorAll(".highlight");
  for (let i = 0; i < highlights.length; i++) {
    highlights[i].classList.remove("highlight");
  }
}

// Add event listeners
searchBtn.addEventListener("click", search);
clearBtn.addEventListener("click", clearSearch);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search();
  }
});

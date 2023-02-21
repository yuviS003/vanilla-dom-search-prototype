// Get DOM elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const content = document.getElementById("content");
const modalTrigger = document.getElementById("modalTrigger");
const modalBody = document.getElementById("modalBody");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Define search function
function search() {
  let matchesURI = [];
  // Get search term and reset previous highlights
  const searchTerm = searchInput.value;
  const highlights = content.querySelectorAll(".highlight");
  for (let i = 0; i < highlights.length; i++) {
    highlights[i].classList.remove("highlight");
  }

  // If search term is blank, do nothing and reset previous highlights
  if (!searchTerm) {
    clearSearch();
    return;
  }

  // Search for and highlight matching content
  const regex = new RegExp(searchTerm, "gi");
  const matches = content.innerHTML.match(regex);

  if (matches) {
    content.childNodes.forEach((node) => {
      if (!node.length) {
        if (regex.test(node.innerHTML)) {
          node.getAttribute("id")
            ? matchesURI.push(
                `http://127.0.0.1:5500/#${node.getAttribute("id")}`
              )
            : matchesURI.push("http://127.0.0.1:5500/");
        }
        node.innerHTML = node.innerHTML.replace(
          regex,
          '<span class="highlight">$&</span>'
        );
      }
    });
    console.log(matchesURI);
    if (matchesURI.length) {
      console.log("Triggering modal");
      var newHtml = ``;
      matchesURI.forEach((uri) => {
        newHtml += `<div class="card w-100 my-2">
              <div class="card-body">
                <h5 class="card-title">Match Found</h5>
                <p class="card-text">
                  Click on this button to see where the match is.
                </p>
                <a href=${uri} class="btn btn-primary" onclick="closeModal()">Follow</a>
              </div>
            </div>`;
      });
      // console.log(modalBody.innerHTML);
      modalBody.innerHTML = newHtml;
      modalTrigger.click();
    }
  }
}

function closeModal() {
  console.log("Close modal");
  modalCloseBtn.click();
  clearSearch();
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

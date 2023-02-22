const BASE_URL = `http://127.0.0.1:5500/`;

// Get DOM elements
const content = document.getElementById("content");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const modalTrigger = document.getElementById("modalTrigger");
const modalBody = document.getElementById("modalBody");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCloseCrossBtn = document.getElementById("modalCloseCrossBtn");
const fetchAnotherDomBtn = document.getElementById("fetchAnotherDomBtn");

// Define search function
function search() {
  let matchedComponents = [];
  // Get search term and reset previous highlights
  const searchTerm = searchInput.value;
  const highlights = content.querySelectorAll(".highlight");
  for (let i = 0; i < highlights.length; i++) {
    const textNode = document.createTextNode(highlights[i].textContent);
    highlights[i].parentNode.replaceChild(textNode, highlights[i]);
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
          console.log(node.childNodes[1].textContent);
          console.log(node.childNodes[3].textContent.trim().slice(0, 50));
          node.getAttribute("id")
            ? matchedComponents.push({
                matchHeading: node.childNodes[1].textContent,
                matchBrief: node.childNodes[3].textContent.trim().slice(0, 50),
                matchUri: `${BASE_URL}#${node.getAttribute("id")}`,
              })
            : matchedComponents.push({
                matchHeading: node.childNodes[1].textContent,
                matchBrief: node.childNodes[3].textContent.trim().slice(0, 50),
                matchUri: `${BASE_URL}`,
              });
        }
        node.innerHTML = node.innerHTML.replace(
          regex,
          '<span class="highlight">$&</span>'
        );
      }
    });
  }
  if (matchedComponents.length) {
    let newHtml = ``;
    matchedComponents.forEach((match) => {
      newHtml += `<div class="card w-100 my-2">
                      <div class="card-body">
                        <h5 class="card-title">${match.matchHeading}</h5>
                        <p class="card-text text-sm-start">
                          ${match.matchBrief}...
                        </p>
                        <a href=${match.matchUri} class="btn btn-primary" onclick="closeModal()">Follow</a>
                      </div>
                    </div>`;
    });
    modalBody.innerHTML = newHtml;
    modalTrigger.click();
  } else {
    console.log("no match found");
    let newHtml = `<div class="alert alert-danger" role="alert">
                    No results found
                  </div>`;
    modalBody.innerHTML = newHtml;
    modalTrigger.click();
  }
  console.log(matchedComponents);
}

function closeModal() {
  console.log("Close modal");
  modalCloseBtn.click();
}

// Define clear search function
function clearSearch() {
  // Reset search input and remove highlights
  searchInput.value = "";
  const highlights = content.querySelectorAll(".highlight");
  for (let i = 0; i < highlights.length; i++) {
    // highlights[i].classList.remove("highlight");
    const textNode = document.createTextNode(highlights[i].textContent);
    highlights[i].parentNode.replaceChild(textNode, highlights[i]);
  }
}

const folderPath = "./otherFiles";
const parser = new DOMParser();

function fetchAnotherDOM() {
  fetch(folderPath)
    .then((response) => response.text())
    .then((data) => {
      const htmlFiles = data.match(/href="([^"]*\.html)"/g);
      if (htmlFiles) {
        htmlFiles.forEach((file) => {
          const fileName = file.match(/href="([^"]*\.html)"/)[1];
          fetch(fileName)
            .then((response) => response.text())
            .then((data) => {
              const dom = parser.parseFromString(data, "text/html");
              // do something with the DOM of the file
              console.log(dom);
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
    })
    .catch((err) => console.error(err));
}

// Add event listeners
searchBtn.addEventListener("click", search);
clearBtn.addEventListener("click", clearSearch);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search();
  }
});
searchInput.addEventListener("input", function (event) {
  if (event.target.value === "") {
    clearSearch();
  }
});

fetchAnotherDomBtn.addEventListener("click", function (event) {
  fetchAnotherDOM();
});

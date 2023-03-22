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
          // console.log(node.childNodes[1].textContent);
          // console.log(node.childNodes[3].textContent.trim().slice(0, 50));
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

let activeWebinars = null;
let activeArticles = null;
let activeServices = null;

function fetchWebinars() {
  // fetch(`https://www.covalenttechnology.co.in/api/webinars/active`, {
  //   method: "GET",
  //   "content-type": "application/json",
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.log(res);
  //     activeWebinars = res;
  //   })
  //   .catch((err) => console.error(err));

  fetch(`./webinars.json`, {
    method: "GET",
    "content-type": "application/json",
  })
    .then((res) => res.json())
    .then((res) => {
      activeWebinars = res;
    })
    .catch((err) => console.error(err));
}

function fetchArticles() {
  // fetch(`https://www.covalenttechnology.co.in/api/latestnews/active/`, {
  //   method: "GET",
  //   "content-type": "application/json",
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.log(res);
  //     activeArticles = res;
  //   })
  //   .catch((err) => console.error(err));

  fetch(`./articles.json`, {
    method: "GET",
    "content-type": "application/json",
  })
    .then((res) => res.json())
    .then((res) => {
      activeArticles = res;
    })
    .catch((err) => console.error(err));
}

function fetchServices() {
  // fetch(`https://www.covalenttechnology.co.in/api/latestnews/active/`, {
  //   method: "GET",
  //   "content-type": "application/json",
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.log(res);
  //     activeArticles = res;
  //   })
  //   .catch((err) => console.error(err));

  fetch(`./services.json`, {
    method: "GET",
    "content-type": "application/json",
  })
    .then((res) => res.json())
    .then((res) => {
      activeServices = res;
    })
    .catch((err) => console.error(err));
}

function searchWithinArticles(query) {
  let searchResults = [];
  if (activeArticles) {
    activeArticles.forEach((article, index) => {
      if (article?.tags) {
        if (article.tags.some((elem) => query.includes(elem))) {
          searchResults.push(article);
        }
      }
    });
  }
  if (searchResults.length) return searchResults;
}

function searchWithinWebinars(query) {
  let searchResults = [];
  if (activeWebinars) {
    activeWebinars.forEach((webinar, index) => {
      if (webinar?.tags) {
        if (webinar.tags.some((elem) => query.includes(elem))) {
          searchResults.push(webinar);
        }
      }
    });
  }
  if (searchResults.length) return searchResults;
}

function searchWithinServices(query) {
  let searchResults = [];
  if (activeServices) {
    activeServices.forEach((service, index) => {
      if (service?.tags) {
        if (service.tags.some((elem) => query.includes(elem))) {
          searchResults.push(service);
        }
      }
    });
  }
  if (searchResults.length) return searchResults;
}

document.getElementById("webArtSearch").addEventListener("click", function () {
  let matchWebinars = searchWithinWebinars(searchInput.value);
  let matchArticles = searchWithinArticles(searchInput.value);
  let matchServices = searchWithinServices(searchInput.value);
  console.log(matchWebinars);
  console.log(matchArticles);
  console.log(matchServices);
  let matches = [];
  if (matchWebinars) {
    matchWebinars.forEach((webinar, index) => {
      matches.push({
        ...webinar,
        type: "Webinar",
      });
    });
  }
  if (matchArticles) {
    matchArticles.forEach((article, index) => {
      matches.push({
        ...article,
        type: "Article",
      });
    });
  }
  if (matchServices) {
    matchServices.forEach((service, index) => {
      matches.push({
        ...service,
        type: "Service",
      });
    });
  }
  if (matches.length) {
    console.log("Matches", matches);
    sessionStorage.setItem("searchMatches", JSON.stringify(matches));
    window.open("/searchResults.html", { target: "_blank" });
  }
});

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

fetchWebinars();
fetchArticles();
fetchServices();

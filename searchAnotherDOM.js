const folderPath = "./pages";
const parser = new DOMParser();

const fetchAnotherDomBtn = document.getElementById("fetchAnotherDomBtn");
// const searchInput = document.getElementById("search-input");

fetchAnotherDomBtn.addEventListener("click", () => {
  fetchAnotherDOM();
});

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
              dom.body.childNodes.forEach((node) => {
                if (!node.length && node.nodeName !== "SCRIPT") {
                  //   console.log(node);
                  searchingAnotherDOM(node);
                }
              });
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
    })
    .catch((err) => console.error(err));
}

// Define search function
function searchingAnotherDOM(DOM) {
  const searchTerm = searchInput.value;
  const highlights = DOM.querySelectorAll(".highlight");
  for (let i = 0; i < highlights.length; i++) {
    const textNode = document.createTextNode(highlights[i].textContent);
    highlights[i].parentNode.replaceChild(textNode, highlights[i]);
  }

  const regex = new RegExp(searchTerm, "gi");
  const matches = DOM.innerHTML.match(regex);

  if (matches) {
    DOM.childNodes.forEach((node) => {
      if (!node.length) {
        node.innerHTML = node.innerHTML.replace(
          regex,
          '<span class="highlight">$&</span>'
        );
      }
    });
  }
}

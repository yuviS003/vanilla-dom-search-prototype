const folderPath = "./otherFiles";
const parser = new DOMParser();

const fetchAnotherDomBtn = document.getElementById("fetchAnotherDomBtn");

function fetchAnotherDOM() {
  fetch(folderPath)
    .then((response) => response.text())
    .then((data) => {
      const htmlFiles = data.match(/href="([^"]*\.html)"/g);
      // console.log(htmlFiles);
      if (htmlFiles) {
        htmlFiles.forEach((file) => {
          const fileName = file.match(/href="([^"]*\.html)"/)[1];
          fetch(fileName)
            .then((response) => response.text())
            .then((data) => {
              const dom = parser.parseFromString(data, "text/html");
              // do something with the DOM of the file
              dom.body.childNodes.forEach((node) => {
                if (!node.length && node.nodeName !== "SCRIPT") {
                  console.log(node);
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

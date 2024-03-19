const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/home") {
    renderPage(res, "home");
  } else if (req.url === "/student") {
    renderPage(res, "student");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end();
  }
});

function renderPage(res, fileName) {
  const filePath = path.join(__dirname, "views", `${fileName}.html`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end();
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
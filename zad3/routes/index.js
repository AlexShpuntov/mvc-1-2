const fs = require("fs");
const path = require("path");

function renderPage(res, fileName) {
  const filePath = path.join(__dirname, "..", "views", `${fileName}.html`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
}

function handleHome(req, res) {
  renderPage(res, "home");
}

function handleStudent(req, res) {
  if (req.method === "POST") {
    res.writeHead(302, { "Location": "/student" });
    res.end();
  } else {
    renderPage(res, "student");
  }
}

module.exports = {
  handleHome,
  handleStudent,
};

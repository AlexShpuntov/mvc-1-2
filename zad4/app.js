const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleHome, handleStudent } = require("./routes/index");

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/home") {
    handleHome(req, res);
  } else if (req.url === "/student") {
    if (req.method === "GET") {
      handleStudent(req, res);
    } else if (req.method === "POST") {
      handleFormSubmission(req, res);
    }
  } else {
    handleNotFound(req, res);
  }
});


function renderPage(res, fileName) {
  const filePath = path.join(__dirname, "views", `${fileName}.html`);

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

function handleFormSubmission(req, res) {
  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });
  req.on("end", () => {
    console.log("Form data:", body);
    res.writeHead(302, { "Location": "/student" });
    res.end();
  });
}

function handleNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("404 Not Found");
}

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
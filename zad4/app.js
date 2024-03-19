const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleHome, handleStudent } = require("./routes/index");

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Routing
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

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

function renderPage(res, fileName, data) {
  // Ścieżka do pliku HTML
  const filePath = path.join(__dirname, "views", `${fileName}.html`);

  // Odczyt pliku HTML
  fs.readFile(filePath, "utf8", (err, template) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      // Wypełnienie szablonu danymi
      const html = fillTemplate(template, data);

      // Ustawienie nagłówka Content-Type na text/html
      res.writeHead(200, { "Content-Type": "text/html" });
      // Wyślij zawartość pliku HTML do klienta
      res.end(html);
    }
  });
}

function handleFormSubmission(req, res) {
  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const formData = parseFormData(body);
    console.log("Form data:", formData);

    // Zapis danych do pliku tekstowego
    const studentID = formData.studentID;
    const fileName = `${studentID}.txt`;
    const filePath = path.join(__dirname, fileName);
    const dataToWrite = JSON.stringify(formData);

    fs.writeFile(filePath, dataToWrite, err => {
      if (err) {
        console.error("Error writing file:", err);
      }
    });

    // Renderowanie strony student.html z przesłanymi danymi
    renderPage(res, "student", formData);
  });
}

function handleNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("404 Not Found");
}

function fillTemplate(template, data) {
  // Zamiana placeholderów w szablonie na rzeczywiste dane
  for (let key in data) {
    template = template.replace(new RegExp(`\\$\\{${key}\\}`, "g"), data[key]);
  }
  return template;
}

function parseFormData(formData) {
  // Przekształcenie ciągu znaków formularza na obiekt danych
  const data = {};
  const keyValuePairs = formData.split("&");
  for (let pair of keyValuePairs) {
    const [key, value] = pair.split("=");
    data[key] = decodeURIComponent(value.replace(/\+/g, " "));
  }
  return data;
}

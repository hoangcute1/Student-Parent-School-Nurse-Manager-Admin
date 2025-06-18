const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Create certificates directory if it doesn't exist
const certificatesDir = path.join(__dirname, "certificates");
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir);
}

// Check if certificates already exist
const keyPath = path.join(certificatesDir, "localhost-key.pem");
const certPath = path.join(certificatesDir, "localhost.pem");

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error("Error: SSL certificates not found!");
  console.log("Please run the following commands:");
  console.log("1. npm install -g mkcert");
  console.log("2. mkcert -install");
  console.log("3. cd certificates");
  console.log("4. mkcert localhost 127.0.0.1 ::1");
  console.log(
    '5. Rename the generated files to "localhost-key.pem" and "localhost.pem"'
  );
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3000");
  });
});

const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const PORT = 3000;

const app = express();

// For security related middleware we use the middleware right at top
app.use(helmet());

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; //TODO
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must log in!" });
  }
  //NOTE We pass on the control to the next in sequence of our middleware / endpoint
  next();
}

//NOTE The OAuth Client ID we created in Google CLoud console.
app.get("/google/auth", (req, res) => {
  //TODO
});

app.get("/google/auth/callback", (req, res) => {
  //TODO
});

app.get("/auth/logout", (req, res) => {
  //TODO
});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("Your personal secret value is 86!!");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem")
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });

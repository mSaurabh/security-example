const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require("dotenv").config();

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};

const AUTH_OPTIONS = {
  /**@description The callbackURL once we have verified user the location where google needs to send the token */
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET
};

/**
 * @description This method gets called when the user is verified
 * @author Saurabh_M
 * @date 2022.08.05
 * @param {*} accessToken user password
 * @param {*} refreshToken extension on time so the user doesn't need to re-login
 * @param {*} profile user profile
 * @param {function} done function to indicate to passport takeover from here.
 */
function verifyCallback(accessToken, refreshToken, profile, done) {
  //accessToken --> users password
  console.log("Google profile", profile);
  //done(error,if no error then valid value to pass to passport)
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

// For security related middleware we use the middleware right at top
app.use(helmet());
//passport initialization
app.use(passport.initialize());

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; //TODO
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must log in!" });
  }
  //NOTE We pass on the control to the next in sequence of our middleware / endpoint
  next();
}

//NOTE The OAuth Client ID we created in Google CLoud console.
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email"] }),
  (req, res) => {
    console.log("Kicking off google auth");
  }
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: false
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

app.get("/auth/logout", (req, res) => {
  //TODO
});

app.get("/failure", (req, res) => {
  //TODO
  return res.send("Failed to log in!");
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

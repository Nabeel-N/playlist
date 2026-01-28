import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1. Setup Session (Required for Passport to remember the user)
app.use(
  session({
    secret: "secret_key_needs_to_be_complex",
    resave: false,
    saveUninitialized: true,
  }),
);

// 2. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // This runs when Google sends the user back
      console.log("User logged in:", profile.emails?.[0].value);
      return done(null, profile);
    },
  ),
);

// 4. Serialization (Required so the user stays logged in)
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// 5. Routes
app.use(express.json());

// A. Login Route (Frontend hits this)
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// B. Callback Route (Google hits this)
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User authenticated");
    res.redirect("http://localhost:3000/dashboard");
  },
);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

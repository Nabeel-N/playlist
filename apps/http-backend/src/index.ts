import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import dotenv from "dotenv";
import playlistRoutes from "./routes/playlist.routes";
import { AuthService } from "./services/auth.services";

dotenv.config();

const app = express();
const authService = new AuthService();

app.use(
  session({
    secret: "secret_key_needs_to_be_complex",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const dbUser = await authService.handleGoogleLogin(profile);

        return done(null, dbUser);
      } catch (e) {
        return done(e, false);
      }
    },
  ),
);

// Serialization
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// Routes
app.use(express.json());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User authenticated");
    res.redirect("http://localhost:3000/dashboard");
  },
);

app.use("/playlist", playlistRoutes);
app.use("/playlist", playlistRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
